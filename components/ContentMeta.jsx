// Shared authorship + citation blocks for content pages (category hubs and the
// vertical landing pages). Three GEO levers live here:
//  - Byline: visible author attribution + a machine-readable <time> (E-E-A-T,
//    author signals, freshness).
//  - Sources: outbound citations to authoritative primary sources with one
//    short, attributed quotation — the single strongest AI-visibility lever.
import Link from "next/link";
import { AUTHOR, PUBLISHER, SITE_UPDATED, fmtDate } from "@/lib/site";

export function Byline() {
  return (
    <p className="byline">
      By <Link href="/about">{AUTHOR.name}</Link> · Reviewed by {PUBLISHER} ·
      Updated <time dateTime={SITE_UPDATED}>{fmtDate(SITE_UPDATED)}</time>
    </p>
  );
}

// A curated set of authoritative primary sources on what an invoice must contain
// and how to keep records. Government pages, deliberately jurisdiction-spanning
// (UK + US) so the citations are accurate wherever the reader is.
const SOURCES = [
  ["https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include",
   "GOV.UK — Invoicing and taking payment from customers",
   "The UK government’s list of what every invoice must legally include."],
  ["https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping",
   "IRS — Recordkeeping for small business",
   "US guidance on the invoices and receipts you should keep, and for how long."],
  ["https://www.sba.gov/business-guide/manage-your-business/manage-your-finances",
   "U.S. Small Business Administration — Manage your finances",
   "Bookkeeping, accounts receivable and getting paid as a small business."],
];

export function Sources() {
  return (
    <section className="band alt" id="sources">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Sources</div>
        <h2>What the official guidance says</h2>
        <blockquote className="cite-quote">
          <p>“Your invoice must include a unique identification number, your company name, address and contact information [and] the total amount owed.”</p>
          <cite>
            —{" "}
            <a href="https://www.gov.uk/invoicing-and-taking-payment-from-customers/invoices-what-they-must-include"
               target="_blank" rel="noopener nofollow">GOV.UK, “Invoices — what they must include”</a>
          </cite>
        </blockquote>
        <p className="lead" style={{ maxWidth: 720, marginTop: 18 }}>
          Requirements differ by country, but the essentials are consistent: a unique invoice number, the
          seller and the buyer, an itemized description, the amount due, and clear payment terms. Every
          BillCrafter template is built around those fields. The primary sources we follow are below.
        </p>
        <ul className="ref-list">
          {SOURCES.map(([href, title, note]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener nofollow">{title}</a>
              <span> — {note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
