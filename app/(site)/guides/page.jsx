import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import JsonLd, { articleSchema } from "@/components/JsonLd";
import { Byline } from "@/components/ContentMeta";
import { GUIDES } from "@/lib/guides";

export const metadata = {
  title: "Billing, Invoice OCR & Help Guides",
  description:
    "Feature & quota comparisons, worked billing examples, receipt-to-CSV workflows, and practical help guides for freelancers, contractors, and small businesses.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Billing, Invoice OCR & Help Guides — BillCrafter",
    description:
      "Sourced invoice OCR comparisons, worked billing examples, and step-by-step receipt-to-Excel workflows.",
    url: "https://billcrafter.com/guides",
    type: "website",
    images: [{ url: "/og/best-free-invoice-ocr-software.png", width: 1200, height: 630, alt: "BillCrafter Guides" }],
  },
};

export default function GuidesHubPage() {
  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: "BillCrafter Billing & Invoice OCR Guides",
          description: metadata.description,
          url: "https://billcrafter.com/guides",
        })}
      />
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div className="eyebrow">Guides, Comparisons &amp; Help</div>
              <h1>Practical guides to invoicing, OCR workflows &amp; billing help.</h1>
              <p className="sub">
                Sourced tool comparisons, worked billing examples, synthetic OCR demos, and clear troubleshooting
                for freelancers, contractors, and bookkeepers.
              </p>
              <Byline />
            </div>

            <div className="vex-grid" style={{ marginTop: 32 }}>
              {GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="vex-card"
                  style={{ textDecoration: "none", transition: "border-color .15s, transform .15s" }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <span className="price-badge" style={{ margin: 0 }}>{g.category}</span>
                      <span className="muted" style={{ fontSize: 12 }}>{g.readTime}</span>
                    </div>
                    <h2 style={{ fontSize: 21, lineHeight: 1.25, color: "var(--ink)" }}>{g.h1}</h2>
                    <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 10, lineHeight: 1.6 }}>
                      {g.metaDescription}
                    </p>
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--brand-ink)" }}>
                    Read guide &amp; try tool →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="band alt">
          <div className="wrap">
            <div className="eyebrow">Free Browser Tools</div>
            <h2>Jump straight into a tool — no sign-up required.</h2>
            <div className="tpl-grid" style={{ marginTop: 24 }}>
              <Link className="tpl-card" href="/invoice-ocr-scanner">
                <div className="mono">AI</div>
                <div className="nm">Invoice OCR scanner</div>
                <div className="ds">PDF &amp; photo invoices to Excel (.xlsx)</div>
              </Link>
              <Link className="tpl-card" href="/receipt-to-csv-converter">
                <div className="mono">Csv</div>
                <div className="nm">Receipt photo to CSV</div>
                <div className="ds">Batch-scan thermal receipts to ledger</div>
              </Link>
              <Link className="tpl-card" href="/">
                <div className="mono">I</div>
                <div className="nm">Free invoice generator</div>
                <div className="ds">45 templates · Instant vector PDF</div>
              </Link>
              <Link className="tpl-card" href="/templates">
                <div className="mono">45</div>
                <div className="nm">Template library</div>
                <div className="ds">Browse trade &amp; freelance layouts</div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
