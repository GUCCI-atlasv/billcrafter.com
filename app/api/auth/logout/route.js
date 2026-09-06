import { getEnv, readSid, clearCookie } from "@/lib/server/auth";

export async function POST(request) {
  const env = await getEnv();
  const sid = readSid(request);
  if (env?.SESSIONS && sid) { try { await env.SESSIONS.delete("sess:" + sid); } catch {} }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "content-type": "application/json", "set-cookie": clearCookie() },
  });
}
