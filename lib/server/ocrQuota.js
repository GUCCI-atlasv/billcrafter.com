// OCR daily allowance, burst rate-limiting, and global daily cost circuit-breaker.
//
//   Guest (no account) -> 3 real AI OCR scans per UTC day (keyed by IP)
//   Free account       -> 20 real AI OCR scans per UTC day (keyed by user.id)
//   Sample bills       -> Unlimited (served client-side with 0 API calls)
//
// Just like /api/pdf, an allowance is ONLY charged when a valid extraction is
// actually returned to the user. Upstream errors never eat someone's free scans.

import { clientIp, utcDay } from "./quota";
import { QUOTA_POLICY } from "../quotaConfig";

export const OCR_ANON_DAILY_LIMIT = QUOTA_POLICY.ocrGuestDaily;
export const OCR_MEMBER_DAILY_LIMIT = QUOTA_POLICY.ocrMemberDaily;
export const OCR_GLOBAL_DAILY_DEFAULT = 3000; // ~$1.05/day hard ceiling on Gemini 2.5 Flash

const ATTEMPT_WINDOW_SEC = 600; // 10 minutes
const ATTEMPT_MAX = 15;         // max attempts per caller per 10-minute window
const KV_USAGE_TTL = 60 * 60 * 26;

const subjKey = (user, ip) => (user?.id ? `u:${user.id}` : `ip:${ip || "unknown"}`);
const kvUsageKey = (subj, day = utcDay()) => `ocr:u:${subj}:${day}`;
const kvGlobalKey = (day = utcDay()) => `ocr:global:${day}`;

async function kvGetNum(env, key) {
  if (!env?.SESSIONS) return null;
  try {
    const raw = await env.SESSIONS.get(key);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

async function kvPutNum(env, key, n, ttl = KV_USAGE_TTL) {
  if (!env?.SESSIONS) return;
  try {
    await env.SESSIONS.put(key, String(n), { expirationTtl: ttl });
  } catch {
    // non-fatal
  }
}

export function globalCapOf(env) {
  const raw = (env && env.OCR_DAILY_GLOBAL_CAP) || (typeof process !== "undefined" ? process.env?.OCR_DAILY_GLOBAL_CAP : "");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : OCR_GLOBAL_DAILY_DEFAULT;
}

export async function ocrGlobalUsedToday(env) {
  const day = utcDay();
  const cached = await kvGetNum(env, kvGlobalKey(day));
  if (cached != null) return cached;
  if (!env?.DB) return 0;
  try {
    const row = await env.DB
      .prepare("SELECT COALESCE(SUM(count), 0) AS total FROM ocr_daily_usage WHERE day = ?")
      .bind(day)
      .first();
    const total = Number(row?.total || 0);
    await kvPutNum(env, kvGlobalKey(day), total);
    return total;
  } catch {
    return 0;
  }
}

export async function ocrUsedToday(env, subject) {
  if (!subject || subject === "ip:unknown") return 0;
  const day = utcDay();
  const cached = await kvGetNum(env, kvUsageKey(subject, day));
  if (cached != null) return cached;
  if (!env?.DB) return 0;
  try {
    const row = await env.DB
      .prepare("SELECT count FROM ocr_daily_usage WHERE subject = ? AND day = ?")
      .bind(subject, day)
      .first();
    const c = Number(row?.count || 0);
    await kvPutNum(env, kvUsageKey(subject, day), c);
    return c;
  } catch {
    return 0;
  }
}

export async function readOcrAllowance(env, request, user) {
  const ip = clientIp(request);
  const subject = subjKey(user, ip);
  const limit = user?.id ? OCR_MEMBER_DAILY_LIMIT : OCR_ANON_DAILY_LIMIT;
  if (!user?.id && !ip) {
    return { allowed: false, reason: "no_ip", plan: "anon", used: 0, limit, remaining: 0, subject, ip: null };
  }

  const globalCap = globalCapOf(env);
  const globalUsed = await ocrGlobalUsedToday(env);
  if (globalUsed >= globalCap) {
    return { allowed: false, reason: "global_cap", plan: user?.id ? "member" : "anon", used: limit, limit, remaining: 0, subject, ip };
  }

  const used = await ocrUsedToday(env, subject);
  const remaining = Math.max(0, limit - used);
  return {
    allowed: used < limit,
    reason: used < limit ? null : "quota",
    plan: user?.id ? "member" : "anon",
    day: utcDay(),
    used,
    limit,
    remaining,
    subject,
    ip,
  };
}

export async function tooManyOcrAttempts(env, request, user) {
  if (!env?.SESSIONS) return false;
  const id = subjKey(user, clientIp(request));
  const key = `ocratt:${id}`;
  const current = (await kvGetNum(env, key)) || 0;
  if (current >= ATTEMPT_MAX) return true;
  await kvPutNum(env, key, current + 1, ATTEMPT_WINDOW_SEC);
  return false;
}

export async function chargeOcrScan(env, subject) {
  if (!subject || subject === "ip:unknown") return { used: 0 };
  const day = utcDay();
  const next = (await ocrUsedToday(env, subject)) + 1;
  await kvPutNum(env, kvUsageKey(subject, day), next);

  const gNext = (await ocrGlobalUsedToday(env)) + 1;
  await kvPutNum(env, kvGlobalKey(day), gNext);

  if (env?.DB) {
    const now = Date.now();
    try {
      await env.DB
        .prepare(
          "INSERT INTO ocr_daily_usage (subject, day, count, updated_at) VALUES (?, ?, 1, ?) " +
          "ON CONFLICT(subject, day) DO UPDATE SET count = count + 1, updated_at = ?"
        )
        .bind(subject, day, now, now)
        .run();
    } catch {
      // Table might not be migrated yet in local dev — KV still enforces the limit
    }
  }
  return { used: next };
}
