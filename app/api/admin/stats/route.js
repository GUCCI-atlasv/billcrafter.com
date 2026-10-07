import { getEnv } from "@/lib/server/auth";
import { getAdmin } from "@/lib/server/admin";

const json = (o, s = 200) => Response.json(o, { status: s, headers: { "cache-control": "private, no-store" } });
const CACHE_KEY = "admin:stats:v3";
const CACHE_TTL = 120; // seconds — stop re-scanning logs on every admin poll
const QUOTA_RE = /exceeded D1.*(?:row read|rows read|read limit)|D1.*free tier|d1_quota_exceeded/i;
const quotaExceeded = () => json({ ok: false, error: "d1_quota_exceeded", detail: "D1 free-tier daily row read limit exceeded. Wait until midnight UTC or upgrade Cloudflare." }, 503);

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB) return json({ ok: false, error: "backend_unavailable" }, 503);

  let admin;
  try {
    admin = await getAdmin(request, env);
  } catch (e) {
    if (e?.code === "d1_quota_exceeded" || QUOTA_RE.test(String(e?.message || ""))) return quotaExceeded();
    return json({ ok: false, error: "server_error" }, 500);
  }
  if (!admin) return json({ ok: false, error: "unauth" }, 401);

  if (env.SESSIONS) {
    try {
      const cached = await env.SESSIONS.get(CACHE_KEY);
      if (cached) return json(JSON.parse(cached));
    } catch { /* ignore */ }
  }

  const one = async (sql, ...b) => {
    try { return (await env.DB.prepare(sql).bind(...b).first()) || {}; }
    catch (e) { if (QUOTA_RE.test(String(e?.message || e))) throw e; return {}; }
  };
  const many = async (sql, ...b) => {
    try { const r = await env.DB.prepare(sql).bind(...b).all(); return r.results || []; }
    catch (e) { if (QUOTA_RE.test(String(e?.message || e))) throw e; return []; }
  };

  try {
    const users = (await one("SELECT COUNT(*) c FROM users")).c || 0;
    const invoices = (await one("SELECT COUNT(*) c FROM records WHERE kind = 'invoice'")).c || 0;
    const clients = (await one("SELECT COUNT(*) c FROM records WHERE kind = 'client'")).c || 0;
    const emailsSent = (await one("SELECT COUNT(*) c FROM email_log WHERE status = 'sent'")).c || 0;
    const recentUsers = await many("SELECT email, created_at FROM users ORDER BY created_at DESC LIMIT 20");
    // Keep audit/email/traffic small — these were burning free-tier row reads.
    const audit = await many("SELECT admin_email, action, target, created_at FROM audit_log ORDER BY created_at DESC LIMIT 15");
    const emails = await many("SELECT user_email, to_email, subject, filename, status, error, created_at FROM email_log ORDER BY created_at DESC LIMIT 25");

    // Avoid COUNT(DISTINCT ip) full scan of analytics_log — sample recent rows instead.
    const traffic = await many("SELECT event, user_email, ip, country, path, template, doc_type, format, created_at FROM analytics_log ORDER BY created_at DESC LIMIT 40");
    const uniqueVisitors = new Set(traffic.filter((t) => t.event === "visit" && t.ip).map((t) => t.ip)).size;
    const exportsTotal = (await one("SELECT COUNT(*) c FROM analytics_log WHERE event = 'export'")).c || 0;
    const topTemplates = await many("SELECT template, COUNT(*) c FROM analytics_log WHERE event = 'export' AND template IS NOT NULL GROUP BY template ORDER BY c DESC LIMIT 10");

    const body = { ok: true, kpis: { users, invoices, clients, emailsSent, uniqueVisitors, exportsTotal }, recentUsers, audit, emails, traffic, topTemplates };
    if (env.SESSIONS) {
      try { await env.SESSIONS.put(CACHE_KEY, JSON.stringify(body), { expirationTtl: CACHE_TTL }); } catch { /* ignore */ }
    }
    return json(body);
  } catch (e) {
    if (QUOTA_RE.test(String(e?.message || e))) return quotaExceeded();
    return json({ ok: false, error: "server_error", detail: String(e?.message || e) }, 500);
  }
}
