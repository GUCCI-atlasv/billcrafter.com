// Google OAuth — step 1: redirect to Google's consent screen.
// Supports `?mode=admin` for /admin console login using the exact same callback URI.
import { getEnv } from "@/lib/server/auth";

export async function GET(request) {
  const env = await getEnv();
  const reqUrl = new URL(request.url);
  const isLocal = reqUrl.hostname === "localhost" || reqUrl.hostname === "127.0.0.1";
  const baseUrl = (!isLocal && env?.APP_URL) ? env.APP_URL.replace(/\/+$/, "") : reqUrl.origin;
  const mode = reqUrl.searchParams.get("mode") === "admin" ? "admin" : "user";
  const clientId = env?.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return Response.redirect(`${baseUrl}/${mode === "admin" ? "admin" : "login"}?e=google_not_configured`, 302);
  }
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${baseUrl}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  const headers = new Headers({
    Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  });
  headers.append("set-cookie", `g_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
  headers.append("set-cookie", `g_flow=${mode}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
  return new Response(null, { status: 302, headers });
}
