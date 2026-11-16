import "@/app/globals.css";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdSenseScript from "@/components/AdSenseScript";
import { Montserrat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_PUBLISHED, SITE_UPDATED } from "@/lib/site";

export const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://billcrafter.com/#organization",
      name: "BillCrafter",
      legalName: "CCC STUDIO",
      url: "https://billcrafter.com",
      logo: "https://billcrafter.com/apple-touch-icon.png",
      description:
        "BillCrafter is a free online invoice generator and AI receipt/invoice OCR scanner for freelancers and small businesses, operated by CCC STUDIO.",
      email: "support@billcrafter.com",
      foundingDate: "2025",
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@billcrafter.com",
        contactType: "customer support",
        availableLanguage: ["en", "es", "de", "fr", "pt", "ja", "zh-Hant", "zh-Hans"],
      },
      sameAs: ["https://www.trustpilot.com/review/billcrafter.com"],
    },
    {
      "@type": "WebSite",
      "@id": "https://billcrafter.com/#website",
      name: "BillCrafter",
      url: "https://billcrafter.com",
      inLanguage: "en",
      publisher: { "@id": "https://billcrafter.com/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "BillCrafter — Free Invoice Generator & AI Invoice OCR",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://billcrafter.com",
      description:
        "Create professional invoices, estimates, quotes and receipts as clean PDFs, or scan paper receipts and PDF invoices to Excel & CSV with AI OCR. No signup required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Invoice generator",
        "AI Invoice & Receipt OCR scanner",
        "Receipt photo to CSV & Excel (.xlsx)",
        "Estimate & quote generator",
        "Receipt maker",
        "45 templates",
        "25+ currencies",
        "Vector PDF export",
      ],
      author: { "@id": "https://billcrafter.com/#organization" },
      publisher: { "@id": "https://billcrafter.com/#organization" },
      datePublished: SITE_PUBLISHED,
      dateModified: SITE_UPDATED,
    },
  ],
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const sharedMetadata = {
  metadataBase: new URL("https://billcrafter.com"),
  other: { "google-adsense-account": "ca-pub-8028325929767359" },
  title: {
    default: "BillCrafter — Free Invoice Generator",
    template: "%s — BillCrafter",
  },
  description:
    "Free invoice generator and AI receipt/invoice OCR scanner for freelancers and small businesses. Create PDF invoices or extract bills to Excel & CSV — no signup required.",
  keywords: [
    "free invoice generator",
    "invoice generator",
    "invoice ocr",
    "receipt photo to CSV OCR",
    "online invoice maker",
    "PDF invoice",
    "free invoice template",
    "estimate generator",
    "quote generator",
    "receipt maker",
  ],
  applicationName: "BillCrafter",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BillCrafter — Free Invoice Generator & AI OCR",
    description: "Create professional PDF invoices or scan receipts to Excel & CSV in seconds. No signup to download.",
    url: "https://billcrafter.com",
    siteName: "BillCrafter",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BillCrafter — free invoice generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillCrafter — Free Invoice Generator & AI OCR",
    description: "Create professional PDF invoices or scan receipts to Excel & CSV in seconds. No signup to download.",
    images: ["/og.png"],
  },
};

export const sharedViewport = {
  themeColor: "#F3F3EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootShell({ lang = "en", children }) {
  return (
    <html lang={lang} className={montserrat.variable}>
      <head>
        <AdSenseScript />
      </head>
      <body>
        <JsonLd data={SITE_SCHEMA} />
        {children}
        <GoogleAnalytics />
        <Script
          src="https://ccc-monitor.583079497.workers.dev/beacon.js"
          data-site="billcrafter.com"
          strategy="lazyOnload"
        />
        <Script
          src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
