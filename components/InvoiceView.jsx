// Read-only render of a saved invoice snapshot. Uses the same .sheet CSS as the
// editor, so a shared link looks exactly like the PDF the client would receive.
import { money, computeTotals, currencyDecimals, taxModeOf } from "@/lib/invoice";
import { docType, t, intlTag, localeTaxLabel, stampLabel } from "@/lib/i18n";

export default function InvoiceView({ doc, locale = "en" }) {
  const d = doc || {};
  const f = d.f || {};
  const items = Array.isArray(d.items) ? d.items : [];
  const adj = d.adj || {};
  const ty = docType(locale, d.type || "invoice");
  const L = (k) => t(locale, k);
  const INTL = intlTag(locale);
  const TAXL = localeTaxLabel(locale);
  const cur = d.currency || "USD";
  const fmt = (n) => money(n, cur, INTL);
  // A shared link is the client's copy of this document — it has to show the
  // arithmetic the record was billed with, not whatever the current code does.
  // Records saved before the 2026-08 tax fix carry no taxMode and stay on the
  // old figures; anything newer is stamped "net".
  const totals = computeTotals(items, { ...adj, decimals: currencyDecimals(cur), taxMode: taxModeOf(d) });
  const isReceipt = (d.type || "invoice") === "receipt";

  return (
    <div className={"sheet " + (d.tpl || "modern")} style={{ ["--accent"]: d.accent || "#16181C" }}>
      {d.stamp ? <div className={"stamp stamp-" + d.stamp} aria-hidden="true">{stampLabel(locale, d.stamp)}</div> : null}

      <div className="inv-head">
        <div className="brandblock">
          {d.logo ? <img src={d.logo} alt="" style={{ maxHeight: 54, maxWidth: 150, objectFit: "contain", marginBottom: 10 }} /> : null}
          <div className="se biz">{f.fromName || "—"}</div>
          <div style={{ fontSize: 12.5, color: "#6E747A", whiteSpace: "pre-line" }}>{f.fromDetails}</div>
        </div>
        <div className="inv-meta">
          <div className="inv-word">{ty.word}</div>
          <div className="metarow"><span>{L("doc.no")}</span> {f.invNo}</div>
          <div className="metarow"><span>{L("doc.issued")}</span> {f.issueDate}</div>
          <div className="metarow"><span>{ty.d2}</span> {f.dueDate}</div>
          {f.poNo ? <div className="metarow"><span>{L("doc.po")}</span> {f.poNo}</div> : null}
        </div>
      </div>

      <div className="billto">
        <div className="tag">{ty.party}</div>
        <div className="se cli">{f.toName || "—"}</div>
        <div style={{ fontSize: 12.5, color: "#6E747A", whiteSpace: "pre-line" }}>{f.toDetails}</div>
      </div>

      <table className="inv">
        <thead>
          <tr>
            <th>{L("doc.description")}</th>
            <th className="num">{L("doc.qty")}</th>
            <th className="num">{L("doc.rate")}</th>
            <th className="num">{L("doc.amount")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, n) => (
            <tr key={n}>
              <td><div>{i.desc}</div>{i.detail ? <div className="it-detail">{i.detail}</div> : null}</td>
              <td className="num" style={{ textAlign: "right" }}>{i.qty}</td>
              <td className="num" style={{ textAlign: "right" }}>{fmt(i.rate)}</td>
              <td className="amount-cell">{fmt((i.qty || 0) * (i.rate || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <table><tbody>
          <tr><td>{L("doc.subtotal")}</td><td className="num">{fmt(totals.subtotal)}</td></tr>
          {totals.discAmt ? <tr><td>{L("doc.discount")}</td><td className="num">−{fmt(totals.discAmt)}</td></tr> : null}
          {Number(adj.taxRate) ? <tr><td>{TAXL} ({adj.taxRate}%)</td><td className="num">{fmt(totals.taxAmt)}</td></tr> : null}
          {totals.ship ? <tr><td>{L("doc.shipping")}</td><td className="num">{fmt(totals.ship)}</td></tr> : null}
          <tr className="grand"><td>{ty.total}</td><td className="num">{fmt(totals.total)}</td></tr>
          {(Number(adj.paid) || isReceipt) ? (<>
            <tr><td>{L("doc.amountPaid")}</td><td className="num">−{fmt(adj.paid)}</td></tr>
            <tr className="due">
              <td>{isReceipt && Math.abs(totals.due) < 0.005 ? L("doc.paidInFull") : L("doc.balanceDue")}</td>
              <td className="num">{fmt(totals.due)}</td>
            </tr>
          </>) : null}
        </tbody></table>
      </div>

      {(f.payNote || f.notes) ? (
        <div className="inv-foot">
          {f.payNote ? (<><span className="tag">{L("doc.payment")}</span><div style={{ fontSize: 12.5, whiteSpace: "pre-line" }}>{f.payNote}</div></>) : null}
          {f.notes ? (<><span className="tag" style={{ marginTop: 10 }}>{L("doc.notes")}</span><div style={{ fontSize: 12.5, whiteSpace: "pre-line" }}>{f.notes}</div></>) : null}
        </div>
      ) : null}
    </div>
  );
}
