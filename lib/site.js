// Single source of truth for authorship + freshness signals.
// Surfaced two ways: (1) machine-readable datePublished/dateModified + author in
// Article JSON-LD, and (2) a visible byline on content pages. AI engines weight
// recency and named authorship, so both the schema and the on-page byline matter.
export const SITE_PUBLISHED = "2025-11-01";
export const SITE_UPDATED = "2026-07-24";

export const AUTHOR = {
  name: "Philips",
  role: "Finance professional",
  description: "Works in finance and sorts through bills and invoices every day.",
  url: "https://billcrafter.com/about#author",
};
export const PUBLISHER = "CCC STUDIO";

// Public Trustpilot review page — the destination for every "leave a review" CTA.
export const REVIEW_URL = "https://www.trustpilot.com/review/billcrafter.com";

// "2026-07-24" -> "July 24, 2026" (no locale dependency, stable across SSG).
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
export function fmtDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
