import { getEnv, getSessionUser } from "@/lib/server/auth";

const KINDS = { clients: "client", items: "item", profiles: "profile", invoices: "invoice" };
const json = (o, s = 200) => Response.json(o, { status: s });

export async function GET(request, { params }) {
  const { kind } = await params;
  const k = KINDS[kind];
  if (!k) return json({ ok: false, error: "bad_kind" }, 400);
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return json({ ok: false, error: "backend_unavailable" }, 503);
  const user = await getSessionUser(request, env);
  if (!user) return json({ ok: false, error: "unauth" }, 401);
  const { results } = await env.DB
    .prepare("SELECT id, data, created_at FROM records WHERE user_id = ? AND kind = ? ORDER BY created_at DESC")
    .bind(user.id, k).all();
  // `_id` is the real DB row id (used for update/delete). `id` keeps the record's
  // own id from its payload when present (invoices carry a client-side id), which
  // is why we can't rely on `id` alone to address the row.
  const items = (results || []).map((r) => { const d = safe(r.data); return { ...d, id: d.id || r.id, _id: r.id, createdAt: r.created_at }; });
  return json({ ok: true, items });
}

export async function POST(request, { params }) {
  const { kind } = await params;
  const k = KINDS[kind];
  if (!k) return json({ ok: false, error: "bad_kind" }, 400);
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return json({ ok: false, error: "backend_unavailable" }, 503);
  const user = await getSessionUser(request, env);
  if (!user) return json({ ok: false, error: "unauth" }, 401);
  const body = await request.json().catch(() => ({}));
  const id = crypto.randomUUID();
  const now = Date.now();
  try {
    await env.DB
      .prepare("INSERT INTO records (id, user_id, kind, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, user.id, k, JSON.stringify(body || {}), now, now).run();
  } catch (e) {
    return json({ ok: false, error: "db_error", detail: String(e?.message || e).slice(0, 300) }, 500);
  }
  return json({ ok: true, item: { id, _id: id, createdAt: now, ...body } }, 201);
}

function safe(s) { try { return JSON.parse(s); } catch { return {}; } }
