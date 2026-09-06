"use client";

// Soft language suggestion — never a redirect.
//
// Why client-side (not Accept-Language on the server): reading request headers
// would opt every marketing page out of static rendering, which hurts SEO and
// worsens the on-demand-render latency we already fight. navigator.languages
// carries the same preference the browser puts in Accept-Language, so we detect
// in the browser and keep every page static and crawlable.
//
// Behavior: if the visitor's browser prefers a *different language* than the one
// this page is in, show a small dismissible bar — in that language — offering to
// switch. We only prompt on a language difference (never for en -> en-GB style
// region tweaks). The choice is remembered in a cookie so we never nag twice.
import { useEffect, useState } from "react";
import { getLocale, matchLocale, swapLocalePath, t, DEFAULT_LOCALE } from "@/lib/i18n";
import Flag from "./Flag";

const COOKIE = "bc_lang";
const readCookie = (name) =>
  (typeof document !== "undefined" ? document.cookie : "")
    .split("; ")
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
const writeCookie = (name, val) => {
  // 1 year, site-wide, lax so it survives the top-level navigation.
  document.cookie = `${name}=${val}; path=/; max-age=31536000; samesite=lax`;
};

export default function LangBanner({ current = DEFAULT_LOCALE }) {
  const [target, setTarget] = useState(null); // locale object to suggest, or null

  useEffect(() => {
    // Respect a prior decision (chosen a language, or dismissed the bar).
    if (readCookie(COOKIE)) return;

    const langs =
      (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
    const code = matchLocale(langs);
    if (!code) return;

    // Only prompt when the *language* differs — region-only differences aren't
    // worth interrupting for.
    if (getLocale(code).lang === getLocale(current).lang) return;
    setTarget(getLocale(code));
  }, [current]);

  if (!target) return null;

  const go = () => {
    writeCookie(COOKIE, target.code);
    window.location.href = swapLocalePath(window.location.pathname, target.code);
  };
  const dismiss = () => {
    writeCookie(COOKIE, "x"); // declined — don't ask again
    setTarget(null);
  };

  return (
    <div className="lang-banner" role="region" aria-label="Language suggestion">
      <div className="wrap">
        <Flag iso={target.iso} size={20} />
        <span className="lb-text">{t(target.code, "banner.prompt")}</span>
        <button type="button" className="lb-switch" onClick={go}>
          {target.native} · {t(target.code, "banner.switch")}
        </button>
        <button type="button" className="lb-x" onClick={dismiss} aria-label={t(target.code, "banner.dismiss")}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
