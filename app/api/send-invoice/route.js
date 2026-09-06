// Email an invoice PDF to the client (available to any signed-in user).
// The Resend call and email_log write live in lib/server/email.js so the signed
// copy sent from /api/sign goes out through the identical path.
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { sendPdfEmail, isEmail } from "@/lib/server/email";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });
  if (!env.EMAIL_API_KEY) return Response.json({ ok: false, error: "email_unavailable" }, { status: 503 });

  const { to, subject, message, filename, pdfBase64 } = await request.json().catch(() => ({}));
  if (!isEmail(to) || !pdfBase64) return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const res = await sendPdfEmail(env, { user, to, subject, message, filename, pdfBase64 });
  if (!res.ok) return Response.json({ ok: false, error: res.error }, { status: res.status || 502 });
  return Response.json({ ok: true });
}
