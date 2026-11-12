// Config-driven SEO landing-page matrix.
// Each entry renders the generator with a scenario preset plus copy that is
// genuinely specific to that trade — a checklist, three sections and FAQs.
// These pages previously shared ~800 words of site-wide marketing and carried
// only ~70 unique words each, which is why Google discovered but didn't index
// them. Everything below is unique to its page.

export const VERTICALS = [
  {
    slug: "freelance-invoice-generator",
    type: "invoice", scenario: "freelance",
    h1: "Free freelance invoice generator",
    sub: "Create a professional freelance invoice in seconds — itemize your work, add your logo, and download a clean PDF. No signup to download.",
    intro: "Freelancers and self-employed professionals can bill clients in minutes. Add line items for design, development, writing, or hourly work, apply tax where needed, and send a polished invoice that gets you paid.",
    include: [
      "Your name or trading name, address and email",
      "The client's company name and billing contact",
      "A unique, sequential invoice number",
      "Issue date and a clear due date",
      "Each deliverable or block of hours, with the rate",
      "Subtotal, any tax, and the total due",
      "How to pay you — bank transfer, PayPal, or a payment link",
    ],
    sections: [
      {
        h: "Bill by the project or by the hour",
        p: "Most freelance work bills one of two ways. Fixed-project work goes on a single line — “Website design, 5 pages, 2 revision rounds” — with the agreed fee. Hourly work goes on as quantity × rate, so the client can see 18 hours at $85 rather than a lump sum with no explanation. Itemizing this way cuts the number of “what is this for?” emails dramatically, and it makes partial disputes easier: a client can query one line instead of holding up the whole invoice.",
      },
      {
        h: "Send it the day you finish, and set a real due date",
        p: "Invoices get paid in the order they arrive in an accounts inbox, so the delay between finishing work and sending the bill is dead time you never get back. Net 14 is a sensible default for independent work; reserve Net 30 for larger companies that genuinely run monthly payment cycles. Put the actual calendar date on the invoice rather than “Net 14” alone — it removes any argument about when the clock started.",
      },
      {
        h: "Tax details: use an EIN, never your SSN",
        p: "In the US you can invoice as a sole proprietor under your own name and address. If you have an EIN, put it on the invoice; if you don't, you can request one free from the IRS. Never print your Social Security number on a document you email to clients — it circulates through inboxes and accounting systems you don't control. Outside the US, include whatever tax registration number your country requires, and only add sales tax or VAT if you're actually registered to charge it.",
      },
    ],
    faq: [
      ["Do I need a registered business to send an invoice?", "No. Freelancers and sole traders can invoice under their own legal name and address. A registered company name and tax number are useful once you have one, but neither is required to bill a client or to be paid."],
      ["What invoice number should I start with?", "Anything sequential works — INV-0001 is fine. The only real rules are that numbers never repeat and never go backwards, because that's what lets you and your accountant reconcile payments later."],
      ["Should I ask for a deposit?", "For new clients or projects over a couple of weeks, a 30–50% deposit is normal and protects you. Record it in the “Amount paid” field so the invoice shows the balance still outstanding rather than the full figure."],
    ],
  },

  {
    slug: "contractor-invoice-generator",
    type: "invoice", scenario: "contractor",
    h1: "Free contractor invoice generator",
    sub: "Built for trades and on-site work — bill labor and materials, add sales tax, and download or print a professional invoice from any device.",
    intro: "Contractors, painters, electricians, plumbers and cleaners can invoice on the job site. Separate labor from materials, mark which lines are taxable, and hand the client a clear, itemized invoice.",
    include: [
      "The job address, not just the billing address",
      "Labor as hours × rate, listed separately",
      "Materials itemized, with quantities",
      "Which lines are taxable and which aren't",
      "Any deposit already paid, and the balance due",
      "Warranty or guarantee terms on the work",
      "Permit or job reference numbers where relevant",
    ],
    sections: [
      {
        h: "Keep labor and materials on separate lines",
        p: "Combining them into one figure is the fastest way to get an invoice questioned. Listing “Interior painting — labor, 18 hrs @ $55” above “Paint and materials — $340” shows the client exactly what they're paying for, and it matters practically too: in many US states labor and materials are taxed differently, so they have to be separable anyway. It also makes change orders easy to add without rewriting the whole document.",
      },
      {
        h: "Sales tax varies more than most trades expect",
        p: "Whether you charge tax on labor, on materials, or on both depends on your state and sometimes on the type of work — new construction and repair are often treated differently. BillCrafter lets you mark each line taxable or not, so a materials line can carry tax while a labor line doesn't. What the correct treatment is for your work is a question for your state's revenue department or your accountant; this tool will apply whatever you tell it to.",
      },
      {
        h: "Deposits, progress billing and the final invoice",
        p: "Larger jobs rarely bill once. A common pattern is a deposit up front, one or two progress invoices at agreed milestones, and a final invoice on completion. Record what's already been paid in the “Amount paid” field and the document shows the remaining balance instead of the full contract value — which stops clients paying the same amount twice, and stops you chasing money you've already received.",
      },
    ],
    faq: [
      ["Should I charge sales tax on labor?", "It depends on your state and the type of work — some tax labor, some tax only materials, and some distinguish repair from new construction. Mark each line taxable or not to match your situation, and confirm the rule with your state revenue office or accountant."],
      ["Can I invoice from the job site?", "Yes. The editor works in a phone or tablet browser, so you can fill in the invoice before you leave, download the PDF and email it to the client while you're still there."],
      ["How do I show a deposit that's already been paid?", "Enter it in the “Amount paid” field. The invoice then shows the total, the amount received, and the balance due — so the client pays the remainder, not the whole figure again."],
    ],
  },

  {
    slug: "consulting-invoice-generator",
    type: "invoice", scenario: "consulting",
    h1: "Free consulting invoice generator",
    sub: "Invoice clients for advisory, hourly, or retainer work. Add your rate, terms, and payment details — then download a clean PDF.",
    intro: "Consultants and agencies can bill by the hour or by project, include PO numbers and Net 30 terms, and present a professional invoice that reflects the value of the work.",
    include: [
      "The engagement or project name",
      "The billing period the invoice covers",
      "Hours, days or milestones with your rate",
      "The client's PO number, if they issue one",
      "Expenses billed on, listed separately",
      "Payment terms and bank details",
    ],
    sections: [
      {
        h: "Hourly, daily, retainer or milestone",
        p: "Each bills differently and the invoice should make which one obvious. Hourly and day-rate work goes on as quantity × rate with the period stated — “Strategy advisory, June, 24 hrs @ $185”. A retainer is one line for the agreed monthly fee, ideally with a note of what it covers. Milestone billing names the deliverable that was reached. Ambiguity here is the single most common reason a consulting invoice sits unpaid in an approvals queue.",
      },
      {
        h: "Get the PO number before you invoice",
        p: "Most mid-size and enterprise clients raise a purchase order before work starts, and their accounts payable system will reject or park any invoice that doesn't quote it. Ask for the PO number at kickoff, not at invoice time, and put it in the PO field. It's a thirty-second question that routinely saves two or three weeks of payment delay.",
      },
      {
        h: "Net 30, and what to do when it slips",
        p: "Net 30 is the realistic default for corporate clients, whose payment runs are usually monthly. State the due date explicitly rather than only the term. If you intend to charge interest on late payment, that has to be agreed in your contract before the work — an interest line that first appears on an overdue invoice is rarely enforceable and tends to damage the relationship more than it recovers.",
      },
    ],
    faq: [
      ["What is a retainer invoice?", "A recurring invoice for an agreed monthly fee that reserves your availability, whether or not the client uses all of it. It's usually a single line item, issued on the same date each month."],
      ["Do I need a PO number on the invoice?", "Only if the client uses purchase orders — but if they do, an invoice without one will typically be rejected automatically. Ask at the start of the engagement."],
      ["Should I bill expenses on the same invoice?", "Yes, but as separate line items rather than folded into your fee, and keep the receipts. Many clients reimburse expenses on different terms from fees, and a merged figure makes that impossible to process."],
    ],
  },

  {
    slug: "small-business-invoice-generator",
    type: "invoice", scenario: "freelance",
    h1: "Free small business invoice generator",
    sub: "A simple, professional way for small businesses to bill customers — multi-currency, sales tax, your logo, and instant PDF.",
    intro: "Small business owners can create and send professional invoices without accounting software. Save your business details once, reuse clients, and keep billing month after month.",
    include: [
      "Your business name, address and tax number",
      "The customer's billing details",
      "A sequential invoice number",
      "Goods or services itemized with quantities",
      "Applicable sales tax or VAT",
      "Payment methods and due date",
    ],
    sections: [
      {
        h: "Numbering is boring and it matters",
        p: "Invoice numbers must be unique and run in sequence. That's not bureaucratic fussiness — it's what lets you prove a payment belongs to a particular sale, and it's the first thing an auditor or accountant checks. Pick a format and never break it: INV-0001 onwards is fine, and a year prefix like 2026-014 works well if you want the year visible at a glance. Gaps and duplicates are what cause reconciliation headaches at year end.",
      },
      {
        h: "Selling across borders",
        p: "If you invoice customers in another country, issue the invoice in the currency you agreed to be paid in, and say so on the document. BillCrafter carries 19 currencies and formats the figures the way that market expects — €1.234,56 in Germany, €1 234,56 in France. Cross-border tax treatment differs a great deal by country and by whether your customer is a business or a consumer, so confirm your obligations before adding or omitting tax.",
      },
      {
        h: "Keep the paperwork your accountant will ask for",
        p: "At minimum, keep a copy of every invoice you issue, a record of what was paid and when, and receipts for anything you billed on. A free BillCrafter account keeps every document you save in one place, so at year end you're not reconstructing the year from your sent-mail folder. Most jurisdictions require records to be retained for several years — check the rule where you operate.",
      },
    ],
    faq: [
      ["Do I have to charge sales tax?", "Only if you're registered to collect it in the relevant jurisdiction. Thresholds and rules vary by state and country, so check your local requirement — the tool applies whatever rate you enter, including none."],
      ["Can I put my logo on the invoice?", "Yes, on every plan. Click the logo area at the top of the document and upload a PNG or JPG; it appears on the PDF exactly as shown on screen."],
      ["What's the difference between an invoice and a receipt?", "An invoice requests payment before it's made. A receipt confirms payment after the fact. Many businesses issue both — the invoice to ask, the receipt as proof once the money arrives."],
    ],
  },

  {
    slug: "photography-invoice-template",
    type: "invoice", scenario: "freelance",
    h1: "Free photography invoice template",
    sub: "Bill for shoots, editing, prints and licensing. Itemize sessions and deliverables, then download a branded PDF invoice.",
    intro: "Photographers and videographers can invoice for session time, editing, and usage rights, add a deposit or amount paid, and send clients a clean, professional bill.",
    include: [
      "Shoot date, location and duration",
      "Session fee and any second shooter",
      "Editing and retouching time",
      "Licensing or usage rights granted",
      "Prints, albums or physical products",
      "Retainer already received, and the balance",
    ],
    sections: [
      {
        h: "The retainer and the balance are two different moments",
        p: "Most photography work takes a non-refundable retainer to hold the date, with the balance due before or shortly after delivery. Your invoice should show the full fee, the retainer already received, and the balance outstanding — not just the remaining number on its own. Clients keep invoices for their own records, and a document showing only the balance makes the total look wrong months later when nobody remembers the deposit.",
      },
      {
        h: "Licensing is a line item, not an afterthought",
        p: "What the client may do with the images is usually worth more than the hours spent taking them. Put the grant on the invoice as its own line — personal use, one year of commercial social media, unlimited web, print advertising — so there's a written record of what was bought. Vague invoices are where usage disputes start, and an invoice is often the only document a small client keeps.",
      },
      {
        h: "Prints and products are taxed differently from services",
        p: "In many US states photography services and physical goods carry different sales-tax treatment: a delivered album or print is tangible property, while the shoot itself may not be. Because BillCrafter lets you mark individual lines taxable or not, you can put the album on a taxed line and the session on an untaxed one where that's the correct treatment. Which rule applies to you depends on your state — confirm it rather than assume.",
      },
    ],
    faq: [
      ["How do I invoice a wedding deposit?", "Issue the invoice for the full package, then enter the retainer in the “Amount paid” field. The document shows the total, what's been received, and the balance due on or before the wedding date."],
      ["Should licensing be a separate line?", "Yes. Stating the usage granted on the invoice creates a written record of what the client bought, which is what protects you if they later want to use the images more widely."],
      ["Can I invoice in a different currency for an overseas client?", "Yes — pick the currency in the side panel before you export. The figures are formatted the way that market expects."],
    ],
  },

  {
    slug: "cleaning-invoice-template",
    type: "invoice", scenario: "contractor",
    h1: "Free cleaning service invoice template",
    sub: "Invoice recurring or one-off cleaning jobs — list services, add tax, and download a professional PDF in minutes.",
    intro: "Cleaning businesses can bill residential or commercial jobs, itemize services and supplies, and keep a record of every invoice in one place.",
    include: [
      "The service address and the dates cleaned",
      "Each service — standard, deep clean, windows",
      "Number of visits in the billing period",
      "Supplies or consumables, if you charge them",
      "Recurring schedule, if there is one",
      "Payment terms and how to pay",
    ],
    sections: [
      {
        h: "Per visit or per month — pick one and be consistent",
        p: "One-off and move-out cleans invoice per job. Regular contracts are usually simpler billed monthly in arrears: one line reading “Weekly office clean — 4 visits, March” rather than four separate invoices. Monthly billing means a quarter of the paperwork and a quarter of the payment chasing, and commercial clients generally prefer it because it matches how their own accounts run.",
      },
      {
        h: "Decide how you handle supplies",
        p: "There are two workable approaches and one that causes arguments. Either build consumables into your rate and say so, or list them as a separate line with quantities. What causes friction is an unexplained bump in the total from one month to the next. If you do bill supplies separately, note them as taxable or not according to your local rule — in many places goods and labor are treated differently.",
      },
      {
        h: "Recurring clients shouldn't mean recurring typing",
        p: "If the same invoice goes to the same client every month, retyping it is wasted effort. A free BillCrafter account saves your client list and every past invoice, so next month's bill is a duplicate-and-edit rather than a fresh document. The same free account can also schedule recurring invoices that go out and email the client automatically on the date you choose.",
      },
    ],
    faq: [
      ["Should I invoice each visit or monthly?", "Monthly in arrears for regular contracts — it's less admin for you and matches how commercial clients pay. One-off and end-of-tenancy cleans are better invoiced per job, on completion."],
      ["Do I charge tax on cleaning services?", "It varies by state and country, and residential and commercial work are sometimes treated differently. Check your local rule and mark lines taxable accordingly."],
      ["Can I set up a monthly invoice that sends itself?", "Yes, with a free account. Save the invoice once, choose a frequency and a client email, and each cycle a new invoice is issued and sent automatically."],
    ],
  },

  {
    slug: "estimate-generator",
    type: "estimate", scenario: "contractor",
    eyebrow: "Free Estimate Maker · Contractors & Freelancers",
    metaTitle: "Free Estimate Generator & Maker for Contractors & Freelancers (PDF)",
    metaDescription: "Build itemized job estimates with separate labor and materials sections, sales tax, and validity dates. Download a clean PDF instantly — 100% free, no sign-up, no watermark.",
    h1: "Free estimate generator & maker",
    sub: "Send a professional job estimate before work starts — pre-loaded with separate Labor and Materials sections, a 'valid until' date, and instant PDF export. 100% free, no sign-up required.",
    intro: "Create a clear, itemized estimate your client can approve on the spot. Separate labor from materials, mark taxable lines individually, and convert the approved estimate to an invoice in one click — no re-typing.",
    include: [
      "A clear description of the scope of work",
      "Itemized labor and materials with quantities and rates",
      "A “valid until” expiration date",
      "What is explicitly not included (exclusions)",
      "Assumptions the price depends on",
      "What happens if the scope changes",
    ],
    sections: [
      {
        h: "An estimate is a projection, not a promise",
        p: "This is the distinction that decides whether you can charge more later. An estimate is a considered, good-faith projection of what a job will cost; a quote is a fixed price you're committing to. If the work might reasonably grow — hidden damage, unknown site conditions, scope the client hasn't settled — issue an estimate and say so on the document. Labelling a document “quote” when you meant “estimate” is one of the more expensive wording mistakes in trade work.",
      },
      {
        h: "Say what's excluded, not just what's included",
        p: "Most disputes come from the gap between what the client imagined and what you priced. A short exclusions note — “price excludes permits, disposal of existing units, and any repair to sub-floor found on removal” — costs a minute and prevents the argument entirely. Put your assumptions there too: access hours, who supplies power and water, whether the room will be cleared before you arrive.",
      },
      {
        h: "Put a validity date on it and mean it",
        p: "Material prices move and your calendar fills. A “valid until” date, typically 14 to 30 days out, gives you a clean reason to re-price rather than honouring a figure you costed months ago. When the client approves, convert the estimate straight to an invoice — the business details, client and line items all carry over, so nothing gets retyped or accidentally changed.",
      },
    ],
    faq: [
      ["Is this estimate generator 100% free with no sign-up or watermark?", "Yes. You can customize your estimate in the browser, add your company logo, separate labor and materials, and download a clean vector PDF immediately — 100% free, with no account required and zero watermarks."],
      ["What's the difference between an estimate, a quote, and an invoice?", "An estimate is a good-faith cost projection that can adjust if job conditions change. A quote is a fixed price you commit to once accepted. An invoice is the payment request sent after the estimate is approved or work is completed."],
      ["Can I separate labor and materials and apply sales tax only to materials?", "Yes. This page pre-loads the Contractor layout with dedicated Labor and Materials sections that subtotal automatically, plus per-line tax checkboxes so you can tax materials while keeping labor non-taxable where local rules require it."],
      ["How long should an estimate stay valid?", "14 to 30 days is normal for contractors and freelancers. It's long enough for the client to decide and short enough that you're not bound to outdated material prices."],
      ["Can I turn an approved estimate into an invoice?", "Yes — click “Convert to invoice →” in the side panel and every detail carries across automatically, updating the title to Invoice and numbering it in sequence."],
    ],
  },

  {
    slug: "quote-generator",
    type: "quote", scenario: "quote",
    eyebrow: "Free Quote Maker · Instant PDF · No Sign-up",
    metaTitle: "Free Quote Generator — Instant Professional Business Quotes (PDF)",
    metaDescription: "Create and download professional business quotes in seconds. Itemize fixed-price deliverables, set a valid-until date, add deposits or tax, and export a clean PDF — 100% free, no sign-up.",
    h1: "Free quote generator & quotation maker",
    sub: "Create a professional price quote or business quotation online in seconds — pre-configured with a 30-day 'valid until' date, milestone schedule, and one-click conversion to an invoice. 100% free, no sign-up.",
    intro: "Send a polished, fixed-price business quote that wins the work. Once your client accepts, convert the quote straight into an invoice with every line item intact.",
    include: [
      "The exact deliverables you're pricing",
      "A fixed total the client can say yes to",
      "The “valid until” expiration date of the offer",
      "Timescale or start availability",
      "Payment schedule — booking deposit and stages",
      "What would count as a change of scope",
    ],
    sections: [
      {
        h: "A quote is a commitment, so scope it tightly",
        p: "Once a client accepts a quote, the price is generally fixed — that's the point of it, and it's why clients like receiving one. The protection isn't in hedging the number, it's in defining precisely what the number buys. “Brand identity: primary logo, two lockups, color palette, type system, one round of revisions” can be delivered against. “Branding package” cannot, and will absorb revisions until someone gives up.",
      },
      {
        h: "Make the yes easy",
        p: "The best quotes are readable in under a minute: what they get, what it costs, when you can start, and how to accept. Long preambles about your process belong in a proposal, not on the pricing document. If you're offering options, put them on one quote as clearly separated blocks rather than sending three documents — clients choose faster when comparison is easy.",
      },
      {
        h: "State the payment schedule up front",
        p: "The moment to agree a deposit is when the client is enthusiastic, not after the work starts. Put the schedule on the quote — 50% to book, 50% on delivery, or thirds across milestones — so accepting the price means accepting the terms. When they say yes, convert the quote to an invoice and the numbers and details carry over untouched.",
      },
    ],
    faq: [
      ["Can I create and download a business quote PDF for free without signing up?", "Yes. BillCrafter lets you build a branded price quote, set a valid-until expiration date, add tax or deposits, and download a clean PDF immediately — 100% free, no sign-up, and no watermark."],
      ["What is the difference between a quote and an invoice?", "A quote is sent before work starts to propose a fixed price and scope for client approval. An invoice is sent after acceptance (or upon delivery) to request actual payment. In BillCrafter, one click converts your accepted quote directly into an invoice."],
      ["Is a quote legally binding?", "Once accepted by the client, a written quote generally forms a binding price agreement for the exact scope described — which is why clear deliverables and a valid-until date matter. Rules vary by jurisdiction, so treat this as general guidance rather than legal advice."],
      ["Does the quote generator support sales tax, VAT/GST, and foreign currencies?", "Yes. Pick from 25+ currencies (USD, EUR, GBP, CAD, AUD, INR, and more) and apply custom Sales Tax, VAT, or GST rates to the entire quote or specific line items."],
      ["What if the client changes the scope after accepting?", "Any work outside the itemized deliverables warrants a revised quote or a separate change order. Stating revision limits and scope boundaries in the Notes section makes that conversation straightforward."],
    ],
  },

  {
    slug: "receipt-maker",
    type: "receipt", scenario: "receipt", stamp: "paid",
    eyebrow: "Free Receipt Generator · Instant PDF · No Sign-up",
    metaTitle: "Free Receipt Maker & Generator (Download PDF, No Sign-up) — BillCrafter",
    metaDescription: "Create and download professional receipts in seconds. Customize currency, sales tax, payment methods, and line items. 100% free with no account required.",
    h1: "Free receipt maker & generator",
    sub: "Create and download a professional PDF receipt in seconds — opens in Receipt mode (#REC-0001) with a PAID stamp, payment method, and zero balance ready to customize. 100% free, no sign-up required.",
    intro: "Give customers instant proof of payment. Customize line items, sales tax, currency, and how payment was received, then download or print a clean, watermark-free PDF receipt.",
    include: [
      "The word “Receipt” and a sequential number (#REC-0001)",
      "The date payment was received",
      "How it was paid — card, cash, Zelle, or bank transfer",
      "Itemized goods or services paid for",
      "Amount received, sales tax, and “Paid in full” status",
      "Your business name and contact details",
    ],
    sections: [
      {
        h: "A receipt confirms; an invoice requests",
        p: "The two documents are often confused and serve opposite ends of the same transaction. An invoice goes out before payment and asks for money. A receipt goes out after and confirms money arrived. Customers need receipts to claim expenses, reclaim tax, and prove a purchase for warranty purposes — so issuing one promptly saves you being asked for it months later when you've forgotten the detail.",
      },
      {
        h: "Record how the payment was made",
        p: "The payment method is the part people leave off and later need. “Bank transfer, 14 April” or “Card ending 4242” is what lets you and your customer match the receipt to a line on a statement. For cash payments this matters more than anything — a cash receipt with no date and no method is close to useless as evidence for either side.",
      },
      {
        h: "Partial payments and paid in full",
        p: "If the payment settles the whole amount, the document should say so plainly — BillCrafter marks it “Paid in full” with a PAID stamp when the balance reaches zero. If it's a deposit or installment, adjust the “Paid” amount in the side panel so the receipt shows both the amount received and the remaining balance due, preventing anyone from mistaking a partial payment for a settled account.",
      },
    ],
    faq: [
      ["Can I export a receipt PDF for free without creating an account?", "Yes. You can customize every field, keep the PAID stamp, and download or print a high-resolution PDF receipt immediately — 100% free, no sign-up required, and no watermark."],
      ["What is the difference between a receipt and an invoice?", "An invoice requests payment before money changes hands; a receipt serves as official proof of payment after you have been paid. Customers and tenants use receipts for expense reimbursement, tax deductions, and audit records."],
      ["Can I customize sales tax, currency, and payment method on the receipt?", "Yes. Enter any Sales Tax, VAT, or GST percentage, choose from 25+ currencies, and record the exact payment method (Cash, Card, Bank Transfer, Zelle, Check, or PayPal) right on the receipt header."],
      ["Do I need to issue a receipt if I already sent an invoice?", "It is best practice whenever a client pays — especially for cash, check, deposit, or rent payments. While an invoice shows what was billed, only a receipt proves the balance was actually paid."],
      ["Can I make a cash receipt or partial-payment receipt?", "Yes. Enter “Cash” in the Method field for instant cash proof of payment, or enter a partial figure in the side panel's “Paid” box to display both the amount received today and the remaining balance due."],
    ],
  },

  {
    slug: "proforma-invoice-generator",
    type: "invoice", scenario: "smallbusiness",
    h1: "Free proforma invoice generator",
    sub: "Create a proforma invoice before the sale is final — quote the goods, quantities and price so your buyer can arrange payment, financing or customs. Download a clean PDF.",
    intro: "A proforma invoice is a preliminary bill of sale sent before goods or services are delivered. Use it to give a buyer a firm price to approve, to support an advance payment, or to accompany an international shipment — then convert it to a commercial invoice once the deal is done.",
    include: [
      "The words “Proforma invoice”, clearly labelled",
      "Your business details and the buyer's details",
      "A description of the goods or services and quantities",
      "The agreed unit price and total, in the sale currency",
      "Any tax, shipping or handling shown separately",
      "A validity date and the payment terms",
      "For exports: country of origin and delivery terms (Incoterms)",
    ],
    sections: [
      {
        h: "A proforma invoice is a quote that looks like an invoice",
        p: "It states exactly what will be supplied, in what quantity, at what price — but it is not a demand for payment and it does not go into your books as a sale. That distinction matters: a proforma should never be entered as accounts receivable, and a buyer cannot use it to reclaim VAT or sales tax. Its job is to give the buyer's purchasing or finance team a document firm enough to raise a purchase order, release an advance payment, or open a letter of credit, before the real commercial invoice exists.",
      },
      {
        h: "Where proforma invoices are actually used",
        p: "Three situations account for most of them. First, advance payment: a supplier who wants money up front sends a proforma so the customer can pay before production or shipping. Second, international trade: customs authorities and freight forwarders often need a proforma to estimate duties and clear a shipment before the final invoice is cut. Third, internal approval: a buyer whose company requires a formal document to authorise spend gets a proforma to push the PO through. In all three, the price and terms should match what the final invoice will say.",
      },
      {
        h: "Turning the proforma into a commercial invoice",
        p: "Once the buyer approves and the goods ship or the work is done, you issue the real commercial invoice — the one that carries a proper invoice number, books as revenue, and supports tax. Keep the numbers identical unless something genuinely changed; a final invoice that silently differs from the proforma the buyer approved is how payment disputes start. In BillCrafter you can duplicate the proforma, relabel it, and give it its sequential invoice number, so nothing gets retyped.",
      },
    ],
    faq: [
      ["What is the difference between a proforma invoice and a commercial invoice?", "A proforma is a preliminary document sent before the sale is complete — a firm quote the buyer can act on. A commercial invoice is the final, legally-recognized request for payment that books as revenue and supports tax. The proforma is not recorded as a sale and cannot be used to reclaim VAT."],
      ["Is a proforma invoice legally binding?", "Generally no — it doesn't create a payment obligation the way a commercial invoice does. It's a good-faith statement of price and terms. That's exactly why it's used before the buyer has committed. Rules vary by country, so treat this as general guidance."],
      ["Do I put an invoice number on a proforma?", "Label it clearly as a proforma and, if you number them, keep that sequence separate from your real invoice numbers so the two never get confused at reconciliation. The binding invoice number goes on the commercial invoice you issue afterwards."],
    ],
  },

  {
    slug: "bill-generator",
    type: "invoice", scenario: "retail",
    // "bill template", "free bill generator", "billing template" and "bill
    // creator" carry ~1.5k GSC impressions but mostly land on / and /templates.
    // Claim the template intent here so this page is the one Google picks.
    title: "Free Bill Generator & Bill Template Online",
    h1: "Free bill generator & bill template",
    sub: "Make a bill for any product or service in seconds — start from a ready bill template, itemize what's owed, add tax, and download a clean PDF or print it. Free online bill maker, no signup to download.",
    intro: "Generate a bill for a customer, shop sale or service in minutes. A bill and an invoice are the same document under two names — list what's owed, apply tax, and hand over a professional PDF the customer can pay from.",
    include: [
      "Your business or shop name and contact details",
      "The customer's name",
      "Each item or service with quantity and price",
      "Any tax or GST, shown as its own line",
      "The total amount payable",
      "A bill number and the date",
      "How to pay — cash, card, transfer or link",
    ],
    sections: [
      {
        h: "“Bill” and “invoice” are the same thing",
        p: "The word you use is mostly regional and situational. A shop hands a customer a bill; a business emails another business an invoice; both documents do the identical job — they list what's owed and request payment. There's no format difference and no legal distinction in most places. So a bill generator and an invoice generator are the same tool: this one produces a document you can head “Bill” or “Invoice” and use exactly the same way.",
      },
      {
        h: "Cash bills and instant printing",
        p: "For a shop or market stall the bill is often handed over on the spot, so it needs to print cleanly and total correctly the first time. Itemize each product with quantity and unit price, let the total add itself up, and add tax or GST as a separate line where you charge it. Download the PDF and print, or hand the customer a digital copy — either way they have a clear record of what they paid for, which cuts down returns disputes.",
      },
      {
        h: "Keep a copy of every bill you raise",
        p: "Whether you call it a bill or an invoice, you should keep a copy of each one. It's what lets you reconcile takings at the end of the day or the month, and it's what your accountant and tax authority expect to see. A free BillCrafter account stores every bill you save, so you're not rebuilding the month from memory — and repeat customers can be billed again by duplicating an earlier document rather than starting over.",
      },
    ],
    faq: [
      ["Is a bill the same as an invoice?", "Yes, in practice. Both list goods or services and the amount owed, and both request payment. “Bill” is more common face-to-face and in retail; “invoice” is more common business-to-business. The document itself is the same, which is why one generator makes both."],
      ["Can I make a GST or tax bill?", "Yes. Add your tax or GST as a separate line at the rate you charge, and it's shown clearly on the total. Set the label and rate to match your country's requirement — the tool applies whatever you enter, including none."],
      ["Can I print the bill?", "Yes. Download the PDF and print it, or use your browser's print option directly. The layout is built to print cleanly on standard paper without anything being clipped."],
      ["Is there a free bill template I can fill in?", "Yes — the editor above is the bill template. It opens with a standard billing layout already in place: your details, the customer, itemized lines, tax and total. Fill in the fields, switch the design from the template picker if you want a different look, and download it as a PDF."],
    ],
  },

  {
    slug: "deposit-invoice",
    type: "invoice", scenario: "depositinvoice",
    h1: "Free deposit invoice generator",
    sub: "Ask for a deposit the professional way — a clear invoice showing the job total, the deposit due now, and the balance to follow. No signup to download.",
    intro: "Contractors, photographers, caterers and event pros can request a booking deposit with a proper document instead of a text message. Show the full job value, the percentage due up front, and the payment schedule for the rest.",
    include: [
      "The full job or project total, so the deposit has context",
      "The deposit amount — as a percentage or a fixed figure",
      "What the deposit secures: a start date, a booking, materials",
      "The payment schedule for the remaining balance",
      "Whether the deposit is refundable, and until when",
      "How to pay — bank transfer, card link, or check",
    ],
    sections: [
      {
        h: "How much deposit to ask for",
        p: "For trades and services, 25–50% up front is the normal range. Bigger deposits are justified when you buy materials before starting — many contractors ask for enough to cover materials plus a day's labor. For bookings (photography, DJs, catering, events), 30–50% to hold the date is standard and clients expect it. Above 50% starts to feel unusual outside of custom orders and made-to-measure work, and a few states cap what home-improvement contractors may collect up front — California, for instance, limits it to 10% or $1,000, whichever is less — so check your state's rule before you set a number.",
      },
      {
        h: "Show the deposit on the invoice, don't invoice only the deposit",
        p: "A deposit request reads best when the client can see the whole picture: the full job total, then “Deposit due (30%)” as its own line. BillCrafter's Deposit field does exactly this — it prints the amount due now without changing the total, so there's no confusion about what the overall job costs. Add the payment schedule block underneath to show when the rest falls due: deposit to book, balance on completion, or a set of milestones on a bigger job.",
      },
      {
        h: "When the deposit arrives, record it and move on",
        p: "Once the deposit is paid, enter it in the “Amount paid” field on your next invoice for the job — the document then shows the total, the deposit received, and the balance due, which is the figure the client actually owes. Keeping this arithmetic on the invoice, rather than in an email thread, is what prevents the classic dispute where a client believes the deposit was never counted. A receipt for the deposit itself takes one click: convert the paid invoice to a receipt and send it.",
      },
    ],
    faq: [
      ["What percentage deposit should I charge?", "25–50% is typical for trades and bookings. Charge toward the higher end when you buy materials up front or turn away other work to hold a date. Some US states cap contractor deposits on home-improvement work, so check your state's rule."],
      ["Is a deposit invoice legally binding?", "The invoice itself is a request for payment, not a contract. The binding part is your agreement with the client — a signed quote, contract or accepted estimate. The deposit invoice implements what that agreement says, so make sure the percentage and refund terms match it."],
      ["Should a deposit be refundable?", "State it either way, in writing, on the invoice. A common pattern: refundable until N days before the start date or booking, then non-refundable because you've turned other work away. Whatever you choose, the notes field on the invoice is the place to say it."],
    ],
  },

  {
    slug: "progress-billing-invoice",
    type: "invoice", scenario: "progressbilling",
    h1: "Progress billing invoice generator",
    sub: "Bill a big job in stages — deposit, milestones, final payment — with a schedule the client can see on every invoice. Free, no signup to download.",
    intro: "Remodels, builds and long projects rarely bill once at the end. Progress billing invoices each completed stage as you go, keeps cash flowing during the job, and shows the client exactly where every payment sits in the overall plan.",
    include: [
      "Which milestone this invoice covers, named plainly",
      "The full payment schedule — every stage, its amount, and status",
      "What was completed to trigger this payment",
      "Amounts already paid on earlier milestones",
      "The job site address and any permit or contract reference",
      "The balance remaining after this payment",
    ],
    sections: [
      {
        h: "Tie every payment to something the client can see",
        p: "The strongest progress schedules bill on visible milestones, not calendar dates: cabinets installed, rough-in inspection passed, drywall complete. A client who can walk through the site and see the milestone met pays without argument; a client billed “30% — month two” starts asking questions. Name the milestone on the invoice line itself — “Progress payment 2 of 3 — cabinets installed” — so the document reads as a record of work done, not just a demand for money.",
      },
      {
        h: "Put the whole schedule on every invoice",
        p: "Each progress invoice should show the full plan: every stage, its amount, and which ones are already paid. BillCrafter's payment schedule block prints this as a small table on the document, so the client never has to reconstruct the arithmetic from a stack of PDFs. The current invoice bills its own milestone; the schedule shows where it fits. This one habit eliminates most mid-project billing disputes — both sides always see the same running picture.",
      },
      {
        h: "Keep the final payment meaningful, not painful",
        p: "A final payment of 10–20% held to completion protects the client and motivates the finish — but don't let it swell. If the last milestone is 40% of a large job, you're financing the project and carrying all the risk of a slow punch list. Front-load materials into early milestones, keep the final stage small enough that a dispute over it won't hurt you, and invoice it the day the walkthrough is done, with the completed-work photos on the invoice if you have them.",
      },
    ],
    faq: [
      ["How is progress billing different from a deposit?", "A deposit is paid before work starts to secure the job. Progress billing continues through the job: each invoice bills a completed stage. Most large projects use both — a deposit up front, then progress invoices at milestones, then a final payment on completion."],
      ["What schedule should I propose?", "A common shape for a mid-size job is 30% deposit, one or two milestone payments of 25–30% each, and a 10–20% final on completion. Match milestones to visible stages of the work, and put the schedule in your quote so the client agrees to it before you start."],
      ["How do I show what's already been paid?", "Enter prior payments in the “Amount paid” field — the invoice shows total, paid, and balance due. Mark paid milestones in the schedule block too (e.g. “1 · Deposit — paid”), so the whole history is visible on one document."],
    ],
  },

  {
    slug: "recurring-invoice",
    type: "invoice", scenario: "recurringinvoice",
    h1: "Recurring invoice generator",
    sub: "Bill the same client every month without rebuilding the invoice. Set the service period, list the visits, and duplicate it next month in one click. Free, no signup to download.",
    intro: "Cleaners, groundskeepers, maintenance firms, bookkeepers and anyone on a retainer bills the same work on a cycle. A recurring invoice states the period it covers, what was delivered inside it, and what changed — so the client can approve it without a phone call.",
    include: [
      "The service period this invoice covers, with start and end dates",
      "How often you attend — weekly, fortnightly, monthly, quarterly",
      "The number of visits or hours actually delivered in the period",
      "Anything extra done this period, listed separately from the plan",
      "Credits for skipped or missed visits",
      "A consistent invoice number sequence so the months reconcile",
    ],
    sections: [
      {
        h: "Put the period on the invoice, not just the date",
        p: "A recurring invoice dated the 1st of the month tells the client nothing about what they're paying for. State the span — 1–31 May, four weekly visits — and the document answers its own question. This matters most when a client queries a bill months later: an invoice that names its own period can be checked against a calendar, while one that just says “monthly service” starts an argument. BillCrafter's service period block prints the dates and the frequency at the top of the document, and disappears entirely on one-off jobs.",
      },
      {
        h: "Separate the plan from the extras",
        p: "The fastest way to make a recurring invoice unapprovable is to bury a one-off charge inside the regular line. Put the plan on its own section — “Recurring service”, four visits at the agreed rate — and anything additional under a second heading with the date it was requested. The client's eye goes straight to the number that changed, which is the only part they need to think about. Sections in BillCrafter subtotal themselves, so the split costs you nothing to maintain.",
      },
      {
        h: "Next month should take ten seconds",
        p: "The real work in recurring billing is not the first invoice, it's the fiftieth. Save the invoice to a free account and duplicate it each cycle: the business details, client, line items and rates carry over, the number advances automatically, and you adjust the period and the visit count. Handle skipped visits as a credit line rather than by editing the rate — the arithmetic stays visible, and your records still show what the plan costs. A free account can also send it automatically when you'd rather not remember at all.",
      },
    ],
    faq: [
      ["Should I bill recurring work in advance or in arrears?", "In arrears is the norm for visit-based work like cleaning and grounds maintenance, because the invoice can state what was actually delivered. Retainers for professional services are more often billed in advance. Either works — say which one you're doing in the notes so the client knows what the period means."],
      ["How do I handle a missed or skipped visit?", "Add a credit line rather than quietly lowering the rate. “Visit skipped 14 May — credit” keeps the plan price visible and shows the client you tracked it, which is far better for trust than an invoice that is mysteriously smaller this month."],
      ["Can BillCrafter send recurring invoices automatically?", "Yes. With a free account, save the invoice once, choose a frequency and the client's email, and each cycle a new invoice is issued and sent automatically. You can also duplicate last month's invoice in one click from your saved history — the details carry over and the number advances on its own."],
    ],
  },

  {
    slug: "lawn-care-invoice-template",
    type: "invoice", scenario: "landscaping",
    h1: "Free lawn care invoice template",
    sub: "Invoice mowing rounds, seasonal work and haul-away in one document — per visit or per month. Add photos of the finished job, then download a clean PDF.",
    intro: "Lawn care and landscaping bill two things at once: a regular mowing round and one-off seasonal work. This template keeps them on separate lines so the client can see the plan price and the extras without doing arithmetic.",
    include: [
      "The property address, which is rarely the billing address",
      "Number of visits in the period, and the per-visit rate",
      "Seasonal or one-off work listed separately from the round",
      "Green-waste removal and disposal fees, itemized",
      "Whether materials — mulch, plants, fertilizer — are taxed",
      "Weather cancellations and how they're credited",
    ],
    sections: [
      {
        h: "Per visit or per month — pick one and show the maths",
        p: "Both models work. Per-visit billing is honest in a wet spring when you couldn't cut, and clients understand it immediately. Flat monthly billing smooths your cash flow across the season and is easier to collect on autopay, but it needs a line stating how many visits the month included, or clients start counting for themselves in July. Whichever you choose, show visits × rate on the invoice rather than a single unexplained figure — it's the difference between a bill that gets paid and one that gets a text message.",
      },
      {
        h: "Seasonal work is where the margin is — itemize it",
        p: "Mowing is the relationship; bed prep, mulching, planting, aeration and cleanups are the profit. Put them under their own heading so they read as work you performed, not as the mowing bill going up. Include quantities where they exist — cubic yards of mulch, number of shrubs — because a client who can picture what arrived on the truck queries the price far less often. Materials and labor are often taxed differently, and separate lines let you mark each correctly.",
      },
      {
        h: "Photograph the cleanup, especially on one-off jobs",
        p: "For a mowing round nobody needs pictures. For a full cleanup, a hedge reduction or a new bed, before-and-after photos on the invoice end the conversation before it starts — the client sees the overgrown corner and then the cleared one, attached to the document asking for money. BillCrafter puts up to six captioned photos at the foot of the invoice, and they export inside the PDF rather than as a separate email attachment nobody opens.",
      },
    ],
    faq: [
      ["Should I charge for a visit when rain stops the work?", "Most lawn care businesses don't charge for a visit that didn't happen, but do charge if the crew turned up and were sent away. Whatever your rule is, put it in the notes on every invoice, because it's the single most common source of seasonal disputes."],
      ["Do I charge sales tax on lawn care?", "It varies by state. Several tax landscaping labor, several exempt routine maintenance but tax installation or new construction, and materials are often treated differently from labor. Mark each line taxable or not to match, and check your state's rule with its revenue department or your accountant."],
      ["How do I bill for green-waste disposal?", "As its own line, priced either flat per haul or per load, rather than folded into the mowing rate. Disposal fees rise, and a separate line lets you adjust it without renegotiating the whole plan."],
    ],
  },

  {
    slug: "pressure-washing-invoice-template",
    type: "invoice", scenario: "pressurewashing",
    h1: "Free pressure washing invoice template",
    sub: "Bill by square foot or by job, itemize detergent and surface treatment, and attach before-and-after photos on the invoice itself. Free PDF, no signup to download.",
    intro: "Pressure and soft washing sells on the difference between two photos. This template prices the work by surface area or flat rate, separates labor from chemicals, and puts the finished-job pictures on the document you send.",
    include: [
      "The property address and which surfaces were treated",
      "Square footage and your rate, or a flat price per surface",
      "Soft wash vs high pressure, noted per surface",
      "Detergent and surface treatment as a materials line",
      "Before-and-after photos of the areas cleaned",
      "Your re-clean or touch-up window, in writing",
    ],
    sections: [
      {
        h: "Price by the surface, show it on the invoice",
        p: "Most pressure washing is quoted per square foot for flat work — driveways, patios, sidewalks — and flat-rate per elevation for house washing. Putting 1,400 sq ft at $0.18 on the invoice rather than “driveway wash — $252” does two things: it shows the client the price was calculated rather than guessed, and it gives you a defensible basis when the neighbour asks for the same job at a different size. Keep a separate line for each surface so a client can decline the patio without renegotiating the driveway.",
      },
      {
        h: "Say soft wash where you mean soft wash",
        p: "Clients and insurers both care about this. Siding, roofs and painted surfaces are cleaned at low pressure with detergent; concrete and masonry take a surface cleaner at high pressure. Noting the method per line documents that you used the right one, which matters if someone later claims damage. It also justifies why house washing is priced differently from a driveway despite covering similar area — you're selling chemistry and care, not pressure.",
      },
      {
        h: "The photos are the invoice",
        p: "No other trade benefits this much from pictures on the document. A driveway shot half-cleaned, or a before-and-after pair of a stained patio, converts an invoice from a request into evidence — and those same photos are the marketing asset you'll want later, already captioned and attached to the job. BillCrafter holds up to six photos with captions at the foot of the invoice, exported inside the PDF. Take them from the same spot, before and after, and the comparison does the work.",
      },
    ],
    faq: [
      ["Should I bill by square foot or per job?", "Flat surfaces price cleanly per square foot; house washing, roofs and fleet work price better as a flat rate per elevation or unit, because access and risk matter more than area. Many businesses quote flat to the client but calculate from area internally — showing both on the invoice is a reasonable middle ground."],
      ["Do I need to itemize the detergent?", "You don't have to, but a short materials line for detergent and surface treatment explains why a soft wash costs more than the same area of concrete, and it's usually taxed differently from labor in states that tax materials."],
      ["Should I offer a re-clean guarantee?", "A short window — commonly 14 days — for touching up anything missed costs little and closes jobs. Put the exact wording in the invoice notes so the promise and its limits are recorded on the document, not just in a text message."],
    ],
  },

  {
    slug: "handyman-invoice-template",
    type: "invoice", scenario: "handyman",
    h1: "Free handyman invoice template",
    sub: "Bill labor and materials on separate lines, add the job address, and hand the customer a clear invoice before you leave. Free PDF, no signup to download.",
    intro: "Handyman work is many small jobs, often several in one visit. This template keeps hours and materials apart, itemizes each task, and prints something a homeowner can read without calling to ask what a line means.",
    include: [
      "The job address, and the customer's billing details",
      "Hours worked, at your hourly or half-day rate",
      "Materials bought for the job, with what they were for",
      "Each task listed separately when you did several",
      "Any minimum call-out charge, stated as its own line",
      "What you'll come back for, if the job isn't finished",
    ],
    sections: [
      {
        h: "One visit, several jobs — list them all",
        p: "A homeowner who asked you to fix a door, hang two shelves and reseal a bath does not want to see “3 hrs labor — $225”. Listing the three tasks, even against a single labor line, is what makes an invoice feel worth its price: the customer reads a list of things that are now fixed rather than a number attached to your time. It also protects you when they remember a fourth job they meant to mention — the document shows exactly what was agreed and done.",
      },
      {
        h: "Materials at cost, marked up, or reimbursed — just be consistent",
        p: "All three are normal in handyman work. What causes friction is switching between them without saying so, or hiding a markup inside a labor line. Put materials under their own heading with a short note of what they were, keep receipts for anything substantial, and if you mark up, apply the same percentage every time. Many US states tax materials but not labor, or tax them at different rates, which is another reason to keep them structurally separate rather than blended.",
      },
      {
        h: "Invoice before you leave the driveway",
        p: "The single biggest predictor of getting paid quickly on small residential jobs is handing over the invoice while you're still there, or emailing it from the van. Memory of the work is fresh, the customer is standing next to the thing you fixed, and nobody has to be chased. BillCrafter works in a phone browser, so you can fill in the lines, attach a photo of the finished job, and send the PDF before you pull away — no app to install and nothing to type up later at the kitchen table.",
      },
    ],
    faq: [
      ["Should I have a minimum call-out charge?", "Most handymen do — commonly one or two hours' labor — because travel and setup cost the same whether the job takes ten minutes or ninety. Put it on the invoice as its own line rather than inflating the hourly rate, and tell customers the minimum when you book, not when you bill."],
      ["Do I need a license to invoice as a handyman?", "You can invoice as a sole proprietor under your own name anywhere. Whether you need a contractor's license depends on your state and the value and type of the work — many states set a dollar threshold above which a license is required, and electrical and plumbing are usually licensed separately. Check with your state licensing board."],
      ["How should I charge — hourly or per job?", "Hourly suits unpredictable repair work and is easy to explain. Flat per job suits anything you've done fifty times and can price from memory, and it protects your margin when you're fast. Many handymen do both: hourly for diagnosis and odd jobs, flat for known installations."],
    ],
  },

  {
    slug: "hourly-invoice",
    type: "invoice", scenario: "hourlyinvoice",
    h1: "Free hourly invoice generator",
    sub: "Bill by the hour with dated entries, a running hours total and your rate on every line. Free, no signup to download the PDF.",
    intro: "Freelancers, consultants and anyone billing time needs the invoice to show what the hours were spent on. Dated entries with hours × rate answer that before the client has to ask, and the total hours line lets them check the arithmetic in a second.",
    include: [
      "Each entry dated, with what you worked on",
      "Hours per entry and your hourly rate",
      "Total hours for the period, stated separately from the money",
      "The increment you round to — 15 minutes, 30 minutes, or the hour",
      "The period the invoice covers",
      "Any fixed-fee work, kept apart from the hourly lines",
    ],
    sections: [
      {
        h: "Dated entries beat one line saying “42 hours”",
        p: "A single line for a month of work asks the client to take your word for it, and a client who can't verify a number delays paying it while they think about whether they believe you. Four to ten dated entries, each naming what was done, converts the same total into a record. It's also the version you'll be glad of six months later when someone asks what June was spent on. Turn on Timesheet in BillCrafter and the table grows a date column and totals your hours automatically.",
      },
      {
        h: "Decide your rounding increment and put it in writing",
        p: "Fifteen minutes is the most common increment for freelance work, thirty for consulting, six minutes (0.1 hr) for legal. What matters far more than which you pick is that the invoice says so — a note reading “billed in 15-minute increments” pre-empts the client who adds up your entries and finds 3.25 where they expected 3. Round consistently, never round every entry up as a habit, and never bill a fraction you couldn't describe if asked.",
      },
      {
        h: "Keep fixed-fee work on its own section",
        p: "Mixed invoices are common — some hourly work, one flat deliverable — and mixing them into a single list is what makes a client query the whole document. Put the hourly entries under one heading and fixed-price items under another, each with its own subtotal, and the invoice reads as two clear answers instead of one confusing one. Sections in BillCrafter subtotal themselves, so this costs no extra effort.",
      },
    ],
    faq: [
      ["Should I show my hourly rate on the invoice?", "Yes, on every line. A rate the client can multiply is a rate they trust; a lump sum with the rate hidden invites the question you least want, which is what the total works out to per hour. If your rate varies by task, use a section per rate."],
      ["What increment should I round my time to?", "15 minutes suits most freelance work, 30 minutes suits consulting, and legal work is usually billed in 0.1-hour units. Pick one, say so on the invoice, and apply it the same way every time — the inconsistency is what damages trust, not the rounding itself."],
      ["Do I need to attach a separate timesheet?", "Not if the invoice carries the dated entries itself, which is the point of this template. A separate spreadsheet is one more file to open and one more thing to disagree with; a client who can see the days on the invoice rarely asks for anything further."],
    ],
  },

  {
    slug: "timesheet-invoice",
    type: "invoice", scenario: "consulting",
    h1: "Timesheet invoice template",
    sub: "Turn a timesheet into an invoice: dated entries, hours per task, rate bands by role, and a total hours line the client can check. Free PDF, no signup.",
    intro: "Agencies, contractors and professional firms bill time that several people logged at several rates. A timesheet invoice keeps the dates and tasks visible while grouping the hours by rate, so approval doesn't require a spreadsheet on the side.",
    include: [
      "One row per dated entry, not per week",
      "The task or matter each entry belongs to",
      "A section per rate band — senior, junior, paralegal",
      "Hours and rate on every line, with the line total",
      "Total hours for the invoice period",
      "Pass-through costs listed apart from time",
    ],
    sections: [
      {
        h: "Group by rate, not by person",
        p: "Clients rarely care which of your people did the work; they care what it cost per hour and whether that matches the agreement. Sections headed by rate — “Senior consultant — $185/hr”, “Analyst — $95/hr” — line the invoice up with the contract they signed, and each section subtotals on its own so the mix is visible at a glance. Grouping by individual name instead invites questions about staffing you don't want to answer line by line.",
      },
      {
        h: "Keep disbursements out of the hours",
        p: "Filing fees, travel, software licenses and anything else you paid on the client's behalf are not time, and folding them into an hourly section makes the effective rate look wrong. Put them under their own heading, note whether they carry tax — in many places pass-through costs are treated differently from services — and attach receipts for anything substantial. The clarity is worth the extra heading.",
      },
      {
        h: "Send it while the entries are recent",
        p: "Timesheet invoices go stale faster than any other kind. A client asked to approve dated entries from two months ago has to reconstruct what was happening then, and the person who requested the work may have moved on. Billing monthly, within a few days of period end, is the single biggest thing you can do to shorten payment time on time-based work — and duplicating last month's invoice from your saved history makes it a five-minute job.",
      },
    ],
    faq: [
      ["How detailed should each timesheet entry be?", "Enough that the client recognises the work: a date, a short task name, and one line of context. Entries reading only “consulting” are the ones that get queried; entries reading “Board pack — prep and readout” almost never are."],
      ["Can I bill different rates on one invoice?", "Yes, and it's normal for firms with mixed seniority. Use a section per rate band so each is subtotalled separately, and make sure the bands match the rate card in your contract."],
      ["Should the invoice show total hours as well as the amount?", "Yes. It's the fastest sanity check the client has, and offering it unprompted signals that the numbers are meant to be checked. BillCrafter prints a total hours line above the money whenever the timesheet columns are on."],
    ],
  },

  {
    slug: "attorney-invoice-template",
    type: "invoice", scenario: "legal",
    h1: "Free attorney invoice template",
    sub: "Bill legal time properly — dated entries in 0.1-hour units, attorney and paralegal rates in separate bands, and disbursements kept apart. Free PDF, no signup.",
    intro: "Legal billing is scrutinised more than any other kind of professional invoice. This template shows dated entries, splits time by rate band, keeps filing fees and other disbursements out of the hourly totals, and prints a clean PDF for the client file.",
    include: [
      "The matter name or file number the invoice relates to",
      "Dated time entries with a clear task description",
      "Separate rate bands for attorney and paralegal time",
      "Time in 0.1-hour increments, stated on the invoice",
      "Disbursements — filing fees, courier, search fees — listed apart",
      "Any retainer or trust balance applied, and what remains",
    ],
    sections: [
      {
        h: "Task descriptions decide whether the bill gets paid",
        p: "In-house counsel and cost assessors read the narrative, not the total. “Attention to matter — 2.5” is the classic entry that gets written down; “Review and mark up master services agreement, first pass — 2.5” survives review because it describes work that obviously took that long. Name the document, the counterparty or the step in the process. It takes seconds at the time and saves the write-off later.",
      },
      {
        h: "Separate attorney time, paralegal time and disbursements",
        p: "Three different things, three different sections. Rate bands let the client see the leverage in the matter — how much went to senior time versus support — which is exactly the transparency that keeps a relationship intact. Disbursements belong in their own block because they're reimbursements, not fees: they typically carry different tax treatment, and burying a $75 filing fee inside a fees section makes the hourly total look inflated for no reason.",
      },
      {
        h: "Show the retainer and what's left of it",
        p: "If you hold funds in trust, the invoice should state the retainer balance before, the amount applied, and the balance after. Clients rarely track this themselves, and an invoice that does the arithmetic prevents both the awkward top-up conversation and the worse one where a client believes they'd already paid. Record the applied amount in the Amount paid field so the document shows fees, the retainer applied, and the balance actually due.",
      },
    ],
    faq: [
      ["What increment should legal time be billed in?", "0.1 of an hour — six minutes — is the standard in most jurisdictions and what clients expect to see. State the increment on the invoice, and avoid the habit of rounding every task to a full unit, which is the first thing a cost assessor looks for."],
      ["Should filing fees be taxed?", "Disbursements paid on a client's behalf are often treated differently from your fees, and the rules vary by jurisdiction. Mark those lines non-taxable or taxable to match your local position, and confirm the treatment with your accountant or bar association guidance."],
      ["Is this template a substitute for legal billing software?", "No. It produces a professional invoice PDF and keeps your history, which is plenty for a small practice or a solo attorney. If you need trust accounting, LEDES export or conflict checking, use practice management software — and note that BillCrafter is a document tool, not legal or accounting advice."],
    ],
  },

  {
    slug: "tutoring-invoice-template",
    type: "invoice", scenario: "tutoring",
    h1: "Free tutoring invoice template",
    sub: "Invoice parents for a block of sessions — each one dated, with the subject and length — plus materials and your cancellation terms. Free PDF, no signup.",
    intro: "Tutors bill a family for sessions delivered over a few weeks. Listing each session with its date and subject turns an invoice into a record of the work, which is exactly what a parent paying for their child's lessons wants to see.",
    include: [
      "The student's name, and the parent or payer's details",
      "Each session dated, with subject and length",
      "Your hourly or per-session rate",
      "Materials or exam fees, listed separately",
      "Your cancellation and rescheduling policy",
      "Any package or block-booking discount applied",
    ],
    sections: [
      {
        h: "List the sessions, don't summarise them",
        p: "“8 sessions — $440” is a number; eight dated lines naming the topic covered is a report a parent can read, and it quietly demonstrates that the time was structured rather than improvised. It also resolves the most common billing question in tutoring, which is whether a particular week's session happened at all. If a session ran long or short, the hours column carries it honestly — 1.5 where a session overran by half an hour, with the reason in the detail line.",
      },
      {
        h: "Put the cancellation policy on every invoice",
        p: "Late cancellations are the friction point in tutoring, and a policy that lives only in a first-day email gets forgotten by week six. A single line in the notes — sessions cancelled with less than 24 hours' notice are charged in full — is enough, and having it printed on the document you're asking money for makes the charge unremarkable when it eventually applies. Credit your own cancellations visibly too; it costs one line and buys a lot of goodwill.",
      },
      {
        h: "Bill in blocks, and make the discount visible",
        p: "Most tutors bill a block of sessions at the end of a period rather than one at a time, which is less admin for both sides and better for your cash flow. If you discount block bookings or sibling rates, show it as a discount line rather than a quietly reduced rate — the parent sees the saving they were promised, and your standard rate stays intact for the next enquiry.",
      },
    ],
    faq: [
      ["Should I bill per session or per month?", "A block of sessions billed at the end of a period is the norm and the easiest to reconcile. Monthly works well for steady schedules; per-session invoicing creates a lot of small documents and slows you down for no gain."],
      ["Do I charge for a session a student misses?", "Most tutors charge in full for cancellations inside 24 hours and credit anything cancelled earlier, on the basis that the slot could have been filled. Whatever your rule, print it on the invoice — it's much easier to apply a policy the parent has already read."],
      ["Do I need to register a business to tutor?", "You can invoice under your own name as a self-employed tutor in most places. Income is still taxable, so keep every invoice you issue. If you work with children, check what background checks or registration your country or state requires — that's separate from the billing question."],
    ],
  },

  {
    slug: "contractor-estimate-generator",
    type: "estimate", scenario: "contractorestimate",
    eyebrow: "Construction & Handyman Estimates · Labor + Materials",
    metaTitle: "Free Contractor & Handyman Estimate Generator (Labor + Materials PDF)",
    metaDescription: "Create itemized construction, remodeling, and handyman job estimates with separate labor and materials sections, job-site address, deposit, and sales tax. 100% free PDF, no sign-up.",
    h1: "Free contractor & handyman estimate generator",
    sub: "Price remodeling, repair, and construction jobs on site — pre-loaded with separate Labor and Materials subtotals, a job-site address, a 30-day validity window, and instant PDF export. 100% free, no sign-up.",
    intro: "General contractors, remodelers, painters, electricians, plumbers, and handymen can build an accurate job estimate before ordering materials. Separate hourly crew labor from taxed materials, specify exclusions, request a booking deposit, and convert the estimate to an invoice once the homeowner approves.",
    include: [
      "Property / job-site address separate from the client's billing address",
      "Labor broken down by phase or trade (demolition, rough-in, finish) with hours × rate",
      "Materials itemized with waste allowance and fixture allowances",
      "Per-line sales tax flags (taxing materials while keeping labor exempt where applicable)",
      "A 30-day “valid until” date to protect against lumber and supply price swings",
      "Explicit exclusions — permits, structural rot, behind-wall surprises",
      "Up-front deposit percentage required to lock in the crew schedule",
    ],
    sections: [
      {
        h: "Split labor and materials — and name your allowances",
        p: "Homeowners and commercial property managers push back on single lump-sum estimates because they cannot tell whether a number reflects forty hours of skilled labor or expensive fixtures. Grouping crew hours under a Labor section and supplies under Materials gives each its own automatic subtotal. Where the client hasn't picked exact tile or fixtures yet, label the line as an “allowance” (for example, “36-inch vanity & faucet allowance — $780”) so everyone knows the estimate adjusts if they upgrade.",
      },
      {
        h: "Protect your margin with a clear exclusions note",
        p: "You cannot price what is hidden behind drywall or under a sub-floor before demolition starts. An estimate protects a handyman or contractor only when it states what is not included: city permit fees, mold or rot remediation, code upgrades to existing wiring, or haul-away of hazardous material. Writing two plain sentences in the Notes block turns an uncomfortable mid-job surprise into a documented change order.",
      },
      {
        h: "Price validity, deposits, and one-click conversion to invoice",
        p: "Supply-house quotes on lumber, copper, and tile rarely hold past thirty days, so neither should your job estimate. Set a firm Valid Until date and state the deposit required to reserve a start date (check your state's statutory cap on home-improvement deposits first). Once the client signs off, click “Convert to invoice →” in the side panel to carry every labor and material line straight onto your progress or final invoice.",
      },
    ],
    faq: [
      ["Is this contractor and handyman estimate maker completely free?", "Yes. You can itemize unlimited labor and material rows, add your contractor license number and logo, and download a clean PDF estimate right from a phone, tablet, or laptop — 100% free, no sign-up, and no watermark."],
      ["How do I tax materials without taxing construction labor?", "Each line item has its own taxable checkbox. Leave Labor lines unchecked and check Materials lines — BillCrafter calculates sales tax strictly on the taxable material subtotal. Confirm your state's rules for repair vs. new construction."],
      ["Should a handyman send an estimate or a fixed quote?", "Send an estimate whenever opening walls, troubleshooting repairs, or working on older homes where hidden conditions could add hours or parts. Send a fixed quote only when the exact scope is visible and predictable."],
      ["How do I include a material deposit on a construction estimate?", "Enter your deposit percentage (such as 30%) in the side panel's Deposit box. The PDF prints “Deposit due” below the estimated total so the client sees both the full project projection and what is needed to schedule the job."],
      ["Can I turn an approved construction estimate into an invoice on site?", "Yes. Use “Convert to invoice →” and all job-site details, client info, labor sections, and material lines transfer into a sequential invoice immediately."],
    ],
  },

  {
    slug: "rent-receipt-maker",
    type: "receipt", scenario: "rentreceipt", stamp: "paid",
    eyebrow: "Landlord & Tenant Proof of Payment · Instant PDF",
    metaTitle: "Free Rent Receipt Maker & Printable Landlord Receipt (PDF, No Sign-up)",
    metaDescription: "Create a printable rent receipt in seconds — pre-loaded with rental period dates, property address, monthly rent, security deposit, payment method, and PAID stamp. 100% free PDF, no sign-up.",
    h1: "Free rent receipt maker & template",
    sub: "Issue an official rent receipt in seconds — pre-filled with rental period, property unit address, monthly rent, security deposit, payment method, and a PAID stamp. Download or print as PDF with no sign-up.",
    intro: "Landlords, property managers, and subletters can give tenants clear, dated proof of rent payment. Itemize monthly rent alongside security deposits, parking, or utilities, record how the payment arrived, and export a clean PDF for both parties' records.",
    include: [
      "Rental property street address and apartment / unit number",
      "Exact rental period covered (e.g. Nov 1 – Nov 30, 2026)",
      "Tenant's full name and landlord or management contact details",
      "Monthly rent separated from refundable security deposits or pet fees",
      "Date payment was received and payment method (cash, check # , Zelle, ACH)",
      "Sequential receipt number (#REC-0001) and zero remaining balance",
    ],
    sections: [
      {
        h: "Why every cash, check, or Zelle rent payment needs a receipt",
        p: "Many states and municipalities legally require landlords to provide a written rent receipt whenever a tenant pays in cash, money order, or upon request. Even for electronic transfers like Zelle or Venmo, bank statements rarely state which lease period or unit a payment covered. A proper rent receipt ties the dollar amount to a specific property address, tenant name, and calendar month — protecting both landlord and tenant if a ledger question arises at lease renewal.",
      },
      {
        h: "Keep monthly rent separate from move-in deposits and utilities",
        p: "Move-in month often combines first month's rent, a refundable security deposit, key fees, and prorated utilities into one transfer. Never lump those into a single “Rent — $3,795” line. Itemizing monthly rent on line one and the refundable security deposit on line two creates an unambiguous paper trail at move-out when calculating deposit returns, and gives tenants accurate figures for state renter's tax credits.",
      },
      {
        h: "Partial rent payments, late fees, and sequential numbering",
        p: "When roommates split rent or a tenant makes a partial payment under a payment plan, enter the exact amount received today in the side panel's “Paid” field. Instead of stamping the whole month settled, the receipt honestly prints both the amount paid and the remaining balance due for that period. Save a free account copy to duplicate next month's receipt in ten seconds with the receipt number advancing automatically.",
      },
    ],
    faq: [
      ["Can I generate and print a rent receipt PDF for free with no sign-up?", "Yes. This rent receipt maker opens pre-configured with rental period dates, property address, rent and deposit lines, and a PAID stamp. Edit the details and download or print your PDF immediately — 100% free, no account required, no watermark."],
      ["What details make a rent receipt valid for proof of residency or tax credits?", "Include the landlord's name and contact info, tenant's name, full rental property address (including unit number), exact lease period covered, payment date, payment method, itemized rent amount, and receipt number."],
      ["How do I record cash or check rent payments?", "Type “Cash” or “Check #1048” into the Method field in the receipt header. Dating and numbering every cash rent receipt is essential because neither side has a bank clearing record to rely on."],
      ["Can I show a security deposit and monthly rent on the same receipt?", "Yes — the template pre-loads separate lines for monthly rent, refundable security deposit, and parking/utilities so refundable deposits are never confused with rent revenue."],
      ["How do I issue a rent receipt for a partial payment?", "Adjust the “Paid” amount in the side panel to match what the tenant paid today. The bottom of the receipt automatically switches from “Paid in full” to showing the exact remaining balance due."],
    ],
  },

  {
    slug: "freelance-design-quote-generator",
    type: "quote", scenario: "designquote",
    eyebrow: "Graphic Design, Web & Photography Quotes · Free PDF",
    metaTitle: "Free Design & Photography Quote Generator — Creative Project Quotes (PDF)",
    metaDescription: "Send winning graphic design, UI/UX web design, and photography project quotes. Itemize deliverables, revision rounds, usage licensing, and 50% booking deposits. Free PDF, no sign-up.",
    h1: "Free freelance design & photography quote template",
    sub: "Quote creative projects with clarity — pre-structured for brand & UI deliverables, revision rounds, commercial usage licensing, a 30-day validity window, and a 50/50 payment schedule. Free PDF, no sign-up.",
    intro: "Graphic designers, UI/UX freelancers, web studios, photographers, and illustrators win better clients with crisp, itemized quotes. Define exact deliverables and usage rights up front, set a booking deposit, and convert the accepted quote into an invoice in one click.",
    include: [
      "Specific creative deliverables (screen counts, file formats, final image counts)",
      "Included revision rounds per phase — and your hourly rate beyond them",
      "Usage rights and commercial licensing scope (web, social, print, buyout)",
      "Payment milestone schedule (e.g. 50% booking deposit, 50% prior to source-file release)",
      "A 30-day “valid until” date tied to your studio availability",
      "Clear note stating when ownership or usage rights transfer to the client",
    ],
    sections: [
      {
        h: "Stop scope creep at the quote stage by counting deliverables and revisions",
        p: "Creative projects rarely go over budget because the design took longer than expected; they go over budget because “website design” meant five pages to you and twelve to the client. Write concrete counts into every line item's detail row — “5 responsive Figma pages, 2 consolidated rounds of revisions” or “12 retouched product photos”. When a client can see the boundaries of the fixed price, extra requests naturally become paid add-ons instead of unpaid favours.",
      },
      {
        h: "Price usage licensing and source files on their own line",
        p: "In photography, illustration, and brand identity work, commercial usage rights carry real standalone value. Separating production fees from licensing — for example, one year of digital ad usage vs. a full global buyout, or packaged source files — anchors your expertise and gives budget-conscious clients a lever: if they ask for a lower total, you can narrow the license scope rather than discounting your creative rate.",
      },
      {
        h: "Tie deposits to booking and final payment to file handover",
        p: "Creative calendars are perishable: holding two weeks open for a client means turning other projects away. This template includes a 50% booking deposit and a milestone schedule on the quote itself, with a note that high-resolution deliverables and source files release upon final payment. Once the client approves, click “Convert to invoice →” to bill the booking deposit immediately without retyping a word.",
      },
    ],
    faq: [
      ["Can I download a graphic design or photography quote PDF for free?", "Yes. Customize the creative sections, upload your studio logo, pick your brand accent color, and export a crisp vector PDF immediately — 100% free, no sign-up required, and zero watermarks."],
      ["Should designers and photographers send a quote or an estimate?", "For fixed-scope packages (a brand identity, a 5-page website, a half-day shoot), clients strongly prefer a fixed quote so they can get budget sign-off. Include clear revision limits so your fixed price stays protected."],
      ["How do I show a 50% booking deposit on a creative quote?", "The template pre-configures both a 50% Deposit Due line and a two-step Payment Schedule (50% at kickoff, 50% on final handover) so the client agrees to the payment timeline the moment they accept your quote."],
      ["Should commercial usage rights be taxed?", "Sales tax rules on digital designs, photography sessions, licensing, and physical prints vary widely by US state and country. Use the per-line tax checkboxes to match your local tax rule."],
      ["Can I convert an approved design quote directly into an invoice?", "Yes. Click “Convert to invoice →” in the side panel and every creative section, deliverable description, and price carries straight into a numbered invoice."],
    ],
  },
];

export function getVertical(slug) {
  return VERTICALS.find((v) => v.slug === slug) || null;
}
