// Admin: permanently delete a user and all of their data.
// This is destructive and irreversible — the client confirms twice before calling.
import { getEnv } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const admin = await getAdmin(request, env);
  if (!admin) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { email } = await request.json().catch(() => ({}));
  if (!email) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  const em = email.toLowerCase();

  const user = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(em).first();
  if (!user) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  const uid = user.id;

  // Cascade delete everything keyed to this user. Each statement is guarded so a
  // missing table (e.g. an unmigrated environment) can't abort the whole delete.
  const del = async (sql, ...b) => { try { await env.DB.prepare(sql).bind(...b).run(); } catch {} };
  await del("DELETE FROM sessions WHERE user_id = ?", uid);
  await del("DELETE FROM magic_tokens WHERE email = ?", em);
  await del("DELETE FROM business_profile WHERE user_id = ?", uid);
  await del("DELETE FROM clients WHERE user_id = ?", uid);
  await del("DELETE FROM items WHERE user_id = ?", uid);
  await del("DELETE FROM invoices WHERE user_id = ?", uid);
  await del("DELETE FROM records WHERE user_id = ?", uid);
  await del("DELETE FROM subscriptions WHERE user_id = ?", uid);
  await del("DELETE FROM export_usage WHERE user_id = ?", uid);
  await del("DELETE FROM share_links WHERE user_id = ?", uid);
  await del("DELETE FROM recurring WHERE user_id = ?", uid);
  await del("DELETE FROM email_log WHERE user_id = ?", uid);
  const r = await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(uid).run();

  try { await env.DB.prepare("INSERT INTO audit_log (admin_email, action, target, created_at) VALUES (?, ?, ?, ?)").bind(admin.email, "Deleted user", em, Date.now()).run(); } catch {}
  return Response.json({ ok: true, deleted: r.meta?.changes || 0 });
}
