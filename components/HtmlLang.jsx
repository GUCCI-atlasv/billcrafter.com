"use client";

import { useEffect } from "react";
import { getLocale, DEFAULT_LOCALE } from "@/lib/i18n";

// Sets <html lang> to the locale actually being displayed.
//
// Why this is a client component and not a header read in the root layout:
// `<html>` can only be emitted by app/layout.jsx, and the only way that layout
// could know the locale is `headers()` — which opts every route out of static
// generation. This site is fully prerendered onto Cloudflare, so paying that
// cost site-wide to fix one attribute is the wrong trade.
//
// What this does fix is the part that actually harms users: a screen reader
// reading Japanese copy with an English voice, because it goes by the live DOM.
// Google renders JavaScript and will see the corrected value too. The raw HTML
// still ships lang="en" for non-rendering crawlers — hreflang, which is the
// signal search engines use for language targeting, is correct and server-side.
export default function HtmlLang({ locale = DEFAULT_LOCALE }) {
  useEffect(() => {
    const l = getLocale(locale);
    // hreflang is the closest thing we hold to a BCP-47 tag per market
    // ("pt-BR", "zh-Hant-HK"), which is exactly what lang wants.
    const tag = l.hreflang || l.code || DEFAULT_LOCALE;
    const prev = document.documentElement.lang;
    document.documentElement.lang = tag;
    return () => { document.documentElement.lang = prev; };
  }, [locale]);
  return null;
}
