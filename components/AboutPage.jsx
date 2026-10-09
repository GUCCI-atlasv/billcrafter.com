// Shared About view, rendered by both /about (English) and /<locale>/about.
import Link from "next/link";
import HtmlLang from "@/components/HtmlLang";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_UPDATED, fmtDate } from "@/lib/site";
import { localePath, DEFAULT_LOCALE } from "@/lib/i18n";
import { about } from "@/lib/aboutI18n";

export default function AboutPage({ locale = DEFAULT_LOCALE }) {
  const a = about(locale);
  const url = "https://billcrafter.com" + localePath(locale, "/about");

  // AboutPage tied to the site Organization entity — gives AI engines an explicit
  // "about" node and reinforces the brand's identity and provenance.
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: a.title === "About" ? "About BillCrafter" : a.title,
    url,
    dateModified: SITE_UPDATED,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      "@id": "https://billcrafter.com/#organization",
      name: "BillCrafter",
      legalName: "CCC STUDIO",
      url: "https://billcrafter.com",
      email: "support@billcrafter.com",
      foundingDate: "2025",
      description: a.sub,
      sameAs: ["https://www.trustpilot.com/review/billcrafter.com"],
    },
  };

  return (
    <>
      <HtmlLang locale={locale} />
      <JsonLd data={schema} />
      <SiteNav locale={locale} />
      <main>
        <section className="hero">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <div className="hero-head">
              <div className="eyebrow">{a.eyebrow}</div>
              <h1>{a.h1}</h1>
              <p className="sub">{a.sub}</p>
              <p className="byline">
                {a.reviewed} · {a.updated} <time dateTime={SITE_UPDATED}>{fmtDate(SITE_UPDATED)}</time>
              </p>
            </div>
          </div>
        </section>

        <section className="band" style={{ paddingTop: 8 }}>
          <div className="wrap about-prose">
            <figure className="about-figure">
              <img
                src="/about/workspace.jpg"
                alt={a.figcaption}
                width="1280" height="1044" loading="lazy" decoding="async"
              />
              <figcaption>{a.figcaption}</figcaption>
            </figure>

            <h2>{a.why.h2}</h2>
            <p>{a.why.p}</p>

            <h2>{a.how.h2}</h2>
            <p>{a.how.p}</p>

            <h2 id="author">{a.author.h2}</h2>
            <p>{a.author.p}</p>

            <h2>{a.who.h2}</h2>
            <p>{a.who.p}</p>

            <h2>{a.contact.h2}</h2>
            <p>
              {a.contact.q}{" "}
              <a href="mailto:support@billcrafter.com">support@billcrafter.com</a>{" "}
              {a.contact.or} <Link href="/contact">{a.contact.pageLabel}</Link>. {a.contact.ready}{" "}
              <Link href={localePath(locale, "/")}>{a.contact.createLabel}</Link> {a.contact.tail}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
