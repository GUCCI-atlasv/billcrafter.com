// Export quota, enforced server-side.
//   anonymous  -> 1 export per month, keyed by IP (get people using it first)
//   free       -> 5 exports per month, keyed by account
//   pro        -> unlimited
//   GET  -> { ok, plan, month, count, limit, remaining }
//   POST -> increments, returns the same shape
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const LIMIT_ANON = 1;
export const LIMIT_FREE = 5;

const month = () => new Date().toISOString().slice(0, 7);

function clientIp(request) {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    null
  );
}

async function readUserCount(env, userId) {
  const row = await env.DB.prepare("SELECT count FROM export_usage WHERE user_id = ? AND month = ?")
    .bind(userId, month()).first().catch(() => null);
  return row?.count || 0;
}
async function readAnonCount(env, ip) {
  if (!ip) return 0;
  const row = await env.DB.prepare("SELECT count FROM anon_usage WHERE ip = ? AND month = ?")
    .bind(ip, month()).first().catch(() => null);
  return row?.count || 0;
}

function payload(plan, count) {
  if (plan === "pro") return { ok: true, plan: "pro", month: month(), count, limit: null, remaining: null };
  const limit = plan === "anon" ? LIMIT_ANON : LIMIT_FREE;
  return { ok: true, plan, month: month(), count, limit, remaining: Math.max(0, limit - count) };
}

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const user = env.SESSIONS ? await getSessionUser(request, env) : null;
  if (user) return Response.json(payload(user.plan === "pro" ? "pro" : "free", await readUserCount(env, user.id)));
  return Response.json(payload("anon", await readAnonCount(env, clientIp(request))));
}

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const user = env.SESSIONS ? await getSessionUser(request, env) : null;
  const m = month();
  const now = Date.now();

  if (user) {
    if (user.plan === "pro") return Response.json(payload("pro", await readUserCount(env, user.id)));
    await env.DB.prepare(
      "INSERT INTO export_usage (user_id, month, count, updated_at) VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(user_id, month) DO UPDATE SET count = count + 1, updated_at = ?"
    ).bind(user.id, m, now, now).run();
    return Response.json(payload("free", await readUserCount(env, user.id)));
  }

  const ip = clientIp(request);
  if (!ip) return Response.json(payload("anon", 0)); // can't identify -> don't block
  await env.DB.prepare(
    "INSERT INTO anon_usage (ip, month, count, updated_at) VALUES (?, ?, 1, ?) " +
    "ON CONFLICT(ip, month) DO UPDATE SET count = count + 1, updated_at = ?"
  ).bind(ip, m, now, now).run();
  return Response.json(payload("anon", await readAnonCount(env, ip)));
}
