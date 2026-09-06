// Magic-link — step 1: create a token and email a sign-in link.
import { getEnv } from "@/lib/server/auth";

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));
  const em = (email || "").trim().toLowerCase();
  if (!/.+@.+\..+/.test(em)) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });

  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const origin = new URL(request.url).origin;
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const expires = Date.now() + 15 * 60 * 1000;
  await env.DB.prepare("INSERT INTO magic_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)").bind(token, em, expires).run();
  const link = `${origin}/api/auth/magic/verify?token=${token}`;

  if (env.EMAIL_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${env.EMAIL_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: env.EMAIL_FROM || "BillCrafter <login@billcrafter.com>",
          to: [em],
          subject: "Your BillCrafter sign-in link",
          html: `<p>Hi,</p><p>Click the link below to sign in to BillCrafter. It expires in 15 minutes.</p><p><a href="${link}" style="display:inline-block;background:#16181C;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Sign in to BillCrafter</a></p><p>If you didn't request this, you can ignore this email.</p>`,
        }),
      });
      if (!res.ok) return Response.json({ ok: false, error: "email_failed" }, { status: 502 });
      return Response.json({ ok: true, sent: true });
    } catch {
      return Response.json({ ok: false, error: "email_failed" }, { status: 502 });
    }
  }
  // No email provider configured (e.g. before you set EMAIL_API_KEY): return the link so you can test.
  return Response.json({ ok: true, sent: false, devLink: link });
}
