// Single switch for the Pro rollout.
//   PRO_BETA = true  -> Pro is shown as "in private beta"; no checkout redirect.
//   PRO_BETA = false -> the normal Waffo/PayPal checkout flow is restored.
// Flip this one value when you're ready to take payments.
export const PRO_BETA = true;

export const PRO_PRICE = "$9.90";
export const PRO_BADGE = "In private beta";
export const PRO_NOTE =
  "Pro is in private beta while we finish billing. Free accounts keep working — email us for early access.";
