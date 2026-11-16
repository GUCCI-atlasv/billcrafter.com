// Read-only render of a saved invoice snapshot. Uses the same .sheet CSS as the
// editor, so a shared link and the server-rendered vector PDF look identical to
// what the user designed on screen.
import { money, computeTotals, sectionSubtotal, currencyDecimals, roundMoney, taxModeOf } from "@/lib/invoice";
import { docType, t, intlTag, localeTaxLabel, stampLabel } from "@/lib/i18n";
import { edCopy } from "@/lib/editorI18n";

export default function InvoiceView({ doc, locale = "en" }) {
  const d = doc || {};
  const f = d.f || {};
  const items = Array.isArray(d.items) ? d.items : [];
  const schedule = Array.isArray(d.schedule) ? d.schedule : [];
  const photos = Array.isArray(d.photos) ? d.photos : [];
  const adj = d.adj || {};
  const docTypeKey = d.type || "invoice";
  const ty = docType(locale, docTypeKey);
  const L = (k) => t(locale, k);
  const E = edCopy(locale);
  const INTL = intlTag(locale);
  const TAXL = localeTaxLabel(locale);
  const cur = d.currency || "USD";
  const dec = currencyDecimals(cur);
  const fmt = (n) => money(n, cur, INTL);
  const fmtDMY = (iso) => {
    if (!iso) return "";
    const dt = new Date(iso + "T00:00:00");
    return isNaN(dt) ? iso : dt.toLocaleDateString(INTL);
  };
  // A shared link is the client's copy of this document — it has to show the
  // arithmetic the record was billed with, not whatever the current code does.
  // Records saved before the 2026-08 tax fix carry no taxMode and stay on the
  // old figures; anything newer is stamped "net".
  const totals = computeTotals(items, { ...adj, decimals: dec, taxMode: taxModeOf(d) });
  const isReceipt = docTypeKey === "receipt";
  const hasDates = Boolean(f.timesheet || items.some((it) => it.section === undefined && it.date));
  const totalHours = items.reduce((n, it) => it.section === undefined && it.date ? n + (Number(it.qty) || 0) : n, 0);
  // Default is branding-free: footer attribution renders only if the user
  // explicitly opted in (hideBrandFoot === false).
  const showBrandFootLink = d.hideBrandFoot === false;
  const showBrandFoot = showBrandFootLink || Boolean(d.shareUrl);

  return (
    <div className={"sheet " + (d.tpl || "modern")} style={{ ["--accent"]: d.accent || "#16181C" }}>
      {d.stamp ? <div className={"stamp stamp-" + d.stamp} aria-hidden="true">{stampLabel(locale, d.stamp)}</div> : null}

      <div className="inv-head">
        <div className="brandblock">
          {d.logo ? <img src={d.logo} alt="" style={{ maxHeight: 54, maxWidth: 150, objectFit: "contain", marginBottom: 10 }} /> : null}
          <div className="se biz">{f.fromName || "—"}</div>
          {f.fromDetails ? <div className="se dets" style={{ color: "#6E747A", whiteSpace: "pre-line" }}>{f.fromDetails}</div> : null}
        </div>
        <div className="inv-meta">
          <div className="inv-word">{ty.word}</div>
          <div className="metarow"><span>{L("doc.no")}</span> <span className="metaval">{f.invNo}</span></div>
          <div className="metarow"><span>{L("doc.issued")}</span> <span className="metaval">{fmtDMY(f.issueDate)}</span></div>
          <div className="metarow"><span>{ty.d2}</span> <span className="metaval">{fmtDMY(f.dueDate)}</span></div>
          {f.poNo ? <div className="metarow"><span>{L("doc.po")}</span> <span className="metaval">{f.poNo}</span></div> : null}
          {ty.method && f.payMethod ? <div className="metarow"><span>{L("doc.method")}</span> <span className="metaval">{f.payMethod}</span></div> : null}
        </div>
      </div>

      <div className="billto">
        <div className="tag">{ty.party}</div>
        <div className="se cli">{f.toName || "—"}</div>
        {f.toDetails ? <div className="se dets" style={{ color: "#6E747A", whiteSpace: "pre-line" }}>{f.toDetails}</div> : null}
      </div>

      {f.jobAddr ? (
        <div className="jobsite">
          <div className="tag">{L("doc.jobsite")}</div>
          <div className="se dets" style={{ whiteSpace: "pre-line" }}>{f.jobAddr}</div>
        </div>
      ) : null}

      {(f.svcFrom || f.svcTo || f.svcFreq || f.svcScope) ? (
        <div className="svc-period">
          <div className="tag">{L("doc.servicePeriod")}</div>
          <div className="svc-row">
            <span className="svc-range">{[fmtDMY(f.svcFrom), fmtDMY(f.svcTo)].filter(Boolean).join(" – ")}</span>
            {f.svcFreq ? (
              <span className="svc-freq-wrap">
                <span className="svc-lb">{L("doc.frequency")}</span>
                <span>{f.svcFreq}</span>
              </span>
            ) : null}
          </div>
          {f.svcScope ? <div className="se dets" style={{ whiteSpace: "pre-line" }}>{f.svcScope}</div> : null}
        </div>
      ) : null}

      <table className="inv">
        <thead>
          <tr>
            {hasDates ? <th className="col-date">{L("doc.date")}</th> : null}
            <th className="col-desc">{L("doc.description")}</th>
            <th className="num col-qty">{hasDates ? L("doc.hours") : L("doc.qty")}</th>
            <th className="num col-rate">{L("doc.rate")}</th>
            <th className="num col-amt">{L("doc.amount")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, n) => it.section !== undefined ? (
            <tr key={n} className="sec-row">
              <td colSpan={hasDates ? 4 : 3} className="sec-cell">
                <div className="se sec-name">{it.section}</div>
              </td>
              <td className="amount-cell sec-sub">{fmt(sectionSubtotal(items, n, dec))}</td>
            </tr>
          ) : (
            <tr key={n}>
              {hasDates ? <td className="col-date">{fmtDMY(it.date)}</td> : null}
              <td><div>{it.desc}</div>{it.detail ? <div className="it-detail" style={{ whiteSpace: "pre-line" }}>{it.detail}</div> : null}</td>
              <td className="num" style={{ textAlign: "right" }}>{it.qty}</td>
              <td className="num" style={{ textAlign: "right" }}>{fmt(it.rate)}</td>
              <td className="amount-cell">{fmt(roundMoney((it.qty || 0) * (it.rate || 0), dec))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <table><tbody>
          {hasDates && totalHours > 0 ? <tr className="hours-row"><td>{L("doc.totalHours")}</td><td className="num">{Number(totalHours.toFixed(2))}</td></tr> : null}
          <tr><td>{L("doc.subtotal")}</td><td className="num">{fmt(totals.subtotal)}</td></tr>
          {totals.discAmt ? <tr><td>{L("doc.discount")}</td><td className="num">−{fmt(totals.discAmt)}</td></tr> : null}
          {Number(adj.taxRate) ? <tr><td>{TAXL} ({adj.taxRate}%)</td><td className="num">{fmt(totals.taxAmt)}</td></tr> : null}
          {totals.ship ? <tr><td>{L("doc.shipping")}</td><td className="num">{fmt(totals.ship)}</td></tr> : null}
          <tr className="grand"><td>{ty.total}</td><td className="num">{fmt(totals.total)}</td></tr>
          {!isReceipt && totals.depositAmt > 0 ? (
            <tr className="due dep"><td>{L("doc.depositDue")}{adj.depositType === "pct" ? ` (${adj.depositVal}%)` : ""}</td><td className="num">{fmt(totals.depositAmt)}</td></tr>
          ) : null}
          {(Number(adj.paid) || isReceipt) ? (<>
            <tr><td>{L("doc.amountPaid")}</td><td className="num">−{fmt(roundMoney(adj.paid, dec))}</td></tr>
            <tr className="due">
              <td>{isReceipt && Math.abs(totals.due) < 0.005 ? L("doc.paidInFull") : L("doc.balanceDue")}</td>
              <td className="num">{fmt(totals.due)}</td>
            </tr>
          </>) : null}
        </tbody></table>
      </div>

      {(schedule.length > 0 || f.payNote || f.notes || photos.length > 0 || d.sig?.png) ? (
        <div className="inv-foot">
          {schedule.length > 0 ? (
            <div className="pay-sched">
              <span className="tag">{L("doc.schedule")}</span>
              <table className="ps-table"><tbody>
                {schedule.map((row, i) => (
                  <tr key={i}>
                    <td className="ps-label">{row.label}</td>
                    <td className="ps-due">{fmtDMY(row.due)}</td>
                    <td className="ps-amt num">{fmt(Number(row.amount) || 0)}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          ) : null}
          {f.payNote ? (<><span className="tag">{L("doc.payment")}</span><div style={{ fontSize: 12.5, whiteSpace: "pre-line" }}>{f.payNote}</div></>) : null}
          {f.notes ? (<><span className="tag" style={{ marginTop: 10 }}>{L("doc.notes")}</span><div style={{ fontSize: 12.5, whiteSpace: "pre-line" }}>{f.notes}</div></>) : null}
          {photos.length > 0 ? (
            <div className="photos-block">
              <span className="tag">{L("doc.photos")}</span>
              <div className="photos-grid">
                {photos.map((p, i) => (
                  <figure key={i} className="ph">
                    <img src={p.src} alt={p.cap || "Job photo"} />
                    {p.cap ? <figcaption className="ph-cap-print" style={{ display: "block" }}>{p.cap}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
          {d.sig?.png ? (
            <div className="sig-block">
              <img className="sig-block-img" src={d.sig.png} alt={`Signature of ${d.sig.name}`} />
              <div className="sig-block-line" />
              <div className="sig-block-meta">
                <span className="sig-block-name">{d.sig.name}</span>
                <span className="sig-block-date">{fmtDMY((d.sig.at || "").slice(0, 10))}</span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showBrandFoot ? (
        <div className="doc-brand-foot">
          <div className="dbf-links">
            {d.shareUrl ? (
              <>
                <span>{E.viewOnline} <a href={d.shareUrl}>{String(d.shareUrl).replace(/^https?:\/\//, "")}</a></span>
                {showBrandFootLink ? <span className="dbf-sep">·</span> : null}
              </>
            ) : null}
            {showBrandFootLink ? (
              <a href="https://billcrafter.com">{E.poweredBy}</a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
