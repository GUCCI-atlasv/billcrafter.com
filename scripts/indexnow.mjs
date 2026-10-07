// Push every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver…).
// Bing had only ~19 of our ~110 sitemap URLs showing impressions, and Bing's
// index also feeds ChatGPT search and Copilot — so we notify it on each deploy
// instead of waiting for a recrawl.
//
// The key is public by design: IndexNow verifies ownership by fetching
// https://billcrafter.com/<key>.txt, which lives in public/.
//
//   node scripts/indexnow.mjs            # submit all sitemap URLs
//   node scripts/indexnow.mjs /a /b      # submit only these paths

const HOST = "billcrafter.com";
const KEY = "431663e77a8a6d17d590b210bb7e0c4c";

async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => new URL(p, `https://${HOST}`).href)
  : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted pending key verification (normal on first run).
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exitCode = 1;
}
