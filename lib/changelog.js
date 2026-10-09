// Public changelog, shown at /changelog and linked from the footer.
//
// Dates below match Cloudflare deploys (UTC+8 session log), not when the code
// was written. Correct anything that drifts — a changelog that dates things
// wrong is worse than one that starts later.
//
// Add an entry when a change is DEPLOYED, not when it's written. Everything
// below is written for users, not for the repo: say what changed for them, not
// which file moved.
//
// tag: "new" | "improved" | "fixed"

export const RELEASES = [
  {
    date: "2026-10-09",
    title: "Clearer about what a PDF and an e-signature do",
    items: [
      ["improved", "The FAQ no longer says a PDF can’t be altered after you send it. A PDF keeps your layout identical for your client, but a standard PDF isn’t tamper-proof — keep your own copy as the record."],
      ["improved", "The e-signature consent now says you intend the signature to count as your handwritten one where the applicable law allows, instead of promising it is legally binding everywhere. Signatures already made keep the wording that was shown at the time."],
      ["improved", "The Writer template now opens with a writing job — an article, a batch of blog posts and an extra edit round — instead of a web design project."],
      ["improved", "Template pages note that the sample prices, tax rate, payment terms and late fee are placeholders to replace with what you agreed with your client."],
      ["improved", "Quantity, rate, date and totals fields in the editor now have names that screen readers announce."],
      ["improved", "The home page now opens with a “Create your invoice” button that jumps straight to the editor, and says up front how many PDFs you can download without an account. The “Ask an AI” links moved down to the FAQ."],
    ],
  },
  {
    date: "2026-09-28",
    title: "Invoice in Gram",
    items: [
      ["new", "You can now bill in GRAM (the TON network coin, formerly Toncoin). Pick it as the currency and the invoice shows a wallet address, network and QR code the same way USDT and USDC do."],
    ],
  },
  {
    date: "2026-09-15",
    title: "BillCrafter is now completely free",
    items: [
      ["new", "There are no paid plans any more. With a free account you can export and email as many invoices as you like."],
      ["new", "Status stamps, share links with view tracking, recurring invoices and multiple business profiles are now included in every free account."],
      ["improved", "Without an account you can export one PDF a day, instead of one a month. Status stamps need an account."],
    ],
  },
  {
    // TODO: set this to the deploy date before shipping — the entry was written
    // ahead of the release, and this file's rule is that dates match deploys.
    date: "2026-08-23",
    title: "Tax on a discounted invoice was too high",
    items: [
      ["fixed", "When an invoice carried both a discount and a tax rate, the tax was worked out on the amount before the discount. A £1,000 job at 20% VAT with 10% off billed £1,100 instead of £1,080. VAT, GST and most US sales tax all treat a discount as reducing the amount you're taxed on, so the tax line was overstated on every discounted invoice. It's now charged on the discounted amount. If only some lines are taxable, the discount is split across them in proportion rather than coming off one side."],
      ["fixed", "The figures in the totals block didn't always add up. Nothing was rounded until the moment it was drawn on screen, so a line of 1.035 printed as 1.04, tax at 20% printed as 0.21, and the total printed as 1.24 — a penny short of the two lines above it. Every amount is now rounded to the currency's own precision before it's added, so the column adds up to the total underneath it."],
      ["fixed", "Yen, won, rupiah and dong invoices were carrying fractional minor units internally. These currencies have no cents in everyday use, and the total is now a whole number rather than a rounded display of a fraction the client couldn't have paid."],
      ["fixed", "A flat discount larger than the invoice itself produced a negative total, and with a tax rate set, a negative tax line. A discount can now take an invoice to zero but no further."],
      ["improved", "Invoices you saved before this release keep the figures they were sent with. Reopening one, or a client opening its share link, shows the same numbers as the PDF already in their inbox — we're not going to quietly restate a bill someone has already paid. Where the old and new arithmetic differ, the editor says so and offers to recalculate. Anything you create or duplicate from now on uses the corrected figures."],
    ],
  },
  {
    date: "2026-08-17",
    title: "Ten guides that nothing linked to",
    items: [
      ["fixed", "The “Other generators” module at the foot of every guide always showed the same first six, so the ten guides added over the last fortnight — hourly, timesheet, deposit, progress billing, recurring, handyman, lawn care, pressure washing, attorney and tutoring — had no links pointing at them from anywhere on the site. They now rotate, and every guide has six pages linking to it."],
      ["improved", "Handyman and Hourly joined the footer, which is the one link that appears on every page."],
      ["improved", "llms.txt — the summary AI assistants read — was still describing the product as it stood before job sites, sections, deposits, payment schedules, job photos, timesheets and service periods existed. It now lists what the tool actually does, and every guide."],
    ],
  },
  {
    date: "2026-08-08",
    title: "PAID and UNPAID stamps actually appear now",
    items: [
      ["fixed", "Choosing a status stamp did nothing to the document. The setting was stored, saved with the invoice and shown correctly on a shared link — but the editor never drew it, so it was missing on screen and in the PDF. It now renders on the document itself, in whichever language you're working in."],
    ],
  },
  {
    date: "2026-08-08",
    title: "Read us, cite us, don't train on us",
    items: [
      ["new", "Our robots.txt now carries a Content Signal: search=yes, ai-input=yes, ai-train=no. Search engines and AI assistants are welcome to read these pages and quote them in an answer, with a link back. We'd rather they didn't fold the writing into model weights."],
      ["new", "ChatGPT, Claude and Perplexity crawlers are named and allowed explicitly, including the search and user-triggered ones that are how a citation actually happens."],
      ["new", "Ask ChatGPT / Ask Claude / Ask Perplexity buttons on the home page, in all 15 languages. They open the assistant with the question already typed — and it's a fair question asking for a comparison, not a request for praise."],
      ["new", "A security.txt at /.well-known/, so anyone finding a vulnerability has an obvious place to send it."],
    ],
  },
  {
    date: "2026-08-08",
    title: "One indexable page per language",
    items: [
      ["fixed", "The Spanish, Portuguese and Chinese market variants were still being offered to search engines as separate pages, even though /es-MX, /es-PE and /es-DO are 99.8% identical to /es. Each language now has exactly one indexable home page, and the regional markets point at it."],
      ["improved", "Every market is still there to pick — choosing Mexico still gives you pesos and 16% IVA. What changed is only what we tell search engines, and it now matches what /about has always done: one URL per language."],
    ],
  },
  {
    date: "2026-08-07",
    title: "Three fixes found by checking the live site",
    items: [
      ["fixed", "The JOB SITE and PO labels rendered centred and grey on a blank invoice instead of left-aligned like BILL TO. The class marking a block as empty happened to share its name with the empty-state style used by the saved-invoices drawer, so the document was picking up a style meant for a sidebar."],
      ["fixed", "Localized pages served <html lang=\"en\"> whatever language they were in, which meant a screen reader read Japanese copy with an English voice. Each page now declares its own language."],
      ["improved", "The recurring and hourly templates open with a real service period filled in. The pages argue that an invoice should state the span it covers, and the example was arriving with both date boxes blank."],
    ],
  },
  {
    date: "2026-08-03",
    title: "Bill by the hour: timesheets on the invoice",
    items: [
      ["new", "A timesheet mode. Switch it on and the line-item table grows a date column, the quantity column becomes Hours, and the totals gain a Total hours line — so a client can check the arithmetic before they check the price."],
      ["new", "Rate bands. Put senior time, junior time and disbursements under separate headings and each subtotals itself, which is how professional-services bills are actually read."],
      ["improved", "Consulting, legal, IT services, tutoring and personal training now open as real timesheets — dated entries with hours against a rate, rather than one line saying “24 hrs”."],
      ["improved", "Bookkeeping and marketing retainers now show the monthly period alongside the ad-hoc work billed on top of it, so what's in scope and what isn't are visible on the same document."],
      ["new", "Four new guides: hourly invoices, timesheet invoices, attorney billing and tutoring — each opening the editor already filled in."],
    ],
  },
  {
    date: "2026-08-02",
    title: "Recurring work: service periods, and seven more trades updated",
    items: [
      ["new", "A service period block for recurring work. State the span the invoice covers and how often you attend — “1–31 May, weekly” — and the client can check the bill against a calendar instead of calling you. It stays hidden on one-off jobs."],
      ["new", "A line under the period for what that cycle actually covered, so a month with an extra visit, or a skipped one, explains itself on the document."],
      ["improved", "Cleaning, lawn care, pest control and HVAC now open as recurring plans, with the regular service and any one-off extras under separate headings that subtotal themselves."],
      ["improved", "Electrician, plumbing and moving picked up the job-site address and the labor/materials split. Moving now opens with the 50% booking deposit those jobs actually run on, and the electrician template carries a license number and permit reference."],
      ["new", "Four new guides: recurring invoices, lawn care, pressure washing and handyman work — each opening the editor already filled in for that trade."],
    ],
  },
  {
    date: "2026-08-02",
    title: "New markets, and a library that saves itself",
    items: [
      ["new", "Peru, the Dominican Republic and Vietnam as invoicing markets — Peruvian sol with 18% IGV, Dominican peso with 18% ITBIS, and Vietnamese dong with 10% VAT. Vietnamese is also a full language now, not just a currency: the editor, FAQ and About page are all translated."],
      ["improved", "Your business profile, client and line items now save themselves the moment you download, email, sign or save an invoice — no separate save buttons to remember."],
      ["improved", "A saved business profile now remembers the template and accent color you last used with it, and applies both automatically the next time you start a blank invoice."],
    ],
  },
  {
    date: "2026-08-01",
    title: "One export format: PDF",
    items: [
      ["improved", "Invoices now download as PDF only. The Word and Excel exports have been retired — they were HTML files with an Office extension, so they opened with a security warning and dropped the logo, signature, QR code and job photos on the way. What your client opened was never quite what you designed."],
      ["improved", "Plans are simpler as a result: every plan gets the same pixel-accurate PDF, all 45 templates and no watermark. The only difference is how many exports a month you get — 1 without an account, 5 free, unlimited on Pro."],
      ["improved", "Print is still one click and still free, so paper copies don't need an export at all."],
      ["new", "The four new trade fields — job site, deposit, payment schedule and job photos — are now translated into all 14 languages rather than falling back to English."],
      ["improved", "Every language now has the full 13-question FAQ, not the 6 it had before. The tax answer is written for each market rather than translated from the US one — so the German page explains the Kleinunternehmer note, the French page the franchise en base mention, and the Japanese page what an invoice needs under the qualified-invoice system."],
      ["improved", "Those answers are also honest about what a PDF from here is not: in Brazil it doesn't replace the nota fiscal, in Italy the SdI submission, in Korea a Hometax tax invoice, in Taiwan a 統一發票. Use it to bill and keep records, and file through the official channel."],
    ],
  },
  {
    date: "2026-08-01",
    title: "Built for the trades: job sites, sections, deposits and photos",
    items: [
      ["new", "Job photos on the invoice — attach up to six before/after shots with captions, and they print at the foot of the document like a completed-job report."],
      ["new", "Section headers in the line-item table. Group lines under Labor, Materials or anything else, each with its own computed subtotal — the way trade invoices are actually read."],
      ["new", "A job site / service address block, separate from the billing address. Optional, and it disappears from the PDF when empty."],
      ["new", "A Deposit field: ask for 30% (or a fixed amount) up front and the invoice prints “Deposit due” with the exact figure — without changing the total."],
      ["new", "A milestone payment schedule you can print on the document: deposit, progress payments, final — each with a date and amount."],
      ["new", "Two new guides: the deposit invoice and progress billing, with the Contractor and Handyman templates updated to use the new structure."],
    ],
  },
  {
    date: "2026-07-28",
    title: "E-signatures",
    items: [
      ["new", "Sign an invoice yourself and email the signed copy to your client — free with an account. Draw your signature, and it appears on the invoice itself rather than being stamped onto the download."],
      ["new", "Every signature is kept with a signing record: the exact consent wording, the time, and a verification hash of the file."],
      ["new", "A public changelog at /changelog — what shipped, in plain language."],
    ],
  },
  {
    date: "2026-07-27",
    title: "Clearer line items and download names",
    items: [
      ["improved", "Line-item descriptions accept line breaks and wrap properly, so long descriptions no longer look like one line on screen and three in the PDF."],
      ["improved", "Downloads are named by date, business and invoice number — 20260727_Rivera_Design_Studio_INV-0042.pdf — and non-Latin business names are kept intact."],
    ],
  },
  {
    date: "2026-07-26",
    title: "Videos, mobile fixes and a freer free plan",
    items: [
      ["new", "Three short product videos on the home page, showing the editor, the no-forms approach, and how repeat invoices take seconds."],
      ["improved", "The FAQ went from 6 questions to 13, covering the things people actually ask: whether an account is needed, whether there's a watermark, online payment, phone use, currencies and tax."],
      ["improved", "Videos load only when you press play, so they don't slow the page down, and no tracking cookies are set until then."],
      ["improved", "Free accounts now get 5 PDF exports a month, up from 3."],
      ["fixed", "The line-item table no longer collapses on phones — the description column was being squeezed to a single character per line."],
      ["fixed", "Number fields on mobile no longer trigger a zoom when tapped, which made them feel impossible to edit."],
    ],
  },
  {
    date: "2026-07-25",
    title: "More languages and markets",
    items: [
      ["new", "Japanese, with yen shown as whole numbers the way invoices there are written."],
      ["new", "Swedish, with the krona after the amount (1 234,56 kr) rather than in front."],
      ["new", "Israel as an invoicing market, with the shekel and 18% VAT."],
      ["improved", "The whole home page is now translated, not just the editor — features, pricing, FAQ and footer included."],
      ["improved", "The About page is available in every language."],
      ["fixed", "Tax and invoicing answers are now written for each market instead of translated from the US version, which was giving wrong guidance in several countries."],
    ],
  },
  {
    date: "2026-07-24",
    title: "Templates and the invoice manager",
    items: [
      ["new", "45 templates organised into 9 industry categories, each with its own page."],
      ["improved", "Saved clients, reusable line items and your business profile now fill straight into the editor."],
      ["improved", "The dashboard is now the invoice manager, with duplicate and delete on saved invoices."],
      ["fixed", "Invoices that failed to save silently now save correctly, and tell you honestly when something goes wrong."],
      ["fixed", "Printing an invoice showed empty form boxes instead of your text, and the coloured table header disappeared entirely."],
      ["improved", "More breathing room around the edge of the document, so nothing sits tight against the margin."],
    ],
  },
  {
    date: "2026-07-23",
    title: "Crypto payments",
    items: [
      ["new", "USDT and USDC invoicing with a scannable wallet QR code — network, address, optional memo, and a live QR that updates as you type."],
    ],
  },
  {
    // Reconstructed from the work itself, not a deploy log — correct if it drifts.
    date: "2026-07-22",
    title: "Pricing, reviews and a working About page",
    items: [
      ["new", "A three-tier pricing layout: a no-account option ahead of Free, with Free now the recommended, highlighted plan."],
      ["new", "A prompt asking for a Trustpilot review right after your PDF finishes downloading — shown once a day, not on every export."],
      ["improved", "The Trustpilot review link moved next to the download actions instead of sitting alone at the bottom of the page, and it's now also in the invoice manager sidebar and on the welcome banner after signing in."],
      ["fixed", "The About page, which was 404ing, is back — with justified text and an image."],
      ["fixed", "Some non-English pages occasionally failed to load with a server error under traffic. The page is now served from cache instead of being re-rendered on every visit."],
    ],
  },
  {
    date: "2026-07-16",
    title: "Usage analytics for Admin",
    items: [
      ["new", "The Admin console can now see how the product is used — page views and key actions — so we can tell which parts people actually open."],
    ],
  },
  {
    date: "2026-07-15",
    title: "Clearer Terms, Privacy and footer",
    items: [
      ["improved", "Terms and Privacy updated for emailing invoices, magic-link sign-in, PayPal billing and Resend delivery — including what we log when you send an invoice."],
      ["improved", "The site footer now lists Legal, Account and Product in one place: Terms, Privacy, Dashboard, Upgrade, and the support / legal / privacy emails."],
    ],
  },
  {
    date: "2026-07-11",
    title: "Email invoices to clients",
    items: [
      ["new", "Email a PDF invoice to your client from the editor — replies come back to you. Requires a signed-in account, and counts toward your monthly export allowance."],
      ["new", "An Email log in the Admin console: every send or failure, with sender, recipient, subject and status."],
      ["fixed", "Signing in from the editor now creates a real server session. The old demo login only wrote to the browser, so emailed invoices never left the building."],
    ],
  },
  {
    date: "2026-07-11",
    title: "Pro, contact and a sitemap",
    items: [
      ["new", "Pro at $9.90 / month via PayPal — unlimited exports, billed monthly until you cancel."],
      ["new", "A contact page for support, privacy and legal questions."],
      ["new", "A public sitemap at /sitemap.xml so search engines can find the generator and template pages."],
      ["improved", "Free accounts see an Upgrade banner on the dashboard when they're on the free plan."],
    ],
  },
  {
    date: "2026-07-11",
    title: "Real accounts, Terms and Admin",
    items: [
      ["new", "Email + password accounts backed by a real database — register, log in, stay signed in, and sign out."],
      ["new", "Magic-link sign-in: we email a one-time link that expires in 15 minutes."],
      ["new", "Formal Terms of Service and Privacy Policy pages."],
      ["new", "A real Admin console: live user counts, Pro subscribers, saved invoices, and an audit log — no more mock rows."],
      ["improved", "Removed the invented Trustpilot / G2 star ratings and “1M+” figures from the home page. The trust strip now states product facts only."],
    ],
  },
  {
    date: "2026-07-11",
    title: "BillCrafter goes live",
    items: [
      ["new", "BillCrafter is live on billcrafter.com — a free WYSIWYG invoice generator for freelancers and small businesses."],
      ["new", "Create invoices, estimates, quotes and receipts; download PDF; print; switch document type without starting over."],
      ["new", "Starter templates in the editor: Freelance, Contractor, Consulting, Photography, Cleaning, Small business and Receipt."],
      ["new", "Industry landing pages for freelancers, contractors, consultants and more — each opens the generator with a sensible starting point."],
      ["improved", "No “Crafted with BillCrafter” watermark on the preview or the download — free use stays free."],
      ["fixed", "Template and industry pages that returned empty under Cloudflare now open correctly."],
    ],
  },
];

export const LATEST = RELEASES[0]?.date || null;
