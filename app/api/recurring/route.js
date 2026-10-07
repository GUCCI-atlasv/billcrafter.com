// Recurring invoice schedules (free for any signed-in user). List / create / update / delete.
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { FREQS, nextRun } from "@/lib/server/recurring";

export const dynamic = "force-dynamic";

async function requireUser(request, env) {
  if (!env?.DB || !env?.SESSIONS) return { err: Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 }) };
  const user = await getSessionUser(request, env);
  if (!user) return { err: Response.json({ ok: false, error: "unauth" }, { status: 401 }) };
  return { user };
}

export async function GET(request) {
  const env = await getEnv();
  const { user, err } = await requireUser(request, env);
  if (err) return err;
  try {
    const r = await env.DB.prepare(
      "SELECT id, title, to_email, freq, next_run, last_run, runs, active, created_at FROM recurring WHERE user_id = ? ORDER BY created_at DESC"
    ).bind(user.id).all();
    return Response.json({ ok: true, items: r.results || [] });
  } catch { return Response.json({ ok: true, items: [] }); }
}

export async function POST(request) {
  const env = await getEnv();
  const { user, err } = await requireUser(request, env);
  if (err) return err;

  const { doc, toEmail, freq, startDate, title, locale } = await request.json().catch(() => ({}));
  if (!doc || typeof doc !== "object") return Response.json({ ok: false, error: "invalid_doc" }, { status: 400 });
  if (!toEmail || !/.+@.+\..+/.test(toEmail)) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
  if (!FREQS.includes(freq)) return Response.json({ ok: false, error: "invalid_freq" }, { status: 400 });

  // Start on the chosen date, else one period from now.
  const start = startDate ? Date.parse(startDate) : NaN;
  const first = Number.isFinite(start) && start > Date.now() ? start : nextRun(Date.now(), freq);

  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      "INSERT INTO recurring (id, user_id, user_email, title, doc_json, to_email, locale, freq, next_run, runs, active, created_at) VALUES (?,?,?,?,?,?,?,?,?,0,1,?)"
    ).bind(id, user.id, user.email, (title || "").slice(0, 160), JSON.stringify(doc), toEmail.trim().toLowerCase(), locale || "en", freq, first, Date.now()).run();
  } catch { return Response.json({ ok: false, error: "save_failed" }, { status: 500 }); }

  return Response.json({ ok: true, id, nextRun: first });
}

export async function PUT(request) {
  const env = await getEnv();
  const { user, err } = await requireUser(request, env);
  if (err) return err;
  const { id, active } = await request.json().catch(() => ({}));
  if (!id) return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  try {
    await env.DB.prepare("UPDATE recurring SET active = ? WHERE id = ? AND user_id = ?")
      .bind(active ? 1 : 0, id, user.id).run();
  } catch {}
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  const env = await getEnv();
  const { user, err } = await requireUser(request, env);
  if (err) return err;
  const { id } = await request.json().catch(() => ({}));
  if (!id) return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  try { await env.DB.prepare("DELETE FROM recurring WHERE id = ? AND user_id = ?").bind(id, user.id).run(); } catch {}
  return Response.json({ ok: true });
}
