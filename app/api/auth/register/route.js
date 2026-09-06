import { getEnv, hashPassword, createSession, sessionCookie } from "@/lib/server/auth";

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !/.+@.+\..+/.test(email)) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  if (!password || password.length < 6) return Response.json({ ok: false, error: "weak_password" }, { status: 400 });

  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const em = email.trim().toLowerCase();
  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(em).first();
  if (exists) return Response.json({ ok: false, error: "email_taken" }, { status: 409 });

  const user = { id: crypto.randomUUID(), email: em, plan: "free" };
  await env.DB.prepare("INSERT INTO users (id, email, password_hash, plan, created_at) VALUES (?, ?, ?, 'free', ?)")
    .bind(user.id, em, await hashPassword(password), Date.now()).run();

  const sid = await createSession(env, user);
  return new Response(JSON.stringify({ ok: true, user: { email: em, plan: "free" } }), {
    status: 201, headers: { "content-type": "application/json", "set-cookie": sessionCookie(sid) },
  });
}
