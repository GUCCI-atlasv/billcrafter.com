// PayPal server helpers (Subscriptions). Live by default; set PAYPAL_ENV=sandbox for testing.
export function payBase(env) {
  return env?.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";
}

export async function payToken(env) {
  const r = await fetch(payBase(env) + "/v1/oauth2/token", {
    method: "POST",
    headers: { authorization: "Basic " + btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`), "content-type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const j = await r.json();
  return j.access_token || null;
}

export async function getSubscription(env, token, id) {
  const r = await fetch(payBase(env) + "/v1/billing/subscriptions/" + id, { headers: { authorization: "Bearer " + token } });
  return r.json();
}

export async function verifyWebhook(env, token, headers, bodyText) {
  const webhookId = env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return true; // not configured (dev) — accept but you SHOULD set it in production
  const payload = {
    auth_algo: headers.get("paypal-auth-algo"),
    cert_url: headers.get("paypal-cert-url"),
    transmission_id: headers.get("paypal-transmission-id"),
    transmission_sig: headers.get("paypal-transmission-sig"),
    transmission_time: headers.get("paypal-transmission-time"),
    webhook_id: webhookId,
    webhook_event: JSON.parse(bodyText),
  };
  const r = await fetch(payBase(env) + "/v1/notifications/verify-webhook-signature", {
    method: "POST", headers: { authorization: "Bearer " + token, "content-type": "application/json" }, body: JSON.stringify(payload),
  });
  const j = await r.json();
  return j.verification_status === "SUCCESS";
}

export async function setPlan(env, email, plan) {
  await env.DB.prepare("UPDATE users SET plan = ? WHERE email = ?").bind(plan, (email || "").toLowerCase()).run();
}
export async function userIdByEmail(env, email) {
  const u = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind((email || "").toLowerCase()).first();
  return u?.id || null;
}
export async function upsertSub(env, userId, subId, status) {
  if (!userId) return;
  await env.DB.prepare("INSERT OR REPLACE INTO subscriptions (user_id, provider, provider_subscription_id, status) VALUES (?, 'paypal', ?, ?)").bind(userId, subId, status).run();
}
