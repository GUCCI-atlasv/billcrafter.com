"use client";

import { useState, useRef, useEffect } from "react";
import { LOCALES, DEFAULT_LOCALE, getLocale, swapLocalePath } from "@/lib/i18n";
import Flag from "./Flag";

// NOTE: deliberately does NOT use usePathname(). This component renders inside
// SiteNav/SiteFooter on every page — including on-demand server renders — and we
// don't want it to depend on router context. The current path is read from
// window.location at click time instead, which needs no context at all.

export default function LocaleSwitcher({ locale = DEFAULT_LOCALE, variant = "footer" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const cur = getLocale(locale);

  // Group regions under their language so 14 markets stay scannable.
  const groups = LOCALES.reduce((acc, l) => {
    const g = acc.find(([lang]) => lang === l.lang);
    if (g) g[1].push(l); else acc.push([l.lang, [l]]);
    return acc;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // Server-rendered href is the locale root (always valid, crawlable). On click
  // we upgrade it to "same page, other locale".
  function go(e, code) {
    e.preventDefault();
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    window.location.href = swapLocalePath(path, code);
  }

  return (
    <div className={"locale-switch " + variant} ref={ref}>
      <button
        type="button"
        className="locale-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${cur.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Flag iso={cur.iso} size={19} />
        <span className="lname">{cur.native}</span>
        <svg className="chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <ul className="locale-menu" role="listbox">
          {groups.map(([lang, list]) => (
            <li key={lang} className="locale-group">
              <div className="locale-group-h">{list[0].native}</div>
              {list.map((l) => (
                <a
                  key={l.code}
                  role="option"
                  aria-selected={l.code === locale}
                  className={"locale-item" + (l.code === locale ? " active" : "")}
                  href={l.code === DEFAULT_LOCALE ? "/" : `/${l.code}`}
                  onClick={(e) => go(e, l.code)}
                >
                  <Flag iso={l.iso} size={22} />
                  <span className="txt">
                    <span className="n">{l.country}</span>
                    <span className="c">{l.currency}{l.vat ? ` · ${l.taxLabel} ${l.vat}%` : ` · ${l.taxLabel}`}</span>
                  </span>
                  {l.code === locale && (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </a>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
