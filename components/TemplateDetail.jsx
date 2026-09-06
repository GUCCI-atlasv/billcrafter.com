// Single-template pages are deliberately lean — the editor is the point, and the
// long-form SEO content lives on the category hub pages (/templates/c/<slug>).
// This just links to related templates in the same category and up to the hub.
import Link from "next/link";
import { TYPES } from "@/lib/invoice";
import { TEMPLATES, catSlug } from "@/lib/templates";

export default function TemplateDetail({ t }) {
  const related = TEMPLATES.filter((x) => x.slug !== t.slug && x.group === t.group).slice(0, 6);
  return (
    <section className="band">
      <div className="wrap">
        <div className="eyebrow">More like this</div>
        <h2>Others in {t.group}.</h2>
        {related.length > 0 && (
          <div className="tpl-grid">
            {related.map((r) => (
              <Link key={r.slug} className="tpl-card" href={`/templates/${r.slug}`}>
                <div className="mono">{(TYPES[r.docType] || TYPES.invoice).word[0]}</div>
                <div className="nm">{r.name}</div>
                <div className="ds">{r.blurb}</div>
              </Link>
            ))}
          </div>
        )}
        <p className="muted" style={{ fontSize: 13.5, marginTop: 20 }}>
          See all <Link href={`/templates/c/${catSlug(t.group)}`} style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>{t.group} templates</Link>, or{" "}
          <Link href="/templates" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>browse all {TEMPLATES.length} templates</Link>.
        </p>
      </div>
    </section>
  );
}
