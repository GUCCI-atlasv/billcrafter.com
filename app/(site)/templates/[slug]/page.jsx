import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InvoiceEditor from "@/components/InvoiceEditor";
import TemplateDetail from "@/components/TemplateDetail";
import { TEMPLATES, getTemplate } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = true;

const DOC_WORD = { invoice: "Invoice", estimate: "Estimate", quote: "Quote", receipt: "Receipt" };

function templateMetaTitle(t) {
  const [subjectRaw, styleName] = String(t.name || "").split(" — ");
  const subject = subjectRaw || t.name;
  const docWord = DOC_WORD[t.docType] || "Invoice";
  const hasDocWord = subject.toLowerCase().includes(docWord.toLowerCase());
  const core = hasDocWord ? `Free ${subject} Template` : `Free ${subject} ${docWord} Template`;
  const stylePart = styleName ? ` (${styleName} PDF)` : " (Editable PDF)";
  return `${core}${stylePart} — BillCrafter`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  const metaTitle = templateMetaTitle(t);
  return {
    title: { absolute: metaTitle },
    description: `${t.blurb} A free, editable ${(t.docType || "invoice")} template in the ${t.style} layout, pre-filled for ${t.group.toLowerCase()} work. Edit in your browser and download a PDF — no signup.`,
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: {
      title: metaTitle, description: t.blurb, type: "article",
      images: [{ url: `/og/templates/${t.slug}.png`, width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: "summary_large_image", title: metaTitle, description: t.blurb,
      images: [`/og/templates/${t.slug}.png`],
    },
  };
}

export default async function TemplatePage({ params }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div style={{ marginBottom: 8 }}><Link className="link-text" href="/templates">← All templates</Link></div>
              <h1>{t.name} template</h1>
              <p className="sub">{t.blurb} Edit it below — what you see is what downloads. No signup to download.</p>
            </div>
            <InvoiceEditor initialType={t.docType} initialScenario={t.scenario} initialStyle={t.style} initialAccent={t.accent} />
          </div>
        </section>
        <TemplateDetail t={t} />
      </main>
      <SiteFooter />
    </>
  );
}
