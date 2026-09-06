import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TemplatePreview from "@/components/TemplatePreview";
import JsonLd, { faqSchema, articleSchema } from "@/components/JsonLd";
import { Byline, Sources } from "@/components/ContentMeta";
import { TEMPLATES, TEMPLATE_CATEGORIES, getCategoryBySlug, templatesInGroup, catSlug } from "@/lib/templates";
import { CATEGORY_SEO } from "@/lib/templateCategories";

const DOC_LABEL = { invoice: "Invoice", estimate: "Estimate", quote: "Quote", receipt: "Receipt" };

export function generateStaticParams() {
  return TEMPLATE_CATEGORIES.map((c) => ({ cat: c.slug }));
}
// Must be true on Cloudflare/OpenNext: nested SSG routes can miss the
// incremental cache at the edge; false would hard-404 instead of rendering.
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);
  if (!category) return {};
  const seo = CATEGORY_SEO[category.group];
  const first = templatesInGroup(category.group)[0];
  const title = seo?.h1 || `${category.group} invoice templates`;
  const description = seo?.sub || `Free, editable ${category.group.toLowerCase()} invoice templates. Edit in your browser and download a PDF — no signup.`;
  return {
    title,
    description,
    alternates: { canonical: `/templates/c/${category.slug}` },
    openGraph: {
      title, description, type: "website",
      images: first ? [{ url: `/og/templates/${first.slug}.png`, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: first ? [`/og/templates/${first.slug}.png`] : undefined },
  };
}

export default async function CategoryPage({ params }) {
  const { cat } = await params;
  const category = getCategoryBySlug(cat);
  if (!category) notFound();
  const seo = CATEGORY_SEO[category.group] || {};
  const rows = templatesInGroup(category.group);
  const others = TEMPLATE_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      <JsonLd data={articleSchema({ headline: seo.h1 || `${category.group} invoice templates`, description: seo.sub, url: `https://billcrafter.com/templates/c/${category.slug}` })} />
      {seo.faq?.length ? <JsonLd data={faqSchema(seo.faq)} /> : null}
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div style={{ marginBottom: 8 }}><Link className="link-text" href="/templates">← All templates</Link></div>
              <div className="eyebrow">{category.group}</div>
              <h1>{seo.h1 || `${category.group} invoice templates`}</h1>
              <p className="sub">{seo.sub}</p>
              <div className="meta"><span>{rows.length} templates</span><span>Free &amp; editable</span><span>No signup to download</span></div>
              <Byline />
            </div>
          </div>
        </section>

        {/* Template grid for this category */}
        <section className="band" style={{ paddingTop: 8 }}>
          <div className="wrap">
            <div className="tpl-lib">
              {rows.map((t) => (
                <Link key={t.slug} className="tpl-lib-card" href={`/templates/${t.slug}`}>
                  <div className="tpl-preview-wrap">
                    <TemplatePreview t={t} />
                    <span className="tpl-badge" style={{ background: t.accent }}>{DOC_LABEL[t.docType]}</span>
                    <span className="tpl-cta">Use this template</span>
                  </div>
                  <div className="tpl-lib-meta">
                    <div className="nm">{t.name}</div>
                    <div className="ds">{t.blurb}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO content — at the bottom of the page */}
        {seo.intro && (
          <section className="band alt">
            <div className="wrap">
              <p className="lead" style={{ maxWidth: 760 }}>{seo.intro}</p>
            </div>
          </section>
        )}
        {(seo.sections || []).map((s, i) => (
          <section className={"band" + (i % 2 ? " alt" : "")} key={s.h}>
            <div className="wrap">
              <h2 style={{ maxWidth: 720 }}>{s.h}</h2>
              <p className="lead" style={{ maxWidth: 720, marginTop: 14 }}>{s.p}</p>
            </div>
          </section>
        ))}
        {seo.faq?.length > 0 && (
          <section className="band alt">
            <div className="wrap">
              <div className="eyebrow">FAQ</div>
              <h2>{category.group} templates — common questions.</h2>
              <div style={{ marginTop: 24, maxWidth: 760 }}>
                {seo.faq.map(([q, a], i) => (
                  <details className="faq" key={q} open={i === 0}><summary><h3>{q}</h3></summary><p>{a}</p></details>
                ))}
              </div>
              <p className="muted" style={{ fontSize: 13, marginTop: 20, maxWidth: 760 }}>
                BillCrafter is a document tool, not an accounting or legal service. Tax and contract rules vary by
                country and state — check anything material with a qualified professional.
              </p>
            </div>
          </section>
        )}

        {/* Cross-links to the other category hubs */}
        <section className="band">
          <div className="wrap">
            <div className="eyebrow">Browse by industry</div>
            <h2>Other template categories.</h2>
            <div className="cat-links">
              {others.map((c) => (
                <Link key={c.slug} className="cat-link" href={`/templates/c/${c.slug}`}>
                  <span className="cat-link-name">{c.group}</span>
                  <span className="cat-link-count">{templatesInGroup(c.group).length}</span>
                </Link>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 20 }}>
              Or <Link href="/templates" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>browse all {TEMPLATES.length} templates</Link>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
