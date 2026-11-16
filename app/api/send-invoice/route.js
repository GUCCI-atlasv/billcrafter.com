// Email an invoice PDF to the client (available to any signed-in user).
// Enforces anti-abuse rate limiting (max 1/minute, 3/day per account & IP).
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { sendPdfEmail, isEmail, consumeEmailRateLimit } from "@/lib/server/email";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });
  if (!env.EMAIL) return Response.json({ ok: false, error: "email_unavailable" }, { status: 503 });

  const { to, subject, message, filename, pdfBase64 } = await request.json().catch(() => ({}));
  if (!isEmail(to) || !pdfBase64) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const rl = await consumeEmailRateLimit(env, { request, user, scope: "outbound" });
  if (!rl.ok) {
    return Response.json(
      { ok: false, error: rl.error, limit: rl.limit, resetAt: rl.resetAt },
      { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined }
    );
  }

  const res = await sendPdfEmail(env, { user, to, subject, message, filename, pdfBase64 });
  if (!res.ok) return Response.json({ ok: false, error: res.error }, { status: res.status || 502 });
  return Response.json({ ok: true });
}
