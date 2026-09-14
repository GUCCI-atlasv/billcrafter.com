// Server-side auth helpers for Cloudflare (D1 users + KV sessions).
// Runs inside the OpenNext worker. Uses Web Crypto (available in Workers).
//
// Magic tokens and session user snapshots live in KV so sign-in still works
// when D1's free-tier daily row-read limit is exhausted.

const COOKIE = "bc_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
const USER_CACHE_TTL = 60 * 60 * 24 * 7; // 7 days
const MAGIC_TTL = 60 * 15; // 15 minutes

// Resolve Cloudflare bindings (DB, SESSIONS). Returns null if unavailable
// (e.g. plain `next dev` without wrangler bindings) so callers can fall back.
export async function getEnv() {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext();
    return ctx?.env || null;
  } catch {
    return null;
  }
}

function b64(bytes) { let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s); }
function fromB64(str) { const bin = atob(str); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }

export async function hashPassword(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, key, 256);
  return `pbkdf2$100000$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

export async function verifyPassword(pw, stored) {
  try {
    const [, iter, saltB64, hashB64] = stored.split("$");
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromB64(saltB64), iterations: Number(iter), hash: "SHA-256" }, key, 256);
    return b64(new Uint8Array(bits)) === hashB64;
  } catch { return false; }
}

async function cacheUser(env, user) {
  if (!env?.SESSIONS || !user?.email) return;
  const payload = JSON.stringify({ id: user.id, email: user.email, plan: user.plan || "free" });
  try {
    await env.SESSIONS.put("user:" + user.email, payload, { expirationTtl: USER_CACHE_TTL });
  } catch { /* ignore */ }
}

async function cachedUser(env, email) {
  if (!env?.SESSIONS || !email) return null;
  try {
    const raw = await env.SESSIONS.get("user:" + email);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function createSession(env, user) {
  const sid = crypto.randomUUID();
  const plan = user.plan || "free";
  await env.SESSIONS.put(
    "sess:" + sid,
    JSON.stringify({ userId: user.id, email: user.email, plan }),
    { expirationTtl: SESSION_TTL },
  );
  await cacheUser(env, { id: user.id, email: user.email, plan });
  return sid;
}

export function sessionCookie(sid, maxAge = SESSION_TTL) {
  const parts = [`${COOKIE}=${sid}`, "HttpOnly", "Secure", "SameSite=Lax", "Path=/", `Max-Age=${maxAge}`];
  return parts.join("; ");
}
export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function readSid(request) {
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  return m ? m[1] : null;
}

// Find or create a user by email (for OAuth / magic-link sign-in, no password).
// Prefers D1; falls back to KV cache so magic login works when D1 reads are exhausted.
export async function upsertUser(env, email) {
  const em = (email || "").trim().toLowerCase();
  if (!em) throw new Error("email_required");

  try {
    let row = await env.DB.prepare("SELECT id, email, plan FROM users WHERE email = ?").bind(em).first();
    if (!row) {
      const id = crypto.randomUUID();
      await env.DB.prepare("INSERT INTO users (id, email, plan, created_at) VALUES (?, ?, 'free', ?)")
        .bind(id, em, Date.now()).run();
      row = { id, email: em, plan: "free" };
    }
    await cacheUser(env, row);
    return row;
  } catch {
    const hit = await cachedUser(env, em);
    if (hit) return hit;
    // Last resort: stable-enough ephemeral user so the session cookie still works.
    // When D1 recovers, a later upsert by email will reconcile via cache overwrite.
    const id = crypto.randomUUID();
    const row = { id, email: em, plan: "free" };
    await cacheUser(env, row);
    return row;
  }
}

export function readCookieValue(request, name) {
  const c = request.headers.get("cookie") || "";
  const m = c.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m ? m[1] : null;
}

export async function getSessionUser(request, env) {
  const sid = readSid(request);
  if (!sid) return null;
  const raw = await env.SESSIONS.get("sess:" + sid);
  if (!raw) return null;
  const sess = JSON.parse(raw);
  try {
    const row = await env.DB.prepare("SELECT id, email, plan FROM users WHERE id = ?").bind(sess.userId).first();
    if (row) {
      await cacheUser(env, row);
      return row;
    }
  } catch { /* D1 quota / outage — use session snapshot */ }
  if (sess.email) {
    const hit = await cachedUser(env, sess.email);
    if (hit) return hit;
  }
  return { id: sess.userId, email: sess.email, plan: sess.plan || "free" };
}

/** Store a magic-link token in KV (primary) and best-effort D1 (legacy). */
export async function putMagicToken(env, token, email) {
  const em = (email || "").trim().toLowerCase();
  const expires = Date.now() + MAGIC_TTL * 1000;
  if (!env?.SESSIONS) throw new Error("sessions_unavailable");
  await env.SESSIONS.put(
    "magic:" + token,
    JSON.stringify({ email: em, expires_at: expires }),
    { expirationTtl: MAGIC_TTL },
  );
  if (env.DB) {
    try {
      await env.DB.prepare("INSERT INTO magic_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)")
        .bind(token, em, expires).run();
    } catch { /* D1 optional for magic auth */ }
  }
  return expires;
}

/** Consume a magic token from KV (preferred) or D1. Returns email or null. */
export async function consumeMagicToken(env, token) {
  if (!token) return null;

  if (env?.SESSIONS) {
    try {
      const key = "magic:" + token;
      const raw = await env.SESSIONS.get(key);
      if (raw) {
        await env.SESSIONS.delete(key);
        const data = JSON.parse(raw);
        if (data?.email && Number(data.expires_at) >= Date.now()) return String(data.email).toLowerCase();
        return null;
      }
    } catch { /* fall through to D1 */ }
  }

  if (!env?.DB) return null;
  try {
    const row = await env.DB.prepare("SELECT token, email, expires_at, used FROM magic_tokens WHERE token = ?")
      .bind(token).first();
    if (!row || row.used || Number(row.expires_at) < Date.now()) return null;
    try {
      await env.DB.prepare("UPDATE magic_tokens SET used = 1 WHERE token = ?").bind(token).run();
    } catch { /* ignore */ }
    return String(row.email).toLowerCase();
  } catch {
    return null;
  }
}
