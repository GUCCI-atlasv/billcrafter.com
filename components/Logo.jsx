// BillCrafter mark (Concept 2 — folded invoice + $).
// variant="brand" (default) -> vermilion doc + white cutouts (light backgrounds)
// variant="white"           -> white doc + ink cutouts (dark backgrounds)
// variant="black"           -> ink doc + white cutouts (mono fallback)
const BRAND = "#F43E01";
const INK = "#2D2F33";

export function LogoMark({ variant = "brand", size = 26 }) {
  const doc = variant === "white" ? "#FFFFFF" : variant === "black" ? INK : BRAND;
  const cut = variant === "white" ? INK : "#FFFFFF";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 6 h14 l7 7 v27 a2 2 0 0 1-2 2 H15 a2 2 0 0 1-2-2 V8 a2 2 0 0 1 2-2 Z" fill={doc} />
      <path d="M29 6 v7 h7" fill="none" stroke={cut} strokeWidth="2" />
      <rect x="18" y="18" width="13" height="2.3" rx="1.1" fill={cut} />
      <rect x="18" y="23" width="9" height="2.3" rx="1.1" fill={cut} />
      <text x="24.5" y="40" textAnchor="middle" fontSize="15" fontWeight="700" fill={cut} fontFamily="Montserrat,Helvetica,Arial,sans-serif">$</text>
    </svg>
  );
}

export function Logo({ variant = "brand" }) {
  return (
    <span className="logo">
      <LogoMark variant={variant} />
      {/* Single uniform weight — Montserrat SemiBold, tight tracking. */}
      <span className="wordmark">BillCrafter</span>
    </span>
  );
}
