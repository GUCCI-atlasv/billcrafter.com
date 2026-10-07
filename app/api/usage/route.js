// Export allowance, enforced server-side (see lib/server/quota.js).
//   no account   -> 1 export per day, keyed by IP
//   free account -> unlimited
//   GET  -> { ok, plan: "anon" | "member", unlimited, day, count, limit, remaining }
//   POST -> records one export (client-side renderer path), returns the same shape
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { clientIp, anonUsedToday, chargeAnon, recordMemberExport, memberPayload, anonPayload } from "@/lib/server/quota";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const env = await getEnv();
  // Reads are served from KV when D1 is unavailable (e.g. free-tier read limit).
  if (!env?.DB && !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const user = env.SESSIONS ? await getSessionUser(request, env) : null;
  if (user) return Response.json(memberPayload());
  return Response.json(anonPayload(await anonUsedToday(env, clientIp(request))));
}

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const user = env.SESSIONS ? await getSessionUser(request, env) : null;
  if (user) {
    await recordMemberExport(env, user.id);
    return Response.json(memberPayload());
  }

  const ip = clientIp(request);
  if (!ip) return Response.json(anonPayload(0)); // can't identify -> don't block
  await chargeAnon(env, ip);
  return Response.json(anonPayload(await anonUsedToday(env, ip)));
}
