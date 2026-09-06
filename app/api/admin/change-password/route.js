// Admin: change own password (requires current password).
import { getEnv, hashPassword, verifyPassword } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const admin = await getAdmin(request, env);
  if (!admin) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { currentPassword, newPassword } = await request.json().catch(() => ({}));
  const current = typeof currentPassword === "string" ? currentPassword : "";
  const next = typeof newPassword === "string" ? newPassword : "";
  if (!current || next.length < 6) {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const row = await env.DB.prepare("SELECT id, email, password_hash FROM admins WHERE id = ? OR email = ?")
    .bind(admin.id, admin.email).first();
  if (!row?.password_hash || !(await verifyPassword(current, row.password_hash))) {
    return Response.json({ ok: false, error: "invalid_current" }, { status: 401 });
  }

  const password_hash = await hashPassword(next);
  await env.DB.prepare("UPDATE admins SET password_hash = ?, must_change_password = 0 WHERE id = ?")
    .bind(password_hash, row.id).run();
  try {
    await env.DB.prepare("INSERT INTO audit_log (admin_email, action, created_at) VALUES (?, ?, ?)")
      .bind(row.email, "Changed password", Date.now()).run();
  } catch {}

  return Response.json({ ok: true });
}
