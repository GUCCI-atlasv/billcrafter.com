// Analytics beacon — records visitor IP/country and template usage.
// Called from the invoice editor: once per session ('visit') and on each export.
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const clip = (s, n = 300) => (s == null ? null : String(s).slice(0, n));

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false }, { status: 200 }); // never block the client
  let b = {};
  try { b = await request.json(); } catch {}
  if (b.event !== "visit" && b.event !== "export") return Response.json({ ok: false }, { status: 200 });

  const h = request.headers;
  const ip = h.get("cf-connecting-ip") || h.get("x-real-ip") || (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const country = h.get("cf-ipcountry") || null;

  let email = null;
  try { if (env.SESSIONS) { const u = await getSessionUser(request, env); email = u?.email || null; } } catch {}

  try {
    await env.DB.prepare(
      "INSERT INTO analytics_log (id, event, user_email, ip, country, path, template, doc_type, format, referrer, ua, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
    ).bind(
      crypto.randomUUID(), b.event, email, clip(ip, 64), clip(country, 8),
      clip(b.path, 200), clip(b.template, 64), clip(b.docType, 24), clip(b.format, 16),
      clip(b.referrer, 300), clip(h.get("user-agent"), 300), Date.now()
    ).run();
  } catch { /* analytics must never break the app */ }

  return Response.json({ ok: true });
}
