import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InvoiceEditor from "@/components/InvoiceEditor";
import MarketingSections from "@/components/MarketingSections";
import HeroCta from "@/components/HeroCta";
import { LOCALE_CODES, DEFAULT_LOCALE, isLocale, t, localePath, homeAlternates, isMarketVariant, primaryLocaleOf } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALE_CODES.filter((c) => c !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) return {};
  const metaTitle = t(locale, "home.metaTitle");
  const h1 = t(locale, "home.h1");
  const desc = t(locale, "home.sub");
  const ogImg = `/og?title=${encodeURIComponent(h1)}&eyebrow=${encodeURIComponent(t(locale, "home.eyebrow"))}`;
  return {
    title: { absolute: metaTitle },
    description: desc,
    alternates: isMarketVariant(locale)
      ? { canonical: localePath(primaryLocaleOf(locale), "/") }
      : { canonical: localePath(locale, "/"), ...homeAlternates() },
    openGraph: { title: metaTitle, description: desc, images: [{ url: ogImg, width: 1200, height: 630, alt: metaTitle }] },
    twitter: { card: "summary_large_image", title: metaTitle, description: desc, images: [ogImg] },
  };
}

export default async function LocalizedHomePage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === DEFAULT_LOCALE) notFound();
  const L = (k) => t(locale, k);
  return (
    <>
      <SiteNav locale={locale} />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div className="eyebrow">{L("home.eyebrow")}</div>
              <h1>{L("home.h1")}</h1>
              <p className="sub">{L("home.sub")}</p>
              <div className="meta">
                <span>{L("home.m1")}</span>
                <span>{L("home.m2")}</span>
                <span>{L("home.m3")}</span>
              </div>
              <HeroCta locale={locale} />
            </div>
            <div id="editor" className="editor-anchor">
              <InvoiceEditor initialType="invoice" initialScenario="blank" locale={locale} />
            </div>
          </div>
        </section>
        <MarketingSections variant="full" locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
