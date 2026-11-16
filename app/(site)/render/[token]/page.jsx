// The page the headless browser prints. Not a user-facing route: the key is
// single-use, expires in two minutes, and is only ever known to /api/pdf and
// the browser it launched.
//
// Deliberately bare — no nav, no footer, no share chrome. What the print
// stylesheet would otherwise have to hide simply isn't here, so the PDF is the
// document and nothing else.
import { notFound } from "next/navigation";
import InvoiceView from "@/components/InvoiceView";
import { getEnv } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function RenderForPdf({ params }) {
  const { token } = await params;
  const env = await getEnv();
  if (!env?.SESSIONS) notFound();

  let payload = null;
  try { payload = JSON.parse((await env.SESSIONS.get("pdfdoc:" + token)) || "null"); } catch {}
  if (!payload || !payload.doc) notFound();

  return (
    <main style={{ background: "#fff", margin: 0, padding: 0 }}>
      {/* .sheet carries its own max-width and padding; the PDF margins come
          from page.pdf(), so this wrapper adds none of its own. Its box shadow
          and rounded corners are the editor's affordances, not the document's. */}
      <style>{`
        html,body{background:#fff!important;margin:0;padding:0}
        .sheet{box-shadow:none!important;border-radius:0!important;max-width:none!important;width:100%!important;padding:0!important}
      `}</style>
      <InvoiceView doc={payload.doc} locale={payload.locale || "en"} />
    </main>
  );
}
