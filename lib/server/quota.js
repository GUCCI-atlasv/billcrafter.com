// Export allowance. BillCrafter is free — there are no paid plans.
//
//   no account   -> ANON_DAILY_LIMIT PDF exports per UTC day, keyed by IP,
//                   and no status stamps (PAID / UNPAID …) on the document
//   free account -> unlimited exports and every feature
//
// Signed-in exports are still written to export_usage (per month) so the admin
// dashboard keeps its numbers; they are never used to block anyone.

export const ANON_DAILY_LIMIT = 1;

export const utcDay = () => new Date().toISOString().slice(0, 10);   // 'YYYY-MM-DD'
const utcMonth = () => new Date().toISOString().slice(0, 7);          // 'YYYY-MM'

export function clientIp(request) {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    null
  );
}

// Anonymous counts are mirrored in KV (SESSIONS) so every editor load doesn't
// spend a D1 row read — the free tier's daily read limit has been hit before.
const anonKey = (ip) => `usage:a:${ip}:${utcDay()}`;
const ANON_KV_TTL = 60 * 60 * 26; // outlives the UTC day it counts

async function kvCount(env, key) {
  if (!env?.SESSIONS) return null;
  try {
    const v = await env.SESSIONS.get(key);
    const n = v == null ? NaN : Number(v);
    return Number.isFinite(n) ? n : null;
  } catch { return null; }
}

async function kvSetCount(env, key, n) {
  if (!env?.SESSIONS) return;
  try { await env.SESSIONS.put(key, String(n), { expirationTtl: ANON_KV_TTL }); } catch { /* ignore */ }
}

export async function anonUsedToday(env, ip) {
  if (!ip) return 0;
  const cached = await kvCount(env, anonKey(ip));
  if (cached != null) return cached;
  if (!env?.DB) return 0;
  const row = await env.DB.prepare("SELECT count FROM anon_daily_usage WHERE ip = ? AND day = ?")
    .bind(ip, utcDay()).first().catch(() => null);
  const c = row?.count || 0;
  await kvSetCount(env, anonKey(ip), c);
  return c;
}

export async function chargeAnon(env, ip) {
  if (!ip) return;
  const next = (await anonUsedToday(env, ip)) + 1;
  await kvSetCount(env, anonKey(ip), next);
  if (!env?.DB) return;
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO anon_daily_usage (ip, day, count, updated_at) VALUES (?, ?, 1, ?) " +
    "ON CONFLICT(ip, day) DO UPDATE SET count = count + 1, updated_at = ?"
  ).bind(ip, utcDay(), now, now).run().catch(() => {});
}

// Stats only — accounts are unlimited.
export async function recordMemberExport(env, userId) {
  if (!env?.DB) return;
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO export_usage (user_id, month, count, updated_at) VALUES (?, ?, 1, ?) " +
    "ON CONFLICT(user_id, month) DO UPDATE SET count = count + 1, updated_at = ?"
  ).bind(userId, utcMonth(), now, now).run().catch(() => {});
}

export function memberPayload() {
  return { ok: true, plan: "member", unlimited: true, day: utcDay(), count: null, limit: null, remaining: null };
}

export function anonPayload(count) {
  return {
    ok: true, plan: "anon", unlimited: false, day: utcDay(), count,
    limit: ANON_DAILY_LIMIT, remaining: Math.max(0, ANON_DAILY_LIMIT - count),
  };
}
