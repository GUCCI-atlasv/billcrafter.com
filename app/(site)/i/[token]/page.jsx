// Public, read-only invoice page behind a share link. Every load records a view,
// which is what powers "your client opened this" tracking.
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import InvoiceView from "@/components/InvoiceView";
import { getEnv } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function SharedInvoice({ params }) {
  const { token } = await params;
  const env = await getEnv();
  if (!env?.DB) notFound();

  let row = null;
  try {
    row = await env.DB.prepare("SELECT token, doc_json, locale, revoked FROM share_links WHERE token = ?").bind(token).first();
  } catch {}
  if (!row || row.revoked) notFound();

  // Record the view (never let logging break the page).
  try {
    const h = await headers();
    const ip = h.get("cf-connecting-ip") || h.get("x-real-ip") || (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
    await env.DB.prepare("INSERT INTO share_views (id, token, ip, country, ua, created_at) VALUES (?,?,?,?,?,?)")
      .bind(crypto.randomUUID(), token, ip, h.get("cf-ipcountry") || null, (h.get("user-agent") || "").slice(0, 300), Date.now())
      .run();
  } catch {}

  let doc = {};
  try { doc = JSON.parse(row.doc_json); } catch {}

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <InvoiceView doc={doc} locale={row.locale || "en"} />
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", marginTop: 22 }}>
          Created with <a href="/" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>BillCrafter</a> — free invoice generator
        </p>
      </div>
    </main>
  );
}
