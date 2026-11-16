// Admin forgot-password — step 2: verify the one-time token, set a new password,
// and sign the admin in immediately.
import { getEnv, hashPassword } from "@/lib/server/auth";
import { createAdminSession, adminCookie } from "@/lib/server/admin";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) {
    return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  }

  const { token, newPassword } = await request.json().catch(() => ({}));
  const tok = typeof token === "string" ? token.trim() : "";
  const next = typeof newPassword === "string" ? newPassword : "";
  if (!tok || next.length < 6) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const key = "admin_reset:" + tok;
  const raw = await env.SESSIONS.get(key);
  if (!raw) {
    return Response.json({ ok: false, error: "invalid_or_expired" }, { status: 400 });
  }

  let data;
  try { data = JSON.parse(raw); } catch { data = null; }
  await env.SESSIONS.delete(key);

  if (!data?.adminId || Number(data.expires_at) < Date.now()) {
    return Response.json({ ok: false, error: "invalid_or_expired" }, { status: 400 });
  }

  const row = await env.DB.prepare("SELECT id, email, role FROM admins WHERE id = ? OR lower(email) = ?")
    .bind(data.adminId, String(data.email || "").toLowerCase()).first();
  if (!row) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const password_hash = await hashPassword(next);
  await env.DB.prepare("UPDATE admins SET password_hash = ?, must_change_password = 0 WHERE id = ?")
    .bind(password_hash, row.id).run();

  const sid = await createAdminSession(env, { id: row.id, email: row.email, role: row.role }, { authMethod: "reset" });
  try {
    await env.DB.prepare("INSERT INTO audit_log (admin_email, action, created_at) VALUES (?, ?, ?)")
      .bind(row.email, "Reset password via email", Date.now()).run();
  } catch {}

  return new Response(
    JSON.stringify({ ok: true, admin: { email: row.email, role: row.role, authMethod: "reset" } }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "private, no-store",
        "set-cookie": adminCookie(sid),
      },
    },
  );
}
