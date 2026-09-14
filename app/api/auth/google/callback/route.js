// Google OAuth — step 2: exchange the code, sign the user in.
import { getEnv, upsertUser, createSession, sessionCookie, readCookieValue } from "@/lib/server/auth";

function decodeJwtEmail(idToken) {
  try {
    const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(decodeURIComponent(escape(atob(payload))));
    return json.email_verified === false ? null : json.email || null;
  } catch { return null; }
}

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const env = await getEnv();
  const fail = (code) => Response.redirect(`${origin}/login?e=${code}`, 302);

  if (!env?.DB || !env?.SESSIONS) return fail("backend");
  const clientId = env.GOOGLE_CLIENT_ID, clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("google_not_configured");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = readCookieValue(request, "g_state");
  if (!code || !state || state !== cookieState) return fail("oauth_state");

  let email = null;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`, grant_type: "authorization_code",
      }),
    });
    const tj = await tokenRes.json();
    email = tj.id_token ? decodeJwtEmail(tj.id_token) : null;
    if (!email && tj.access_token) {
      const ui = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${tj.access_token}` } });
      const uj = await ui.json(); email = uj.email || null;
    }
  } catch { return fail("oauth_exchange"); }

  if (!email) return fail("oauth_email");
  let user;
  try {
    user = await upsertUser(env, email);
  } catch {
    return fail("backend");
  }
  const sid = await createSession(env, user);
  const clearState = "g_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
  const headers = new Headers({ Location: `${origin}/invoicemanager` });
  headers.append("set-cookie", sessionCookie(sid));
  headers.append("set-cookie", clearState);
  return new Response(null, { status: 302, headers });
}
