// Google OAuth — step 1: redirect to Google's consent screen.
import { getEnv } from "@/lib/server/auth";

export async function GET(request) {
  const env = await getEnv();
  const origin = new URL(request.url).origin;
  const clientId = env?.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return Response.redirect(`${origin}/login?e=google_not_configured`, 302);
  }
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  const cookie = `g_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`;
  return new Response(null, {
    status: 302,
    headers: { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, "set-cookie": cookie },
  });
}
