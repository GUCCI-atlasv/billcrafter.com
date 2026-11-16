// Outbound email via Cloudflare Email Service (Workers `send_email` binding `env.EMAIL`).
//
// Shared by /api/auth/magic, /api/send-invoice, /api/sign, /api/contact, and
// /api/cron/recurring so every email uses the same From parsing, reply-to
// handling, and error reporting.
import { QUOTA_POLICY } from "../quotaConfig";

const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const isEmail = (s) => /.+@.+\..+/.test(String(s || "").trim());

export const EMAIL_PER_MINUTE_LIMIT = 1;
export const EMAIL_DAILY_LIMIT = QUOTA_POLICY.emailDailyLimit;

const utcDay = () => new Date().toISOString().slice(0, 10);
export const nextUtcMidnightISO = () => {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
};

function reqIp(request) {
  if (!request?.headers) return null;
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    null
  );
}

async function readDailyCount(env, subject, day) {
  if (env?.DB) {
    try {
      const row = await env.DB
        .prepare("SELECT count FROM email_daily_usage WHERE subject = ? AND day = ?")
        .bind(subject, day)
        .first();
      if (row) return Number(row.count || 0);
    } catch { /* fall back to KV */ }
  }
  if (env?.SESSIONS) {
    try {
      const raw = await env.SESSIONS.get(`rl:em:d:${subject}:${day}`);
      if (raw != null) {
        const n = Number(raw);
        if (Number.isFinite(n)) return n;
      }
    } catch {}
  }
  return 0;
}

async function incrementDailyCount(env, subject, day, prevCount) {
  const next = prevCount + 1;
  if (env?.SESSIONS) {
    try {
      await env.SESSIONS.put(`rl:em:d:${subject}:${day}`, String(next), { expirationTtl: 60 * 60 * 26 });
    } catch {}
  }
  if (env?.DB) {
    const now = Date.now();
    try {
      await env.DB
        .prepare(
          "INSERT INTO email_daily_usage (subject, day, count, updated_at) VALUES (?, ?, 1, ?) " +
          "ON CONFLICT(subject, day) DO UPDATE SET count = count + 1, updated_at = ?"
        )
        .bind(subject, day, now, now)
        .run();
    } catch {}
  }
}

/**
 * Enforce anti-abuse rate limits across email endpoints:
 *   - max 1 email per minute (60s cooldown)
 *   - max 3 emails per UTC day
 * Checked and charged across both the authenticated user (or target email) and client IP.
 */
export async function consumeEmailRateLimit(env, { request, user, email, scope = "outbound" } = {}) {
  const day = utcDay();
  const subjects = [];
  if (user?.id) subjects.push(`${scope}:u:${user.id}`);
  else if (email) subjects.push(`${scope}:e:${String(email).trim().toLowerCase()}`);

  const ip = reqIp(request);
  if (ip) subjects.push(`${scope}:ip:${ip}`);

  if (subjects.length === 0) return { ok: true };

  // 1. Check per-minute cooldown (1/min) in KV
  if (env?.SESSIONS) {
    for (const subj of subjects) {
      try {
        const hit = await env.SESSIONS.get(`rl:em:m:${subj}`);
        if (hit) {
          return { ok: false, error: "rate_limited", status: 429, retryAfter: 60 };
        }
      } catch {}
    }
  }

  // 2. Check daily quota (EMAIL_DAILY_LIMIT / UTC day)
  const counts = {};
  for (const subj of subjects) {
    const used = await readDailyCount(env, subj, day);
    if (used >= EMAIL_DAILY_LIMIT) {
      return { ok: false, error: "daily_limit_exceeded", status: 429, limit: EMAIL_DAILY_LIMIT, resetAt: nextUtcMidnightISO() };
    }
    counts[subj] = used;
  }

  // 3. Reserve quota before sending so concurrent bursts cannot slip through
  if (env?.SESSIONS) {
    for (const subj of subjects) {
      try {
        await env.SESSIONS.put(`rl:em:m:${subj}`, String(Date.now()), { expirationTtl: 60 });
      } catch {}
    }
  }
  for (const subj of subjects) {
    await incrementDailyCount(env, subj, day, counts[subj]);
  }

  return { ok: true };
}

/**
 * Parse "Name <user@domain>" into { email, name } for EmailMessageBuilder,
 * or return a plain email string as-is.
 */
export function parseEmailAddress(raw) {
  if (raw && typeof raw === "object" && raw.email) {
    return raw.name ? { email: String(raw.email).trim(), name: String(raw.name).trim() } : String(raw.email).trim();
  }
  const s = String(raw || "").trim();
  const m = s.match(/^(?:"?([^"]*?)"?\s*)?<([^<>@\s]+@[^<>@\s]+)>$/);
  if (m) {
    const email = m[2].trim();
    const name = (m[1] || "").trim();
    return name ? { email, name } : email;
  }
  return s;
}

async function logEmail(env, { user, to, subject, filename, status, error }) {
  try {
    await env.DB.prepare(
      "INSERT INTO email_log (id, user_id, user_email, to_email, subject, filename, status, error, created_at) VALUES (?,?,?,?,?,?,?,?,?)"
    ).bind(
      crypto.randomUUID(), user?.id || null, user?.email || null, to,
      (subject || "Your invoice").slice(0, 300), filename || "invoice.pdf",
      status, error ? String(error).slice(0, 300) : null, Date.now()
    ).run();
  } catch { /* logging must never break sending */ }
}

/**
 * Send an email through the Cloudflare Email Service `EMAIL` binding.
 * Returns { ok, messageId } or { ok: false, error, status, detail? }.
 */
export async function sendEmail(env, { to, subject, html, text, replyTo, attachments }) {
  if (!env?.EMAIL || typeof env.EMAIL.send !== "function") {
    return { ok: false, error: "email_unavailable", status: 503 };
  }

  const from = parseEmailAddress(env.EMAIL_FROM || "BillCrafter <noreply@billcrafter.com>");
  const payload = {
    from,
    to,
    subject: subject || "Message from BillCrafter",
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo: parseEmailAddress(replyTo) } : {}),
    ...(attachments?.length ? { attachments } : {}),
  };

  try {
    const r = await env.EMAIL.send(payload);
    return { ok: true, messageId: r?.messageId || null };
  } catch (e) {
    const detail = [e?.code, e?.message].filter(Boolean).join(": ") || String(e || "send_failed");
    return { ok: false, error: "send_failed", code: e?.code || null, detail, status: 502 };
  }
}

/**
 * Send a PDF attachment through Cloudflare Email Service and record it in email_log.
 * Returns { ok } or { ok:false, error, status } — callers map that to a response.
 */
export async function sendPdfEmail(env, { user, to, subject, message, filename, pdfBase64, footerNote }) {
  if (!env?.EMAIL || typeof env.EMAIL.send !== "function") return { ok: false, error: "email_unavailable", status: 503 };
  if (!isEmail(to) || !pdfBase64) return { ok: false, error: "invalid", status: 400 };

  const recipient = String(to).trim();
  const bodyText = message || "Please find your invoice attached.";
  const body = esc(bodyText).replace(/\n/g, "<br>");
  const note = footerNote ? `<p style="color:#888;font-size:12px">${esc(footerNote)}</p>` : "";
  const cleanBase64 = String(pdfBase64).replace(/^data:[^,]+,/, "");

  const res = await sendEmail(env, {
    to: recipient,
    replyTo: user?.email || undefined,
    subject: subject || "Your invoice",
    html: `<p>${body}</p><hr style="border:none;border-top:1px solid #eee;margin:16px 0">${note}<p style="color:#888;font-size:12px">Sent via BillCrafter · billcrafter.com</p>`,
    text: `${bodyText}${footerNote ? `\n\n${footerNote}` : ""}\n\nSent via BillCrafter · billcrafter.com`,
    attachments: [{
      content: cleanBase64,
      filename: filename || "invoice.pdf",
      type: "application/pdf",
      disposition: "attachment",
    }],
  });

  if (!res.ok) {
    await logEmail(env, { user, to: recipient, subject, filename, status: "failed", error: res.detail || res.error });
    return { ok: false, error: res.error, status: res.status || 502 };
  }
  await logEmail(env, { user, to: recipient, subject, filename, status: "sent" });
  return { ok: true };
}

/**
 * Render a clean, brand-matched BillCrafter magic-link sign-in email (HTML + plain text).
 */
export function buildMagicLinkEmail({ email, link }) {
  const safeEmail = esc(email);
  const safeLink = esc(link);
  const preheader = "Use this one-time link to sign in to BillCrafter (expires in 15 minutes).";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sign in to BillCrafter</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F3EE;color:#2D2F33;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3EE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#FFFFFF;border:1px solid #E4E4DC;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px 18px;border-bottom:1px solid #EFEFE8;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:26px;height:26px;background-color:#2D2F33;border-radius:6px;text-align:center;vertical-align:middle;color:#FFFFFF;font-size:14px;font-weight:700;line-height:26px;">$</td>
                  <td style="padding-left:10px;font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#2D2F33;">BillCrafter</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 24px;">
              <h1 style="margin:0 0 12px;font-size:21px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:#2D2F33;">Sign in to BillCrafter</h1>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4A4D53;">
                Click the button below to sign in as <strong style="color:#2D2F33;">${safeEmail}</strong>. This link expires in <strong style="color:#2D2F33;">15 minutes</strong> and can only be used once.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" bgcolor="#2D2F33" style="border-radius:8px;">
                    <a href="${safeLink}" target="_blank" rel="noopener" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;background-color:#2D2F33;">Sign in to BillCrafter</a>
                  </td>
                </tr>
              </table>
              <div style="background-color:#FAFAF7;border:1px solid #EAEAE2;border-radius:8px;padding:12px 14px;margin:0 0 20px;">
                <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:#6B6F76;">Button not working? Copy and paste this link into your browser:</p>
                <p style="margin:0;font-size:12px;line-height:1.5;word-break:break-all;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">
                  <a href="${safeLink}" target="_blank" rel="noopener" style="color:#2D2F33;text-decoration:underline;">${safeLink}</a>
                </p>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.55;color:#6B6F76;">
                If you didn’t request this sign-in link, you can safely ignore this email — no changes were made to your account.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#FAFAF7;border-top:1px solid #EFEFE8;font-size:12px;line-height:1.5;color:#90969E;">
              BillCrafter · <a href="https://billcrafter.com" style="color:#6B6F76;text-decoration:none;">billcrafter.com</a> · Need help? Just reply to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    "Sign in to BillCrafter",
    "",
    `Use this one-time link to sign in as ${email} (expires in 15 minutes):`,
    link,
    "",
    "If you didn't request this sign-in link, you can safely ignore this email — no changes were made to your account.",
    "",
    "BillCrafter · https://billcrafter.com",
    "Need help? Reply to this email.",
  ].join("\n");

  return { subject: "Your BillCrafter sign-in link", html, text };
}

/**
 * Render an admin password-reset email (HTML + plain text).
 */
export function buildAdminResetEmail({ email, link }) {
  const safeEmail = esc(email);
  const safeLink = esc(link);
  const preheader = "Reset your BillCrafter Admin password (expires in 15 minutes).";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset your BillCrafter Admin password</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F3EE;color:#2D2F33;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3EE;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#FFFFFF;border:1px solid #E4E4DC;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:24px 32px 18px;border-bottom:1px solid #EFEFE8;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:26px;height:26px;background-color:#2D2F33;border-radius:6px;text-align:center;vertical-align:middle;color:#FFFFFF;font-size:14px;font-weight:700;line-height:26px;">$</td>
                  <td style="padding-left:10px;font-size:17px;font-weight:700;letter-spacing:-0.02em;color:#2D2F33;">BillCrafter Admin</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 24px;">
              <h1 style="margin:0 0 12px;font-size:21px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:#2D2F33;">Reset your admin password</h1>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4A4D53;">
                Click the button below to set a new admin password for <strong style="color:#2D2F33;">${safeEmail}</strong>. This link expires in <strong style="color:#2D2F33;">15 minutes</strong> and can only be used once.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" bgcolor="#2D2F33" style="border-radius:8px;">
                    <a href="${safeLink}" target="_blank" rel="noopener" style="display:inline-block;padding:13px 24px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;background-color:#2D2F33;">Set new password</a>
                  </td>
                </tr>
              </table>
              <div style="background-color:#FAFAF7;border:1px solid #EAEAE2;border-radius:8px;padding:12px 14px;margin:0 0 20px;">
                <p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:#6B6F76;">Button not working? Copy and paste this link into your browser:</p>
                <p style="margin:0;font-size:12px;line-height:1.5;word-break:break-all;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">
                  <a href="${safeLink}" target="_blank" rel="noopener" style="color:#2D2F33;text-decoration:underline;">${safeLink}</a>
                </p>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.55;color:#6B6F76;">
                If you didn’t request this password reset, you can safely ignore this email — your password has not been changed.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#FAFAF7;border-top:1px solid #EFEFE8;font-size:12px;line-height:1.5;color:#90969E;">
              BillCrafter · <a href="https://billcrafter.com" style="color:#6B6F76;text-decoration:none;">billcrafter.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    "Reset your BillCrafter Admin password",
    "",
    `Use this one-time link to set a new admin password for ${email} (expires in 15 minutes):`,
    link,
    "",
    "If you didn't request this password reset, you can safely ignore this email.",
    "",
    "BillCrafter · https://billcrafter.com",
  ].join("\n");

  return { subject: "Reset your BillCrafter Admin password", html, text };
}
