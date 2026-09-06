import { getEnv, verifyPassword, createSession, sessionCookie } from "@/lib/server/auth";

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) return Response.json({ ok: false, error: "missing" }, { status: 400 });

  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const em = email.trim().toLowerCase();
  const row = await env.DB.prepare("SELECT id, email, plan, password_hash FROM users WHERE email = ?").bind(em).first();
  if (!row || !row.password_hash || !(await verifyPassword(password, row.password_hash))) {
    return Response.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const sid = await createSession(env, { id: row.id, email: row.email });
  return new Response(JSON.stringify({ ok: true, user: { email: row.email, plan: row.plan } }), {
    status: 200, headers: { "content-type": "application/json", "set-cookie": sessionCookie(sid) },
  });
}
