// Waffo Pancake payment webhook receiver (http channel).
// Configured in Dashboard -> Settings -> Webhooks as:
//   https://billcrafter.com/webhooks   (testMode: true for the test env)
//
// Spec: verify `X-Waffo-Signature: t=<ms>,v1=<base64>` (input `${t}.${rawBody}`)
// with the environment's Waffo webhook public key, respond 200 fast, dedup by
// eventType+eventId, then grant/revoke Pro.
import { getEnv } from "@/lib/server/auth";
import { verifyWebhook, entitlementAction } from "@/lib/server/waffo";
import { setPlan } from "@/lib/server/paypal";

export const dynamic = "force-dynamic";

async function logWebhook(env, row) {
  if (!env?.DB) return;
  try {
    await env.DB.prepare(
      "INSERT INTO webhook_log (id, provider, event_type, event_id, status, ref, amount, currency, raw, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
    ).bind(
      crypto.randomUUID(), "waffo", row.eventType || null, row.eventId || null, row.status,
      row.ref || null, row.amount || null, row.currency || null, (row.raw || "").slice(0, 2000), Date.now()
    ).run();
  } catch { /* logging must never break the webhook */ }
}

async function seen(env, eventType, eventId) {
  if (!eventId) return false;
  try {
    const r = await env.DB.prepare("SELECT 1 FROM webhook_log WHERE event_type = ? AND event_id = ? LIMIT 1").bind(eventType, eventId).first();
    return !!r;
  } catch { return false; }
}

async function grant(env, email, id) {
  if (email) { await setPlan(env, email, "pro"); return "email"; }
  if (id) { try { const r = await env.DB.prepare("UPDATE users SET plan='pro' WHERE id = ?").bind(String(id).replace(/^bc_/, "")).run(); if ((r?.meta?.changes || 0) > 0) return "id"; } catch {} }
  return null;
}
async function revoke(env, email, id) {
  if (email) { await setPlan(env, email, "free"); return "email"; }
  if (id) { try { const r = await env.DB.prepare("UPDATE users SET plan='free' WHERE id = ?").bind(String(id).replace(/^bc_/, "")).run(); if ((r?.meta?.changes || 0) > 0) return "id"; } catch {} }
  return null;
}

export async function POST(request) {
  const env = await getEnv();
  const rawBody = await request.text();
  const sig = request.headers.get("x-waffo-signature") || "";

  // Verify (skip only if the webhook public key isn't configured yet — test setup).
  if (env?.WAFFO_WEBHOOK_PUBLIC_KEY) {
    const ok = await verifyWebhook(env.WAFFO_WEBHOOK_PUBLIC_KEY, rawBody, sig);
    if (ok === false) { await logWebhook(env, { status: "bad_signature", raw: rawBody }); return new Response("Invalid signature", { status: 401 }); }
  }
  if (!env?.DB) return new Response("OK", { status: 200 });

  let evt = {};
  try { evt = JSON.parse(rawBody); } catch {}
  const eventType = evt.eventType || request.headers.get("x-waffo-event") || "";
  const eventId = evt.eventId || evt.id || null;
  const d = evt.data || {};
  const email = (d.buyerEmail || "").trim().toLowerCase() || null;
  const idRef = (d.orderMetadata && d.orderMetadata.userId) || d.merchantProvidedBuyerIdentity || d.orderMerchantExternalId || null;

  // Idempotency: same eventType+eventId is processed once.
  if (await seen(env, eventType, eventId)) return new Response("OK", { status: 200 });

  let status = "received";
  try {
    const action = entitlementAction(eventType);
    if (action === "grant") status = (await grant(env, email, idRef)) ? "pro_granted" : "paid_unmatched";
    else if (action === "revoke") status = (await revoke(env, email, idRef)) ? "pro_revoked" : "received";
  } catch { status = "error"; }

  await logWebhook(env, { eventType, eventId, status, ref: email || idRef, amount: d.amount || null, currency: d.currency || null, raw: rawBody });

  return new Response("OK", { status: 200 });
}

// Browser sanity check.
export async function GET() {
  return Response.json({ ok: true, endpoint: "waffo-pancake-webhook", note: "POST only" });
}
