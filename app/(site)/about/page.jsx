import AboutPage from "@/components/AboutPage";
import { about, aboutAlternates } from "@/lib/aboutI18n";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export const metadata = (() => {
  const a = about(DEFAULT_LOCALE);
  const ogImg = `/og?title=${encodeURIComponent(a.h1 || a.title)}&eyebrow=${encodeURIComponent(a.eyebrow || "About")}`;
  return {
    title: a.title,
    description: a.desc,
    // Every English market (en, en-GB, en-AU, en-CA…) is served by this one page
    // and declared here via hreflang — see aboutAlternates.
    alternates: { canonical: "/about", ...aboutAlternates(LOCALES) },
    openGraph: { title: a.title, description: a.desc, type: "website", images: [{ url: ogImg, width: 1200, height: 630, alt: a.title }] },
    twitter: { card: "summary_large_image", title: a.title, description: a.desc, images: [ogImg] },
  };
})();

export default function About() {
  return <AboutPage locale={DEFAULT_LOCALE} />;
}
