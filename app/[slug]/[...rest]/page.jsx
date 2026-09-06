import { permanentRedirect, notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

// Locale-prefixed URLs for pages that only exist in English.
//
// Only the home page and /about are localized. Earlier builds linked to things
// like /de/quote-generator and /bn/templates from the localized nav, so Google
// crawled and remembered them — Search Console reported eight of them as 404s.
// The bad links are gone from the source now, but the URLs still live in Google's
// index and in any external link, so they need to resolve rather than 404.
//
// A 301 to the English page keeps whatever link equity they picked up and stops
// the errors permanently. Anything that isn't a locale prefix is a genuine 404.
export const dynamicParams = true;

export default async function LocalePrefixedFallback({ params }) {
  const { slug, rest } = await params;
  if (!isLocale(slug)) notFound();

  const path = "/" + (Array.isArray(rest) ? rest.join("/") : String(rest || ""));
  if (path === "/") notFound();
  permanentRedirect(path);
}
