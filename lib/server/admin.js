// Admin session helpers — D1-backed (avoids KV daily write limits on free plan).
const COOKIE = "bc_admin";
const TTL = 60 * 60 * 8; // 8 hours

export async function createAdminSession(env, admin) {
  const sid = crypto.randomUUID();
  const now = Date.now();
  const expiresAt = now + TTL * 1000;
  await env.DB.prepare(
    "INSERT INTO admin_sessions (sid, admin_id, email, role, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).bind(sid, admin.id, admin.email, admin.role, expiresAt, now).run();
  // Best-effort cleanup of expired rows
  try {
    await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at < ?").bind(now).run();
  } catch {}
  return sid;
}

export function adminCookie(sid, maxAge = TTL) {
  return [`${COOKIE}=${sid}`, "HttpOnly", "Secure", "SameSite=Lax", "Path=/", `Max-Age=${maxAge}`].join("; ");
}
export function clearAdminCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
export function readAdminSid(request) {
  const c = request.headers.get("cookie") || "";
  const m = c.match(/(?:^|; )bc_admin=([^;]+)/);
  return m ? m[1] : null;
}

function isD1QuotaError(err) {
  const msg = String(err?.message || err || "");
  return /exceeded D1.*(?:row read|rows read|read limit)|D1.*free tier/i.test(msg);
}

export async function getAdmin(request, env) {
  const sid = readAdminSid(request);
  if (!sid || !env?.DB) return null;

  try {
    const row = await env.DB.prepare(
      "SELECT admin_id AS id, email, role, expires_at FROM admin_sessions WHERE sid = ?",
    ).bind(sid).first();
    if (!row) return null;
    if (Number(row.expires_at) < Date.now()) {
      try { await env.DB.prepare("DELETE FROM admin_sessions WHERE sid = ?").bind(sid).run(); } catch {}
      return null;
    }
    return { id: row.id, email: row.email, role: row.role };
  } catch (e) {
    if (isD1QuotaError(e)) {
      const err = new Error("d1_quota_exceeded");
      err.code = "d1_quota_exceeded";
      throw err;
    }
    return null;
  }
}

export async function destroyAdminSession(env, sid) {
  if (!env?.DB || !sid) return;
  try { await env.DB.prepare("DELETE FROM admin_sessions WHERE sid = ?").bind(sid).run(); } catch {}
}
