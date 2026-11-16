// Shared static landing page renderer for Receipt & Invoice OCR tools (English + Tier-1 locales).
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import OcrWorkbench from "@/components/OcrWorkbench";
import AdSlot from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import JsonLd, { faqSchema, howToSchema, articleSchema } from "@/components/JsonLd";
import { Byline } from "@/components/ContentMeta";
import { SITE_PUBLISHED, SITE_UPDATED } from "@/lib/site";
import { DEFAULT_LOCALE, localePath, TIER1_OCR_LOCALES, primaryLocaleOf, getLocale } from "@/lib/i18n";
import { ocrUi } from "@/lib/ocrUiI18n";

export default function OcrLandingPage({ config, locale = DEFAULT_LOCALE }) {
  if (!config) return null;
  const pagePath = locale === DEFAULT_LOCALE ? `/${config.slug}` : `/${locale}/${config.slug}`;
  const fullUrl = `https://billcrafter.com${pagePath}`;
  const langTag = getLocale(locale).hreflang || locale;
  const U = ocrUi(locale);
  const LND = U.landing;
  const isEn = locale === DEFAULT_LOCALE;
  const primary = primaryLocaleOf(locale);
  const ocrPath = (slug) => {
    if (isEn) return `/${slug}`;
    if (TIER1_OCR_LOCALES.includes(locale)) return `/${locale}/${slug}`;
    if (TIER1_OCR_LOCALES.includes(primary)) return `/${primary}/${slug}`;
    return `/${slug}`;
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.metaTitle || config.h1,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: fullUrl,
    inLanguage: langTag,
    description: config.metaDescription || config.sub,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "AI Invoice & Receipt OCR",
      "Receipt photo to CSV & Excel (.xlsx)",
      "Automatic subtotal + tax = total verification",
      "One-click conversion to watermark-free PDF invoice",
    ],
    author: { "@id": "https://billcrafter.com/#organization" },
    publisher: { "@id": "https://billcrafter.com/#organization" },
    datePublished: SITE_PUBLISHED,
    dateModified: SITE_UPDATED,
  };

  return (
    <>
      <JsonLd data={softwareSchema} />
      <JsonLd
        data={articleSchema({
          headline: config.h1,
          description: config.metaDescription || config.sub,
          url: fullUrl,
          locale: langTag,
        })}
      />
      {config.steps?.length ? (
        <JsonLd
          data={howToSchema({
            name: config.stepsTitle || config.h1,
            description: config.metaDescription || config.sub,
            url: `${fullUrl}#how`,
            locale: langTag,
            steps: config.steps,
          })}
        />
      ) : null}
      {config.faq?.length ? <JsonLd data={faqSchema(config.faq)} /> : null}

      <SiteNav locale={locale} />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              {config.eyebrow ? <div className="eyebrow">{config.eyebrow}</div> : null}
              <h1>{config.h1}</h1>
              <p className="sub">{config.sub}</p>
              {config.pills?.length ? (
                <div className="meta">
                  {config.pills.map((p) => (
                    <span key={p}>{p}</span>
                  ))}
                </div>
              ) : null}
            </div>

            <OcrWorkbench
              locale={locale}
              mode="full"
              defaultCsvPreset={config.defaultCsvPreset || "itemized"}
            />
          </div>
        </section>

        {/* Jump links */}
        <nav className="toc-band" aria-label={LND.tocLabel}>
          <div className="wrap">
            <span className="toc-label">{LND.tocLabel}</span>
            <ul className="toc-links">
              <li><a href="#how">{LND.tocHow}</a></li>
              <li><a href="#anatomy">{LND.tocAnatomy}</a></li>
              <li><a href="#guide">{LND.tocGuide}</a></li>
              <li><a href="#faq">{LND.tocFaq}</a></li>
              <li><a href="#more">{LND.tocMore}</a></li>
            </ul>
          </div>
        </nav>

        {/* 3-step visual walkthrough */}
        {config.steps?.length > 0 && (
          <section className="band" id="how">
            <div className="wrap">
              <div className="eyebrow">{LND.eyebrowHow}</div>
              <h2>{config.stepsTitle}</h2>
              <div className="steps">
                {config.steps.map(([title, body, img], idx) => (
                  <div className="step" key={title}>
                    {img ? (
                      <img
                        className="step-img"
                        src={img}
                        alt={title}
                        width="720"
                        height="460"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <div className="n">{String(idx + 1).padStart(2, "0")}</div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Annotated OCR Extraction Diagram */}
        <section className="band alt" id="anatomy">
          <div className="wrap">
            <div className="eyebrow">{LND.eyebrowAnatomy}</div>
            <h2>{LND.h2Anatomy}</h2>
            <p className="lead" style={{ maxWidth: 720 }}>
              {LND.leadAnatomy}
            </p>
            <Byline />
            <img
              className="anatomy-img"
              src="/anatomy/ocr-scanner.png"
              alt="Diagram showing AI OCR extracting vendor details, invoice number, dates, itemized rows, tax, tip, and math-verified total into CSV and Excel"
              width="1040"
              height="720"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* Safe separation (>48px) from workbench controls */}
        <AdSlot slot={AD_SLOTS.inContent} />

        {/* Substantive unique guide sections */}
        {config.sections?.length > 0 && (
          <div id="guide">
            {config.sections.map((s, i) => (
              <section className={"band" + (i % 2 ? " alt" : "")} key={s.h}>
                <div className="wrap">
                  <h2 style={{ maxWidth: 740 }}>{s.h}</h2>
                  <p className="lead" style={{ maxWidth: 740, marginTop: 14 }}>
                    {s.p}
                  </p>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* FAQ */}
        {config.faq?.length > 0 && (
          <section className="band alt" id="faq">
            <div className="wrap">
              <div className="eyebrow">{LND.eyebrowFaq}</div>
              <h2>{LND.h2Faq}</h2>
              <div style={{ marginTop: 24, maxWidth: 760 }}>
                {config.faq.map(([q, a], i) => (
                  <details className="faq" key={q} open={i === 0}>
                    <summary>
                      <h3>{q}</h3>
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
              {locale === DEFAULT_LOCALE && (
                <p className="muted" style={{ fontSize: 13.5, marginTop: 20 }}>
                  Comparing tools for your team? Read our{" "}
                  <Link
                    href="/guides/best-free-invoice-ocr-software"
                    style={{ color: "var(--brand-ink)", textDecoration: "underline", fontWeight: 600 }}
                  >
                    7 Best Free Invoice OCR Software in 2026 comparison →
                  </Link>
                </p>
              )}
            </div>
          </section>
        )}

        <AdSlot slot={AD_SLOTS.bottom} />

        {/* Cross-links feeding authority back to localized home and sibling OCR tool */}
        <section className="band" id="more">
          <div className="wrap">
            <div className="eyebrow">{LND.eyebrowMore}</div>
            <h2>{LND.h2More}</h2>
            <p className="lead" style={{ maxWidth: 700 }}>
              {LND.leadMore}
            </p>
            <div className="tpl-grid" style={{ marginTop: 24 }}>
              <Link className="tpl-card" href={localePath(locale, "/")}>
                <div className="mono">I</div>
                <div className="nm">{LND.cardInvoiceTitle}</div>
                <div className="ds">{LND.cardInvoiceDesc}</div>
              </Link>
              <Link
                className="tpl-card"
                href={
                  config.slug === "invoice-ocr-scanner"
                    ? ocrPath("receipt-to-csv-converter")
                    : ocrPath("invoice-ocr-scanner")
                }
              >
                <div className="mono">Csv</div>
                <div className="nm">
                  {config.slug === "invoice-ocr-scanner" ? LND.cardCsvTitle : LND.cardOcrTitle}
                </div>
                <div className="ds">
                  {config.slug === "invoice-ocr-scanner" ? LND.cardCsvDesc : LND.cardOcrDesc}
                </div>
              </Link>
              <Link className="tpl-card" href="/receipt-maker">
                <div className="mono">R</div>
                <div className="nm">{LND.cardReceiptTitle}{!isEn ? " (EN)" : ""}</div>
                <div className="ds">{LND.cardReceiptDesc}</div>
              </Link>
              <Link className="tpl-card" href="/estimate-generator">
                <div className="mono">E</div>
                <div className="nm">{LND.cardEstimateTitle}{!isEn ? " (EN)" : ""}</div>
                <div className="ds">{LND.cardEstimateDesc}</div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
