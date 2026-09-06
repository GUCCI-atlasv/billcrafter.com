// A lightweight "Review on Trustpilot" button. Unlike the full TrustBox widget
// (which needs the bootstrap script + a verified domain to render), this is a
// plain link to the public review page — so it works everywhere, instantly, and
// is the right fit for modals, welcome banners and sidebars.
import { REVIEW_URL } from "@/lib/site";

function TrustStar() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ flex: "none" }}>
      <path fill="#00b67a" d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

export default function ReviewCta({ label = "Review us on Trustpilot", variant = "solid", className = "" }) {
  return (
    <a
      className={`review-cta review-cta--${variant} ${className}`}
      href={REVIEW_URL}
      target="_blank"
      rel="noopener"
    >
      <TrustStar />
      <span>{label}</span>
    </a>
  );
}
