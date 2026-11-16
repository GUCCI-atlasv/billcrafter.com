// Editorial Guides & Software Benchmarks configuration (`/guides` & `/guides/[slug]`).
//
// Flagship #1: `/guides/best-free-invoice-ocr-software`
//   Targets "best ocr software for invoice processing" (1,600/mo, KD 15) +
//   "free invoice ocr software 2026" — embeds `OcrWorkbench` right on the page.
//
// Flagship #2: `/guides/how-to-scan-receipts-to-excel`
//   Targets "receipt photo to CSV OCR" / "how to scan receipts to excel free".

export const GUIDES = [
  {
    slug: "best-free-invoice-ocr-software",
    updated: "2026-11-15",
    category: "Software Comparison",
    readTime: "8 min read",
    eyebrow: "2026 Feature & Limit Comparison · 7 Tools",
    metaTitle: "7 Best Free Invoice OCR Software in 2026 (Compared)",
    metaDescription:
      "Compare 7 free invoice OCR tools by real free-tier limits, sign-up friction, line-item and tax extraction, spreadsheet exports, and privacy terms — plus try a live browser sandbox.",
    h1: "7 Best Free Invoice OCR Software in 2026: Free Limits, Exports & Tradeoffs",
    sub: "Most “free invoice OCR” lists blur together true no-signup web tools, developer API credits, and 14-day trials. Below is a sourced breakdown of seven popular options by actual free allowance, onboarding friction, line-item and tax support, and export formats — plus three public synthetic sample bills you can test live in BillCrafter.",
    disclosure:
      "Editorial disclosure: This comparison is written and published by CCC STUDIO, the maker of BillCrafter. Competitor free-tier allowances, sign-up requirements, and export formats were checked against each vendor’s public pricing and documentation pages on November 14, 2026. Because 3 sample bills are not a statistically valid benchmark across vendors, we do not publish comparative accuracy percentages.",
    embedSandbox: {
      defaultCsvPreset: "itemized",
      kicker: "Interactive Live Sandbox — Try BillCrafter Right Here (No Sign-Up)",
      blurb:
        "Drop your own PDF/photo invoice below or click one of our 3 public synthetic sample bills to inspect live extraction and automatic arithmetic verification:",
    },
    comparisonHeaders: [
      "Software",
      "Best For",
      "Free Allowance (Checked Nov 2026)",
      "Sign-Up Required?",
      "Line Items & Tax Verification",
      "Exports",
    ],
    comparisonRows: [
      [
        "1. BillCrafter Invoice OCR",
        "Instant browser extraction & turning receipts into client PDFs",
        "3 scans/day guest · 20/day free account",
        "No (instant)",
        "Line items + subtotal/tax/tip math check",
        "Excel (.xlsx), CSV (Ledger/QBO), Editable PDF",
      ],
      [
        "2. Nanonets",
        "Custom multi-step AP & ERP API workflows",
        "Starter credit on new accounts (per vendor pricing page)",
        "Yes (work email)",
        "Table & custom field extraction + approval rules",
        "JSON, CSV, QuickBooks, ERP webhooks",
      ],
      [
        "3. Rossum",
        "Mid-market & enterprise accounts payable teams",
        "Trial / guided sandbox only",
        "Yes + sales/demo gate",
        "AI extraction + human-in-the-loop review queue",
        "SAP, NetSuite, Coupa, XML/CSV",
      ],
      [
        "4. Dext Prepare",
        "Bookkeepers syncing directly to Xero / QuickBooks",
        "14-day free trial (paid plans thereafter)",
        "Yes (trial)",
        "Summary-first; line items depend on plan/settings",
        "Direct Xero/QBO push, CSV",
      ],
      [
        "5. Klippa DocHorizon",
        "EU GDPR compliance & European VAT workflows",
        "Starter platform credit on verified business signup",
        "Yes (business verification)",
        "EU VAT/IBAN parsing + fraud checks",
        "JSON, CSV, XLSX, UBL/XRechnung",
      ],
      [
        "6. Veryfi / Mindee",
        "Developers embedding mobile receipt SDKs",
        "Free developer sandbox / monthly dev quota",
        "Yes (API key)",
        "Structured receipt/invoice JSON objects",
        "REST JSON",
      ],
      [
        "7. Google Cloud Document AI",
        "Engineering teams building custom cloud pipelines",
        "New-GCP-customer credit; per-page pricing thereafter",
        "Yes (GCP billing)",
        "Raw parser entities + bounding boxes",
        "Raw JSON (requires custom code for Excel)",
      ],
    ],
    methodology: {
      title: "Try 3 public synthetic sample bills in the sandbox",
      intro:
        "Want to see how BillCrafter’s own extractor handles common formatting edge cases before uploading your own files? These three public synthetic sample fixtures (fictional vendors and amounts) run locally in the sandbox above — they demonstrate BillCrafter’s extraction and arithmetic check, not a comparative accuracy score across all seven vendors:",
      fixtures: [
        {
          name: "Sample A — Creased Café Receipt (PNG)",
          url: "/samples/sample-coffee-receipt.png",
          challenge: "Thermal-style receipt layout, 4 food items, 8.25% sales tax, and a separate $7.85 tip line.",
        },
        {
          name: "Sample B — Contractor Hardware Invoice (PNG)",
          url: "/samples/sample-hardware-invoice.png",
          challenge: "3 taxed building-material SKUs ($735.00 @ 8% tax) plus 1 tax-exempt delivery line ($65.00).",
        },
        {
          name: "Sample C — Multi-Rate B2B Consulting Invoice (PNG)",
          url: "/samples/sample-consulting-invoice.png",
          challenge: "Dated timesheet rows at $195/hr and $140/hr, fixed milestone fee, PO number, and Net 30 due date.",
        },
      ],
      testMatrixTitle: "BillCrafter OCR check scenarios, expected answers & known limits (checked Nov 15, 2026 · Gemini 2.5 Flash)",
      testMatrixNote:
        "Our built-in math check verifies only that Subtotal − Discount + Tax + Shipping + Tip = Total within $0.02. It does not prove every line description or unit rate matches your paper document — always compare extracted fields against the original bill.",
      testMatrixHeaders: ["Scenario", "Expected Figure / Behavior", "Scope & Limitation"],
      testMatrixRows: [
        [
          "USD café receipt (synthetic)",
          "39.25 subtotal + 3.24 tax (8.25%) + 7.85 tip = 50.34 total",
          "Preset synthetic demo result (0 AI calls); tip & tax columns verified separately.",
        ],
        [
          "Mixed-tax hardware bill (synthetic)",
          "735.00 taxed materials @ 8% (58.80 tax) + 65.00 tax-exempt delivery = 858.80",
          "Preset synthetic demo result; non-taxable flag preserved per row.",
        ],
        [
          "Zero-decimal JPY invoice",
          "Integer yen amounts (0 decimal places) with no fractional rounding drift",
          "Verified in unit tests (currencyDecimals('JPY') === 0); verify tax-inclusive vs exclusive on Japanese invoices.",
        ],
        [
          "European decimal/thousands format",
          "Separates comma decimals (e.g. 1.250,50 EUR) and local VAT/MwSt./TVA rates into numeric cells",
          "Exported CSV/XLSX writes normalized numeric floats; verify regional tax rate on multi-rate bills.",
        ],
        [
          "Low-clarity / arithmetic discrepancy",
          "26.00 + 2.00 = 28.00 vs 28.50 printed total triggers yellow Math check warning",
          "Demonstrated by the 4th synthetic demo chip in the workbench; prompts user review instead of hiding mismatch.",
        ],
        [
          "Oversized (>4.5 MB) or unsupported file",
          "Client/API rejects before spending quota (counted: false) and preserves prior scanned rows",
          "Images >16 MB or PDFs >4.5 MB are blocked cleanly with a screenshot/smaller-PDF suggestion.",
        ],
      ],
    },
    reviews: [
      {
        rank: 1,
        name: "BillCrafter Invoice & Receipt OCR",
        badge: "Free Instant Web Tool (No Sign-Up to Start)",
        bestFor: "Freelancers, contractors, and SMB bookkeepers who want clean Excel/CSV or client reimbursement PDFs right in the browser.",
        freeTier: "3 scans/day without an account · 20 scans/day with a free account ($0, no paid plans, zero watermarks).",
        officialUrl: "https://billcrafter.com/invoice-ocr-scanner",
        officialLabel: "BillCrafter Invoice OCR product page",
        verifiedAt: "November 14, 2026",
        summary:
          "Most OCR vendors treat “free” as a lead-capture form for an enterprise sales team. BillCrafter opens the full split-screen scanner directly in your browser. Drop a PDF, snap a receipt with your phone camera, or press ⌘V to paste a screenshot, and structured multimodal vision extracts each line item alongside your original document. Every scan runs a deterministic arithmetic check (Subtotal + Tax + Tip = Total) and exports either a native two-sheet Excel (.xlsx) workbook with live =SUM() formulas, a UTF-8 Expense Ledger CSV, or sends the extracted items straight into BillCrafter’s WYSIWYG invoice editor.",
        pros: [
          "Works immediately without sign-up, credit card, or watermarks on CSV, XLSX, or PDF",
          "Built-in Math Sanity Check highlights discrepancies if a blurry receipt digit doesn’t add up",
          "Converts supplier/travel receipts directly into a client-facing reimbursement PDF invoice (with receipt photos attached)",
          "Guest uploads are processed in volatile memory via Google Cloud Vertex AI (enterprise zero-training terms)",
        ],
        cons: [
          "Not designed for 10,000-invoice/month automated ERP 3-way PO matching",
          "No direct OAuth push into NetSuite/SAP (exports clean QuickBooks/Xero-ready CSV & XLSX instead)",
        ],
        ctaHref: "/invoice-ocr-scanner",
        ctaLabel: "Open Free Invoice OCR Scanner →",
      },
      {
        rank: 2,
        name: "Nanonets",
        badge: "Best for Custom AP Automation Pipelines",
        bestFor: "Operations and finance engineers automating recurring vendor formats via webhooks or ERP integrations.",
        freeTier: "Starter credit on new workspace sign-ups; usage-based per-page pricing thereafter (check vendor pricing page for current terms).",
        officialUrl: "https://nanonets.com/pricing",
        officialLabel: "Nanonets pricing & plans",
        verifiedAt: "November 14, 2026",
        summary:
          "Nanonets is built for conditional AP workflows — for example, flagging any invoice over $5,000, matching line items against a master SKU table, and pushing approved JSON straight into QuickBooks Online or an internal database. Setup takes time in its workflow builder, making it heavier than needed for quick spreadsheet exports but well suited to growing finance teams.",
        pros: [
          "Built for multi-page table extraction and custom field schemas",
          "Visual no-code workflow rules, webhooks, and email-inbox auto-forwarding",
        ],
        cons: [
          "Requires work-email sign-up and workspace setup before your first export",
          "Per-field/per-page pricing applies once starter credits are used",
        ],
      },
      {
        rank: 3,
        name: "Rossum",
        badge: "Best for Enterprise Accounts Payable Teams",
        bestFor: "Mid-market and enterprise AP departments processing thousands of invoices per month across multiple subsidiaries.",
        freeTier: "Guided trial / sandbox only; commercial pricing is quote-based for enterprise volume.",
        officialUrl: "https://rossum.ai/pricing/",
        officialLabel: "Rossum platform & pricing",
        verifiedAt: "November 14, 2026",
        summary:
          "Rossum focuses on high-volume accounts payable automation with its Aurora transactional AI engine and a dedicated human-in-the-loop validation queue for full-time AP clerks. It includes automated vendor email communication when a PO number is missing and native connectors for SAP, Coupa, and NetSuite.",
        pros: [
          "Dedicated human review queue with bounding-box keyboard shortcuts",
          "Supports 3-way purchase-order matching and multi-subsidiary tax codes",
        ],
        cons: [
          "Enterprise-oriented sales onboarding — not usable as a quick free web utility",
        ],
      },
      {
        rank: 4,
        name: "Dext Prepare (formerly Receipt Bank)",
        badge: "Best for Bookkeepers Living Inside Xero or QuickBooks",
        bestFor: "Accounting firms and bookkeepers who want clients to snap receipts into a dedicated mobile inbox.",
        freeTier: "14-day free trial only; no permanent free tier.",
        officialUrl: "https://dext.com/pricing",
        officialLabel: "Dext pricing & trial details",
        verifiedAt: "November 14, 2026",
        summary:
          "Dext isn’t trying to be a standalone PDF-to-Excel converter — it’s a pre-accounting hub that remembers supplier coding rules and publishes directly to Xero or QuickBooks Online. Depending on your plan and settings, Dext often focuses on header-level totals rather than full line-item extraction unless line-item capture is enabled.",
        pros: [
          "Polished client mobile app and dedicated forwarding email inbox",
          "Deep supplier rules and chart-of-accounts memory for Xero and QuickBooks",
        ],
        cons: [
          "No permanent free plan — requires a monthly subscription after 14 days",
          "Over-engineered if you simply want a clean CSV or Excel spreadsheet",
        ],
      },
      {
        rank: 5,
        name: "Klippa DocHorizon",
        badge: "Best for EU VAT & E-Invoicing Compliance",
        bestFor: "European businesses needing EU data residency, IBAN validation, and UBL/XRechnung outputs.",
        freeTier: "Starter platform credit upon verified business account registration.",
        officialUrl: "https://www.klippa.com/en/dochorizon/",
        officialLabel: "Klippa DocHorizon documentation",
        verifiedAt: "November 14, 2026",
        summary:
          "Headquartered in the Netherlands, Klippa focuses on European invoices carrying multiple MwSt./TVA/IVA rates, QR payment codes, and GDPR-oriented processing including optional PII masking and UBL/XRechnung e-invoice conversion.",
        pros: [
          "Strong European tax-ID, IBAN, and e-invoicing format support",
          "Built-in document fraud & duplicate-receipt detection options",
        ],
        cons: [
          "Requires business account approval; oriented toward API/platform buyers rather than casual users",
        ],
      },
      {
        rank: 6,
        name: "Veryfi / Mindee",
        badge: "Best Developer APIs for Mobile Apps",
        bestFor: "Software developers building expense-management features into their own iOS, Android, or SaaS product.",
        freeTier: "Free developer sandbox / limited monthly API call tier.",
        officialUrl: "https://www.veryfi.com/pricing/",
        officialLabel: "Veryfi developer pricing",
        verifiedAt: "November 14, 2026",
        summary:
          "If you are writing Python or TypeScript and want a clean REST JSON response from receipt photos via an API or mobile capture SDK, Veryfi and Mindee are built for developer integration. Non-developers will need a spreadsheet tool instead, as their primary workflow is API-first.",
        pros: [
          "Well-documented OpenAPI specs + mobile camera SDKs",
          "Enterprise security certifications (e.g., SOC 2 Type II on Veryfi)",
        ],
        cons: [
          "Returns developer JSON — non-technical users cannot just drag a PDF and get an Excel workbook",
        ],
      },
      {
        rank: 7,
        name: "Google Cloud Document AI (Invoice Parser)",
        badge: "Best Raw Cloud Infrastructure for Engineering Teams",
        bestFor: "Companies already running workloads on GCP that want raw bounding-box invoice JSON.",
        freeTier: "New-GCP-customer credit; specialized Invoice Parser is billed per page afterward.",
        officialUrl: "https://cloud.google.com/document-ai/pricing",
        officialLabel: "Google Cloud Document AI pricing",
        verifiedAt: "November 14, 2026",
        summary:
          "Google’s specialized Invoice Parser provides structured entity JSON and bounding boxes inside GCP projects, with IAM, VPC Service Controls, and US/EU regional endpoints. Because it is raw cloud infrastructure, your team still has to write post-processing code to build Excel workbooks or run tax-math reconciliation.",
        pros: [
          "Enterprise SLAs, VPC Service Controls, and regional US/EU processing",
        ],
        cons: [
          "Zero end-user spreadsheet UI — requires GCP IAM setup and custom code",
        ],
      },
    ],
    decisionGuide: [
      [
        "Under 100 bills/month (Freelancers, Contractors, Small Businesses)",
        "Use BillCrafter’s Free Invoice OCR Scanner or Receipt-to-CSV Converter. You pay $0, skip sign-up friction, get math-verified Excel/CSV sheets immediately, and can turn reimbursable receipts straight into client PDF invoices.",
      ],
      [
        "Bookkeeping practices managing 15+ Xero / QuickBooks clients",
        "Evaluate Dext Prepare if your primary need is automated chart-of-accounts publishing into Xero or QuickBooks, and use BillCrafter whenever you need quick line-item Excel breakdowns or client-facing PDFs.",
      ],
      [
        "2,000+ invoices/month with ERP 3-way PO matching",
        "Evaluate Rossum or Nanonets for dedicated AP approval queues and SAP/NetSuite webhooks.",
      ],
    ],
    faq: [
      [
        "How should I evaluate invoice OCR accuracy before choosing a tool?",
        "Test every candidate on a handful of your own actual documents — especially creased thermal receipts, mixed-tax invoices, and multi-page PDFs — and verify whether the output separates subtotal, tax, and tip cleanly. Tools with built-in arithmetic verification (Subtotal + Tax + Tip = Total) make misread digits obvious before they reach your ledger.",
      ],
      [
        "Which free invoice OCR tool works without signing up or entering a credit card?",
        "BillCrafter’s Invoice OCR Scanner (/invoice-ocr-scanner) lets you scan up to 3 real PDF or photo invoices per day and download formatted Excel (.xlsx) or CSV spreadsheets with zero registration. Signing up for a free account raises the limit to 20/day.",
      ],
      [
        "Can free OCR software extract individual line items into Excel, or only the total?",
        "Many bookkeeping apps default to capturing only the merchant name, date, and grand total. BillCrafter extracts every individual line item (description, category, quantity, unit price, tax flag, and line total) into a dedicated Line Items worksheet alongside a Summary worksheet.",
      ],
      [
        "Is it safe to upload company invoices to a free online OCR scanner?",
        "Always check whether a tool retains your files for model training. BillCrafter processes guest uploads strictly in volatile memory through Google Cloud Vertex AI (governed by enterprise zero-training terms) and deletes the file immediately after returning your table.",
      ],
    ],
  },

  {
    slug: "how-to-scan-receipts-to-excel",
    updated: "2026-11-15",
    category: "Step-by-Step Tutorial",
    readTime: "6 min read",
    eyebrow: "Expense Reporting Guide · Phone & Desktop",
    metaTitle: "How to Scan Receipt Photos to CSV & Excel Free (2026)",
    metaDescription:
      "Step-by-step guide to turning phone receipt photos into clean Excel or Google Sheets expense reports without manual typing. Free online AI OCR included.",
    h1: "How to Scan Receipt Photos to CSV & Excel for Free (No App Needed)",
    sub: "Typing faded paper receipts into Excel at the end of the month is one of the highest-friction chores in small business. Here is the practical workflow to turn phone photos or PDFs into a math-checked CSV or two-sheet Excel workbook right in your browser.",
    embedSandbox: {
      defaultCsvPreset: "ledger",
      kicker: "Try It Live — Expense Ledger Mode (1 Row Per Receipt)",
      blurb:
        "Snap a photo on your phone or drop up to 3 receipt images right below (or try a synthetic demo fixture) to download a ready-to-open CSV or .xlsx:",
    },
    steps: [
      [
        "Capture flat, well-lit photos (or batch-drag from your computer)",
        "Place the paper receipt on a contrasting desk surface so all four edges and the grand total are visible. If you are already on your phone, tap “Snap receipt photo” above to open your rear camera directly in Safari or Chrome — no app store download required.",
        "/steps/ocr-step-1.png",
      ],
      [
        "Choose between Expense Ledger (1 row/receipt) vs. Itemized Lines",
        "For tax prep, mileage/travel reimbursement, or monthly bookkeeping, select “CSV: Expense Ledger (1 row/receipt)” so 10 receipts produce 10 clean summary rows (Date, Merchant, Category, Subtotal, Tax, Tip, Total). Choose “Line Items” when tracking individual SKUs or building materials.",
        "/steps/ocr-step-2.png",
      ],
      [
        "Check the arithmetic status bar before exporting",
        "Glance at the status bar above your extracted table and compare key amounts against your original receipt. If a crease hid a tax figure, use the reconciliation bar or edit the field directly so your Excel =SUM() totals match your receipt.",
        "/steps/ocr-step-3.png",
      ],
    ],
    proTips: [
      {
        h: "Why CSVs sometimes show garbled symbols in Windows Excel — and how we prevent it",
        p: "When Excel on Windows opens a plain UTF-8 file without a Byte Order Mark (BOM), symbols like €, £, ¥, or accented café names turn into mojibake characters (Ã©). BillCrafter automatically prepends a standards-compliant UTF-8 BOM to every CSV download and wraps comma-containing descriptions in RFC 4180 quotes, so double-clicking the file opens cleanly in Excel, Apple Numbers, and Google Sheets.",
      },
      {
        h: "Billing materials or travel back to a client? Skip the spreadsheet altogether",
        p: "If the whole reason you’re scanning receipts is to charge a client for reimbursable expenses, you don’t even need Excel as a middleman. After scanning your receipts, click “Open in Invoice Editor → Bill expenses to client” to generate a numbered, watermark-free PDF invoice with your receipt photos neatly attached at the bottom as proof of purchase.",
      },
    ],
    faq: [
      [
        "Can Microsoft Excel scan receipt photos by itself?",
        "Excel’s mobile app includes a basic “Data from Picture” button, but it tries to map spatial text gridlines rather than semantic receipt fields — which scrambles multi-line store headers, tips, and taxes across random columns. A dedicated receipt-to-CSV parser outputs uniform Date, Vendor, Tax, and Total columns every time.",
      ],
      [
        "How do I import the exported CSV into Google Sheets?",
        "Open Google Sheets, click File → Import → Upload, and drop the CSV file downloaded from BillCrafter. Leave separator detection on Automatic — every column and decimal aligns immediately.",
      ],
      [
        "How many receipts can I convert to CSV for free?",
        "Guests get 3 free AI scans every day with zero sign-up; creating a free BillCrafter account unlocks 20 scans per day and batches of up to 10 receipts merged into a single CSV or Excel download.",
      ],
    ],
  },

  {
    slug: "billing-and-ocr-help-guide",
    updated: "2026-11-15",
    category: "Help & Worked Examples",
    readTime: "7 min read",
    eyebrow: "Product Help · Worked Examples & Rules",
    metaTitle: "BillCrafter Help & Worked Examples: Deposits, Timesheets, OCR & Exports",
    metaDescription:
      "Worked billing examples (deposits, progress schedules, timesheets, receipts) and step-by-step help for OCR extraction, saving drafts, quotas, and PDF exports.",
    h1: "BillCrafter Help & Worked Examples: Invoicing, OCR & Exporting",
    sub: "How BillCrafter calculates deposits, schedules, timesheets, and tax — plus step-by-step help for OCR review, saving drafts, daily quotas (resets at 00:00 UTC), and PDF export recovery.",
    workedExamples: [
      {
        id: "invoicing-deposits",
        title: "Worked Example 1 · Contractor Deposit, Labor/Materials & Milestone Schedule",
        toolHref: "/contractor-invoice-generator",
        toolLabel: "Open Contractor Invoice Generator →",
        rows: [
          ["Labor section", "18 hrs @ $55/hr + 2 hrs @ $65/hr = $1,120.00 (marked non-taxable if labor is exempt in your state)"],
          ["Materials section", "$340.00 (marked taxable @ 8.25% = $28.05)"],
          ["Total & Deposit due", "Invoice total = $1,488.05. Setting Deposit = 30% prints “Deposit due (30%): $446.42” below Total without altering the invoice total."],
          ["Payment schedule", "Adding milestones (e.g. Deposit $446.42, Rough-in $520.00, Completion $521.63) prints a dedicated Payment schedule table and Job site block on the PDF."],
        ],
      },
      {
        id: "timesheet-hourly",
        title: "Worked Example 2 · Consulting Timesheet & Tax-Exempt Expenses",
        toolHref: "/timesheet-invoice",
        toolLabel: "Open Timesheet Invoice Template →",
        rows: [
          ["Timesheet toggle", "Click “+ Timesheet” below the table to add a Date column; Qty becomes Hours and a Total hours summary row prints above Subtotal."],
          ["Mixed rates", "Use “+ Add section” to separate Senior Advisory ($185/hr) from Engineering ($140/hr) or Fixed Fees with automatic section subtotals."],
          ["Discounts & tax", "Discounts are applied proportionally across taxable and non-taxable lines before computing tax, rounded per currency precision (2 decimals for USD/EUR, 0 for JPY/KRW/VND)."],
        ],
      },
      {
        id: "receipt-proof",
        title: "Worked Example 3 · Paid Receipt Confirmation",
        toolHref: "/receipt-maker",
        toolLabel: "Open Free Receipt Maker →",
        rows: [
          ["Receipt mode", "Switches labels to Receipt, Received from, Paid on, and Method (Card / Cash / Bank transfer) with a PAID stamp."],
          ["Paid in full vs partial", "Enter the full Total in the side panel Paid field to print Paid in full ($0.00 balance due), or enter a partial payment to show the remaining balance due."],
        ],
      },
      {
        id: "ocr-to-invoice",
        title: "Worked Example 4 · OCR Review, Math Check & Client Reimbursement PDF",
        toolHref: "/invoice-ocr-scanner",
        toolLabel: "Open Invoice OCR Scanner →",
        rows: [
          ["1. Upload & check", "Drop a JPG, PNG, WebP, or PDF (up to 4.5 MB). Inspect extracted vendor, dates, currency, and line items side-by-side against the original image."],
          ["2. Resolve math differences", "If the status bar flags a difference (e.g. a faded digit), edit the row directly or click “Set Total to …” / “Add adjustment line”."],
          ["3. Export or re-bill", "Download Expense Ledger CSV (1 row/receipt), Line Items CSV, two-sheet Excel (.xlsx with =SUM() formulas), or click “Open in Invoice Editor → Bill expenses to client” to create a clean reimbursement PDF with receipt photos attached."],
        ],
      },
    ],
    proTips: [
      {
        h: "Saving drafts, cloud sync & browser recovery",
        p: "Unregistered edits auto-save locally in your browser’s localStorage for up to 7 days (clearing browser data or clicking Reset removes the local draft). To keep business profiles, clients, and invoice history across devices, sign in with a free account — edits save to Cloudflare D1 and can be duplicated in one click from My invoices.",
      },
      {
        h: "Daily allowances & reset schedule (00:00 UTC)",
        p: "Without an account: 1 PDF export/day and 3 AI OCR scans/day (up to 3 files per batch). With a free account: unlimited PDF exports, 20 AI OCR scans/day (up to 10 files per batch), and up to 3 outbound invoice emails/day (1/minute anti-spam cooldown). All daily counters reset at 00:00 UTC. Preset synthetic demo samples in the OCR workbench never consume quota.",
      },
      {
        h: "What to do if PDF export, OCR, or email fails",
        p: "If the server PDF renderer is unavailable or a download is blocked, BillCrafter automatically falls back to the in-browser PDF generator or lets you open your browser Print dialog (“Save as PDF”). Failed OCR scans and failed submissions are never charged against your daily allowance. If a page link carries an (EN) badge on a localized view, that target page is currently in English only. Need help or found an error? Email support@billcrafter.com.",
      },
    ],
    faq: [
      [
        "Why did my branding footer link appear or stay hidden?",
        "New documents default to NO BillCrafter footer link on Invoice, Estimate, Quote, and Receipt PDFs. If you want to include the attribution link, tick “Include BillCrafter footer link” in the side panel under Tax & adjustments.",
      ],
      [
        "Why is my daily email limit 3 per day when PDF exports are unlimited?",
        "Free accounts can create and download unlimited PDFs. Outbound invoice emails are capped at 3 per UTC day (and 1 per minute) to prevent spam abuse on our shared mail relay; after 3 emails you can always download the PDF and send it from your own email inbox.",
      ],
      [
        "Are BillCrafter PDFs legally compliant tax or e-invoices in every country?",
        "No. BillCrafter is a document and extraction utility, not an accounting, tax, or certified e-invoicing system (such as Italy’s SdI, Taiwan’s e-GUI, or Russia’s My Tax / счет-фактура). Verify local tax registration and mandatory invoice fields with a qualified accountant or local tax authority.",
      ],
    ],
  },
];

export function getGuide(slug) {
  return GUIDES.find((g) => g.slug === slug) || null;
}
