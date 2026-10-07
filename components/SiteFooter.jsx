import Link from "next/link";
import { LogoMark } from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { t, localePath, DEFAULT_LOCALE } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

// Industry links (Freelance, Contractor, …) point at English-only template pages,
// so their labels stay English — see the note in lib/marketingI18n.js.
//
// This is a curated shortlist, not an index — the footer appears on every page,
// so it's the strongest internal link on the site and worth spending on the
// guides that carry real search demand. "Hourly" and "Handyman" earn their place
// on volume; the full set is reachable from the rotating module at the foot of
// every guide, and from /templates.
const INDUSTRIES = [
  ["/freelance-invoice-generator", "Freelance"],
  ["/contractor-invoice-generator", "Contractor"],
  ["/handyman-invoice-template", "Handyman"],
  ["/consulting-invoice-generator", "Consulting"],
  ["/hourly-invoice", "Hourly"],
  ["/photography-invoice-template", "Photography"],
  ["/cleaning-invoice-template", "Cleaning"],
  ["/small-business-invoice-generator", "Small business"],
];

export default function SiteFooter({ locale = DEFAULT_LOCALE }) {
  const L = (k) => t(locale, k);
  const { foot } = mktg(locale);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <span className="logo" style={{ color: "#fff" }}><LogoMark /> BillCrafter</span>
            <p style={{ fontSize: 13.5, color: "#A9ADB4", maxWidth: 280, marginTop: 12, lineHeight: 1.6 }}>
              {L("foot.tagline")}
            </p>
            <p style={{ fontSize: 12, color: "#8B8F96", marginTop: 14 }}>{foot.operated}</p>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "#8B8F96", marginBottom: 6, fontWeight: 600 }}>
                {L("foot.language")}
              </div>
              <LocaleSwitcher locale={locale} />
            </div>
          </div>
          <div className="foot-col">
            <div className="foot-h">{foot.product}</div>
            <Link href="/">{foot.invoiceGen}</Link>
            <Link href="/quote-generator">{foot.quoteGen}</Link>
            <Link href="/estimate-generator">{foot.estimateGen}</Link>
            <Link href="/receipt-maker">{foot.receiptMaker}</Link>
            {/* English-only guide, so an English label like INDUSTRIES below. Sitewide
                anchor for "bill generator" — those queries were landing on / instead. */}
            <Link href="/bill-generator">Bill generator</Link>
            <Link href="/templates">{foot.allTemplates}</Link>
          </div>
          <div className="foot-col">
            <div className="foot-h">{foot.templates}</div>
            {INDUSTRIES.map(([href, label]) => (<Link key={href} href={href}>{label}</Link>))}
            <Link href="/templates">{foot.browseAll}</Link>
          </div>
          <div className="foot-col">
            <div className="foot-h">{foot.company}</div>
            <Link href={localePath(locale, "/about")}>{foot.about}</Link>
            <Link href="/changelog">{foot.changelog}</Link>
            <Link href="/contact">{foot.contact}</Link>
            <Link href="/invoicemanager">{foot.manager}</Link>
            <Link href="/login">{foot.login}</Link>
            <Link href="/signup">{foot.signup}</Link>
            <a href="mailto:support@billcrafter.com">support@billcrafter.com</a>
          </div>
          <div className="foot-col">
            <div className="foot-h">{foot.legal}</div>
            <Link href="/terms">{foot.terms}</Link>
            <Link href="/privacy">{foot.privacy}</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{foot.rights}</span>
          <span>
            <Link href="/terms">{foot.termsShort}</Link>
            {" · "}
            <Link href="/privacy">{foot.privacyShort}</Link>
            {" · "}
            <Link href="/contact">{foot.contactShort}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
