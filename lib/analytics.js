// Unified client-side analytics helper.
//
// Sends product events to BOTH:
//   1. First-party D1 analytics beacon (`/api/track`) for the `/admin` dashboard;
//   2. Google Analytics 4 (`window.gtag`) on public routes so channel & landing-page
//      conversion rates (generate_pdf, ocr_scan_success, export_csv, export_xlsx,
//      ocr_to_editor, sign_up) are measurable in one place.
//
// Privacy rule: NEVER pass PII (client names, emails, filenames, or dollar totals)
// into `params`.

const SKIP_GA_RE = [/^\/render\//, /^\/i\//, /^\/admin(\/|$)/];
const LANDING_STORAGE_KEY = "bc_landing_slug";

export function getLandingSlug() {
  if (typeof window === "undefined") return "/";
  try {
    let saved = sessionStorage.getItem(LANDING_STORAGE_KEY);
    if (!saved) {
      saved = window.location.pathname || "/";
      sessionStorage.setItem(LANDING_STORAGE_KEY, saved);
    }
    return saved;
  } catch {
    return window.location?.pathname || "/";
  }
}

export function trackEvent(event, params = {}, beaconOverride = null) {
  if (typeof window === "undefined") return;
  const path = window.location.pathname || "/";
  const landing_slug = getLandingSlug();

  // 1. GA4 event (skipped on private/render/admin paths)
  if (!SKIP_GA_RE.some((re) => re.test(path)) && typeof window.gtag === "function") {
    try {
      window.gtag("event", event, {
        landing_slug,
        ...params,
      });
    } catch {
      // ignore
    }
  }

  // 2. First-party /api/track beacon
  const beaconEvent = beaconOverride?.event || event;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event: beaconEvent,
        path,
        referrer: document.referrer || "",
        ...(beaconOverride || params),
      }),
    }).catch(() => {});
  } catch {
    // analytics must never disrupt user flow
  }
}
