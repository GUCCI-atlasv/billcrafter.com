// Single source of truth for organizational maintenance + freshness signals.
// Surfaced in Article JSON-LD and visible bylines on content pages.
export const SITE_PUBLISHED = "2025-11-01";
export const SITE_UPDATED = "2026-11-15";

export const PUBLISHER = "CCC STUDIO";
export const MAINTAINER = {
  name: "CCC STUDIO",
  role: "Product operator & maintainer",
  description: "Independent software team building and maintaining BillCrafter.",
  url: "https://billcrafter.com/about#maintainer",
};
export const AUTHOR = MAINTAINER;

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
