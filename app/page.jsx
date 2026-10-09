import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import InvoiceEditor from "@/components/InvoiceEditor";
import MarketingSections from "@/components/MarketingSections";
import AskAi from "@/components/AskAi";
import { homeAlternates, DEFAULT_LOCALE } from "@/lib/i18n";

// Each declared alternate is an indexable, self-canonical home page. English
// market variants sharing this copy are deliberately omitted until localized.
export const metadata = { alternates: { canonical: "/", ...homeAlternates() } };

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-head">
              <div className="eyebrow">Invoices · Estimates · Quotes · Receipts</div>
              <h1>Free Invoice Generator for Freelancers &amp; Small Businesses</h1>
              <p className="sub">The invoice tool built for speed. Edit directly on the invoice — what you type is what you get. Create invoices, estimates, quotes and receipts, then download a clean PDF. No signup to download, keyboard-fast.</p>
              <div className="meta"><span>No signup to download</span><span>Free &amp; unlimited editing</span><span>Vector PDF, never clipped</span></div>
              <AskAi locale={DEFAULT_LOCALE} />
            </div>
            <InvoiceEditor initialType="invoice" initialScenario="blank" />
          </div>
        </section>
        <MarketingSections />
      </main>
      <SiteFooter />
    </>
  );
}
