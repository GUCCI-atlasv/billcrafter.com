import { notFound, permanentRedirect } from "next/navigation";
import AboutPage from "@/components/AboutPage";
import { about, aboutHasOwnUrl, aboutUrlFor, aboutAlternates } from "@/lib/aboutI18n";
import { LOCALES, LOCALE_CODES, isLocale } from "@/lib/i18n";

// Localized About: /es/about, /ja/about, … The [slug] segment is reused (Next.js
// requires sibling dynamic segments to share a param name) and is validated as a
// locale below, so /freelance-invoice-generator/about can never render.
//
// One URL per language: markets that share a language (en-GB, es-MX, zh-Hant-TW…)
// would render identical text, so they 301 to the language's own URL instead.
export function generateStaticParams() {
  return LOCALE_CODES.filter((c) => aboutHasOwnUrl(c, LOCALES)).map((c) => ({ slug: c }));
}
// Must stay true on Cloudflare/OpenNext: nested SSG routes can miss the
// incremental cache at the edge; false would hard-404 instead of rendering.
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!isLocale(slug) || !aboutHasOwnUrl(slug, LOCALES)) return {};
  const a = about(slug);
  const ogImg = `/og?title=${encodeURIComponent(a.h1 || a.title)}&eyebrow=${encodeURIComponent(a.eyebrow || "About")}`;
  return {
    title: a.title,
    description: a.desc,
    alternates: {
      canonical: `/${slug}/about`,
      ...aboutAlternates(LOCALES),
    },
    openGraph: { title: a.title, description: a.desc, type: "website", images: [{ url: ogImg, width: 1200, height: 630, alt: a.title }] },
    twitter: { card: "summary_large_image", title: a.title, description: a.desc, images: [ogImg] },
  };
}

export default async function LocalizedAbout({ params }) {
  const { slug } = await params;
  if (!isLocale(slug)) notFound();
  // Markets that share a language share its page.
  if (!aboutHasOwnUrl(slug, LOCALES)) permanentRedirect(aboutUrlFor(slug, LOCALES));
  return <AboutPage locale={slug} />;
}
