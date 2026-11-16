// Contact form → emails support@billcrafter.com via Cloudflare Email Service (reply-to = visitor).
import { getEnv, isBanned, reqClientIp } from "@/lib/server/auth";
import { sendEmail, isEmail, consumeEmailRateLimit } from "@/lib/server/email";

const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

export async function POST(request) {
  const { name, email, message, website } = await request.json().catch(() => ({}));
  if (website) return Response.json({ ok: true }); // honeypot: pretend success for bots
  if (!isEmail(email) || !message || message.trim().length < 5) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const env = await getEnv();
  if (!env?.EMAIL) return Response.json({ ok: false, error: "email_unavailable" }, { status: 503 });

  const senderEmail = String(email).trim();
  if (await isBanned(env, { email: senderEmail, ip: reqClientIp(request) })) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const rl = await consumeEmailRateLimit(env, { request, email: senderEmail, scope: "contact" });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: rl.error },
      { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
    );
  }

  const to = env.CONTACT_TO || "support@billcrafter.com";
  const res = await sendEmail(env, {
    to,
    replyTo: senderEmail,
    subject: `Contact form — ${(name || senderEmail).slice(0, 80)}`,
    html: `<p><b>From:</b> ${esc(name) || "—"} &lt;${esc(senderEmail)}&gt;</p><p><b>Message:</b></p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
    text: `From: ${name || "—"} <${senderEmail}>\n\nMessage:\n${message}`,
  });
  if (!res.ok) return Response.json({ ok: false, error: res.error || "send_failed" }, { status: res.status || 502 });
  return Response.json({ ok: true });
}
