// Magic-link — step 2: verify the token and sign the user in.
// Reads the token from KV first so login works when D1 is over quota.
import { getEnv, upsertUser, createSession, sessionCookie, consumeMagicToken } from "@/lib/server/auth";

// Ignore HEAD preflight requests from email security scanners so they don't consume the one-time token.
export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const token = url.searchParams.get("token");
  const env = await getEnv();
  const fail = (c) => Response.redirect(`${origin}/login?e=${c}`, 302);

  if (!env?.SESSIONS) return fail("backend");
  if (!token) return fail("link");

  const email = await consumeMagicToken(env, token);
  if (!email) return fail("link");

  let user;
  try {
    user = await upsertUser(env, email);
  } catch {
    // No D1 and no KV user cache — refuse a ghost session cookie.
    return fail("backend");
  }
  const sid = await createSession(env, user);
  return new Response(null, {
    status: 302,
    headers: { Location: `${origin}/invoicemanager`, "set-cookie": sessionCookie(sid) },
  });
}
