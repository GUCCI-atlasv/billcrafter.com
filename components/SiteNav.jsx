import Link from "next/link";
import { Logo } from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import LangBanner from "./LangBanner";
import { t, localePath, DEFAULT_LOCALE, TIER1_OCR_LOCALES, primaryLocaleOf } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

export default function SiteNav({ locale = DEFAULT_LOCALE }) {
  const L = (k) => t(locale, k);
  const p = (path) => localePath(locale, path);
  const { nav } = mktg(locale);

  const isEn = locale === DEFAULT_LOCALE;
  const primary = primaryLocaleOf(locale);
  const ocrIsLocalized =
    isEn || TIER1_OCR_LOCALES.includes(locale) || TIER1_OCR_LOCALES.includes(primary);
  const ocrHref =
    isEn
      ? "/invoice-ocr-scanner"
      : TIER1_OCR_LOCALES.includes(locale)
      ? `/${locale}/invoice-ocr-scanner`
      : TIER1_OCR_LOCALES.includes(primary)
      ? `/${primary}/invoice-ocr-scanner`
      : "/invoice-ocr-scanner";
  const enTag = !isEn ? <span className="nav-lang-en" aria-label="(English)">EN</span> : null;

  return (
    <header className="site-nav">
      <LangBanner current={locale} />
      <div className="wrap row">
        <Link href={p("/")} className="logo" aria-label="BillCrafter home">
          <Logo />
        </Link>
        <nav className="nav-links">
          <Link href={ocrHref}>
            {L("nav.ocr")}<span className="nav-pill">AI</span>{!ocrIsLocalized ? enTag : null}
          </Link>
          <Link href="/templates">{L("nav.templates")}{enTag}</Link>
          <Link href="/guides">{nav.guide}{enTag}</Link>
          <Link href={p("/#features")}>{nav.features}</Link>
          <Link href={p("/about")}>{nav.about}</Link>
        </nav>
        <div className="nav-cta">
          <Link className="nav-ocr-mobile" href={ocrHref}>
            OCR{!ocrIsLocalized ? enTag : null}
          </Link>
          <LocaleSwitcher locale={locale} variant="nav" />
          <Link className="link-text" href="/login">
            {L("nav.login")}{enTag}
          </Link>
          <Link className="btn btn-solid" href="/signup">
            {L("nav.signup")}{enTag}
          </Link>
        </div>
      </div>
    </header>
  );
}
