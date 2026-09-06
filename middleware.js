import { NextResponse } from "next/server";

// One canonical host. Both custom domains are attached to the Worker, so without
// this redirect www and apex serve identical content and Search Console keeps
// two sitemap histories. Sitemap URLs, APP_URL and robots.txt already use apex.
// Requires assets.run_worker_first = true in wrangler.toml — otherwise
// prerendered assets (including /sitemap.xml) skip middleware entirely.
const CANONICAL_HOST = "billcrafter.com";

export function middleware(request) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const url = new URL(request.url);
  // Cloudflare preserves the visitor scheme in this header even when the
  // Worker request itself has already been normalized to HTTPS.
  const originalProtocol = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const shouldUseHttps = originalProtocol !== "https";
  const shouldUseApex = host === `www.${CANONICAL_HOST}`;

  if (!shouldUseHttps && !shouldUseApex) return NextResponse.next();

  url.protocol = "https:";
  if (shouldUseApex) url.hostname = CANONICAL_HOST;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
