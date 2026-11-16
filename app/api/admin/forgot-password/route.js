// Admin forgot-password — step 1: email a one-time reset link to an authorized admin.
// Tokens live in KV (`admin_reset:<token>`) with a 15-minute TTL.
import { getEnv } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";
import { sendEmail, isEmail, buildAdminResetEmail } from "@/lib/server/email";

const RESET_TTL = 60 * 15; // 15 minutes

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) {
    return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  let em = (body?.email || "").trim().toLowerCase();
  if (!em) {
    const current = await getAdmin(request, env).catch(() => null);
    if (current?.email) em = current.email.toLowerCase();
  }
  if (!isEmail(em)) {
    return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const row = await env.DB.prepare("SELECT id, email, role FROM admins WHERE lower(email) = ?")
    .bind(em).first();

  // Do not disclose whether an arbitrary email is an admin account.
  if (!row) {
    return Response.json({ ok: true, sent: true });
  }

  const reqUrl = new URL(request.url);
  const isLocal = reqUrl.hostname === "localhost" || reqUrl.hostname === "127.0.0.1";
  const baseUrl = (!isLocal && env.APP_URL) ? env.APP_URL.replace(/\/+$/, "") : reqUrl.origin;

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  await env.SESSIONS.put(
    "admin_reset:" + token,
    JSON.stringify({ adminId: row.id, email: row.email, role: row.role, expires_at: Date.now() + RESET_TTL * 1000 }),
    { expirationTtl: RESET_TTL },
  );

  const link = `${baseUrl}/admin?reset=${token}`;

  if (env.EMAIL && typeof env.EMAIL.send === "function") {
    const { subject, html, text } = buildAdminResetEmail({ email: row.email, link });
    const res = await sendEmail(env, {
      to: row.email,
      replyTo: env.CONTACT_TO || "support@billcrafter.com",
      subject,
      html,
      text,
    });
    if (!res.ok) {
      console.error("admin_reset_email_failed", res.detail || res.error);
      return Response.json({ ok: false, error: "email_failed" }, { status: 502 });
    }
    try {
      await env.DB.prepare("INSERT INTO audit_log (admin_email, action, created_at) VALUES (?, ?, ?)")
        .bind(row.email, "Requested password reset", Date.now()).run();
    } catch {}
    return Response.json({ ok: true, sent: true });
  }

  // No email binding configured (e.g. local dev without Wrangler): return the link for testing.
  return Response.json({ ok: true, sent: false, devLink: link });
}
