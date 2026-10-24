"use client";

// One responsive AdSense display unit. Place only between content sections —
// never beside the editor or download buttons (AdSense accidental-click policy).
// Without a slot ID it renders nothing in production and a labelled outline in
// dev, so placements are visible before the ad units exist.
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AD_CLIENT, adsAllowed } from "@/lib/ads";

export default function AdSlot({ slot, className = "" }) {
  const path = usePathname();
  const ref = useRef(null);
  const on = Boolean(slot) && adsAllowed(path);

  useEffect(() => {
    const el = ref.current;
    // Guard against double push (StrictMode, re-renders): AdSense marks a
    // filled <ins> with data-adsbygoogle-status.
    if (!on || !el || el.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers / not-yet-approved sites throw here; the page must not care.
    }
  }, [on, path]);

  if (!on) {
    if (process.env.NODE_ENV !== "development") return null;
    return <div className={"ad-band ad-dev " + className}>Ad slot (no slot ID yet)</div>;
  }
  return (
    <div className={"ad-band " + className} aria-label="Advertisement">
      <div className="wrap">
        <div className="ad-label">Advertisement</div>
        {/* key: a fresh <ins> per route so client-side navigation gets a new ad */}
        <ins
          key={path}
          ref={ref}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
