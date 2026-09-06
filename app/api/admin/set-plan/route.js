// Admin: manually set a user's plan (e.g. after confirming a PayPal payment).
import { getEnv } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const admin = await getAdmin(request, env);
  if (!admin) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { email, plan } = await request.json().catch(() => ({}));
  if (!email || !["pro", "free", "test"].includes(plan)) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  // A "test" account is Pro-entitled but complimentary: plan='pro' so every
  // `plan === 'pro'` check passes, comp=1 so it's excluded from revenue/MRR.
  const dbPlan = plan === "free" ? "free" : "pro";
  const comp = plan === "test" ? 1 : 0;

  const r = await env.DB
    .prepare("UPDATE users SET plan = ?, comp = ? WHERE email = ?")
    .bind(dbPlan, comp, email.toLowerCase())
    .run();
  const label = plan === "test" ? "test (comp Pro)" : plan;
  try { await env.DB.prepare("INSERT INTO audit_log (admin_email, action, target, created_at) VALUES (?, ?, ?, ?)").bind(admin.email, `Set plan → ${label}`, email, Date.now()).run(); } catch {}
  return Response.json({ ok: true, changed: r.meta?.changes || 0 });
}
