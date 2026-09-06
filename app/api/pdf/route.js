// Server-side PDF rendering.
//
// The client path (html2pdf → html2canvas) does not print the document, it
// photographs it: html2canvas re-implements CSS layout and text metrics, and
// every difference between its implementation and the browser's shows up as a
// defect in what the client receives — a value clipped to half its height, a
// stylesheet that failed to reach the capture, a figure sitting on the lower
// edge of the totals band. Each one had to be found by measuring pixels,
// because none of them throws.
//
// Here the browser renders the invoice with its own engine and its own print
// stylesheet, and returns real vector PDF: selectable text, embedded fonts,
// correct positions by construction. There is no second layout implementation
// to disagree with.
//
// This route is additive. If the Browser Rendering binding is not configured it
// answers 503 and the client falls back to the existing html2pdf path, so
// deploying it cannot make the current behaviour worse.
import { getEnv, getSessionUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";

const LIMIT_ANON = 1;
const LIMIT_FREE = 5;
const month = () => new Date().toISOString().slice(0, 7);

function clientIp(request) {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
    null
  );
}

// Two separate things are being limited here, and an earlier version of this
// file confused them.
//
//   The PRODUCT allowance — how many invoices a plan may export in a month —
//   belongs to the user. It is charged only when a PDF is actually delivered.
//   Charging it on every attempt meant our own renderer failing quietly ate
//   someone's month: a few 502s and a paying-attention user is locked out of a
//   button that never produced anything for them. That is the worst possible
//   way to spend someone's allowance.
//
//   The COST cap — how many headless browsers may be launched — is ours. It
//   exists so a script cannot run up a bill, and it is enforced separately, on
//   a short rolling window, so a burst of failures costs the caller nothing
//   they care about while still bounding what it costs us.
//
// Charge on success; cap attempts on the side.
const ATTEMPT_WINDOW = 900;   // seconds
const ATTEMPT_MAX = 12;       // browser launches per window per caller

async function readAllowance(env, request) {
  const user = env.SESSIONS ? await getSessionUser(request, env) : null;
  if (user && user.plan === "pro") return { allowed: true, user, ip: null };
  const m = month();
  if (user) {
    const row = await env.DB.prepare("SELECT count FROM export_usage WHERE user_id = ? AND month = ?")
      .bind(user.id, m).first().catch(() => null);
    return { allowed: (row?.count || 0) < LIMIT_FREE, user, ip: null };
  }
  const ip = clientIp(request);
  if (!ip) return { allowed: false, user: null, ip: null };
  const row = await env.DB.prepare("SELECT count FROM anon_usage WHERE ip = ? AND month = ?")
    .bind(ip, m).first().catch(() => null);
  return { allowed: (row?.count || 0) < LIMIT_ANON, user: null, ip };
}

// Best-effort rolling cap on browser launches. KV has no atomic increment, so a
// simultaneous burst can slip a couple through — which is fine: this bounds a
// bill, it does not guard a secret.
async function tooManyAttempts(env, request, user) {
  const id = user ? "u:" + user.id : "ip:" + (clientIp(request) || "unknown");
  const k = "pdfatt:" + id;
  const n = Number((await env.SESSIONS.get(k)) || 0);
  if (n >= ATTEMPT_MAX) return true;
  try { await env.SESSIONS.put(k, String(n + 1), { expirationTtl: ATTEMPT_WINDOW }); } catch {}
  return false;
}

// Charged only once the file is on its way to the caller.
async function chargeExport(env, user, ip) {
  const now = Date.now();
  const m = month();
  try {
    if (user) {
      if (user.plan === "pro") return;
      await env.DB.prepare(
        "INSERT INTO export_usage (user_id, month, count, updated_at) VALUES (?, ?, 1, ?) " +
        "ON CONFLICT(user_id, month) DO UPDATE SET count = count + 1, updated_at = ?"
      ).bind(user.id, m, now, now).run();
      return;
    }
    if (!ip) return;
    await env.DB.prepare(
      "INSERT INTO anon_usage (ip, month, count, updated_at) VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(ip, month) DO UPDATE SET count = count + 1, updated_at = ?"
    ).bind(ip, m, now, now).run();
  } catch {}
}

export async function POST(request) {
  const env = await getEnv();
  if (!env?.BROWSER || !env?.SESSIONS || !env?.DB) {
    // Not an error: the binding simply isn't set up. The client falls back.
    return Response.json({ ok: false, error: "renderer_unavailable", counted: false }, { status: 503 });
  }
  // Validate before spending anything: a malformed body should not cost the
  // caller an export.
  const { doc, locale, filename } = await request.json().catch(() => ({}));
  if (!doc || typeof doc !== "object" || !Array.isArray(doc.items)) {
    return Response.json({ ok: false, error: "invalid", counted: false }, { status: 400 });
  }

  const quota = await readAllowance(env, request);
  if (!quota.allowed) {
    return Response.json({ ok: false, error: "quota", counted: false }, { status: 402 });
  }
  if (await tooManyAttempts(env, request, quota.user)) {
    // Nothing is charged: this is our cost cap, not the caller's allowance.
    return Response.json({ ok: false, error: "rate_limited", counted: false }, { status: 429 });
  }

  // The snapshot is handed to the headless browser through a single-use key
  // rather than a query string: it carries the client's name, address and
  // amounts, and a URL would end up in logs. 120s is long enough for a cold
  // browser start and short enough that the key is worthless if it leaks.
  const key = crypto.randomUUID().replace(/-/g, "");
  await env.SESSIONS.put("pdfdoc:" + key, JSON.stringify({ doc, locale: locale || "en" }), { expirationTtl: 120 });

  let browser = null;
  try {
    const puppeteer = (await import("@cloudflare/puppeteer")).default;
    browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();
    // Wide enough that .sheet reaches its 700px max-width; the PDF page size is
    // set below, not by the viewport.
    await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 1 });
    const base = env.APP_URL || "https://billcrafter.com";
    const res = await page.goto(`${base}/render/${key}`, { waitUntil: "networkidle0", timeout: 25000 });
    if (!res || !res.ok()) throw new Error("render_page_" + (res ? res.status() : "no_response"));
    // A webfont still swapping when the PDF is taken reflows the sheet.
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
    });
    // Delivered — now, and only now, spend the export.
    await chargeExport(env, quota.user, quota.ip);
    const name = (typeof filename === "string" && filename.trim()) ? filename.trim().slice(0, 120) : "invoice.pdf";
    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${name.replace(/["\\]/g, "")}"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    // Nothing was charged: the user got no file. The client falls back to its
      // own renderer and counts that export itself, exactly as it always did.
      return Response.json({ ok: false, error: "render_failed", counted: false, detail: String(e?.message || e).slice(0, 200) }, { status: 502 });
  } finally {
    try { await env.SESSIONS.delete("pdfdoc:" + key); } catch {}
    try { if (browser) await browser.close(); } catch {}
  }
}
