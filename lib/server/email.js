// Outbound invoice email (Resend), shared by /api/send-invoice and /api/sign.
//
// Extracted so the signed-copy email goes out through exactly the same path as a
// normal invoice email — same From, same reply-to, same email_log row. Two copies
// of this would drift, and the log is what support and the admin panel read.
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

export const isEmail = (s) => /.+@.+\..+/.test(String(s || "").trim());

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
 * Send a PDF attachment through Resend and record it in email_log.
 * Returns { ok } or { ok:false, error, status } — callers map that to a response.
 */
export async function sendPdfEmail(env, { user, to, subject, message, filename, pdfBase64, footerNote }) {
  if (!env?.EMAIL_API_KEY) return { ok: false, error: "email_unavailable", status: 503 };
  if (!isEmail(to) || !pdfBase64) return { ok: false, error: "invalid", status: 400 };

  const from = env.EMAIL_FROM || "BillCrafter <noreply@billcrafter.com>";
  const body = esc(message || "Please find your invoice attached.").replace(/\n/g, "<br>");
  const note = footerNote ? `<p style="color:#888;font-size:12px">${esc(footerNote)}</p>` : "";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.EMAIL_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: user?.email,
        subject: subject || "Your invoice",
        html: `<p>${body}</p><hr style="border:none;border-top:1px solid #eee;margin:16px 0">${note}<p style="color:#888;font-size:12px">Sent via BillCrafter · billcrafter.com</p>`,
        attachments: [{ filename: filename || "invoice.pdf", content: pdfBase64 }],
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      await logEmail(env, { user, to, subject, filename, status: "failed", error: `HTTP ${r.status} ${detail}` });
      return { ok: false, error: "send_failed", status: 502 };
    }
    await logEmail(env, { user, to, subject, filename, status: "sent" });
    return { ok: true };
  } catch (e) {
    await logEmail(env, { user, to, subject, filename, status: "failed", error: e && e.message });
    return { ok: false, error: "send_failed", status: 502 };
  }
}
