import { getEnv, getSessionUser } from "@/lib/server/auth";

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: true, user: null });
  return Response.json({ ok: true, user: { email: user.email, plan: user.plan } });
}
