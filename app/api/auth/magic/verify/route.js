// Magic-link — step 2: verify the token and sign the user in.
// Reads the token from KV first so login works when D1 is over quota.
import { getEnv, upsertUser, createSession, sessionCookie, consumeMagicToken } from "@/lib/server/auth";

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

  const user = await upsertUser(env, email);
  const sid = await createSession(env, user);
  return new Response(null, {
    status: 302,
    headers: { Location: `${origin}/invoicemanager`, "set-cookie": sessionCookie(sid) },
  });
}
