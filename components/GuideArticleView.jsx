import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import OcrWorkbench from "@/components/OcrWorkbench";
import AdSlot from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import JsonLd, { faqSchema, howToSchema, articleSchema } from "@/components/JsonLd";
import { Byline } from "@/components/ContentMeta";

export default function GuideArticleView({ guide }) {
  if (!guide) return null;
  const fullUrl = `https://billcrafter.com/guides/${guide.slug}`;

  const itemListSchema = guide.reviews?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: guide.h1,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: guide.reviews.length,
        itemListElement: guide.reviews.map((r) => ({
          "@type": "ListItem",
          position: r.rank,
          name: r.name,
          description: r.bestFor,
          ...(r.ctaHref ? { url: `https://billcrafter.com${r.ctaHref}` } : {}),
        })),
      }
    : null;

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: guide.h1,
          description: guide.metaDescription || guide.sub,
          url: fullUrl,
          dateModified: guide.updated,
        })}
      />
      {itemListSchema ? <JsonLd data={itemListSchema} /> : null}
      {guide.steps?.length ? (
        <JsonLd
          data={howToSchema({
            name: guide.h1,
            description: guide.metaDescription || guide.sub,
            url: `${fullUrl}#steps`,
            steps: guide.steps,
          })}
        />
      ) : null}
      {guide.faq?.length ? <JsonLd data={faqSchema(guide.faq)} /> : null}

      <SiteNav />
      <main>
        <header className="guide-hero">
          <div className="guide-wrap">
            <nav className="guide-crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/guides">Guides</Link>
              <span>/</span>
              <span>{guide.category}</span>
            </nav>
            <div className="hero-head">
              <div className="eyebrow">
                {guide.eyebrow} · {guide.readTime}
              </div>
              <h1>{guide.h1}</h1>
              <p className="sub" style={{ maxWidth: 780 }}>
                {guide.sub}
              </p>
              <Byline updated={guide.updated} />
            </div>
          </div>
        </header>

        {/* Jump TOC */}
        <nav className="toc-band" aria-label="Article sections">
          <div className="guide-wrap" style={{ display: "flex", alignItems: "center", gap: 18, height: 48, overflowX: "auto" }}>
            <span className="toc-label">Jump to</span>
            <ul className="toc-links">
              {guide.comparisonHeaders ? <li><a href="#comparison">Quick comparison</a></li> : null}
              {guide.embedSandbox ? <li><a href="#live-test">Live OCR sandbox</a></li> : null}
              {guide.methodology ? <li><a href="#methodology">Sample bills</a></li> : null}
              {guide.reviews ? <li><a href="#reviews">7 tools compared</a></li> : null}
              {guide.workedExamples ? <li><a href="#examples">Worked examples</a></li> : null}
              {guide.steps ? <li><a href="#steps">Step-by-step</a></li> : null}
              {guide.faq?.length ? <li><a href="#faq">FAQ</a></li> : null}
            </ul>
          </div>
        </nav>

        <article className="guide-wrap guide-prose" style={{ paddingBottom: 64 }}>
          {/* 1. Quick Verdict Table (for Comparison articles) */}
          {guide.comparisonHeaders && guide.comparisonRows ? (
            <section id="comparison">
              <h2>Quick Comparison: 7 Invoice OCR Tools Side-by-Side</h2>
              <p>
                Here is how all seven tools compare across verified free-tier allowances, sign-up friction,
                line-item and tax support, and spreadsheet exports:
              </p>
              {guide.disclosure ? (
                <p className="muted" style={{ fontSize: 13.5, background: "#F7F8F9", border: "1px solid var(--line)", borderRadius: 10, padding: "12px 14px", marginBottom: 18 }}>
                  {guide.disclosure}
                </p>
              ) : null}
              <div className="guide-table-wrap">
                <table className="guide-table">
                  <thead>
                    <tr>
                      {guide.comparisonHeaders.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.comparisonRows.map((row, idx) => (
                      <tr key={row[0]} className={idx === 0 ? "is-pick" : ""}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={cIdx === 0 ? { fontWeight: 600, color: "var(--ink)" } : undefined}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {/* 2. Embedded Live OCR Sandbox (High dwell-time & zero-click conversion hook) */}
          {guide.embedSandbox ? (
            <section id="live-test" style={{ marginTop: 38 }}>
              <div className="eyebrow" style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".09em", color: "var(--brand-ink)", fontWeight: 700 }}>
                {guide.embedSandbox.kicker}
              </div>
              <p style={{ marginTop: 6, marginBottom: 14 }}>{guide.embedSandbox.blurb}</p>
            </section>
          ) : null}
        </article>

        {/* Full-width container for embedded workbench so split-view breathes */}
        {guide.embedSandbox ? (
          <div className="wrap" style={{ marginTop: -44, marginBottom: 28 }}>
            <OcrWorkbench
              mode="embedded"
              defaultCsvPreset={guide.embedSandbox.defaultCsvPreset || "itemized"}
            />
          </div>
        ) : null}

        <AdSlot slot={AD_SLOTS.inContent} />

        <article className="guide-wrap guide-prose" style={{ paddingBottom: 48 }}>
          {/* 3. Synthetic Demo Fixtures & OCR Test Matrix */}
          {guide.methodology ? (
            <section id="methodology">
              <h2>{guide.methodology.title}</h2>
              <p>{guide.methodology.intro}</p>
              <div className="vex-grid">
                {guide.methodology.fixtures.map((fx) => (
                  <div className="vex-card" key={fx.name}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 15 }}>{fx.name}</div>
                      <p style={{ fontSize: 13.5, margin: "6px 0 0", color: "var(--muted)" }}>{fx.challenge}</p>
                    </div>
                    <a
                      href={fx.url}
                      target="_blank"
                      rel="noopener"
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-ink)", textDecoration: "underline" }}
                    >
                      View / download synthetic fixture →
                    </a>
                  </div>
                ))}
              </div>
              {guide.methodology.testMatrixRows?.length ? (
                <div style={{ marginTop: 28 }}>
                  <h3>{guide.methodology.testMatrixTitle}</h3>
                  {guide.methodology.testMatrixNote ? (
                    <p style={{ fontSize: 13.5, color: "var(--muted)" }}>{guide.methodology.testMatrixNote}</p>
                  ) : null}
                  <div className="guide-table-wrap">
                    <table className="guide-table">
                      <thead>
                        <tr>
                          {guide.methodology.testMatrixHeaders.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {guide.methodology.testMatrixRows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, idx) => (
                              <td key={idx} style={idx === 0 ? { fontWeight: 600, color: "var(--ink)" } : undefined}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {/* 4. Step-by-Step Tutorial Blocks (for How-To articles) */}
          {guide.steps?.length ? (
            <section id="steps">
              <h2>Step-by-Step Workflow</h2>
              <div className="steps" style={{ marginTop: 22 }}>
                {guide.steps.map(([title, body, img], idx) => (
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
            </section>
          ) : null}

          {/* 5. Detailed Tool Reviews */}
          {guide.reviews?.length ? (
            <section id="reviews">
              <h2>In-Depth Reviews: Best Free Invoice OCR Tools in 2026</h2>
              {guide.reviews.map((rev) => (
                <div
                  key={rev.name}
                  className={`guide-review-card${rev.rank === 1 ? " is-winner" : ""}`}
                >
                  <div className="guide-review-head">
                    <h3 style={{ margin: 0, fontSize: 20 }}>
                      #{rev.rank}. {rev.name}
                    </h3>
                    <span className="price-badge" style={{ margin: 0 }}>
                      {rev.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, marginTop: 12 }}>
                    <strong style={{ color: "var(--ink)" }}>Best for:</strong> {rev.bestFor}
                    <br />
                    <strong style={{ color: "var(--ink)" }}>Free tier:</strong> {rev.freeTier}
                    {rev.officialUrl ? (
                      <>
                        <br />
                        <strong style={{ color: "var(--ink)" }}>Official source:</strong>{" "}
                        <a href={rev.officialUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
                          {rev.officialLabel || rev.officialUrl}
                        </a>
                        {rev.verifiedAt ? ` (checked ${rev.verifiedAt})` : ""}
                      </>
                    ) : null}
                  </p>
                  <p>{rev.summary}</p>
                  <div className="guide-pros-cons">
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--ok-ink)", letterSpacing: ".05em" }}>
                        What stood out
                      </div>
                      <ul>
                        {rev.pros.map((p) => (
                          <li key={p} style={{ fontSize: 13.5 }}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--warn-ink)", letterSpacing: ".05em" }}>
                        Watch-outs &amp; limits
                      </div>
                      <ul>
                        {rev.cons.map((c) => (
                          <li key={c} style={{ fontSize: 13.5 }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {rev.ctaHref ? (
                    <div style={{ marginTop: 16 }}>
                      <Link className="btn btn-accent btn-sm" href={rev.ctaHref}>
                        {rev.ctaLabel}
                      </Link>
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {/* Worked Examples (Help & Walkthroughs) */}
          {guide.workedExamples?.length ? (
            <section id="examples">
              {guide.workedExamples.map((ex) => (
                <div key={ex.id} id={ex.id} className="guide-review-card" style={{ marginTop: 22 }}>
                  <h2 style={{ marginTop: 0, fontSize: 20 }}>{ex.title}</h2>
                  <ul>
                    {ex.rows.map(([label, desc]) => (
                      <li key={label}>
                        <strong style={{ color: "var(--ink)" }}>{label}:</strong> {desc}
                      </li>
                    ))}
                  </ul>
                  {ex.toolHref ? (
                    <div style={{ marginTop: 14 }}>
                      <Link className="btn btn-accent btn-sm" href={ex.toolHref}>
                        {ex.toolLabel}
                      </Link>
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {/* 6. Decision Guide / Pro Tips */}
          {guide.decisionGuide?.length ? (
            <section>
              <h2>Which Invoice OCR Tool Should You Actually Pick?</h2>
              <ul>
                {guide.decisionGuide.map(([head, body]) => (
                  <li key={head}>
                    <strong style={{ color: "var(--ink)" }}>{head}:</strong> {body}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {guide.proTips?.map((tip) => (
            <section key={tip.h}>
              <h2>{tip.h}</h2>
              <p>{tip.p}</p>
            </section>
          ))}
        </article>

        {/* FAQ Band */}
        {guide.faq?.length ? (
          <section className="band alt" id="faq">
            <div className="guide-wrap">
              <div className="eyebrow">FAQ</div>
              <h2>Frequently Asked Questions</h2>
              <div style={{ marginTop: 22 }}>
                {guide.faq.map(([q, a], i) => (
                  <details className="faq" key={q} open={i === 0}>
                    <summary>
                      <h3>{q}</h3>
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <AdSlot slot={AD_SLOTS.bottom} />

        {/* Funnel CTA Band back to Core Tools */}
        <section className="band">
          <div className="wrap">
            <div className="eyebrow">Try BillCrafter Free</div>
            <h2>Scan supplier receipts — or send client invoices in under a minute.</h2>
            <div className="tpl-grid" style={{ marginTop: 24 }}>
              <Link className="tpl-card" href="/invoice-ocr-scanner">
                <div className="mono">AI</div>
                <div className="nm">Invoice OCR scanner</div>
                <div className="ds">Extract PDF &amp; photo bills to Excel / CSV</div>
              </Link>
              <Link className="tpl-card" href="/receipt-to-csv-converter">
                <div className="mono">Csv</div>
                <div className="nm">Receipt photo to CSV</div>
                <div className="ds">Batch-convert receipts into 1 ledger sheet</div>
              </Link>
              <Link className="tpl-card" href="/">
                <div className="mono">I</div>
                <div className="nm">Free invoice generator</div>
                <div className="ds">45 templates · Instant vector PDF, no watermark</div>
              </Link>
              <Link className="tpl-card" href="/receipt-maker">
                <div className="mono">R</div>
                <div className="nm">Free receipt maker</div>
                <div className="ds">Create official PAID customer receipts</div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
