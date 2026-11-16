import OcrLandingPage from "@/components/OcrLandingPage";
import { getOcrPageConfig, ocrAlternatesFor } from "@/lib/ocrSeo";

const SLUG = "invoice-ocr-scanner";
const cfg = getOcrPageConfig(SLUG, "en");

export const metadata = {
  title: { absolute: cfg.metaTitle },
  description: cfg.metaDescription,
  alternates: {
    canonical: `/${SLUG}`,
    ...ocrAlternatesFor(SLUG),
  },
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: `https://billcrafter.com/${SLUG}`,
    type: "website",
    images: [{ url: `/og/${SLUG}.png`, width: 1200, height: 630, alt: cfg.h1 }],
  },
  twitter: {
    card: "summary_large_image",
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    images: [`/og/${SLUG}.png`],
  },
};

export default function InvoiceOcrScannerPage() {
  return <OcrLandingPage config={cfg} locale="en" />;
}
