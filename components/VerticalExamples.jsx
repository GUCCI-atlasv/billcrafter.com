"use client";

// Page-unique, interactive industry examples & decision tables for the top 3
// organic landing pages (`/estimate-generator`, `/quote-generator`, `/receipt-maker`).
// Clicking "Use this example in editor" dispatches `bc:load-example` so the live
// WYSIWYG sheet above pre-fills immediately without a page reload.

import Link from "next/link";

const ESTIMATE_EXAMPLES = [
  {
    title: "Bathroom Remodel Estimate (Contractor)",
    tag: "Labor + Taxed Materials",
    total: "$4,462.20",
    note: "Excludes permit fees & hidden sub-floor rot repair · Valid 30 days",
    lines: [
      ["Demolition & haul-away (12 hrs @ $65)", "$780.00"],
      ["Tile & vanity installation labor (24 hrs @ $75)", "$1,800.00"],
      ["Porcelain tile, mortar & vanity allowance (taxed 8.25%)", "$1,740.00"],
    ],
    snapshot: {
      type: "estimate",
      tpl: "band",
      currency: "USD",
      items: [
        { section: "Labor" },
        { desc: "Bathroom demolition & debris haul-away", detail: "Remove existing vanity, floor tile & baseboard", qty: 12, rate: 65, tax: false },
        { desc: "Floor tile & 36\" vanity installation", detail: "Waterproof membrane, set porcelain tile, plumb faucet", qty: 24, rate: 75, tax: false },
        { section: "Materials & Allowances" },
        { desc: "Porcelain hex floor tile & thinset mortar", detail: "65 sq ft incl. 10% waste factor", qty: 1, rate: 640, tax: true },
        { desc: "36\" oak vanity, quartz top & faucet allowance", detail: "Client selection allowance", qty: 1, rate: 1100, tax: true },
      ],
      adj: { taxRate: 8.25, discVal: 0, discType: "pct", shipping: 0, paid: 0, depositVal: 30, depositType: "pct" },
      f: {
        fromName: "Summit Craft Remodeling LLC",
        fromDetails: "410 Blake St, Denver, CO 80205 · Lic #CO-99412",
        toName: "Jordan & Maya Alvarez",
        toDetails: "billing@alvarez-home.example",
        jobAddr: "1420 S Emerson St, Denver, CO 80210",
        invNo: "EST-2026-041",
        notes: "Good-faith estimate valid for 30 days. Excludes municipal permit fees and any structural sub-floor or behind-wall plumbing remediation discovered after demolition.",
      },
    },
  },
  {
    title: "Commercial Deep Clean Estimate",
    tag: "Sq Ft + Add-Ons",
    total: "$985.00",
    note: "Weekend after-hours access · Supplies included",
    lines: [
      ["Post-renovation office deep clean (3,200 sq ft @ $0.22)", "$704.00"],
      ["Interior partition glass & window detailing (22 panes)", "$176.00"],
      ["HEPA eco-consumables & floor machine pad kit", "$105.00"],
    ],
    snapshot: {
      type: "estimate",
      tpl: "ruled",
      currency: "USD",
      items: [
        { desc: "Commercial office deep clean", detail: "3,200 sq ft · carpets, restrooms, breakroom, high dusting", qty: 3200, rate: 0.22, tax: false },
        { desc: "Interior glass partitions & entry windows", detail: "Both sides, streak-free squeegee", qty: 22, rate: 8, tax: false },
        { desc: "Commercial HEPA & green cleaning supplies", detail: "Flat consumables kit", qty: 1, rate: 105, tax: false },
      ],
      adj: { taxRate: 0, discVal: 0, discType: "pct", shipping: 0, paid: 0, depositVal: 0, depositType: "pct" },
      f: {
        fromName: "Sparkle Commercial Care",
        fromDetails: "88 Maple Ave, Columbus, OH 43004",
        toName: "Cedar Park Dental Group",
        toDetails: "Suite 210, 400 Cedar Park Dr",
        invNo: "EST-2026-108",
        notes: "Estimate assumes unobstructed Saturday access 8:00 AM – 4:00 PM with building water and power active. Valid for 21 days.",
      },
    },
  },
];

const RECEIPT_EXAMPLES = [
  {
    title: "Cash Payment Receipt (Service / Trade)",
    tag: "PAID in Cash · $0 Balance",
    total: "$285.00",
    note: "Method: Cash on completion · Signed proof of payment",
    lines: [
      ["Emergency garbage disposal replacement — labor", "$165.00"],
      ["1/2 HP Badger disposal unit & P-trap kit", "$120.00"],
    ],
    snapshot: {
      type: "receipt",
      tpl: "compact",
      stamp: "paid",
      currency: "USD",
      items: [
        { desc: "Garbage disposal replacement — labor", detail: "Remove jammed unit, wire & leak-test", qty: 1, rate: 165, tax: false },
        { desc: "1/2 HP disposal unit & PVC discharge kit", detail: "3-year manufacturer warranty", qty: 1, rate: 120, tax: false },
      ],
      adj: { taxRate: 0, discVal: 0, discType: "pct", shipping: 0, paid: 285, depositVal: 0, depositType: "pct" },
      f: {
        fromName: "Oakridge Plumbing & Handyman",
        fromDetails: "742 Evergreen Way, Austin, TX 78745",
        toName: "Marcus Vance",
        toDetails: "89 Rainey St, Unit 12B, Austin, TX",
        invNo: "REC-2026-089",
        payMethod: "Cash",
        notes: "Paid in full in cash upon job completion. 1-year workmanship guarantee.",
      },
    },
  },
  {
    title: "50% Booking Deposit Receipt (Partial Paid)",
    tag: "Deposit Received · Balance Shown",
    total: "$1,200.00 paid of $2,400.00",
    note: "Method: Zelle transfer · Shows remaining $1,200.00 due",
    lines: [
      ["Event photography full-day package (8 hours)", "$2,000.00"],
      ["Edited high-res gallery & print release", "$400.00"],
    ],
    snapshot: {
      type: "receipt",
      tpl: "elegant",
      stamp: "",
      currency: "USD",
      items: [
        { desc: "Full-day event photography coverage", detail: "8 hours on-site, two camera bodies", qty: 1, rate: 2000, tax: false },
        { desc: "High-resolution retouched gallery", detail: "250+ photos delivered within 14 days", qty: 1, rate: 400, tax: false },
      ],
      adj: { taxRate: 0, discVal: 0, discType: "pct", shipping: 0, paid: 1200, depositVal: 0, depositType: "pct" },
      f: {
        fromName: "Lens & Light Studio",
        fromDetails: "14 Harbor St, San Diego, CA 92101",
        toName: "Sarah & Tom Chen",
        toDetails: "October 18 venue booking",
        invNo: "REC-2026-054",
        payMethod: "Zelle (#ZL-88410)",
        notes: "Confirms $1,200.00 (50%) booking retainer received. Remaining $1,200.00 balance due 7 days prior to event.",
      },
    },
  },
];

function loadIntoEditor(snapshot) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bc:load-example", { detail: { snapshot } }));
}

export default function VerticalExamples({ slug }) {
  if (slug === "estimate-generator") {
    return (
      <section className="band alt" id="examples">
        <div className="wrap">
          <div className="eyebrow">Ready-to-use estimate examples</div>
          <h2>Start from a real trade or service estimate in one click.</h2>
          <p className="lead" style={{ maxWidth: 700 }}>
            Pick a pre-built industry example below to load its itemized lines, exclusions note, and deposit
            settings straight into the editor above — then customize any figure and download your PDF.
          </p>
          <div className="vex-grid">
            {ESTIMATE_EXAMPLES.map((ex) => (
              <div className="vex-card" key={ex.title}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <h3 style={{ fontSize: 16.5 }}>{ex.title}</h3>
                    <span className="badge">{ex.tag}</span>
                  </div>
                  <div className="vex-lines">
                    {ex.lines.map(([l, r]) => (
                      <div className="vex-line" key={l}>
                        <span>{l}</span>
                        <strong>{r}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="vex-total">
                    <span>Estimated total</span>
                    <span>{ex.total}</span>
                  </div>
                  <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>{ex.note}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-line btn-sm"
                  onClick={() => loadIntoEditor(ex.snapshot)}
                >
                  Use this example in editor ↑
                </button>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 18 }}>
            Need a fixed-price commitment instead of a projection? Switch to our{" "}
            <Link href="/quote-generator" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
              free quote generator
            </Link>{" "}
            or{" "}
            <Link href="/contractor-estimate-generator" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
              contractor estimate template
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  if (slug === "quote-generator") {
    return (
      <section className="band alt" id="comparison">
        <div className="wrap">
          <div className="eyebrow">Quote vs. Estimate vs. Invoice</div>
          <h2>Which pricing document should you send right now?</h2>
          <p className="lead" style={{ maxWidth: 720 }}>
            Sending an “estimate” when the client needs a fixed budget sign-off — or calling a rough ballpark a
            “quote” — causes avoidable friction. Here is how the three documents differ in practice:
          </p>
          <div className="guide-table-wrap" style={{ marginTop: 22 }}>
            <table className="guide-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Price Quote (This Tool)</th>
                  <th>Job Estimate</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="is-pick">
                  <td><strong>When it is sent</strong></td>
                  <td>Before work starts (defined scope)</td>
                  <td>Before work starts (variable conditions)</td>
                  <td>After approval, milestone, or delivery</td>
                </tr>
                <tr>
                  <td><strong>Can the price change?</strong></td>
                  <td>Fixed for the exact scope until expiration</td>
                  <td>Good-faith projection (±10–20% if conditions vary)</td>
                  <td>Final amount owed for delivered work</td>
                </tr>
                <tr>
                  <td><strong>Key date field</strong></td>
                  <td>Valid Until (typically 14–30 days)</td>
                  <td>Valid Until (typically 14–30 days)</td>
                  <td>Payment Due Date (e.g. Net 14 / Net 30)</td>
                </tr>
                <tr>
                  <td><strong>Accounting impact</strong></td>
                  <td>Not booked as revenue yet</td>
                  <td>Not booked as revenue yet</td>
                  <td>Recorded as Accounts Receivable / Sale</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: 13.5 }}>
            Pricing an open-wall remodel with unknowns? Use the{" "}
            <Link href="/estimate-generator" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
              estimate generator
            </Link>
            . Ready to request payment right away? Go straight to the{" "}
            <Link href="/" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
              free invoice generator
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  if (slug === "receipt-maker" || slug === "rent-receipt-maker") {
    return (
      <section className="band alt" id="examples">
        <div className="wrap">
          <div className="eyebrow">Instant receipt templates &amp; paper scanner</div>
          <h2>Load a cash or deposit receipt example — or scan paper receipts to CSV.</h2>
          {slug === "receipt-maker" && (
            <div className="vex-grid">
              {RECEIPT_EXAMPLES.map((ex) => (
                <div className="vex-card" key={ex.title}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <h3 style={{ fontSize: 16.5 }}>{ex.title}</h3>
                      <span className="badge">{ex.tag}</span>
                    </div>
                    <div className="vex-lines">
                      {ex.lines.map(([l, r]) => (
                        <div className="vex-line" key={l}>
                          <span>{l}</span>
                          <strong>{r}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="vex-total">
                      <span>Receipt status</span>
                      <span>{ex.total}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>{ex.note}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-line btn-sm"
                    onClick={() => loadIntoEditor(ex.snapshot)}
                  >
                    Use this receipt in editor ↑
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="upgrade-banner" style={{ marginTop: 22, marginBottom: 0 }}>
            <div className="txt">
              <strong>Already holding paper receipts or vendor PDFs?</strong> Snap or drop receipt photos to
              extract every item and total into a clean Excel / CSV spreadsheet right in your browser.
            </div>
            <Link className="btn btn-accent btn-sm" href="/receipt-to-csv-converter">
              Scan Receipt Photo to CSV →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
