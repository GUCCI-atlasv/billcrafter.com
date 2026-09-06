// Stripe webhook (STUB). Production: verify signature, update subscriptions in D1.

export async function POST(request) {
  // TODO(prod):
  //  const sig = request.headers.get('stripe-signature');
  //  const event = stripe.webhooks.constructEvent(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  //  handle: checkout.session.completed, customer.subscription.updated/deleted ->
  //          set users.plan = 'pro'/'free' in D1.
  await request.text().catch(() => "");
  return Response.json({ received: true, note: "STUB — verify signature + update subscriptions in D1." });
}
