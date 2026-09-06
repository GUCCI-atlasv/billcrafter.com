import Link from "next/link";
import { PRO_BETA, PRO_BADGE } from "@/lib/billing";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

function Check() {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}

export default function Pricing({ locale = DEFAULT_LOCALE }) {
  const { pc } = mktg(locale);
  return (
    <>
      <div className="price-grid">
        {/* No account — what you can do before signing up. */}
        <div className="price-card">
          <div className="price-name">{pc.anon.name}</div>
          <div className="price-amt"><span className="big">$0</span></div>
          <div className="price-note">{pc.anon.note}</div>
          <Link className="btn btn-ghost btn-block" href="/">{pc.anon.cta}</Link>
          <div className="price-lead">{pc.includes}</div>
          <ul className="price-feats">{pc.anon.feats.map((f) => (<li key={f}><Check />{f}</li>))}</ul>
          <p className="price-foot">{pc.anon.foot}</p>
        </div>

        {/* Free account — the plan we push. */}
        <div className="price-card featured">
          <span className="price-badge">{pc.free.badge}</span>
          <div className="price-name">{pc.free.name}</div>
          <div className="price-amt"><span className="big">$0</span><span className="per">{pc.free.per}</span></div>
          <div className="price-note">{pc.free.note}</div>
          <Link className="btn btn-solid btn-block" href="/signup">{pc.free.cta}</Link>
          <div className="price-lead">{pc.free.lead}</div>
          <ul className="price-feats">{pc.free.feats.map((f) => (<li key={f}><Check />{f}</li>))}</ul>
        </div>

        <div className="price-card">
          <span className="price-badge">{PRO_BETA ? PRO_BADGE : pc.pro.badge}</span>
          <div className="price-name">{pc.pro.name}</div>
          <div className="price-amt"><span className="big">$9.90</span><span className="per">{pc.pro.per}</span></div>
          <div className="price-note">{PRO_BETA ? pc.pro.noteBeta : pc.pro.note}</div>
          <Link className="btn btn-ghost btn-block" href="/upgrade">{PRO_BETA ? pc.pro.ctaBeta : pc.pro.cta}</Link>
          <div className="price-lead">{pc.pro.lead}</div>
          <ul className="price-feats">{pc.pro.feats.map((f) => (<li key={f}><Check />{f}</li>))}</ul>
        </div>
      </div>
      <p className="demo-note">{pc.note}{PRO_BETA ? pc.noteBeta : ""}</p>
    </>
  );
}
