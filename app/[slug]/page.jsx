import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InvoiceEditor from "@/components/InvoiceEditor";
import MarketingSections from "@/components/MarketingSections";
import VerticalDetail from "@/components/VerticalDetail";
import JsonLd, { faqSchema, articleSchema } from "@/components/JsonLd";
import HtmlLang from "@/components/HtmlLang";
import AskAi from "@/components/AskAi";
import { VERTICALS, getVertical } from "@/lib/seo";
import { LOCALE_CODES, isLocale, t, localePath, DEFAULT_LOCALE, homeAlternates, isMarketVariant, primaryLocaleOf } from "@/lib/i18n";

// This single segment serves two things without colliding:
//   /es, /fr, …   -> localized home page
//   /freelance-…  -> the existing English SEO landing page (URLs unchanged)
export function generateStaticParams() {
  return [
    ...VERTICALS.map((v) => ({ slug: v.slug })),
    ...LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE).map((c) => ({ slug: c })),
  ];
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (isLocale(slug)) {
    const title = t(slug, "home.h1");
    const desc = t(slug, "home.sub");
    const ogImg = `/og?title=${encodeURIComponent(title)}&eyebrow=${encodeURIComponent(t(slug, "home.eyebrow"))}`;
    return {
      title,
      description: desc,
      // A market variant folds into its language's primary market, not into "/"
      // — /es-MX belongs to /es, not to the English home page.
      alternates: isMarketVariant(slug)
        ? { canonical: localePath(primaryLocaleOf(slug), "/") }
        : { canonical: localePath(slug, "/"), ...homeAlternates() },
      openGraph: { title, description: desc, images: [{ url: ogImg, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", title, description: desc, images: [ogImg] },
    };
  }

  const v = getVertical(slug);
  if (!v) return {};
  return {
    title: v.h1,
    description: v.sub,
    // SEO landing pages only exist in English. Declaring locale-prefixed
    // alternates here sends crawlers to URLs that permanently redirect back.
    alternates: { canonical: `/${v.slug}` },
    openGraph: {
      title: v.h1, description: v.sub, type: "website",
      images: [{ url: `/og/${v.slug}.png`, width: 1200, height: 630, alt: `${v.h1} — BillCrafter` }],
    },
    twitter: {
      card: "summary_large_image", title: v.h1, description: v.sub,
      images: [`/og/${v.slug}.png`],
    },
  };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;

  // ---- Localized home ----
  if (isLocale(slug)) {
    const L = (k) => t(slug, k);
    return (
      <>
        <HtmlLang locale={slug} />
        <SiteNav locale={slug} />
        <main>
          <section className="hero">
            <div className="wrap">
              <div className="hero-head">
                <div className="eyebrow">{L("home.eyebrow")}</div>
                <h1>{L("home.h1")}</h1>
                <p className="sub">{L("home.sub")}</p>
                <div className="meta">
                  <span>{L("home.m1")}</span><span>{L("home.m2")}</span><span>{L("home.m3")}</span>
                </div>
                <AskAi locale={slug} />
              </div>
              <InvoiceEditor initialType="invoice" initialScenario="blank" locale={slug} />
            </div>
          </section>
          {/* full (not slim): the localized nav links to #pricing and #faq, so those
              sections have to exist on the locale home too. */}
          <MarketingSections variant="full" locale={slug} />
        </main>
        <SiteFooter locale={slug} />
      </>
    );
  }

  // ---- English SEO landing page (unchanged) ----
  const v = getVertical(slug);
  if (!v) notFound();
  return (
    <>
      <JsonLd data={articleSchema({ headline: v.h1, description: v.sub, url: `https://billcrafter.com/${v.slug}` })} />
      {v.faq?.length ? <JsonLd data={faqSchema(v.faq)} /> : null}
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <h1>{v.h1}</h1>
              <p className="sub">{v.sub}</p>
              <div className="meta"><span>No signup to download</span><span>Free &amp; unlimited editing</span><span>Vector PDF, never clipped</span></div>
            </div>
            <InvoiceEditor initialType={v.type} initialScenario={v.scenario} />
          </div>
        </section>
        <VerticalDetail v={v} />
        <MarketingSections intro={v.intro} variant="slim" path={`/${v.slug}`} />
      </main>
      <SiteFooter />
    </>
  );
}
