// Template detail section: focuses strictly on what is pre-filled in THIS
// template, why its layout suits the document, and how it differs from sibling
// styles in the same category — keeping its role distinct from the trade-level
// billing guides (/<trade>-invoice-generator) and category hubs (/templates/c/*).
import Link from "next/link";
import { TYPES, SCENARIOS } from "@/lib/invoice";
import { TEMPLATES, catSlug } from "@/lib/templates";

const STYLE_NOTES = {
  modern: {
    label: "Modern",
    summary: "Clean sans-serif hierarchy with an accent rule and generous spacing — balanced for digital PDF viewing and client email attachments.",
  },
  minimal: {
    label: "Minimal",
    summary: "Stripped-back header with light borders and low ink density — fast to scan and economical to print in black and white.",
  },
  classic: {
    label: "Classic",
    summary: "Traditional business typography and structured totals block suited to consulting, accounting, and legal practices.",
  },
  band: {
    label: "Band",
    summary: "High-contrast accent header band that highlights your business name and document number at a glance.",
  },
  ruled: {
    label: "Ruled",
    summary: "Crisp horizontal table rules separating every line item — built for job-site readability and multi-row trade breakdowns.",
  },
  compact: {
    label: "Compact",
    summary: "Tighter row padding and denser line spacing so long parts lists or retail itemizations stay on a single PDF page.",
  },
  elegant: {
    label: "Elegant",
    summary: "Centered serif display heading with refined spacing — tailored for creative studios, photography, salons, and advisory proposals.",
  },
  mono: {
    label: "Mono",
    summary: "Monospace-accented technical grid with crisp numeric alignment — ideal for software engineers, IT services, and design studios.",
  },
};

const GUIDE_BY_SCENARIO = {
  freelance: { href: "/freelance-invoice-generator", label: "Freelance invoicing guide" },
  contractor: { href: "/contractor-invoice-generator", label: "Contractor invoicing guide" },
  consulting: { href: "/consulting-invoice-generator", label: "Consulting billing guide" },
  photography: { href: "/photography-invoice-template", label: "Photography billing guide" },
  cleaning: { href: "/cleaning-invoice-template", label: "Cleaning service billing guide" },
  handyman: { href: "/handyman-invoice-template", label: "Handyman invoicing guide" },
  landscaping: { href: "/lawn-care-invoice-template", label: "Lawn care invoicing guide" },
  legal: { href: "/attorney-invoice-template", label: "Attorney billing guide" },
  tutoring: { href: "/tutoring-invoice-template", label: "Tutoring invoicing guide" },
  smallbusiness: { href: "/small-business-invoice-generator", label: "Small business invoicing guide" },
  rent: { href: "/rent-receipt-maker", label: "Rent receipt guide" },
};

const GUIDE_BY_DOCTYPE = {
  estimate: { href: "/estimate-generator", label: "How to write a job estimate" },
  quote: { href: "/quote-generator", label: "How to structure a business quote" },
  receipt: { href: "/receipt-maker", label: "Receipt maker & payment proof guide" },
};

export default function TemplateDetail({ t }) {
  const related = TEMPLATES.filter((x) => x.slug !== t.slug && x.group === t.group).slice(0, 6);
  const scen = SCENARIOS[t.scenario] || SCENARIOS.blank;
  const styleInfo = STYLE_NOTES[t.style] || STYLE_NOTES.modern;
  const sections = (scen.items || []).filter((i) => i.section !== undefined).map((i) => i.section);
  const lineItems = (scen.items || []).filter((i) => i.section === undefined);
  const sampleTitles = lineItems.map((i) => i.desc).filter(Boolean).slice(0, 3);
  const docLabel = (TYPES[t.docType] || TYPES.invoice).word.toLowerCase();
  const guideLink =
    (t.docType !== "invoice" && GUIDE_BY_DOCTYPE[t.docType]) ||
    GUIDE_BY_SCENARIO[t.scenario] ||
    null;

  return (
    <section className="band">
      <div className="wrap">
        <div className="eyebrow">Template specification</div>
        <h2>Inside the {t.name} {docLabel} template.</h2>
        <div className="features" style={{ marginTop: 20 }}>
          <div className="feature">
            <h3>{styleInfo.label} layout &amp; print fit</h3>
            <p>{styleInfo.summary}</p>
          </div>
          <div className="feature">
            <h3>Pre-filled structure ({lineItems.length} sample {lineItems.length === 1 ? "row" : "rows"})</h3>
            <p>
              {sections.length > 0
                ? `Grouped into ${sections.join(" and ")} sections with automatic subtotals. `
                : ""}
              {sampleTitles.length > 0
                ? `Starts with examples like ${sampleTitles.join(", ")}. `
                : ""}
              {scen.timesheet ? "Includes a dated timesheet column and total-hours summary. " : ""}
              {scen.jobAddr ? "Includes a separate Job Site / Service Address block. " : ""}
              {scen.svc ? "Pre-configured with Service Period dates and visit frequency. " : ""}
              {!sections.length && !scen.timesheet && !scen.jobAddr && !scen.svc
                ? "Includes itemized description, quantity, unit rate, per-line tax toggle, and payment notes."
                : ""}
            </p>
          </div>
          <div className="feature">
            <h3>Tax, currency &amp; terms defaults</h3>
            <p>
              {scen.tax > 0
                ? `Opens with a sample ${scen.tax}% tax rate and per-line taxable toggles so you can separate taxed materials or parts from non-taxed labor.`
                : "Opens with a 0% default tax rate — enter any VAT, GST, or sales tax rate and mark individual lines taxable as needed."}{" "}
              {scen.notes ? `Sample terms: “${scen.notes}”` : ""}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 42 }}>
            <div className="eyebrow">Compare other styles</div>
            <h2>Other {t.group.toLowerCase()} templates.</h2>
            <div className="tpl-grid">
              {related.map((r) => (
                <Link key={r.slug} className="tpl-card" href={`/templates/${r.slug}`}>
                  <div className="mono">{(TYPES[r.docType] || TYPES.invoice).word[0]}</div>
                  <div className="nm">{r.name}</div>
                  <div className="ds">{r.blurb}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="muted" style={{ fontSize: 13.5, marginTop: 22 }}>
          See all <Link href={`/templates/c/${catSlug(t.group)}`} style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>{t.group} templates</Link>,{" "}
          <Link href="/templates" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>browse all {TEMPLATES.length} templates</Link>
          {guideLink ? (
            <>
              , or read our{" "}
              <Link href={guideLink.href} style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
                {guideLink.label}
              </Link>
            </>
          ) : null}
          .
        </p>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 8 }}>
          The sample business, prices, tax rate, payment terms and any late fee are placeholders. Replace them with
          what you agreed with your client — tax and late-fee rules vary by country and state.
        </p>
      </div>
    </section>
  );
}
