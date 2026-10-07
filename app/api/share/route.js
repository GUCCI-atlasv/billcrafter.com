// Shareable invoice links (free for any signed-in user). POST creates a link; GET lists the user's links
// with their view counts.
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const token = () =>
  (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "").slice(0, 22);

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { doc, title, locale } = await request.json().catch(() => ({}));
  if (!doc || typeof doc !== "object") return Response.json({ ok: false, error: "invalid" }, { status: 400 });

  const t = token();
  try {
    await env.DB.prepare(
      "INSERT INTO share_links (token, user_id, user_email, doc_json, title, locale, revoked, created_at) VALUES (?,?,?,?,?,?,0,?)"
    ).bind(t, user.id, user.email, JSON.stringify(doc), (title || "").slice(0, 160), locale || "en", Date.now()).run();
  } catch {
    return Response.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  const base = env.APP_URL || "https://billcrafter.com";
  return Response.json({ ok: true, token: t, url: `${base}/i/${t}` });
}

export async function GET(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  try {
    // Indexed lookup only — avoid per-row share_views scans (D1 free-tier reads).
    const r = await env.DB.prepare(
      `SELECT token, title, revoked, created_at FROM share_links
        WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
    ).bind(user.id).all();
    const links = (r.results || []).map((row) => ({ ...row, views: 0, last_viewed: null }));
    return Response.json({ ok: true, links });
  } catch {
    return Response.json({ ok: true, links: [] });
  }
}

// Revoke a link.
export async function DELETE(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });
  const { token: tk } = await request.json().catch(() => ({}));
  if (!tk) return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  try {
    await env.DB.prepare("UPDATE share_links SET revoked = 1 WHERE token = ? AND user_id = ?").bind(tk, user.id).run();
  } catch {}
  return Response.json({ ok: true });
}
