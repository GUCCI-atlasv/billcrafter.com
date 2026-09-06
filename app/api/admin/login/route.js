// Real admin login — verifies a hashed password against the `admins` table in D1
// and creates an admin session in D1 (cookie `bc_admin`).
import { getEnv, verifyPassword } from "@/lib/server/auth";
import { createAdminSession, adminCookie } from "@/lib/server/admin";

export async function POST(request) {
  try {
    const { email, password } = await request.json().catch(() => ({}));
    const env = await getEnv();
    if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

    const em = (email || "").trim().toLowerCase();
    const row = await env.DB.prepare("SELECT id, email, role, password_hash FROM admins WHERE email = ?").bind(em).first();
    if (!row || !row.password_hash || !(await verifyPassword(password, row.password_hash))) {
      return Response.json({ ok: false, error: "invalid" }, { status: 401 });
    }

    const sid = await createAdminSession(env, { id: row.id, email: row.email, role: row.role });
    try {
      await env.DB.prepare("INSERT INTO audit_log (admin_email, action, created_at) VALUES (?, ?, ?)").bind(row.email, "Signed in", Date.now()).run();
    } catch {}

    return new Response(JSON.stringify({ ok: true, admin: { email: row.email, role: row.role } }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "private, no-store",
        "set-cookie": adminCookie(sid),
      },
    });
  } catch (e) {
    console.error("admin login failed", e);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
