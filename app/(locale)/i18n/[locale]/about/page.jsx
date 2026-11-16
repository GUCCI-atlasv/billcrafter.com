import { notFound, permanentRedirect } from "next/navigation";
import AboutPage from "@/components/AboutPage";
import { about, aboutHasOwnUrl, aboutUrlFor, aboutAlternates } from "@/lib/aboutI18n";
import { LOCALES, LOCALE_CODES, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALE_CODES.filter((c) => aboutHasOwnUrl(c, LOCALES)).map((locale) => ({ locale }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!isLocale(locale) || !aboutHasOwnUrl(locale, LOCALES)) return {};
  const a = about(locale);
  const ogImg = `/og?title=${encodeURIComponent(a.h1 || a.title)}&eyebrow=${encodeURIComponent(a.eyebrow || "About")}`;
  return {
    title: a.title,
    description: a.desc,
    alternates: {
      canonical: `/${locale}/about`,
      ...aboutAlternates(LOCALES),
    },
    openGraph: { title: a.title, description: a.desc, type: "website", images: [{ url: ogImg, width: 1200, height: 630, alt: a.title }] },
    twitter: { card: "summary_large_image", title: a.title, description: a.desc, images: [ogImg] },
  };
}

export default async function LocalizedAboutPage({ params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (!aboutHasOwnUrl(locale, LOCALES)) permanentRedirect(aboutUrlFor(locale, LOCALES));
  return <AboutPage locale={locale} />;
}
