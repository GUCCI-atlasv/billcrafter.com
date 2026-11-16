import { VERTICALS } from "@/lib/seo";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";
import { LOCALES, DEFAULT_LOCALE, INDEXABLE_HOME_LOCALES } from "@/lib/i18n";
import { aboutUrlFor, aboutHasOwnUrl } from "@/lib/aboutI18n";
import { OCR_TIER1_LOCALES } from "@/lib/ocrSeo";
import { GUIDES } from "@/lib/guides";
import { SITE_UPDATED } from "@/lib/site";
import { RELEASES } from "@/lib/changelog";

const BASE = "https://billcrafter.com";

// Deterministic per-section content timestamps so builds without substantive
// content changes do not mutate every URL's <lastmod>.
const HOME_LASTMOD = new Date(`${SITE_UPDATED}T00:00:00Z`);
const CHANGELOG_LASTMOD = new Date(`${RELEASES[0]?.date || SITE_UPDATED}T00:00:00Z`);
const OCR_LASTMOD = new Date(`${SITE_UPDATED}T00:00:00Z`);
const TEMPLATES_LASTMOD = new Date(`${SITE_UPDATED}T00:00:00Z`);
const VERTICALS_LASTMOD = new Date("2026-11-12T00:00:00Z");
const TERMS_LASTMOD = new Date("2026-11-14T00:00:00Z");
const PRIVACY_LASTMOD = new Date("2026-11-15T00:00:00Z");
const CONTACT_LASTMOD = new Date("2026-10-09T00:00:00Z");

export default function sitemap() {
  const ocrScannerAlts = {
    en: `${BASE}/invoice-ocr-scanner`,
    de: `${BASE}/de/invoice-ocr-scanner`,
    "es-ES": `${BASE}/es/invoice-ocr-scanner`,
    fr: `${BASE}/fr/invoice-ocr-scanner`,
    ja: `${BASE}/ja/invoice-ocr-scanner`,
    "zh-Hant-HK": `${BASE}/zh-Hant/invoice-ocr-scanner`,
    "zh-Hans-CN": `${BASE}/zh-Hans/invoice-ocr-scanner`,
    "pt-BR": `${BASE}/pt/invoice-ocr-scanner`,
  };

  const receiptCsvAlts = {
    en: `${BASE}/receipt-to-csv-converter`,
    de: `${BASE}/de/receipt-to-csv-converter`,
    "es-ES": `${BASE}/es/receipt-to-csv-converter`,
    fr: `${BASE}/fr/receipt-to-csv-converter`,
    ja: `${BASE}/ja/receipt-to-csv-converter`,
    "zh-Hant-HK": `${BASE}/zh-Hant/receipt-to-csv-converter`,
    "zh-Hans-CN": `${BASE}/zh-Hans/receipt-to-csv-converter`,
    "pt-BR": `${BASE}/pt/receipt-to-csv-converter`,
  };

  const staticPages = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "weekly", lastModified: HOME_LASTMOD },
    { url: `${BASE}/invoice-ocr-scanner`, priority: 0.95, changeFrequency: "weekly", alternates: { languages: ocrScannerAlts }, lastModified: OCR_LASTMOD },
    { url: `${BASE}/receipt-to-csv-converter`, priority: 0.95, changeFrequency: "weekly", alternates: { languages: receiptCsvAlts }, lastModified: OCR_LASTMOD },
    { url: `${BASE}/invoice-to-excel-converter`, priority: 0.9, changeFrequency: "monthly", lastModified: OCR_LASTMOD },
    { url: `${BASE}/guides`, priority: 0.85, changeFrequency: "weekly", lastModified: HOME_LASTMOD },
    { url: `${BASE}/templates`, priority: 0.9, changeFrequency: "weekly", lastModified: TEMPLATES_LASTMOD },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly", lastModified: HOME_LASTMOD },
    { url: `${BASE}/changelog`, priority: 0.4, changeFrequency: "weekly", lastModified: CHANGELOG_LASTMOD },
    { url: `${BASE}/contact`, priority: 0.4, changeFrequency: "yearly", lastModified: CONTACT_LASTMOD },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly", lastModified: TERMS_LASTMOD },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly", lastModified: PRIVACY_LASTMOD },
  ];

  const guidePages = GUIDES.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    priority: 0.9,
    changeFrequency: "monthly",
    lastModified: new Date(`${g.updated || SITE_UPDATED}T00:00:00Z`),
  }));

  const verticals = VERTICALS.map((v) => ({
    url: `${BASE}/${v.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: VERTICALS_LASTMOD,
  }));
  const templates = TEMPLATES.map((t) => ({
    url: `${BASE}/templates/${t.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: TEMPLATES_LASTMOD,
  }));
  const templateCategories = TEMPLATE_CATEGORIES.map((c) => ({
    url: `${BASE}/templates/c/${c.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: VERTICALS_LASTMOD,
  }));

  // Localized home pages, each declaring its full hreflang set.
  const langAlternates = Object.fromEntries(
    INDEXABLE_HOME_LOCALES.map((l) => [l.hreflang, l.code === DEFAULT_LOCALE ? `${BASE}/` : `${BASE}/${l.code}`])
  );
  const localeHomes = INDEXABLE_HOME_LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => ({
    url: `${BASE}/${l.code}`,
    priority: 0.9,
    changeFrequency: "weekly",
    alternates: { languages: langAlternates },
    lastModified: HOME_LASTMOD,
  }));

  // Tier-1 localized OCR tool pages (only genuine mother-tongue localized pages)
  const localeOcrPages = OCR_TIER1_LOCALES.flatMap((code) => [
    {
      url: `${BASE}/${code}/invoice-ocr-scanner`,
      priority: 0.85,
      changeFrequency: "monthly",
      alternates: { languages: ocrScannerAlts },
      lastModified: OCR_LASTMOD,
    },
    {
      url: `${BASE}/${code}/receipt-to-csv-converter`,
      priority: 0.85,
      changeFrequency: "monthly",
      alternates: { languages: receiptCsvAlts },
      lastModified: OCR_LASTMOD,
    },
  ]);

  // Localized /about — one URL per language.
  const aboutAlts = Object.fromEntries(
    LOCALES.map((l) => [l.hreflang, BASE + aboutUrlFor(l.code, LOCALES)])
  );
  const localeAbout = LOCALES.filter((l) => aboutHasOwnUrl(l.code, LOCALES)).map((l) => ({
    url: `${BASE}/${l.code}/about`,
    priority: 0.5,
    changeFrequency: "monthly",
    alternates: { languages: aboutAlts },
    lastModified: HOME_LASTMOD,
  }));

  return [
    ...staticPages,
    ...guidePages,
    ...localeHomes,
    ...localeOcrPages,
    ...localeAbout,
    ...verticals,
    ...templateCategories,
    ...templates,
  ];
}
