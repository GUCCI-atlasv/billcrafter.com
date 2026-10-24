"use client";

// AdSense loader. Rendered as a plain <script> (not next/script) so the tag is in
// the server HTML, where AdSense's site-verification crawler looks for it.
// Skipped on the routes in NO_ADS (PDF render, private links, app screens).
import { usePathname } from "next/navigation";
import { AD_CLIENT, adsAllowed } from "@/lib/ads";

export default function AdSenseScript() {
  if (!adsAllowed(usePathname())) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
