import { t } from "@/lib/i18n";

// Above-the-fold call to action on the home pages: jumps to the editor (which
// sits just below the hero) and states the guest export allowance up front, so
// nobody is surprised by it at the download button.
export default function HeroCta({ locale }) {
  return (
    <div className="hero-cta">
      <a className="btn btn-solid" href="#editor">{t(locale, "home.cta")} <span aria-hidden="true">↓</span></a>
      <span className="hero-quota">{t(locale, "home.quota")}</span>
    </div>
  );
}
