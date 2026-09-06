// PayPal webhook — authoritative source of truth for Pro entitlement.
import { getEnv } from "@/lib/server/auth";
import { payToken, verifyWebhook, setPlan, userIdByEmail, upsertSub } from "@/lib/server/paypal";

const ACTIVATE = ["BILLING.SUBSCRIPTION.ACTIVATED", "BILLING.SUBSCRIPTION.RE-ACTIVATED", "PAYMENT.SALE.COMPLETED", "PAYMENT.CAPTURE.COMPLETED", "CHECKOUT.ORDER.APPROVED"];
const DEACTIVATE = ["BILLING.SUBSCRIPTION.CANCELLED", "BILLING.SUBSCRIPTION.EXPIRED", "BILLING.SUBSCRIPTION.SUSPENDED"];

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const bodyText = await request.text();

  let token = null;
  try { token = await payToken(env); } catch {}
  if (token) {
    const ok = await verifyWebhook(env, token, request.headers, bodyText);
    if (!ok) return Response.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }

  let evt;
  try { evt = JSON.parse(bodyText); } catch { return Response.json({ ok: false }, { status: 400 }); }
  const type = evt.event_type;
  const res = evt.resource || {};
  // Match to a BillCrafter account: prefer custom_id (subscription flow), else fall
  // back to the payer's email (no-code payment link). Users are told to pay with the
  // same email as their account.
  const email =
    res.custom_id || res.custom ||
    res.subscriber?.email_address ||
    res.payer?.email_address ||
    res.payer?.payer_info?.email || null;
  const subId = res.id || res.billing_agreement_id || null;

  try {
    if (email && ACTIVATE.includes(type)) {
      await setPlan(env, email, "pro");
      await upsertSub(env, await userIdByEmail(env, email), subId, "active");
    } else if (email && DEACTIVATE.includes(type)) {
      await setPlan(env, email, "free");
      await upsertSub(env, await userIdByEmail(env, email), subId, "canceled");
    }
  } catch {}

  return Response.json({ ok: true });
}
