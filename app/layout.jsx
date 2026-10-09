import "./globals.css";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Montserrat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { SITE_PUBLISHED, SITE_UPDATED } from "@/lib/site";

// Site-wide entity graph — the biggest GEO gap was zero structured data. This
// gives AI engines and search a stable identity for the brand and the product.
const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://billcrafter.com/#organization",
      name: "BillCrafter",
      legalName: "CCC STUDIO",
      url: "https://billcrafter.com",
      logo: "https://billcrafter.com/apple-touch-icon.png",
      description: "BillCrafter is a free online invoice generator for freelancers and small businesses, operated by CCC STUDIO.",
      email: "support@billcrafter.com",
      foundingDate: "2025",
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@billcrafter.com",
        contactType: "customer support",
        availableLanguage: ["en"],
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
      name: "BillCrafter — Free Invoice Generator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://billcrafter.com",
      description: "Create professional invoices, estimates, quotes and receipts in the browser and download a clean PDF. No signup to download.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: ["Invoice generator", "Estimate & quote generator", "Receipt maker", "45 templates", "Multi-currency", "PDF export"],
      author: { "@id": "https://billcrafter.com/#organization" },
      publisher: { "@id": "https://billcrafter.com/#organization" },
      datePublished: SITE_PUBLISHED,
      dateModified: SITE_UPDATED,
    },
  ],
};

// Self-hosted, latin-only subset so the redesign doesn't cost LCP.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://billcrafter.com"),
  title: {
    default: "BillCrafter — Free Invoice Generator",
    template: "%s — BillCrafter",
  },
  description:
    "Free invoice generator for freelancers and small businesses. Create invoices, estimates, quotes and receipts, then download a clean PDF. No signup to download.",
  keywords: [
    "free invoice generator", "invoice generator", "online invoice maker", "PDF invoice",
    "free invoice template", "create invoice online", "freelance invoice", "invoice maker",
    "estimate generator", "quote generator", "receipt maker",
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
    title: "BillCrafter — Free Invoice Generator",
    description: "Create professional invoices in seconds. No signup to download.",
    url: "https://billcrafter.com",
    siteName: "BillCrafter",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "BillCrafter — free invoice generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BillCrafter — Free Invoice Generator",
    description: "Create professional invoices in seconds. No signup to download.",
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#F3F3EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <JsonLd data={SITE_SCHEMA} />
        {children}
        <GoogleAnalytics />
        <Script
          src="https://ccc-monitor.583079497.workers.dev/beacon.js"
          data-site="billcrafter.com"
          strategy="afterInteractive"
        />
        {/* Trustpilot TrustBox bootstrap — renders any .trustpilot-widget on the page. */}
        <Script src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
