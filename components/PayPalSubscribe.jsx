"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function PayPalSubscribe() {
  const [me, setMe] = useState(undefined);   // undefined=loading, null=logged out
  const [cfg, setCfg] = useState(null);
  const [status, setStatus] = useState("");  // "" | "error"
  const ref = useRef(null);
  const rendered = useRef(false);

  useEffect(() => {
    (async () => {
      try { const r = await fetch("/api/auth/me"); const d = await r.json().catch(() => ({})); setMe(d.user || null); } catch { setMe(null); }
      try { const r = await fetch("/api/paypal/config"); setCfg(await r.json()); } catch { setCfg({ ready: false }); }
    })();
  }, []);

  useEffect(() => {
    if (!me || !cfg || !cfg.ready || rendered.current) return;
    rendered.current = true;
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(cfg.clientId)}&vault=true&intent=subscription`;
    s.onload = () => {
      if (!window.paypal || !ref.current) { setStatus("error"); return; }
      try {
        window.paypal.Buttons({
          style: { shape: "pill", color: "black", layout: "vertical", label: "subscribe" },
          createSubscription: (data, actions) => actions.subscription.create({ plan_id: cfg.planId, custom_id: me.email }),
          onApprove: async (data) => {
            try { await fetch("/api/paypal/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subscriptionID: data.subscriptionID }) }); } catch {}
            window.location.href = "/invoicemanager?pro=1";
          },
          onError: () => setStatus("error"),
        }).render(ref.current);
      } catch { setStatus("error"); }
    };
    s.onerror = () => setStatus("error");
    document.body.appendChild(s);
  }, [me, cfg]);

  if (me === undefined || cfg === null) return <div className="muted" style={{ fontSize: 13 }}>Loading…</div>;
  if (me === null) return <div style={{ fontSize: 14 }}>Please <Link href="/login" style={{ textDecoration: "underline", color: "var(--ink)" }}>log in</Link> to upgrade to Pro.</div>;
  if (!cfg.ready) return <div className="muted" style={{ fontSize: 13 }}>Pro checkout isn’t configured yet — set <code>PAYPAL_CLIENT_ID</code> and <code>PAYPAL_PLAN_ID</code>, then deploy.</div>;

  return (
    <div>
      <div ref={ref} />
      {status === "error" && <p style={{ color: "var(--err-ink)", fontSize: 12.5 }}>Payment couldn’t start. Please try again.</p>}
      <p className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Signed in as {me.email}. $9.90/month · cancel anytime.</p>
    </div>
  );
}
