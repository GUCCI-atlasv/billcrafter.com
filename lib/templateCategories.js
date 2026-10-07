// SEO content for the template category hub pages (/templates/c/<slug>).
// Keyed by the exact group name in lib/templates.js. Each block is unique,
// substantive copy for that industry category — the single-template pages
// deliberately carry no long-form SEO content, so this is where it lives.

export const CATEGORY_SEO = {
  "Freelance & creative": {
    h1: "Free invoice templates for freelancers & creatives",
    sub: "Editable invoice templates for designers, developers, writers, photographers, videographers, marketers and studios — each opens pre-filled.",
    intro: "Freelancers and creative professionals bill in a lot of different shapes — a fixed project fee, an hourly rate, a licensing grant, a monthly retainer. Each template here opens with a worked example for that kind of work, so you can see a finished invoice before you change a single field.",
    sections: [
      { h: "Bill by project, by hour, or by usage", p: "Fixed-scope work goes on a single line with the agreed fee. Hourly work goes on as quantity × rate so the client sees the hours, not just a lump sum. Creative work often adds a third kind of line — a licensing or usage grant, which is frequently worth more than the time spent. Putting the grant on its own line creates a written record of exactly what the client bought, and that record is what protects you if they later want to use the work more widely." },
      { h: "Look professional without an accounting suite", p: "A freelance invoice doesn't need software — it needs to be clear, numbered, and sent the day the work is done. Pick a layout that fits your brand: a monospace style for developers, an elegant serif for writers, a modern accent for designers. Add your logo, and download a clean PDF. Save a free account and every invoice is kept in one place for tax time." },
    ],
    faq: [
      ["Do I need a registered business to invoice as a freelancer?", "No. Sole traders and freelancers can invoice under their own legal name and address. A business name and tax number are useful once you have them, but neither is required to bill a client or be paid."],
      ["How do I invoice for licensing or usage rights?", "Put the grant on its own line — “Commercial usage, social media, one year”, for example — separate from the time or production cost. It documents what the client bought and protects you if they later want to use the work more widely."],
    ],
  },
  "Trades & construction": {
    h1: "Free invoice templates for trades & construction",
    sub: "Contractor, electrician and plumbing invoice templates — separate labor and materials, apply tax correctly, print clearly on site.",
    intro: "Trade invoices have to do something office invoices don't: keep labor and materials separate, handle tax that differs between the two, and stay readable when they're printed and pinned to a wall or photographed on a phone.",
    sections: [
      { h: "Keep labor and materials on separate lines", p: "Combining them into one figure is the fastest way to get an invoice questioned. Listing labor hours above itemized materials shows the client exactly what they're paying for — and it matters practically, because in many US states labor and materials are taxed differently and have to be separable anyway. Every template here marks each line taxable or not." },
      { h: "Deposits, progress billing and the final invoice", p: "Larger jobs rarely bill once. A common pattern is a deposit up front, one or two progress invoices at agreed milestones, and a final invoice on completion. Record what's already been paid and the document shows the remaining balance instead of the full contract value — so clients don't pay twice and you don't chase money you've already received." },
    ],
    faq: [
      ["Should I charge sales tax on labor?", "It depends on your state and the type of work — some tax labor, some tax only materials, and some distinguish repair from new construction. Mark each line taxable or not to match your situation, and confirm the rule with your state revenue office or accountant."],
      ["Can I invoice from the job site?", "Yes. The editor works in a phone or tablet browser, so you can fill in the invoice, download the PDF and email it while you're still on site."],
    ],
  },
  "Home & auto": {
    h1: "Free invoice templates for home & auto services",
    sub: "Cleaning, HVAC, landscaping, handyman, auto repair, pest control and moving invoice templates — one-off or recurring.",
    intro: "Home and auto service businesses bill a mix of one-off jobs and recurring contracts, usually with a service call, some labor, and parts or supplies. These templates open with that structure already laid out.",
    sections: [
      { h: "Per visit or per month — be consistent", p: "One-off jobs invoice per job on completion. Regular contracts are simpler billed monthly in arrears — one line reading “Weekly service, 4 visits, March” instead of four separate invoices. Monthly billing means a quarter of the paperwork and a quarter of the chasing, and commercial clients usually prefer it because it matches how their own accounts run." },
      { h: "Service call, labor, parts", p: "Most service invoices have three parts: the call-out or diagnostic fee, the labor to do the work, and any parts or supplies. Listing them separately answers the customer's questions before they ask, and lets you apply tax to parts but not labor where that's the correct treatment. Add a warranty note on the work and the invoice doubles as a record." },
    ],
    faq: [
      ["How do I show a deposit that's already been paid?", "Enter it in the “Amount paid” field. The invoice then shows the total, the amount received, and the balance due — so the customer pays the remainder, not the whole figure again."],
      ["Can I set up a recurring invoice that sends itself?", "Yes, with a free account. Save the invoice once, choose a frequency and a customer email, and each cycle a new invoice is issued and emailed automatically."],
    ],
  },
  "Health & beauty": {
    h1: "Free invoice templates for health & beauty",
    sub: "Hair salon, massage therapy and personal trainer invoice templates — sessions, packages and add-ons.",
    intro: "Health, wellness and beauty professionals usually bill for time — a session, a treatment, a class — often sold in packages. These templates open with a session-based example you can adapt in a minute.",
    sections: [
      { h: "Sessions, packages and add-ons", p: "Put the core service on the first line — a 60-minute massage, a cut and color, a training session — then add-ons below it. Packages (a block of ten sessions, a monthly plan) go on a single line with the agreed price; note in the description what the package covers so there's no confusion later." },
      { h: "Tax, tips and payment methods", p: "Personal services are taxed differently by state, and many are exempt where retail goods are not — so mark product lines taxable and service lines according to your local rule. Record the payment method on the receipt, especially for card, HSA/FSA or app payments, so both sides can match it to a statement." },
    ],
    faq: [
      ["How do I invoice a package of sessions?", "Put the package on one line with the total price and note what it includes — for example “10-session training block”. As sessions are used you can issue receipts against it, or keep the one invoice as the record of purchase."],
      ["Do I charge tax on services?", "It varies by state and by whether the line is a service or a physical product. Mark each line taxable or not to match your situation, and check your local requirement."],
    ],
  },
  "Professional services": {
    h1: "Free invoice templates for professional services",
    sub: "Consulting, accounting, legal, real estate and IT invoice templates — hourly, retainer and fixed-fee billing.",
    intro: "Professional-service firms bill by the hour, on a monthly retainer, or per matter — often with a purchase order and Net 30 terms. These templates open configured for that, so an invoice looks the part for a corporate accounts-payable team.",
    sections: [
      { h: "Hourly, retainer or fixed fee", p: "Hourly and day-rate work goes on as quantity × rate with the period stated. A retainer is a single line for the agreed monthly fee, ideally with a note of what it covers. Fixed-fee or per-matter work names the deliverable. Ambiguity here is the single most common reason a services invoice sits unpaid in an approvals queue." },
      { h: "Get the PO number and state the terms", p: "Most mid-size and enterprise clients raise a purchase order before work starts, and their AP system will reject an invoice that doesn't quote it — so ask for the PO at kickoff and put it in the PO field. State Net 30 with an explicit due date rather than only the term, and keep numbering strictly sequential for your own reconciliation." },
    ],
    faq: [
      ["Do I need a PO number on the invoice?", "Only if the client uses purchase orders — but if they do, an invoice without one will typically be rejected automatically. Ask at the start of the engagement and enter it in the PO field."],
      ["What's the difference between a retainer and a fixed-fee invoice?", "A retainer bills a recurring agreed amount that reserves your availability, usually monthly. A fixed-fee invoice bills a set price for a defined piece of work. Both are single-line, but a retainer repeats on the same date each period."],
    ],
  },
  "Events & food": {
    h1: "Free invoice templates for events & food",
    sub: "Catering, florist and event-planner invoice templates — deposits, per-guest pricing and vendor lines.",
    intro: "Event and food businesses bill in two moments — a deposit to reserve the date, and a balance close to the event — often with per-guest or per-arrangement pricing. These templates open with that structure.",
    sections: [
      { h: "Deposit to book, balance before the event", p: "Take a non-refundable deposit to hold the date and record it in the “Amount paid” field so the invoice shows the balance outstanding, not the full figure. State clearly when the balance is due — typically one to two weeks before the event — and when the final guest count or order has to be confirmed." },
      { h: "Per-guest, per-item, and vendor lines", p: "Catering usually bills per guest for food plus separate lines for staff, delivery and setup. Florists bill per arrangement plus delivery. Event planners bill a planning fee, day-of coordination and vendor management as distinct lines. Itemizing this way makes the quote easy to approve and the final invoice easy to reconcile against it." },
    ],
    faq: [
      ["How do I handle a deposit on the invoice?", "Enter the deposit in the “Amount paid” field. The document then shows the full price, the deposit received, and the balance due before the event — so the client pays the remainder, not the whole amount again."],
      ["Should I send an estimate or quote first?", "For events, yes — send a quote or estimate the client can approve in writing, then convert it to an invoice once the date is booked. Every detail carries across, so nothing is retyped."],
    ],
  },
  "Retail & business": {
    h1: "Free invoice templates for retail & small business",
    sub: "General small-business, retail and tutoring invoice templates — itemized goods and services with tax.",
    intro: "Small businesses and retailers bill for a mix of goods and services, usually with sales tax, and need a clean numbered document they can hand over or email. These templates open ready to itemize.",
    sections: [
      { h: "Numbering is boring and it matters", p: "Invoice numbers must be unique and run in sequence — that's what lets you prove a payment belongs to a particular sale, and it's the first thing an accountant or auditor checks. Pick a format and never break it: INV-0001 onwards is fine, and a year prefix like 2026-014 works well if you want the year visible at a glance." },
      { h: "Goods, services and sales tax", p: "Retail lines are usually taxable; some services are not. Mark each line so the tax is calculated correctly, and set the rate for your jurisdiction in the side panel. Keep a copy of every document you issue — a free account stores them all in one place, so year-end isn't a reconstruction from your sent-mail folder." },
    ],
    faq: [
      ["Do I have to charge sales tax?", "Only if you're registered to collect it in the relevant jurisdiction. Thresholds and rules vary by state and country, so check your local requirement — the tool applies whatever rate you enter, including none."],
      ["Can I use this as a bill for a shop sale?", "Yes. A bill and an invoice are the same document — itemize the goods, add tax, and hand over or print the PDF. Use it as a cash bill or a business invoice interchangeably."],
    ],
  },
  "Estimates & quotes": {
    h1: "Free estimate & quote templates",
    sub: "Estimate and quote templates that convert to an invoice in one click when the work is approved.",
    intro: "An estimate and a quote both price work before it starts — but they're not the same thing, and using the wrong one is an expensive wording mistake. These templates open with the right label and structure for each.",
    sections: [
      { h: "Estimate vs quote — the difference matters", p: "An estimate is a good-faith projection that can reasonably change if the scope grows. A quote is a fixed price you commit to once the client accepts. Use an estimate when the final scope isn't fully known — hidden damage, unknown site conditions; use a quote when you can define the work tightly. Labelling a document “quote” when you meant “estimate” can bind you to a figure you costed months ago." },
      { h: "Say what's excluded, and set a validity date", p: "Most disputes come from the gap between what the client imagined and what you priced. A short exclusions note prevents the argument. Put a “valid until” date on it — typically 14 to 30 days — so material prices moving isn't your problem. When the client approves, convert the estimate or quote straight to an invoice and every detail carries across." },
    ],
    faq: [
      ["Can I turn an approved estimate into an invoice?", "Yes — use “Convert to invoice” in the editor and every detail carries across, with the document wording and numbering updated for you."],
      ["How long should a quote stay valid?", "14 to 30 days is normal — long enough for the client to decide, short enough that you're not bound to old material prices. State the date explicitly on the document."],
    ],
  },
  "Receipts": {
    h1: "Free receipt templates",
    sub: "Payment receipt, retail receipt and rent receipt templates — proof of payment, marked paid in full.",
    intro: "A receipt confirms money already received — the opposite end of the transaction from an invoice. Customers keep receipts to claim expenses, reclaim tax and prove a purchase, so issuing one promptly saves you being asked months later.",
    sections: [
      { h: "A receipt confirms; an invoice requests", p: "An invoice goes out before payment and asks for money; a receipt goes out after and confirms it arrived. Record how the payment was made — “Bank transfer, 14 April” or “Card ending 4242” — because that's what lets both sides match the receipt to a statement. For cash especially, a dated receipt with the method is close to essential, since there's no bank record to fall back on." },
      { h: "Paid in full, or part payment", p: "If the payment settles the whole amount, the document should say so plainly — these templates mark it “Paid in full” when the balance reaches zero. If it's a deposit or installment, the receipt shows the amount received and the balance still outstanding, so nobody later mistakes a part payment for a closed account. Rent receipts work the same way, one per month." },
    ],
    faq: [
      ["Do I need to issue a receipt if I already sent an invoice?", "Not always, but it's good practice and customers often ask. The invoice shows what was owed; the receipt proves it was paid — which is what they need for expenses and tax."],
      ["Can I make a receipt for a cash payment?", "Yes. Record the amount, the date and “cash” as the method. For cash especially, both sides benefit from a dated document since there's no bank record."],
    ],
  },
};
