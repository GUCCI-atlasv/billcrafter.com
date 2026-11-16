// Magic-link — step 1: create a token and email a sign-in link via Cloudflare Email Service.
// Tokens are stored in KV so verify works even when D1 row-reads are exhausted.
import { getEnv, putMagicToken, isBanned, reqClientIp } from "@/lib/server/auth";
import { sendEmail, isEmail, buildMagicLinkEmail, consumeEmailRateLimit } from "@/lib/server/email";

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));
  const em = (email || "").trim().toLowerCase();
  if (!isEmail(em)) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });

  const env = await getEnv();
  // KV is required for magic auth; D1 is optional (often over free-tier read quota).
  if (!env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  if (await isBanned(env, { email: em, ip: reqClientIp(request) })) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const hasEmail = Boolean(env.EMAIL && typeof env.EMAIL.send === "function");
  if (hasEmail) {
    const rl = await consumeEmailRateLimit(env, { request, email: em, scope: "magic" });
    if (!rl.ok) {
      return Response.json(
        { ok: false, error: rl.error },
        { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
      );
    }
  }

  const reqUrl = new URL(request.url);
  const isLocal = reqUrl.hostname === "localhost" || reqUrl.hostname === "127.0.0.1";
  const baseUrl = (!isLocal && env.APP_URL) ? env.APP_URL.replace(/\/+$/, "") : reqUrl.origin;

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  try {
    await putMagicToken(env, token, em);
  } catch {
    return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  }
  const link = `${baseUrl}/api/auth/magic/verify?token=${token}`;

  if (hasEmail) {
    const { subject, html, text } = buildMagicLinkEmail({ email: em, link });
    const res = await sendEmail(env, {
      to: em,
      replyTo: env.CONTACT_TO || "support@billcrafter.com",
      subject,
      html,
      text,
    });
    if (!res.ok) {
      console.error("magic_email_failed", res.detail || res.error);
      return Response.json({ ok: false, error: "email_failed" }, { status: 502 });
    }
    return Response.json({ ok: true, sent: true });
  }
  // No email binding configured (e.g. plain `next dev` without Wrangler): return the link so you can test.
  return Response.json({ ok: true, sent: false, devLink: link });
}
