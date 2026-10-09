import Link from "next/link";
import VideoSection from "./VideoSection";
import AskAi from "./AskAi";
import JsonLd, { faqSchema, howToSchema } from "./JsonLd";
import { localePath, DEFAULT_LOCALE } from "@/lib/i18n";
import { mktg } from "@/lib/marketingI18n";

function IconZap() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" /></svg>); }
function IconCloud() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.4A4 4 0 0 0 6.5 19Z" /><path d="M12 12v5" /><polyline points="9.5 14.5 12 12 14.5 14.5" /></svg>); }
function IconGrid() { return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>); }

const ICONS = [IconZap, IconCloud, IconGrid];

// Template cards: the names are proper nouns / industry labels that read the same
// across our markets, so only the surrounding copy is translated.
const TEMPLATES = [
  ["F", "Freelance", "/templates/freelance-modern"],
  ["C", "Contractor", "/templates/contractor-band"],
  ["Co", "Consulting", "/templates/consulting-modern"],
  ["Ph", "Photography", "/templates/photography-elegant"],
  ["Cl", "Cleaning", "/templates/cleaning-ruled"],
  ["Sb", "Small business", "/templates/smallbiz-modern"],
  ["Rc", "Receipt", "/templates/receipt-modern"],
  ["+", "45", "/templates"],
];

// Step screenshots show the English UI, so their alt text stays English — a
// translated description would misdescribe the actual image.
const STEP_IMGS = [
  ["/steps/step-1-type.png", "Editing a line item directly on the invoice, with the total updating live"],
  ["/steps/step-2-customize.png", "Choosing the Band layout and an accent color from the side panel"],
  ["/steps/step-3-download.png", "The finished invoice downloading as INV-0042.pdf, no signup required"],
];

// variant="full" -> the complete marketing story (home pages, incl. localized)
// variant="slim" -> features + how-it-works only, for the SEO landing pages,
//   which previously repeated all ~800 words and looked near-identical to Google.
export default function MarketingSections({ intro, variant = "full", locale = DEFAULT_LOCALE, path }) {
  const full = variant === "full";
  const M = mktg(locale);
  const p = (path) => localePath(locale, path);
  // Defaults to the locale home; the SEO landing pages (which embed this
  // component but aren't the home page) pass their own path so the HowTo
  // schema's url points at the actual page, not "/".
  const pagePath = path || p("/");

  return (
    <>
      <section className="band" id="features">
        <div className="wrap">
          <div className="eyebrow">{M.feat.eyebrow}</div>
          <h2>{M.feat.h2}</h2>
          <p className="lead">{intro || M.feat.lead}</p>
          <div className="features">
            {M.feat.cards.map(([title, body], i) => {
              const Icon = ICONS[i] || IconZap;
              return (
                <div className="feature" key={title}>
                  <div className="ic"><Icon /></div>
                  <h3>{title}</h3>
                  <p>
                    {body}
                    {i === 2 ? <> <Link href="/templates" style={{ color: "var(--brand-ink)", textDecoration: "underline" }}>{M.feat.browse}</Link>.</> : null}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {full && (<section className="band alt" id="templates">
        <div className="wrap">
          <div className="eyebrow">{M.tpl.eyebrow}</div>
          <h2>{M.tpl.h2}</h2>
          <p className="lead">{M.tpl.lead}</p>
          <div className="tpl-grid">
            {TEMPLATES.map(([mark, nm, href]) => (
              <Link key={href} className="tpl-card" href={href}>
                <div className="mono">{mark}</div>
                <div className="nm">{nm}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>)}

      <JsonLd data={howToSchema({
        name: M.step.h2,
        description: M.feat.lead,
        url: `https://billcrafter.com${pagePath}#how`,
        locale,
        steps: M.step.items.map(([title, body], i) => [title, body, (STEP_IMGS[i] || STEP_IMGS[0])[0]]),
      })} />
      <section className="band" id="how">
        <div className="wrap">
          <div className="eyebrow">{M.step.eyebrow}</div>
          <h2>{M.step.h2}</h2>
          <div className="steps">
            {M.step.items.map(([title, body], i) => {
              const [img, alt] = STEP_IMGS[i] || STEP_IMGS[0];
              return (
                <div className="step" key={title}>
                  <img className="step-img" src={img} alt={alt} width="720" height="460" loading="lazy" decoding="async" />
                  <div className="n">{String(i + 1).padStart(2, "0")}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Videos sit right after "how it works" — they show the same three steps
          in motion, so they reinforce rather than repeat. */}
      {full && <VideoSection locale={locale} />}


      {full && (<section className="band alt" id="faq">
        <div className="wrap">
          <JsonLd data={faqSchema(M.faq.items)} />
          <div className="eyebrow">{M.faq.eyebrow}</div>
          <h2>{M.faq.h2}</h2>
          <div style={{ marginTop: 24, maxWidth: 760 }}>
            {M.faq.items.map(([q, a], i) => (
              <details className="faq" key={q} open={i === 0}>
                <summary><h3>{q}</h3></summary>
                <p>{a}</p>
              </details>
            ))}
            <p className="muted" style={{ fontSize: 13.5, marginTop: 18 }}>{M.faq.still} <a href="mailto:support@billcrafter.com" style={{ color: "var(--ink)", textDecoration: "underline" }}>support@billcrafter.com</a>.</p>
            <AskAi locale={locale} />
          </div>
        </div>
      </section>)}

      {full && (<section className="band">
        <div className="wrap">
          <div className="eyebrow">{M.tr.eyebrow}</div>
          <h2>{M.tr.h2}</h2>
          <div className="trust-row">
            {M.tr.items.map(([sc, lb]) => (
              <div className="trust-item" key={lb}><div className="sc">{sc}</div><div className="lb">{lb}</div></div>
            ))}
            <a
              className="trust-badge"
              target="_blank"
              rel="noopener"
              href="https://betalist.com/startups/billcrafter?utm_campaign=badge-billcrafter&utm_medium=badge&utm_source=badge-featured"
            >
              <img
                alt="BillCrafter - Create invoices, estimates, and receipts fast with no signup required | BetaList"
                width={156}
                height={54}
                src="https://betalist.com/badges/featured?id=178792&theme=color"
              />
            </a>
          </div>
        </div>
      </section>)}
    </>
  );
}
