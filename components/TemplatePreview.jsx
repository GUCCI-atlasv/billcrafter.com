// A true-to-life miniature of a template. It renders the SAME markup and the SAME
// .sheet.{style} CSS the real editor uses, scaled down — so what you see in the
// gallery is exactly what you get when you open it. No screenshot assets needed.
import { SCENARIOS, TYPES, money } from "@/lib/invoice";

const CLIENTS = {
  freelance: "Northwind Co.",
  contractor: "The Delgado Residence",
  consulting: "Acme Holdings",
  photography: "Sarah & Tom Chen",
  videography: "Lumen Media",
  design: "Fable Studio",
  cleaning: "Cedar Park Offices",
  smallbusiness: "Riverbend Cafe",
  plumbing: "M. Okafor",
  hvac: "Bright Valley HOA",
  retail: "Walk-in customer",
  rent: "Unit 4B — J. Park",
  tutoring: "The Nguyen Family",
  catering: "Vertex Corp Events",
};

export default function TemplatePreview({ t }) {
  const s = SCENARIOS[t.scenario] || SCENARIOS.freelance;
  const ty = TYPES[t.docType] || TYPES.invoice;
  const items = (s.items || []).slice(0, 3);

  const subtotal = items.reduce((n, i) => n + (i.qty || 0) * (i.rate || 0), 0);
  const taxAmt = subtotal * ((s.tax || 0) / 100);
  const total = subtotal + taxAmt;
  const client = CLIENTS[t.scenario] || "Northwind Co.";

  return (
    <div className="tpl-preview" aria-hidden="true">
      <div className="tpl-scaler">
        <div className={"sheet " + t.style} style={{ ["--accent"]: t.accent }}>
          <div className="inv-head">
            <div className="brandblock">
              <div className="tpl-logo-ph" />
              <div className="se biz">{s.name || "Your business"}</div>
              <div style={{ fontSize: 11.5, color: "#6E747A", whiteSpace: "pre-line", marginTop: 2 }}>
                {(s.details || "").split("\n")[0]}
              </div>
            </div>
            <div className="inv-meta">
              <div className="inv-word">{ty.word}</div>
              <div className="metarow"><span>No.</span> {ty.prefix}-0042</div>
              <div className="metarow"><span>Issued</span> Jul 8, 2026</div>
              <div className="metarow"><span>{ty.d2}</span> Jul 22, 2026</div>
            </div>
          </div>

          <div className="billto">
            <div className="tag">{ty.party}</div>
            <div className="se cli">{client}</div>
            <div style={{ fontSize: 11.5, color: "#6E747A" }}>accounts@example.com</div>
          </div>

          <table className="inv">
            <thead>
              <tr>
                <th>Description</th>
                <th className="num">Qty</th>
                <th className="num">Rate</th>
                <th className="num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, n) => (
                <tr key={n}>
                  <td>
                    <div>{i.desc}</div>
                    {i.detail ? <div className="it-detail">{i.detail}</div> : null}
                  </td>
                  <td className="num" style={{ textAlign: "right" }}>{i.qty}</td>
                  <td className="num" style={{ textAlign: "right" }}>{money(i.rate)}</td>
                  <td className="amount-cell">{money((i.qty || 0) * (i.rate || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals">
            <table>
              <tbody>
                <tr><td>Subtotal</td><td className="num">{money(subtotal)}</td></tr>
                {s.tax ? <tr><td>Tax ({s.tax}%)</td><td className="num">{money(taxAmt)}</td></tr> : null}
                <tr className="grand"><td>{ty.total}</td><td className="num">{money(total)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="inv-foot">
            <span className="tag">Notes</span>
            <div style={{ fontSize: 11.5, color: "#5b6066" }}>{s.notes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
