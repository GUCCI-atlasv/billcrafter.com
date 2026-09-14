// Export quota, enforced server-side.
//   anonymous  -> 1 export per month, keyed by IP
//   free       -> 5 exports per month, keyed by account
//   pro        -> unlimited
// Counts are cached in KV (SESSIONS) to avoid burning D1 row reads on every editor load.
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const LIMIT_ANON = 1;
export const LIMIT_FREE = 5;
const USAGE_TTL = 60 * 60; // 1 hour cache; invalidated on increment

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

function usageKey(kind, id) {
  return `usage:${kind}:${id}:${month()}`;
}

async function kvGetCount(env, key) {
  if (!env?.SESSIONS) return null;
  try {
    const v = await env.SESSIONS.get(key);
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

async function kvSetCount(env, key, count) {
  if (!env?.SESSIONS) return;
  try {
    await env.SESSIONS.put(key, String(count), { expirationTtl: USAGE_TTL });
  } catch { /* ignore */ }
}

async function readUserCount(env, userId) {
  const key = usageKey("u", userId);
  const cached = await kvGetCount(env, key);
  if (cached != null) return cached;
  try {
    const row = await env.DB.prepare("SELECT count FROM export_usage WHERE user_id = ? AND month = ?")
      .bind(userId, month()).first();
    const c = row?.count || 0;
    await kvSetCount(env, key, c);
    return c;
  } catch {
    return 0;
  }
}

async function readAnonCount(env, ip) {
  if (!ip) return 0;
  const key = usageKey("a", ip);
  const cached = await kvGetCount(env, key);
  if (cached != null) return cached;
  try {
    const row = await env.DB.prepare("SELECT count FROM anon_usage WHERE ip = ? AND month = ?")
      .bind(ip, month()).first();
    const c = row?.count || 0;
    await kvSetCount(env, key, c);
    return c;
  } catch {
    return 0;
  }
}

function payload(plan, count) {
  if (plan === "pro") return { ok: true, plan: "pro", month: month(), count, limit: null, remaining: null };
  const limit = plan === "anon" ? LIMIT_ANON : LIMIT_FREE;
  return { ok: true, plan, month: month(), count, limit, remaining: Math.max(0, limit - count) };
}

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB && !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

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
    try {
      await env.DB.prepare(
        "INSERT INTO export_usage (user_id, month, count, updated_at) VALUES (?, ?, 1, ?) " +
        "ON CONFLICT(user_id, month) DO UPDATE SET count = count + 1, updated_at = ?"
      ).bind(user.id, m, now, now).run();
    } catch { /* ignore */ }
    // Bust cache then re-read (or optimistic +1)
    const prev = (await kvGetCount(env, usageKey("u", user.id))) || 0;
    const next = prev + 1;
    await kvSetCount(env, usageKey("u", user.id), next);
    return Response.json(payload("free", next));
  }

  const ip = clientIp(request);
  if (!ip) return Response.json(payload("anon", 0));
  try {
    await env.DB.prepare(
      "INSERT INTO anon_usage (ip, month, count, updated_at) VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(ip, month) DO UPDATE SET count = count + 1, updated_at = ?"
    ).bind(ip, m, now, now).run();
  } catch { /* ignore */ }
  const prev = (await kvGetCount(env, usageKey("a", ip))) || 0;
  const next = prev + 1;
  await kvSetCount(env, usageKey("a", ip), next);
  return Response.json(payload("anon", next));
}
