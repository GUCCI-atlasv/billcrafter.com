"use client";

// Trustpilot "Review Collector" TrustBox. The bootstrap script (loaded once in
// the root layout) scans the DOM for .trustpilot-widget elements and renders an
// iframe into them. On client-side navigation the element is new, so we re-run
// Trustpilot.loadFromElement on mount to make sure it always renders.
import { useEffect, useRef } from "react";

export default function Trustpilot() {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.Trustpilot && ref.current) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);
  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="6a63146dcd8fa54ea856cefe"
      data-style-height="52px"
      data-style-width="100%"
      data-token="914505d6-337f-4bca-87f7-aabd1306cd78"
    >
      <a href="https://www.trustpilot.com/review/billcrafter.com" target="_blank" rel="noopener">Trustpilot</a>
    </div>
  );
}
