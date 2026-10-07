import Link from "next/link";
import { Logo } from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import LangBanner from "./LangBanner";
import { t, localePath, DEFAULT_LOCALE } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

export default function SiteNav({ locale = DEFAULT_LOCALE }) {
  const L = (k) => t(locale, k);
  const p = (path) => localePath(locale, path);
  const { nav } = mktg(locale);
  return (
    <header className="site-nav">
      <LangBanner current={locale} />
      <div className="wrap row">
        <Link href={p("/")} className="logo" aria-label="BillCrafter home"><Logo /></Link>
        <nav className="nav-links">
          {/* Templates, About are English-only pages — link plain (no locale prefix,
              which would 404 since only the home page is localized). */}
          <Link href="/templates">{L("nav.templates")}</Link>
          <Link href={p("/#features")}>{nav.features}</Link>
          <Link href={p("/#faq")}>{nav.guide}</Link>
          <Link href={p("/about")}>{nav.about}</Link>
        </nav>
        <div className="nav-cta">
          <LocaleSwitcher locale={locale} variant="nav" />
          <Link className="link-text" href="/login">{L("nav.login")}</Link>
          <Link className="btn btn-solid" href="/signup">{L("nav.signup")}</Link>
        </div>
      </div>
    </header>
  );
}
