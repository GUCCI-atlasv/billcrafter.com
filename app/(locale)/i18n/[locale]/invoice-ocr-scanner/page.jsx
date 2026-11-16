import { notFound } from "next/navigation";
import OcrLandingPage from "@/components/OcrLandingPage";
import { OCR_TIER1_LOCALES, getOcrPageConfig, ocrAlternatesFor } from "@/lib/ocrSeo";

const SLUG = "invoice-ocr-scanner";

export function generateStaticParams() {
  return OCR_TIER1_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const cfg = getOcrPageConfig(SLUG, locale);
  if (!cfg) return {};
  const ogImg = `/og?title=${encodeURIComponent(cfg.h1)}&eyebrow=${encodeURIComponent(cfg.eyebrow || "AI OCR")}`;
  return {
    title: { absolute: cfg.metaTitle },
    description: cfg.metaDescription,
    alternates: {
      canonical: `/${locale}/${SLUG}`,
      ...ocrAlternatesFor(SLUG),
    },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      url: `https://billcrafter.com/${locale}/${SLUG}`,
      type: "website",
      images: [{ url: ogImg, width: 1200, height: 630, alt: cfg.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      images: [ogImg],
    },
  };
}

export default async function LocalizedInvoiceOcrPage({ params }) {
  const { locale } = await params;
  const cfg = getOcrPageConfig(SLUG, locale);
  if (!cfg) notFound();
  return <OcrLandingPage config={cfg} locale={locale} />;
}
