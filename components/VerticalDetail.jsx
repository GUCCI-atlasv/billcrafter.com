// Renders the per-vertical content from lib/seo.js: an in-page table of
// contents, an annotated "anatomy" diagram, a "what to include" checklist,
// three substantive sections, vertical-specific FAQs and cross-links.
import AdSlot from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import Link from "next/link";
import { VERTICALS } from "@/lib/seo";
import { Byline, Sources } from "./ContentMeta";
import VerticalExamples from "./VerticalExamples";

function Check() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flex: "none", marginTop: 3, color: "var(--brand)" }}><polyline points="20 6 9 17 4 12" /></svg>);
}

const CORE_WORKFLOW = [
  { slug: "", href: "/", mark: "I", name: "Invoice generator", desc: "Bill clients & collect payment (PDF)" },
  { slug: "quote-generator", href: "/quote-generator", mark: "Q", name: "Quote generator", desc: "Fixed-price business quotes" },
  { slug: "estimate-generator", href: "/estimate-generator", mark: "E", name: "Estimate generator", desc: "Labor & materials job estimates" },
  { slug: "receipt-maker", href: "/receipt-maker", mark: "R", name: "Receipt maker", desc: "Instant Paid proof of payment" },
  { slug: "invoice-ocr-scanner", href: "/invoice-ocr-scanner", mark: "AI", name: "Invoice & receipt OCR", desc: "Scan PDF/photo bills to Excel & CSV" },
];

const CORE_FALLBACK_BY_SLUG = {
  "receipt-maker": { slug: "rent-receipt-maker", href: "/rent-receipt-maker", mark: "Rr", name: "Rent receipt maker", desc: "Landlord & tenant rent receipts" },
  "estimate-generator": { slug: "contractor-estimate-generator", href: "/contractor-estimate-generator", mark: "Ce", name: "Contractor estimate", desc: "Construction & handyman estimates" },
  "quote-generator": { slug: "freelance-design-quote-generator", href: "/freelance-design-quote-generator", mark: "Dq", name: "Design & photo quote", desc: "Creative scope & licensing quotes" },
};

export default function VerticalDetail({ v }) {
  if (!v) return null;
  // Cross-intent workflow links: every vertical landing page links across the
  // four core document intents (Invoice <-> Quote <-> Estimate <-> Receipt) so
  // crawlers and users move effortlessly across the full billing funnel.
  const workflowCards = CORE_WORKFLOW.map((item) =>
    item.slug === v.slug && CORE_FALLBACK_BY_SLUG[v.slug]
      ? CORE_FALLBACK_BY_SLUG[v.slug]
      : item
  );
  const workflowSlugs = new Set(workflowCards.map((c) => c.slug).filter(Boolean));

  // Pair same-intent vertical pages first (e.g. /receipt-maker <-> /rent-receipt-maker),
  // then fill remaining slots by deterministic rotation across VERTICALS so no
  // guide is ever orphaned.
  const idx = VERTICALS.findIndex((x) => x.slug === v.slug);
  const sameType = VERTICALS.filter(
    (x) => x.slug !== v.slug && !workflowSlugs.has(x.slug) && x.type === v.type
  );
  const rotated = [];
  for (let step = 1; step < VERTICALS.length && sameType.length + rotated.length < 8; step++) {
    const cand = VERTICALS[(idx + step) % VERTICALS.length];
    if (cand.slug === v.slug || workflowSlugs.has(cand.slug)) continue;
    if (sameType.some((s) => s.slug === cand.slug)) continue;
    rotated.push(cand);
  }
  const others = [...sameType, ...rotated].slice(0, 8);
  const noun = v.type === "invoice" ? "invoice" : v.type;
  const Noun = noun[0].toUpperCase() + noun.slice(1);

  // In-page table of contents — helps readers jump and gives Google the anchors
  // it can surface as sitelinks in the search result.
  const toc = [
    ["anatomy", `Anatomy of a${/^[aeiou]/i.test(noun) ? "n" : ""} ${noun}`],
    v.include?.length ? ["checklist", `What to put on it`] : null,
    v.sections?.length ? ["guide", `${Noun} guide`] : null,
    v.faq?.length ? ["faq", `FAQ`] : null,
    ["more", "Other generators"],
  ].filter(Boolean);

  return (
    <>
      <nav className="toc-band" aria-label="On this page">
        <div className="wrap">
          <span className="toc-label">On this page</span>
          <ul className="toc-links">
            {toc.map(([id, label]) => (
              <li key={id}><a href={`#${id}`}>{label}</a></li>
            ))}
          </ul>
        </div>
      </nav>

      <VerticalExamples slug={v.slug} />

      <section className="band" id="anatomy">
        <div className="wrap">
          <div className="eyebrow">Anatomy</div>
          <h2>The parts of a{/^[aeiou]/i.test(noun) ? "n" : ""} {noun}, labelled.</h2>
          <p className="lead" style={{ maxWidth: 720 }}>
            A complete {noun} has nine parts. The editor above has a field for every one — here&apos;s where each
            sits on the finished document.
          </p>
          <Byline />
          <img
            className="anatomy-img"
            src={`/anatomy/${v.type}.png`}
            alt={`Labelled diagram of a ${noun}, numbering its nine parts: header, business details, client details, ${noun} number, dates, line items, tax and subtotal, total, and payment terms`}
            width="1040" height="720" loading="lazy" decoding="async"
          />
        </div>
      </section>

      <AdSlot slot={AD_SLOTS.inContent} />

      {v.include?.length > 0 && (
        <section className="band alt" id="checklist">
          <div className="wrap">
            <div className="eyebrow">Checklist</div>
            <h2>What to put on this {noun}.</h2>
            <p className="lead">
              Miss one of these and the document usually comes back with a question attached. Everything here is
              a field in the editor above.
            </p>
            <ul className="price-feats" style={{ marginTop: 24, maxWidth: 640, gap: 11 }}>
              {v.include.map((i) => (
                <li key={i} style={{ fontSize: 14.5 }}><Check />{i}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {v.sections?.length > 0 && (
        <div id="guide">
          {v.sections.map((s, i) => (
            <section className={"band" + (i % 2 ? " alt" : "")} key={s.h}>
              <div className="wrap">
                <h2 style={{ maxWidth: 720 }}>{s.h}</h2>
                <p className="lead" style={{ maxWidth: 720, marginTop: 14 }}>{s.p}</p>
              </div>
            </section>
          ))}
        </div>
      )}

      {v.faq?.length > 0 && (
        <section className="band alt" id="faq">
          <div className="wrap">
            <div className="eyebrow">FAQ</div>
            <h2>{v.h1.replace("Free ", "").replace(/^\w/, (c) => c.toUpperCase())} — common questions.</h2>
            <div style={{ marginTop: 24, maxWidth: 760 }}>
              {v.faq.map(([q, a], i) => (
                <details className="faq" key={q} open={i === 0}>
                  <summary><h3>{q}</h3></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 20, maxWidth: 760 }}>
              BillCrafter is a document tool, not an accounting or legal service. Tax and contract rules vary by
              country and state — check anything material with a qualified professional.
            </p>
          </div>
        </section>
      )}

      <Sources />

      <AdSlot slot={AD_SLOTS.bottom} />

      <section className="band" id="more">
        <div className="wrap">
          <div className="eyebrow">Complete billing workflow</div>
          <h2>Switch between quotes, estimates, invoices &amp; receipts.</h2>
          <p className="lead" style={{ maxWidth: 700 }}>
            Every BillCrafter generator is 100% free with instant PDF download and no sign-up required. Pick the
            exact document your client or tenant needs right now:
          </p>
          <div className="tpl-grid" style={{ marginTop: 24 }}>
            {workflowCards.map((c) => (
              <Link key={c.href} className="tpl-card" href={c.href}>
                <div className="mono">{c.mark}</div>
                <div className="nm">{c.name}</div>
                <div className="ds">{c.desc}</div>
              </Link>
            ))}
          </div>

          <div className="eyebrow" style={{ marginTop: 48 }}>Related generators &amp; templates</div>
          <h3 style={{ fontSize: 21, marginTop: 4 }}>More trade &amp; scenario templates you can edit free.</h3>
          <div className="tpl-grid" style={{ marginTop: 20 }}>
            {others.map((o) => (
              <Link key={o.slug} className="tpl-card" href={`/${o.slug}`}>
                <div className="mono">{o.type[0].toUpperCase()}</div>
                <div className="nm">{o.h1.replace("Free ", "").replace(" generator", "").replace(" template", "").replace(" maker", "")}</div>
                <div className="ds">{o.type === "invoice" ? "Invoice" : o.type[0].toUpperCase() + o.type.slice(1)}</div>
              </Link>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 20 }}>
            Or <Link href="/templates" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>browse all 45 templates</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
