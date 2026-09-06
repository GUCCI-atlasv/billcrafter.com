// Server-side auth helpers for Cloudflare (D1 users + KV sessions).
// Runs inside the OpenNext worker. Uses Web Crypto (available in Workers).

const COOKIE = "bc_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days

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

export async function createSession(env, user) {
  const sid = crypto.randomUUID();
  await env.SESSIONS.put("sess:" + sid, JSON.stringify({ userId: user.id, email: user.email }), { expirationTtl: SESSION_TTL });
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
export async function upsertUser(env, email) {
  const em = (email || "").trim().toLowerCase();
  let row = await env.DB.prepare("SELECT id, email, plan FROM users WHERE email = ?").bind(em).first();
  if (!row) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO users (id, email, plan, created_at) VALUES (?, ?, 'free', ?)").bind(id, em, Date.now()).run();
    row = { id, email: em, plan: "free" };
  }
  return row;
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
  const row = await env.DB.prepare("SELECT id, email, plan FROM users WHERE id = ?").bind(sess.userId).first();
  return row || { id: sess.userId, email: sess.email, plan: "free" };
}
