"use client";

import { useState } from "react";
import { PRO_BETA, PRO_NOTE } from "@/lib/billing";

// Fallback used only once PRO_BETA is switched off and Waffo isn't configured.
const PAYPAL_LINK = "https://www.paypal.com/ncp/payment/KJ64HHT93PWR4";

export default function UpgradeButton() {
  const [busy, setBusy] = useState(false);

  // ---- Private beta: no checkout, no payment redirect ----
  if (PRO_BETA) {
    return (
      <>
        <button className="btn btn-solid btn-block" disabled style={{ padding: 12, opacity: 0.55, cursor: "not-allowed" }}>
          Pro — in private beta
        </button>
        <p className="muted" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
          {PRO_NOTE}{" "}
          <a href="mailto:support@billcrafter.com?subject=BillCrafter%20Pro%20early%20access"
             style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>
            Request early access
          </a>
        </p>
      </>
    );
  }

  // ---- Live checkout ----
  async function go() {
    setBusy(true);
    try {
      const r = await fetch("/api/checkout", { method: "POST" });
      if (r.status === 401) { window.location.href = "/login?next=/upgrade"; return; }
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.checkoutUrl) { window.location.href = d.checkoutUrl; return; }
      window.location.href = PAYPAL_LINK;
    } catch {
      window.location.href = PAYPAL_LINK;
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className="btn btn-solid btn-block" onClick={go} disabled={busy} style={{ padding: 12, textAlign: "center" }}>
      {busy ? "Redirecting to secure checkout…" : "Subscribe — $9.90/mo"}
    </button>
  );
}
