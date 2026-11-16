import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TemplatesGallery from "@/components/TemplatesGallery";
import { TEMPLATES, TEMPLATE_CATEGORIES, templatesInGroup } from "@/lib/templates";

const TITLE = `Free Invoice Templates — ${TEMPLATES.length} Editable Designs | BillCrafter`;
const DESC = "Browse free invoice templates — plus estimate, quote and receipt templates — across styles and industries. Pick an invoice template and edit it live, no signup to download.";
const OG_IMG = `/og?title=${encodeURIComponent(`${TEMPLATES.length} free invoice templates`)}&eyebrow=${encodeURIComponent("Template library")}`;

export const metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/templates" },
  openGraph: { title: TITLE, description: DESC, type: "website", images: [{ url: OG_IMG, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMG] },
};

export default function TemplatesPage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div className="eyebrow">Template library</div>
              <h1>Free Invoice Templates — Edit Live, Then Download</h1>
              <p className="sub">
                {TEMPLATES.length} free invoice, estimate, quote and receipt templates — every one is a real,
                editable document, not a picture. No signup needed to download your first PDF.
              </p>
              <div className="meta">
                <span>✓ Edit in your browser</span>
                <span>✓ Free PDF download</span>
                <span>✓ 12 accent colors</span>
              </div>
            </div>
            <div className="wrap" style={{ padding: 0 }}><TemplatesGallery /></div>
          </div>
        </section>

        <section className="band alt">
          <div className="wrap">
            <div className="eyebrow">Browse by industry</div>
            <h2>Templates by category.</h2>
            <div className="cat-links" style={{ marginTop: 20 }}>
              {TEMPLATE_CATEGORIES.map((c) => (
                <Link key={c.slug} className="cat-link" href={`/templates/c/${c.slug}`}>
                  <span className="cat-link-name">{c.group}</span>
                  <span className="cat-link-count">{templatesInGroup(c.group).length}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
