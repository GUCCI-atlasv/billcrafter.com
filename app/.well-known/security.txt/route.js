import { readFileSync } from "node:fs";
import { join } from "node:path";

// public/.well-known/security.txt is the editable source. With
// assets.run_worker_first = true, the Worker handles the request before ASSETS,
// and app/[slug]/[...rest] would otherwise treat ".well-known" as a locale slug
// and 404. This route wins the match and is frozen at build time so the Worker
// bundle never needs filesystem access at runtime.
export const dynamic = "force-static";

const BODY = readFileSync(
  join(process.cwd(), "public/.well-known/security.txt"),
  "utf8"
);

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
