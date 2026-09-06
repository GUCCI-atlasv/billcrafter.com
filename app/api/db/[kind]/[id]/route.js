import { getEnv, getSessionUser } from "@/lib/server/auth";

const KINDS = { clients: "client", items: "item", profiles: "profile", invoices: "invoice" };
const json = (o, s = 200) => Response.json(o, { status: s });

async function ctx(request, kind) {
  const k = KINDS[kind];
  if (!k) return { err: json({ ok: false, error: "bad_kind" }, 400) };
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return { err: json({ ok: false, error: "backend_unavailable" }, 503) };
  const user = await getSessionUser(request, env);
  if (!user) return { err: json({ ok: false, error: "unauth" }, 401) };
  return { env, user, k };
}

export async function PUT(request, { params }) {
  const { kind, id } = await params;
  const c = await ctx(request, kind);
  if (c.err) return c.err;
  const body = await request.json().catch(() => ({}));
  delete body.createdAt; delete body._id;
  let res;
  try {
    res = await c.env.DB
      .prepare("UPDATE records SET data = ?, updated_at = ? WHERE id = ? AND user_id = ? AND kind = ?")
      .bind(JSON.stringify(body || {}), Date.now(), id, c.user.id, c.k).run();
  } catch (e) {
    return json({ ok: false, error: "db_error", detail: String(e?.message || e).slice(0, 300) }, 500);
  }
  if (!res.meta?.changes) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, item: { id, ...body } });
}

export async function DELETE(request, { params }) {
  const { kind, id } = await params;
  const c = await ctx(request, kind);
  if (c.err) return c.err;
  await c.env.DB.prepare("DELETE FROM records WHERE id = ? AND user_id = ? AND kind = ?").bind(id, c.user.id, c.k).run();
  return json({ ok: true });
}
