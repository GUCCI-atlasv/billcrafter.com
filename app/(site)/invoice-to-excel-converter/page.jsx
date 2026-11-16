import OcrLandingPage from "@/components/OcrLandingPage";
import { getOcrPageConfig } from "@/lib/ocrSeo";

const SLUG = "invoice-to-excel-converter";
const cfg = getOcrPageConfig(SLUG, "en");

export const metadata = {
  title: { absolute: cfg.metaTitle },
  description: cfg.metaDescription,
  alternates: {
    canonical: `/${SLUG}`,
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

export default function InvoiceToExcelConverterPage() {
  return <OcrLandingPage config={cfg} locale="en" />;
}
