// Google AdSense config. Single source of truth for the publisher ID, the ad
// unit slot IDs, and the routes where AdSense must never load.
export const AD_CLIENT = "ca-pub-8028325929767359";

// Ad unit slot IDs (the data-ad-slot number from AdSense → Ads → By ad unit →
// Display ads → "Get code"). An empty ID renders nothing in production, so a
// placement can ship before its unit exists.
export const AD_SLOTS = {
  // Between content sections on home / SEO landing / template category pages.
  inContent: "",
  // Lower on the page, after the long-form guide / FAQ.
  bottom: "",
};

// Routes where AdSense (script and Auto ads) is skipped:
//  - /render/*  headless Chrome builds PDFs from this page and waits for network
//               idle — ad requests would slow exports and could land in the PDF;
//  - /i/*       private invoice share links (token in URL, no publisher content);
//  - app screens with no publisher content (policy: no ads on login/app UIs).
export const NO_ADS = [
  /^\/render\//, /^\/i\//, /^\/admin(\/|$)/, /^\/dashboard(\/|$)/,
  /^\/invoicemanager(\/|$)/, /^\/login(\/|$)/, /^\/signup(\/|$)/,
];
export const adsAllowed = (path) => !NO_ADS.some((re) => re.test(path || "/"));
