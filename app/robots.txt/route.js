import { readFileSync } from "node:fs";
import { join } from "node:path";

// Same reason as /.well-known/security.txt: with run_worker_first the Worker
// sees /robots.txt before ASSETS, and app/[slug] would treat "robots.txt" as a
// locale slug. Freeze the public file into a static route at build time.
export const dynamic = "force-static";

const BODY = readFileSync(join(process.cwd(), "public/robots.txt"), "utf8");

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
