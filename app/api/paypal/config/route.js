// Public PayPal config for the client SDK (client-id + plan-id are not secret).
import { getEnv } from "@/lib/server/auth";

export async function GET() {
  const env = await getEnv();
  const clientId = env?.PAYPAL_CLIENT_ID || null;
  const planId = env?.PAYPAL_PLAN_ID || null;
  return Response.json({ ok: true, ready: !!(clientId && planId), clientId, planId, env: env?.PAYPAL_ENV || "live" });
}
