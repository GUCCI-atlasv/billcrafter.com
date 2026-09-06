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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  const title = `${t.name} template`;
  return {
    title,
    description: `${t.blurb} A free, editable ${(t.docType || "invoice")} template in the ${t.style} layout, pre-filled for ${t.group.toLowerCase()} work. Edit in your browser and download a PDF — no signup.`,
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: {
      title, description: t.blurb, type: "article",
      images: [{ url: `/og/templates/${t.slug}.png`, width: 1200, height: 630, alt: `${t.name} — free ${t.docType} template` }],
    },
    twitter: {
      card: "summary_large_image", title, description: t.blurb,
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
