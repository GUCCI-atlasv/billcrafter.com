// Create a Waffo Pancake checkout session for the Pro subscription and return
// the hosted checkout URL. API-Key auth is signed with Web Crypto (Workers-safe).
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { signApiHeaders } from "@/lib/server/waffo";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.waffo.ai";
const PATH = "/v1/actions/checkout/create-session";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });

  if (!env.WAFFO_MERCHANT_ID || !env.WAFFO_PRIVATE_KEY || !env.WAFFO_PRO_PRODUCT_ID) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const appUrl = env.APP_URL || "https://billcrafter.com";
  const bodyObj = {
    productId: env.WAFFO_PRO_PRODUCT_ID,
    currency: "USD",
    buyerEmail: user.email,
    successUrl: `${appUrl}/invoicemanager?upgraded=1`,
    orderMerchantExternalId: user.id,
    metadata: { userId: user.id },
  };
  if (env.WAFFO_STORE_ID) bodyObj.storeId = env.WAFFO_STORE_ID;
  const bodyStr = JSON.stringify(bodyObj);

  try {
    const headers = await signApiHeaders(env, "POST", PATH, bodyStr);
    const r = await fetch(API_BASE + PATH, { method: "POST", headers, body: bodyStr });
    const j = await r.json().catch(() => ({}));
    const url = j?.data?.checkoutUrl;
    if (r.ok && url) return Response.json({ ok: true, checkoutUrl: url });
    return Response.json({ ok: false, error: j?.errors?.[0]?.message || "checkout_failed" }, { status: r.status || 502 });
  } catch {
    return Response.json({ ok: false, error: "checkout_failed" }, { status: 502 });
  }
}
