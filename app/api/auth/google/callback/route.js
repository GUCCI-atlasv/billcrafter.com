// Google OAuth — step 2: exchange the code, sign the user (or authorized admin) in.
import { getEnv, upsertUser, createSession, sessionCookie, readCookieValue } from "@/lib/server/auth";
import { createAdminSession, adminCookie } from "@/lib/server/admin";

function decodeJwtEmail(idToken) {
  try {
    const payload = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(decodeURIComponent(escape(atob(payload))));
    return json.email_verified === false ? null : json.email || null;
  } catch { return null; }
}

const clearState = "g_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
const clearFlow = "g_flow=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";

export async function GET(request) {
  const url = new URL(request.url);
  const env = await getEnv();
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const baseUrl = (!isLocal && env?.APP_URL) ? env.APP_URL.replace(/\/+$/, "") : url.origin;
  const flow = readCookieValue(request, "g_flow") === "admin" ? "admin" : "user";

  const fail = (code) => {
    const headers = new Headers({
      Location: `${baseUrl}/${flow === "admin" ? "admin" : "login"}?e=${code}`,
    });
    headers.append("set-cookie", clearState);
    headers.append("set-cookie", clearFlow);
    return new Response(null, { status: 302, headers });
  };

  if (!env?.DB || (flow !== "admin" && !env?.SESSIONS)) return fail("backend");
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
        redirect_uri: `${baseUrl}/api/auth/google/callback`, grant_type: "authorization_code",
      }),
    });
    const tj = await tokenRes.json();
    email = tj.id_token ? decodeJwtEmail(tj.id_token) : null;
    if (!email && tj.access_token) {
      const ui = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${tj.access_token}` } });
      const uj = await ui.json();
      email = uj.email_verified === false ? null : uj.email || null;
    }
  } catch { return fail("oauth_exchange"); }

  if (!email) return fail("oauth_email");

  if (flow === "admin") {
    const em = String(email).trim().toLowerCase();
    let row;
    try {
      row = await env.DB.prepare("SELECT id, email, role FROM admins WHERE lower(email) = ?").bind(em).first();
    } catch {
      return fail("backend");
    }
    if (!row) return fail("not_admin");

    const sid = await createAdminSession(env, { id: row.id, email: row.email, role: row.role }, { authMethod: "google" });
    try {
      await env.DB.prepare("INSERT INTO audit_log (admin_email, action, created_at) VALUES (?, ?, ?)")
        .bind(row.email, "Signed in (Google)", Date.now()).run();
    } catch {}

    const headers = new Headers({ Location: `${baseUrl}/admin` });
    headers.append("set-cookie", adminCookie(sid));
    headers.append("set-cookie", clearState);
    headers.append("set-cookie", clearFlow);
    return new Response(null, { status: 302, headers });
  }

  let user;
  try {
    user = await upsertUser(env, email);
  } catch {
    return fail("backend");
  }
  const sid = await createSession(env, user);
  const headers = new Headers({ Location: `${baseUrl}/invoicemanager` });
  headers.append("set-cookie", sessionCookie(sid));
  headers.append("set-cookie", clearState);
  headers.append("set-cookie", clearFlow);
  return new Response(null, { status: 302, headers });
}
