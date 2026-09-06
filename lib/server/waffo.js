// Waffo Pancake (pancake.waffo.ai) helpers — Web Crypto based so they run on the
// Cloudflare Workers runtime (the official @waffo/pancake-ts SDK is Node-only).
//
// Two things live here:
//   1. API request signing (RSA-SHA256) for server-to-server calls like
//      creating a checkout session.
//   2. Webhook signature verification for the `http` channel
//      (X-Waffo-Signature: t=<ms>,v1=<base64>, input = `${t}.${rawBody}`).

const enc = new TextEncoder();

function pemToBuf(pem) {
  const b64 = String(pem)
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u.buffer;
}
function bufToB64(buf) {
  const u = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s);
}
function b64ToBuf(b64) {
  const bin = atob(String(b64).trim());
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u.buffer;
}
const ALG = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };

async function sha256Base64(str) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return bufToB64(d);
}

// ---- API request signing (server-to-server) ----
// canonicalRequest = METHOD\nPATH\nTIMESTAMP\nSHA256_BASE64(BODY)
export async function signApiHeaders(env, method, path, bodyStr) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyHash = await sha256Base64(bodyStr);
  const canonical = `${method}\n${path}\n${timestamp}\n${bodyHash}`;
  const key = await crypto.subtle.importKey("pkcs8", pemToBuf(env.WAFFO_PRIVATE_KEY), ALG, false, ["sign"]);
  const sig = await crypto.subtle.sign(ALG.name, key, enc.encode(canonical));
  return {
    "content-type": "application/json",
    "X-Merchant-Id": env.WAFFO_MERCHANT_ID,
    "X-Timestamp": timestamp,
    "X-Signature": bufToB64(sig),
  };
}

// ---- Webhook signature verification ----
// header: "t=<ms>,v1=<base64>"  |  input: `${t}.${rawBody}`
export async function verifyWebhook(publicKeyPem, rawBody, signatureHeader, toleranceMs = 5 * 60 * 1000) {
  if (!publicKeyPem) return null;              // not configured yet (test convenience)
  if (!signatureHeader) return false;
  const parts = {};
  for (const pair of signatureHeader.split(",")) {
    const i = pair.indexOf("=");
    if (i > 0) parts[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
  }
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() - Number(t)) > toleranceMs) return false; // replay protection
  try {
    const key = await crypto.subtle.importKey("spki", pemToBuf(publicKeyPem), ALG, false, ["verify"]);
    return await crypto.subtle.verify(ALG.name, key, b64ToBuf(v1), enc.encode(`${t}.${rawBody}`));
  } catch { return false; }
}

// Map a Pancake webhook event to a plan change.
//   "grant"  -> Pro   |   "revoke" -> Free   |   null -> no change
export function entitlementAction(eventType) {
  switch (eventType) {
    case "order.completed":
    case "subscription.activated":
    case "subscription.payment_succeeded":
    case "subscription.uncanceled":
      return "grant";
    case "subscription.canceled":
    case "refund.succeeded":
      return "revoke";
    // canceling / past_due / updated / refund.failed -> keep current access
    default:
      return null;
  }
}
