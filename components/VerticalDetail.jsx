// Renders the per-vertical content from lib/seo.js: an in-page table of
// contents, an annotated "anatomy" diagram, a "what to include" checklist,
// three substantive sections, vertical-specific FAQs and cross-links.
import Link from "next/link";
import { VERTICALS } from "@/lib/seo";
import { Byline, Sources } from "./ContentMeta";

function Check() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flex: "none", marginTop: 3, color: "var(--brand)" }}><polyline points="20 6 9 17 4 12" /></svg>);
}

export default function VerticalDetail({ v }) {
  if (!v) return null;
  // Take the six guides that FOLLOW this one, wrapping around the end of the
  // list. The previous `.filter(...).slice(0, 6)` always returned the first six
  // entries of VERTICALS, so every page linked to the same handful and the ten
  // guides added later — appended to the end of the array — had no inbound
  // internal links anywhere on the site. Orphan pages get crawled reluctantly
  // and rank badly, however good the writing is.
  //
  // Rotating by position gives each guide exactly six inbound links, spreads
  // link equity evenly, and stays deterministic — which matters because these
  // pages are prerendered and cached.
  const idx = VERTICALS.findIndex((x) => x.slug === v.slug);
  const others = Array.from({ length: Math.min(6, VERTICALS.length - 1) }, (_, i) =>
    VERTICALS[(idx + 1 + i) % VERTICALS.length]
  );
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

      <section className="band" id="more">
        <div className="wrap">
          <div className="eyebrow">More generators</div>
          <h2>Other documents you can create free.</h2>
          <div className="tpl-grid">
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
