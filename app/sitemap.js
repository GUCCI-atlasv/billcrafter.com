import { VERTICALS } from "@/lib/seo";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates";
import { LOCALES, DEFAULT_LOCALE, INDEXABLE_HOME_LOCALES } from "@/lib/i18n";
import { aboutUrlFor, aboutHasOwnUrl } from "@/lib/aboutI18n";

const BASE = "https://billcrafter.com";

export default function sitemap() {
  const now = new Date();
  const staticPages = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/templates`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${BASE}/changelog`, priority: 0.4, changeFrequency: "weekly" },
    { url: `${BASE}/contact`, priority: 0.4, changeFrequency: "yearly" },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly" },
  ];
  const verticals = VERTICALS.map((v) => ({ url: `${BASE}/${v.slug}`, priority: 0.8, changeFrequency: "monthly" }));
  const templates = TEMPLATES.map((t) => ({ url: `${BASE}/templates/${t.slug}`, priority: 0.7, changeFrequency: "monthly" }));
  const templateCategories = TEMPLATE_CATEGORIES.map((c) => ({ url: `${BASE}/templates/c/${c.slug}`, priority: 0.8, changeFrequency: "monthly" }));

  // Localized home pages, each declaring its full hreflang set.
  const langAlternates = Object.fromEntries(
    INDEXABLE_HOME_LOCALES.map((l) => [l.hreflang, l.code === DEFAULT_LOCALE ? `${BASE}/` : `${BASE}/${l.code}`])
  );
  const localeHomes = INDEXABLE_HOME_LOCALES.filter((l) => l.code !== DEFAULT_LOCALE).map((l) => ({
    url: `${BASE}/${l.code}`,
    priority: 0.9,
    changeFrequency: "weekly",
    alternates: { languages: langAlternates },
  }));

  // Localized /about — one URL per language. Markets sharing a language render
  // identical text and 301 to that language's page, so listing them here would
  // just spend crawl budget on redirects.
  const aboutAlts = Object.fromEntries(
    LOCALES.map((l) => [l.hreflang, BASE + aboutUrlFor(l.code, LOCALES)])
  );
  const localeAbout = LOCALES.filter((l) => aboutHasOwnUrl(l.code, LOCALES)).map((l) => ({
    url: `${BASE}/${l.code}/about`,
    priority: 0.5,
    changeFrequency: "monthly",
    alternates: { languages: aboutAlts },
  }));

  return [...staticPages, ...localeHomes, ...localeAbout, ...verticals, ...templateCategories, ...templates].map((p) => ({ lastModified: now, ...p }));
}
