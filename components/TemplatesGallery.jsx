"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TEMPLATES, TEMPLATE_GROUPS } from "@/lib/templates";
import TemplatePreview from "./TemplatePreview";

const DOC_TABS = [
  ["All", "All documents"],
  ["invoice", "Invoices"],
  ["estimate", "Estimates"],
  ["quote", "Quotes"],
  ["receipt", "Receipts"],
];
const DOC_LABEL = { invoice: "Invoice", estimate: "Estimate", quote: "Quote", receipt: "Receipt" };

export default function TemplatesGallery() {
  const [doc, setDoc] = useState("All");
  const [group, setGroup] = useState("All");

  const rows = useMemo(
    () =>
      TEMPLATES.filter(
        (t) => (doc === "All" || t.docType === doc) && (group === "All" || t.group === group)
      ),
    [doc, group]
  );

  return (
    <>
      <div className="tpl-filters">
        <div className="tpl-tabs doc">
          {DOC_TABS.map(([k, label]) => (
            <button key={k} className={"tpl-tab" + (doc === k ? " active" : "")} onClick={() => setDoc(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="tpl-tabs">
          {TEMPLATE_GROUPS.map((g) => (
            <button key={g} className={"chip" + (group === g ? " active" : "")} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
        <div className="tpl-count">
          {rows.length} template{rows.length === 1 ? "" : "s"} · free to edit · PDF download
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="empty-box">
          <h3>No templates match</h3>
          <div>Try a different document type or industry.</div>
        </div>
      ) : (
        <div className="tpl-lib">
          {rows.map((t) => (
            <Link key={t.slug} className="tpl-lib-card" href={`/templates/${t.slug}`}>
              <div className="tpl-preview-wrap">
                <TemplatePreview t={t} />
                <span className="tpl-badge" style={{ background: t.accent }}>{DOC_LABEL[t.docType]}</span>
                <span className="tpl-cta">Use this template</span>
              </div>
              <div className="tpl-lib-meta">
                <div className="nm">{t.name}</div>
                <div className="ds">{t.blurb}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
