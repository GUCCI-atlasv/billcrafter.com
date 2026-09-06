// Magic-link — step 2: verify the token and sign the user in.
import { getEnv, upsertUser, createSession, sessionCookie } from "@/lib/server/auth";

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const token = url.searchParams.get("token");
  const env = await getEnv();
  const fail = (c) => Response.redirect(`${origin}/login?e=${c}`, 302);

  if (!env?.DB || !env?.SESSIONS) return fail("backend");
  if (!token) return fail("link");

  const row = await env.DB.prepare("SELECT token, email, expires_at, used FROM magic_tokens WHERE token = ?").bind(token).first();
  if (!row || row.used || Number(row.expires_at) < Date.now()) return fail("link");

  await env.DB.prepare("UPDATE magic_tokens SET used = 1 WHERE token = ?").bind(token).run();
  const user = await upsertUser(env, row.email);
  const sid = await createSession(env, user);
  return new Response(null, { status: 302, headers: { Location: `${origin}/invoicemanager`, "set-cookie": sessionCookie(sid) } });
}
