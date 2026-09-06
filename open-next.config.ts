import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Why an incremental cache is required here:
// Fully-static routes (like "/") are served straight from the assets bundle and
// are fine. But dynamic routes with generateStaticParams — every /<locale> home
// and every SEO /<slug> landing page (app/[slug]) plus the template pages — are
// prerendered at build, and WITHOUT a configured incremental cache the Cloudflare
// worker re-renders them on every request. Re-running the heavy invoice-editor SSR
// per request exceeds the Worker CPU limit and Cloudflare returns "Error 1102"
// (e.g. /en-GB). The static-assets cache serves those prerendered pages from the
// bundle instead of re-rendering — read-only, no KV/R2/D1 needed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
