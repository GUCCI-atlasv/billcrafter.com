// Download a signed PDF from R2, plus its audit record.
//
// Ownership is checked against the row in D1 rather than trusting the key in the
// URL — a signature id must never let one account read another's document.
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });

  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  const { id } = await params;
  const row = await env.DB.prepare(
    "SELECT * FROM signatures WHERE id = ? AND user_id = ?"
  ).bind(id, user.id).first().catch(() => null);
  if (!row) return Response.json({ ok: false, error: "not_found" }, { status: 404 });

  // ?audit=1 returns the evidence record instead of the file.
  if (new URL(request.url).searchParams.get("audit")) {
    return Response.json({
      ok: true,
      id: row.id,
      invoiceNo: row.invoice_no,
      signerName: row.signer_name,
      signedAt: row.consent_at,
      consentText: row.consent_text,
      ip: row.ip,
      country: row.country,
      userAgent: row.ua,
      sha256: row.sha256,
      bytes: row.bytes,
    });
  }

  if (!env.FILE_STORAGE) return Response.json({ ok: false, error: "storage_unavailable" }, { status: 503 });
  const obj = await env.FILE_STORAGE.get(row.r2_key);
  if (!obj) return Response.json({ ok: false, error: "gone" }, { status: 410 });

  const filename = `${(row.invoice_no || "document").replace(/[^\w.-]/g, "_")}-signed.pdf`;
  return new Response(obj.body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "private, no-store",
    },
  });
}
