import { getEnv } from "@/lib/server/auth";
import { readAdminSid, destroyAdminSession, clearAdminCookie } from "@/lib/server/admin";

export async function POST(request) {
  const env = await getEnv();
  const sid = readAdminSid(request);
  if (env?.DB && sid) await destroyAdminSession(env, sid);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json", "set-cookie": clearAdminCookie() },
  });
}
