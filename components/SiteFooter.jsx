import Link from "next/link";
import { LogoMark } from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { t, localePath, DEFAULT_LOCALE, TIER1_OCR_LOCALES, primaryLocaleOf } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

// Curated shortlist of high-demand vertical pages (including previously unlinked
// Attorney & Tutoring pages so Google indexes all 18 verticals promptly).
const INDUSTRIES = [
  ["/freelance-invoice-generator", "Freelance"],
  ["/contractor-invoice-generator", "Contractor"],
  ["/contractor-estimate-generator", "Contractor estimate"],
  ["/handyman-invoice-template", "Handyman"],
  ["/rent-receipt-maker", "Rent receipt"],
  ["/freelance-design-quote-generator", "Design & photo quote"],
  ["/consulting-invoice-generator", "Consulting"],
  ["/hourly-invoice", "Hourly"],
  ["/attorney-invoice-template", "Attorney / legal"],
  ["/tutoring-invoice-template", "Tutoring"],
  ["/photography-invoice-template", "Photography"],
  ["/cleaning-invoice-template", "Cleaning"],
  ["/small-business-invoice-generator", "Small business"],
];

export default function SiteFooter({ locale = DEFAULT_LOCALE }) {
  const L = (k) => t(locale, k);
  const { foot } = mktg(locale);
  const isEn = locale === DEFAULT_LOCALE;
  const enTag = isEn ? "" : " (EN)";
  const primary = primaryLocaleOf(locale);
  const ocrPrefix =
    isEn
      ? ""
      : TIER1_OCR_LOCALES.includes(locale)
      ? `/${locale}`
      : TIER1_OCR_LOCALES.includes(primary)
      ? `/${primary}`
      : "";
  const ocrIsEn = !isEn && !ocrPrefix;
  const ocrTag = ocrIsEn ? " (EN)" : "";

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <span className="logo" style={{ color: "#fff" }}>
              <LogoMark /> BillCrafter
            </span>
            <p style={{ fontSize: 13.5, color: "#A9ADB4", maxWidth: 280, marginTop: 12, lineHeight: 1.6 }}>
              {L("foot.tagline")}
            </p>
            <p style={{ fontSize: 12, color: "#8B8F96", marginTop: 14 }}>{foot.operated}</p>
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "#8B8F96",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {L("foot.language")}
              </div>
              <LocaleSwitcher locale={locale} />
            </div>
          </div>

          <div className="foot-col">
            <div className="foot-h">{foot.product}</div>
            <Link href={localePath(locale, "/")}>{foot.invoiceGen}</Link>
            <Link href={`${ocrPrefix}/invoice-ocr-scanner`}>{foot.ocrScanner}{ocrTag}</Link>
            <Link href={`${ocrPrefix}/receipt-to-csv-converter`}>{foot.receiptCsv}{ocrTag}</Link>
            <Link href="/invoice-to-excel-converter">{foot.invoiceExcel}{enTag}</Link>
            <Link href="/quote-generator">{foot.quoteGen}{enTag}</Link>
            <Link href="/estimate-generator">{foot.estimateGen}{enTag}</Link>
            <Link href="/receipt-maker">{foot.receiptMaker}{enTag}</Link>
            <Link href="/bill-generator">{foot.billGen}{enTag}</Link>
            <Link href="/templates">{foot.allTemplates}{enTag}</Link>
          </div>

          <div className="foot-col">
            <div className="foot-h">{foot.templates}{enTag}</div>
            {INDUSTRIES.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <Link href="/templates">{foot.browseAll}</Link>
          </div>

          <div className="foot-col">
            <div className="foot-h">{foot.company}</div>
            <Link href="/guides">{foot.guides}{enTag}</Link>
            <Link href="/guides/billing-and-ocr-help-guide">{foot.helpGuide}{enTag}</Link>
            <Link href="/guides/best-free-invoice-ocr-software">{foot.ocrGuide}{enTag}</Link>
            <Link href="/guides/how-to-scan-receipts-to-excel">{foot.receiptGuide}{enTag}</Link>
            <Link href={localePath(locale, "/about")}>{foot.about}</Link>
            <Link href="/changelog">{foot.changelog}{enTag}</Link>
            <Link href="/contact">{foot.contact}{enTag}</Link>
            <Link href="/invoicemanager">{foot.manager}{enTag}</Link>
            <Link href="/login">{foot.login}{enTag}</Link>
            <Link href="/signup">{foot.signup}{enTag}</Link>
            <a href="mailto:support@billcrafter.com">support@billcrafter.com</a>
          </div>

          <div className="foot-col">
            <div className="foot-h">{foot.legal}{enTag}</div>
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
