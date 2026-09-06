// Export-quota gate (STUB). Wire to D1 in production.
// Plan limits: anon = 1 lifetime, free = 10 / month, pro = unlimited.

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { userId = null, deviceId = null } = body;

  // TODO(prod): look up the user's plan + usage from D1, e.g.
  //   const env = getRequestContext().env; // @cloudflare/next-on-pages / opennext
  //   const plan = userId ? await getPlan(env.DB, userId) : 'anon';
  //   const used = await getUsage(env.DB, userId, deviceId);
  //   if (limitReached(plan, used)) return Response.json({ allowed:false, reason:'quota' }, { status: 402 });
  //   await incrementUsage(env.DB, userId, deviceId);

  return Response.json({
    allowed: true,
    plan: userId ? "free" : "anon",
    remaining: userId ? 10 : 1,
    note: "STUB — replace with D1-backed quota check (see db/schema.sql: export_usage).",
  });
}
