import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InvoiceEditor from "@/components/InvoiceEditor";
import MarketingSections from "@/components/MarketingSections";
import VerticalDetail from "@/components/VerticalDetail";
import JsonLd, { faqSchema, articleSchema } from "@/components/JsonLd";
import { VERTICALS, getVertical } from "@/lib/seo";

// English SEO vertical landing pages (localized homes live under app/(locale)/_locale/[locale]
// so they receive a genuine server-rendered `<html lang="...">` attribute).
export function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};
  const socialTitle = v.metaTitle || v.title || v.h1;
  const desc = v.metaDescription || v.sub;
  return {
    title: v.metaTitle ? { absolute: v.metaTitle } : (v.title || v.h1),
    description: desc,
    alternates: { canonical: `/${v.slug}` },
    openGraph: {
      title: socialTitle,
      description: desc,
      type: "website",
      images: [{ url: `/og/${v.slug}.png`, width: 1200, height: 630, alt: `${v.h1} — BillCrafter` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: desc,
      images: [`/og/${v.slug}.png`],
    },
  };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();
  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: v.h1,
          description: v.metaDescription || v.sub,
          url: `https://billcrafter.com/${v.slug}`,
        })}
      />
      {v.faq?.length ? <JsonLd data={faqSchema(v.faq)} /> : null}
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              {v.eyebrow ? <div className="eyebrow">{v.eyebrow}</div> : null}
              <h1>{v.h1}</h1>
              <p className="sub">{v.sub}</p>
              <div className="meta">
                <span>100% free · No sign-up</span>
                <span>Instant PDF · No watermark</span>
                <span>Vector PDF, never clipped</span>
              </div>
            </div>
            <div id="editor" className="editor-anchor">
              <InvoiceEditor
                initialType={v.type}
                initialScenario={v.scenario}
                initialStamp={v.stamp || (v.type === "receipt" ? "paid" : "")}
              />
            </div>
          </div>
        </section>
        <VerticalDetail v={v} />
        <MarketingSections intro={v.intro} variant="slim" path={`/${v.slug}`} />
      </main>
      <SiteFooter />
    </>
  );
}
