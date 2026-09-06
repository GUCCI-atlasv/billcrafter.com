// Invoices CRUD (STUB). Production: read/write D1 (invoices), scoped to session user.
import { MOCK_INVOICES } from "@/lib/mock";

export async function GET() {
  // TODO(prod): const userId = await requireSession(request);
  //             const rows = await env.DB.prepare('SELECT * FROM invoices WHERE user_id=?').bind(userId).all();
  return Response.json({ ok: true, invoices: MOCK_INVOICES, note: "STUB — returns mock data." });
}

export async function POST(request) {
  const invoice = await request.json().catch(() => ({}));
  // TODO(prod): validate + INSERT/UPDATE into D1; archive PDF snapshot to R2.
  return Response.json({ ok: true, id: "inv_" + Date.now(), saved: invoice, note: "STUB — not persisted." }, { status: 201 });
}
