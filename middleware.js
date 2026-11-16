import { NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale, primaryLocaleOf } from "./lib/i18n";
import { aboutHasOwnUrl, aboutUrlFor } from "./lib/aboutI18n";
import { OCR_TIER1_LOCALES } from "./lib/ocrSeo";

// One canonical host (`billcrafter.com`) + clean localized routing that serves
// prerendered SSG HTML with the exact `<html lang="...">` attribute per locale
// via `app/(locale)/i18n/[locale]` without invoking `headers()` in layouts.
const CANONICAL_HOST = "billcrafter.com";
const OCR_LOCALIZED_SLUGS = new Set(["invoice-ocr-scanner", "receipt-to-csv-converter"]);

export function middleware(request) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const url = new URL(request.url);
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  const originalProtocol = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const shouldUseHttps = !isLocalHost && originalProtocol !== "https";
  const shouldUseApex = host === `www.${CANONICAL_HOST}`;

  if (shouldUseHttps || shouldUseApex) {
    url.protocol = "https:";
    if (shouldUseApex) url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const pathname = url.pathname || "/";

  // Block direct access to internal rewrite prefix `/i18n/...` -> canonical public URL
  if (pathname === "/i18n" || pathname.startsWith("/i18n/")) {
    const clean = pathname.replace(/^\/i18n/, "") || "/";
    return NextResponse.redirect(new URL(clean + url.search, request.url), 308);
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && first !== DEFAULT_LOCALE && isLocale(first)) {
    const rest = segments.slice(1).join("/");

    // 1. Localized home page: /es, /de, /ja, /zh-Hant, ...
    if (!rest) {
      return NextResponse.rewrite(new URL(`/i18n/${first}${url.search}`, request.url));
    }

    // 2. Localized /about page (or 308 market variants to their language primary)
    if (rest === "about") {
      if (aboutHasOwnUrl(first, LOCALES)) {
        return NextResponse.rewrite(new URL(`/i18n/${first}/about${url.search}`, request.url));
      }
      return NextResponse.redirect(new URL(aboutUrlFor(first, LOCALES) + url.search, request.url), 308);
    }

    // 3. Tier-1 localized OCR tool pages (/de/invoice-ocr-scanner, /es/receipt-to-csv-converter, ...)
    if (OCR_LOCALIZED_SLUGS.has(rest)) {
      if (OCR_TIER1_LOCALES.includes(first)) {
        return NextResponse.rewrite(new URL(`/i18n/${first}/${rest}${url.search}`, request.url));
      }
      const primary = primaryLocaleOf(first);
      if (OCR_TIER1_LOCALES.includes(primary)) {
        return NextResponse.redirect(new URL(`/${primary}/${rest}${url.search}`, request.url), 308);
      }
      return NextResponse.redirect(new URL(`/${rest}${url.search}`, request.url), 308);
    }

    // 4. Any other English-only path under a locale prefix -> permanent redirect to English
    return NextResponse.redirect(new URL(`/${rest}${url.search}`, request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/|og/|samples/|anatomy/|steps/).*)"],
};
