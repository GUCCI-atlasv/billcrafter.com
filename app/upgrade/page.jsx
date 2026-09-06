import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import UpgradeButton from "@/components/UpgradeButton";
import { PRO_BETA } from "@/lib/billing";

export const metadata = { title: "Upgrade to Pro", robots: { index: false } };

const FEATURES = [
  "Unlimited PDF exports (Free is 5 / month)",
  "PAID / UNPAID status stamps",
  "Share links with view tracking",
  "Recurring invoices",
  "Unlimited invoice emails to clients",
  "Priority support",
];

export default function Upgrade() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero"><div className="wrap" style={{ maxWidth: 720 }}>
          <div className="hero-head">
            {PRO_BETA && <div className="eyebrow">In private beta</div>}
            <h1>BillCrafter Pro</h1>
            <p className="sub">
              {PRO_BETA
                ? <>Pro will be <strong style={{ color: "var(--ink)" }}>$9.90/month</strong> for unlimited exports and everything below. It’s in private beta while we finish billing — <strong style={{ color: "var(--ink)" }}>you can’t buy it yet</strong>, and the free plan is unaffected.</>
                : <>Unlimited exports and everything below, for <strong style={{ color: "var(--ink)" }}>$9.90/month</strong>. Cancel anytime.</>}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18, marginTop: 22 }}>
            <div className="price-card featured" style={{ maxWidth: 460 }}>
              <span className="price-badge">{PRO_BETA ? "Pro · beta" : "Pro"}</span>
              <div className="price-amt"><span className="big">$9.90</span><span className="per">/ month</span></div>
              <div className="price-note">{PRO_BETA ? "Not purchasable yet — private beta" : "Billed monthly · cancel anytime"}</div>
              <ul className="price-feats" style={{ margin: "16px 0 20px" }}>
                {FEATURES.map((f) => (
                  <li key={f}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>{f}</li>
                ))}
              </ul>
              <UpgradeButton />

            </div>
          </div>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
