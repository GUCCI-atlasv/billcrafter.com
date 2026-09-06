// Called by the client right after PayPal approval — verifies the subscription
// server-side and upgrades the account immediately (webhook remains authoritative).
import { getEnv, getSessionUser } from "@/lib/server/auth";
import { payToken, getSubscription, setPlan, upsertSub } from "@/lib/server/paypal";

export async function POST(request) {
  const env = await getEnv();
  if (!env?.DB || !env?.SESSIONS) return Response.json({ ok: false, error: "backend_unavailable" }, { status: 503 });
  const user = await getSessionUser(request, env);
  if (!user) return Response.json({ ok: false, error: "unauth" }, { status: 401 });
  const { subscriptionID } = await request.json().catch(() => ({}));
  if (!subscriptionID) return Response.json({ ok: false, error: "missing" }, { status: 400 });

  try {
    const token = await payToken(env);
    const sub = await getSubscription(env, token, subscriptionID);
    if (sub && (sub.status === "ACTIVE" || sub.status === "APPROVED")) {
      await setPlan(env, user.email, "pro");
      await upsertSub(env, user.id, subscriptionID, "active");
      return Response.json({ ok: true, plan: "pro" });
    }
    return Response.json({ ok: false, error: "not_active", status: sub?.status || "unknown" }, { status: 400 });
  } catch {
    return Response.json({ ok: false, error: "verify_failed" }, { status: 502 });
  }
}
