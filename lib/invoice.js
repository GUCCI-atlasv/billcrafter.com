// Pure invoice helpers + config shared by the editor, dashboard and (future) API.

export const CURRENCIES = {
  USD: "$", EUR: "€", GBP: "£", CAD: "C$", AUD: "A$", JPY: "¥", CNY: "¥",
  INR: "₹", BRL: "R$", MXN: "$", CHF: "CHF ", SGD: "S$", HKD: "HK$",
  NZD: "NZ$", SEK: "kr ", ZAR: "R ", TWD: "NT$", RUB: "₽", PLN: "zł ",
  AED: "AED ", BDT: "৳", KRW: "₩", IDR: "Rp ", ILS: "₪", PEN: "S/ ", DOP: "RD$ ", VND: "₫",
  // Crypto. Shown with the ticker as prefix, 2 decimals — the wallet address /
  // network is set in the dedicated crypto payment block.
  USDT: "USDT ", USDC: "USDC ", GRAM: "GRAM ",
};

// Coins that unlock the crypto payment block (network + address + QR).
// Amounts print to 2 decimals like fiat; native chain precision is higher for
// some coins, but invoices use a practical commercial precision.
export const CRYPTO = {
  USDT: { name: "Tether (USDT)", networks: ["TRC-20 · Tron", "ERC-20 · Ethereum", "BEP-20 · BNB Chain", "Polygon", "Arbitrum", "Solana"] },
  USDC: { name: "USD Coin (USDC)", networks: ["ERC-20 · Ethereum", "Base", "Solana", "Polygon", "Arbitrum", "TRC-20 · Tron"] },
  GRAM: { name: "Gram (GRAM)", networks: ["TON · The Open Network"] },
};
export const isCrypto = (c) => Object.prototype.hasOwnProperty.call(CRYPTO, c);

export const TYPES = {
  invoice:  { word: "Invoice",  prefix: "INV", d2: "Due",         party: "Bill to",       total: "Total",           method: false, next: "receipt", nextLabel: "Convert to receipt →" },
  estimate: { word: "Estimate", prefix: "EST", d2: "Valid until", party: "Prepared for",  total: "Estimated total", method: false, next: "invoice", nextLabel: "Convert to invoice →" },
  quote:    { word: "Quote",    prefix: "QUO", d2: "Valid until", party: "Prepared for",  total: "Quoted total",    method: false, next: "invoice", nextLabel: "Convert to invoice →" },
  receipt:  { word: "Receipt",  prefix: "REC", d2: "Paid on",     party: "Received from", total: "Total",           method: true,  next: null,      nextLabel: "Receipt is final" },
};

export const ACCENTS = ["#16181C", "#4F46E5", "#2563EB", "#0EA5E9", "#0D9488", "#0E9F6E", "#7C3AED", "#DB2777", "#EA580C", "#DC2626", "#D97706", "#334155"];

export const SCENARIOS = {
  blank: { name: "", details: "", items: [{ desc: "", detail: "", qty: 1, rate: 0, tax: true }], notes: "Payment due within 14 days. Thank you!", pay: "", tax: 0 },
  freelance: {
    name: "Alex Rivera Design", details: "22 Studio Ln, Austin, TX 78701\nalex@rivera.design",
    items: [
      { desc: "Website design", detail: "Responsive layout, 5 pages, 2 revision rounds", qty: 1, rate: 1800, tax: false },
      { desc: "Logo & brand kit", detail: "Primary logo, color palette, font system", qty: 1, rate: 600, tax: false },
    ],
    notes: "Net 14. Late payments subject to 1.5%/mo, as agreed in our contract. Thank you!", pay: "PayPal: alex@rivera.design  ·  Zelle: (555) 010-2233", tax: 0,
  },
  contractor: {
    name: "BrightHome Services LLC", details: "9 Depot Rd, Denver, CO 80205\n(555) 222-9090",
    jobAddr: "1420 S Emerson St, Denver, CO 80210",
    items: [
      { section: "Labor" },
      { desc: "Interior painting — labor", detail: "2 bedrooms + hallway, 3 coats", qty: 18, rate: 55, tax: false },
      { desc: "Drywall patch & prep", detail: "Hallway, 2 patches, sand + prime", qty: 2, rate: 65, tax: false },
      { section: "Materials" },
      { desc: "Paint & materials", detail: "Premium low-VOC, primer, supplies", qty: 1, rate: 340, tax: true },
    ],
    notes: "Payment due on receipt. Warranty: 1 year on labor.", pay: "Check or bank transfer. Routing/Acct on request.", tax: 8.25,
  },
  consulting: {
    name: "NorthPeak Consulting", details: "500 Congress Ave, Ste 12, Austin, TX 78701",
    timesheet: true,
    items: [
      { section: "Advisory — hourly" },
      { date: "2026-06-03", desc: "Discovery workshop", detail: "On-site, exec team", qty: 6, rate: 185, tax: false },
      { date: "2026-06-11", desc: "Market analysis", detail: "Competitor review + sizing", qty: 9.5, rate: 185, tax: false },
      { date: "2026-06-18", desc: "Board pack & readout", detail: "Remote, prep + presentation", qty: 8.5, rate: 185, tax: false },
      { section: "Fixed fee" },
      { desc: "Workshop facilitation", detail: "Full-day leadership workshop", qty: 1, rate: 2500, tax: false },
    ],
    notes: "Net 30. Hours are billed in 30-minute increments against the SOW dated 1 June.", pay: "ACH / Wire — see MSA. Stripe link available on request.", tax: 0,
  },
  photography: {
    name: "Lens & Light Studio", details: "14 Harbor St, San Diego, CA 92101\nhello@lensandlight.co",
    items: [
      { desc: "Half-day photo session", detail: "4 hours on location, digital delivery", qty: 1, rate: 950, tax: false },
      { desc: "Photo editing & retouching", detail: "40 final images, color-graded", qty: 40, rate: 12, tax: false },
      { desc: "Print licensing", detail: "Commercial usage, 1 year", qty: 1, rate: 400, tax: false },
    ],
    notes: "50% deposit due on booking. Balance on delivery.", pay: "PayPal: hello@lensandlight.co  ·  Stripe link on request", tax: 0,
  },
  cleaning: {
    name: "Sparkle Clean Co", details: "88 Maple Ave, Columbus, OH 43004\n(555) 771-2020",
    jobAddr: "Cedar Park Offices — 400 Cedar Park Dr, Columbus, OH 43004",
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Weekly", scope: "4 weekly visits this period. Kitchen, baths, floors and dusting each visit; interior windows monthly." },
    items: [
      { desc: "Weekly clean — office suite", detail: "Kitchen, baths, floors, dusting · 4 visits", qty: 4, rate: 240, tax: false },
      { desc: "Interior windows", detail: "Monthly add-on, 12 windows", qty: 12, rate: 6, tax: false },
      { desc: "Supplies", detail: "Eco-friendly products", qty: 1, rate: 25, tax: true },
    ],
    notes: "Payment due on completion. Weekly/bi-weekly plans are billed monthly in arrears.", pay: "Cash, check, Venmo, or card on site.", tax: 7.5,
  },
  smallbusiness: {
    name: "Maple & Co.", details: "500 Commerce Dr, Suite 210, Chicago, IL 60601\nbilling@mapleandco.com",
    items: [
      { desc: "Product / service — line 1", detail: "Describe what you delivered", qty: 1, rate: 500, tax: true },
      { desc: "Product / service — line 2", detail: "Add as many as you need", qty: 2, rate: 150, tax: true },
    ],
    notes: "Payment due within 15 days. Thank you for your business!", pay: "Bank transfer / card. Details below.", tax: 8.25,
  },
  design: {
    name: "Pixel & Co Studio", details: "77 Market St, Portland, OR 97204\nhi@pixelandco.studio",
    items: [
      { desc: "UI/UX design", detail: "Wireframes + hi-fi mockups, 8 screens", qty: 1, rate: 2400, tax: false },
      { desc: "Front-end build", detail: "Responsive, 40 hrs @ $95", qty: 40, rate: 95, tax: false },
      { desc: "Design system", detail: "Components, tokens, docs", qty: 1, rate: 800, tax: false },
    ],
    notes: "Net 15. Source files delivered on final payment.", pay: "Stripe link on request · ACH available", tax: 0,
  },
  writing: {
    name: "Maya Chen Copy & Content", details: "48 Elm St, Asheville, NC 28801\nmaya@mayachen.co",
    items: [
      { desc: "Feature article — \u201cRemote teams that ship\u201d", detail: "2,000 words, 1 revision round, SEO brief supplied", qty: 1, rate: 800, tax: false },
      { desc: "Blog posts — October batch", detail: "4 posts × 1,200 words, delivered Oct 3–24", qty: 4, rate: 300, tax: false },
      { desc: "Additional edit round", detail: "Feature article, client-requested restructure", qty: 2, rate: 65, tax: false },
    ],
    notes: "Net 14. Payment releases usage rights to the delivered copy. Thank you!", pay: "Bank transfer (ACH) or PayPal: maya@mayachen.co", tax: 0,
  },
  videography: {
    name: "Frame 24 Studio", details: "12 Canal Rd, Brooklyn, NY 11222\nbook@frame24.studio",
    items: [
      { desc: "Full-day video shoot", detail: "Director + operator, 8 hrs", qty: 1, rate: 1800, tax: false },
      { desc: "Editing & color grade", detail: "Final 3–5 min film + cutdowns", qty: 1, rate: 1200, tax: false },
      { desc: "Licensed music", detail: "Commercial usage", qty: 1, rate: 150, tax: true },
    ],
    notes: "50% deposit to book. Balance on delivery.", pay: "PayPal / bank transfer", tax: 8.875,
  },
  plumbing: {
    name: "FlowRight Plumbing", details: "9 Depot Rd, Denver, CO 80205\ndispatch@flowright.com",
    jobAddr: "77 Larimer St, Unit 3, Denver, CO 80205",
    items: [
      { section: "Labor" },
      { desc: "Service call — labor", detail: "Diagnosis + repair, 2.5 hrs", qty: 2.5, rate: 110, tax: false },
      { section: "Parts" },
      { desc: "Parts — valve & fittings", detail: "Brass, 3/4in", qty: 1, rate: 78, tax: true },
    ],
    notes: "Payment due on completion. 90-day workmanship warranty.", pay: "Card, check, or Zelle", tax: 8.25,
  },
  hvac: {
    name: "CoolAir HVAC", details: "410 Industrial Blvd, Phoenix, AZ 85009\nservice@coolair.com",
    jobAddr: "Bright Valley HOA — clubhouse, 700 Valley Pkwy, Phoenix, AZ 85009",
    svc: { from: "2026-01-01", to: "2026-06-30", freq: "Twice a year", scope: "Maintenance plan visit 1 of 2 (spring). Autumn heating check scheduled separately." },
    items: [
      { section: "Labor" },
      { desc: "AC system tune-up", detail: "Inspection, coil clean, refrigerant check", qty: 1, rate: 149, tax: false },
      { section: "Parts" },
      { desc: "Capacitor replacement", detail: "OEM, 45/5 µF", qty: 1, rate: 65, tax: true },
    ],
    notes: "Net 7. Plan members get priority scheduling and no diagnostic fee.", pay: "Card or bank transfer", tax: 8.6,
  },
  retail: {
    name: "Nook Goods", details: "220 Main St, Austin, TX 78701\norders@nookgoods.com",
    items: [
      { desc: "Ceramic mug (set of 4)", detail: "SKU MUG-004", qty: 6, rate: 28, tax: true },
      { desc: "Linen tote", detail: "SKU TOTE-01", qty: 10, rate: 18, tax: true },
      { desc: "Gift wrapping", detail: "Per order", qty: 1, rate: 12, tax: true },
    ],
    notes: "Thank you for your order!", pay: "Paid by card at checkout.", tax: 8.25,
  },
  rent: {
    name: "Cedar Property Mgmt", details: "88 Oak Ave, Suite 3, Seattle, WA 98101\nrentals@cedarpm.com",
    items: [
      { desc: "Monthly rent — Unit 4B", detail: "June 2026", qty: 1, rate: 1850, tax: false },
    ],
    notes: "Rent received with thanks. Balance $0.00.", pay: "Paid via bank transfer.", tax: 0,
  },
  tutoring: {
    name: "BrightMinds Tutoring", details: "15 College Ln, Boston, MA 02134\nhello@brightminds.io",
    timesheet: true,
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Twice weekly", scope: "8 sessions delivered this period. One session rescheduled from 18 June to 20 June at no charge." },
    items: [
      { section: "Sessions — $55/hr" },
      { date: "2026-06-02", desc: "Algebra II — 1:1", detail: "Quadratics, practice set", qty: 1, rate: 55, tax: false },
      { date: "2026-06-06", desc: "Algebra II — 1:1", detail: "Functions & graphing", qty: 1, rate: 55, tax: false },
      { date: "2026-06-09", desc: "Algebra II — 1:1", detail: "Mock test review", qty: 1.5, rate: 55, tax: false },
      { date: "2026-06-13", desc: "SAT math — 1:1", detail: "Timed section practice", qty: 1, rate: 55, tax: false },
      { section: "Materials" },
      { desc: "Practice materials", detail: "Workbook + digital", qty: 1, rate: 30, tax: true },
    ],
    notes: "Net 14. Sessions cancelled with less than 24 hours notice are charged in full. Package discounts available.", pay: "Venmo / Zelle / card", tax: 6.25,
  },
  catering: {
    name: "Saffron Catering", details: "300 Vine St, San Jose, CA 95110\nevents@saffroncatering.com",
    items: [
      { desc: "Plated dinner", detail: "Per guest, 3 courses", qty: 60, rate: 42, tax: true },
      { desc: "Service staff", detail: "4 servers, 5 hrs", qty: 20, rate: 28, tax: false },
      { desc: "Delivery & setup", detail: "Flat", qty: 1, rate: 200, tax: false },
    ],
    notes: "25% deposit to reserve. Final count due 72h prior.", pay: "Card or bank transfer", tax: 9.25,
  },
  electrician: {
    name: "Volt & Wire Electric", details: "44 Circuit Ave, Austin, TX 78702\n(555) 214-8890\nTECL #12345",
    jobAddr: "902 Comal St, Austin, TX 78702 — permit #EP-2026-4417",
    items: [
      { section: "Labor" },
      { desc: "Service call — diagnostic", detail: "Troubleshooting, first hour", qty: 1, rate: 120, tax: false },
      { desc: "Labor — panel upgrade", detail: "Licensed electrician, 4 hrs", qty: 4, rate: 95, tax: false },
      { section: "Materials" },
      { desc: "Materials — breakers & wiring", detail: "200A panel, breakers, conduit", qty: 1, rate: 420, tax: true },
    ],
    notes: "Payment due on completion. 1-year workmanship warranty. License TECL #12345.", pay: "Card, check, or bank transfer", tax: 8.25,
  },
  landscaping: {
    name: "GreenScape Lawn & Garden", details: "9 Meadow Ln, Portland, OR 97202\nhello@greenscape.co",
    jobAddr: "The Whitfield residence — 88 Alder St, Portland, OR 97202",
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Weekly", scope: "4 mowing visits this period, plus spring bed planting on the third visit." },
    items: [
      { section: "Recurring service" },
      { desc: "Lawn mowing & edging", detail: "Per visit · 4 visits this period", qty: 4, rate: 55, tax: false },
      { desc: "Green-waste removal", detail: "Haul-away", qty: 1, rate: 60, tax: false },
      { section: "One-off work" },
      { desc: "Seasonal planting", detail: "Bed prep + perennials", qty: 1, rate: 380, tax: true },
    ],
    notes: "Net 14. Weekly and bi-weekly plans billed monthly. Skipped visits are credited to the next invoice.", pay: "Venmo, card, or check", tax: 0,
  },
  handyman: {
    name: "FixIt Handyman Services", details: "7 Maple St, Columbus, OH 43004\n(555) 771-3300",
    jobAddr: "The Alvarez residence — 212 Birch Ct, Columbus, OH 43004",
    items: [
      { section: "Labor" },
      { desc: "Handyman labor", detail: "General repairs, 3 hrs", qty: 3, rate: 75, tax: false },
      { section: "Materials" },
      { desc: "Materials & hardware", detail: "Supplied on the job", qty: 1, rate: 85, tax: true },
    ],
    notes: "Payment due on completion. Thank you!", pay: "Cash, card, or Zelle", tax: 7.5,
  },
  autorepair: {
    name: "Precision Auto Repair", details: "310 Garage Rd, Phoenix, AZ 85009\nservice@precisionauto.com",
    items: [
      { desc: "Diagnostic", detail: "Computer scan + inspection", qty: 1, rate: 89, tax: false },
      { desc: "Labor — brake service", detail: "2.0 hrs @ $110", qty: 2, rate: 110, tax: false },
      { desc: "Parts — pads & rotors", detail: "OEM, front axle", qty: 1, rate: 240, tax: true },
    ],
    notes: "Payment due on pickup. 12-month / 12k-mile warranty.", pay: "Card or cash", tax: 8.6,
  },
  pestcontrol: {
    name: "ShieldGuard Pest Control", details: "88 Cypress Dr, Orlando, FL 32801\ndispatch@shieldguard.com",
    jobAddr: "1240 Palm Grove Ct, Orlando, FL 32801",
    svc: { from: "2026-04-01", to: "2026-06-30", freq: "Quarterly", scope: "Quarterly perimeter treatment. Free re-treatment between scheduled visits if pests return." },
    items: [
      { desc: "Quarterly plan — service visit", detail: "Interior + exterior perimeter", qty: 1, rate: 89, tax: false },
      { desc: "Rodent station check", detail: "4 stations, baited and logged", qty: 4, rate: 12, tax: false },
    ],
    notes: "Billed after each quarterly visit. Free re-treatment between visits if pests return.", pay: "Card on file or bank transfer", tax: 6.5,
  },
  moving: {
    name: "SwiftMove Movers", details: "500 Depot St, Denver, CO 80205\nbook@swiftmove.com",
    jobAddr: "From 12 Pearl St, Denver → to 480 Grove Ave, Boulder, CO",
    deposit: { val: 50, type: "pct" },
    items: [
      { section: "Labor" },
      { desc: "Moving crew — 3 movers", detail: "5 hrs @ $150/hr", qty: 5, rate: 150, tax: false },
      { section: "Truck & materials" },
      { desc: "Truck & fuel", detail: "26 ft truck", qty: 1, rate: 120, tax: false },
      { desc: "Packing materials", detail: "Boxes, tape, wrap", qty: 1, rate: 75, tax: true },
    ],
    notes: "50% deposit to reserve the date. Balance due on completion.", pay: "Card or bank transfer", tax: 7.75,
  },
  salon: {
    name: "Luxe Hair Studio", details: "22 Bloom St, Los Angeles, CA 90012\nbook@luxehair.com",
    items: [
      { desc: "Cut & style", detail: "Wash, cut, blow-dry", qty: 1, rate: 85, tax: false },
      { desc: "Full color", detail: "Single process + gloss", qty: 1, rate: 140, tax: false },
      { desc: "Bond-repair treatment", detail: "Add-on", qty: 1, rate: 35, tax: true },
    ],
    notes: "Thank you! Gratuity appreciated but not included.", pay: "Card, cash, or app", tax: 9.5,
  },
  massage: {
    name: "Serenity Massage Therapy", details: "14 Calm Way, San Diego, CA 92101\nhello@serenitymassage.co",
    items: [
      { desc: "60-min therapeutic massage", detail: "Deep tissue", qty: 1, rate: 110, tax: false },
      { desc: "Aromatherapy add-on", detail: "Essential oils", qty: 1, rate: 15, tax: false },
    ],
    notes: "Package of 5 available at a discount.", pay: "Card, HSA/FSA, or cash", tax: 0,
  },
  personaltrainer: {
    name: "Peak Fitness Coaching", details: "3 Summit Rd, Boulder, CO 80302\ncoach@peakfit.io",
    timesheet: true,
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Twice weekly", scope: "8 sessions this period, plus programme review. One session credited — trainer cancellation on 11 June." },
    items: [
      { section: "Sessions — $70/hr" },
      { date: "2026-06-02", desc: "1:1 training", detail: "Lower body, 60 min", qty: 1, rate: 70, tax: false },
      { date: "2026-06-05", desc: "1:1 training", detail: "Upper body + conditioning", qty: 1, rate: 70, tax: false },
      { date: "2026-06-09", desc: "1:1 training", detail: "Assessment + deload", qty: 1, rate: 70, tax: false },
      { date: "2026-06-16", desc: "1:1 training", detail: "Strength block, week 1", qty: 1, rate: 70, tax: false },
      { section: "Programme" },
      { desc: "Custom program & nutrition", detail: "Monthly plan", qty: 1, rate: 120, tax: false },
    ],
    notes: "Net 7. 24-hour cancellation policy — sessions cancelled late are charged, trainer cancellations are credited.", pay: "Card or Venmo", tax: 0,
  },
  accounting: {
    name: "Ledger & Co Bookkeeping", details: "500 Finance Blvd, Ste 8, Chicago, IL 60601\nbilling@ledgerco.com",
    timesheet: true,
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Monthly", scope: "Monthly close for the period shown, plus ad-hoc advisory time itemized below." },
    items: [
      { section: "Monthly retainer" },
      { desc: "Monthly bookkeeping", detail: "Reconciliation + management reports", qty: 1, rate: 450, tax: false },
      { desc: "Payroll processing", detail: "Up to 10 employees", qty: 1, rate: 150, tax: false },
      { section: "Advisory — $160/hr" },
      { date: "2026-06-19", desc: "Year-end planning call", detail: "Owner + accountant, 1 hr", qty: 1, rate: 160, tax: false },
    ],
    notes: "Net 15. Retainer clients billed on the 1st; advisory time billed in arrears.", pay: "ACH / bank transfer", tax: 0,
  },
  legal: {
    name: "Marbury Legal", details: "1 Court St, Ste 1200, New York, NY 10007\nbilling@marburylegal.com",
    timesheet: true,
    items: [
      { section: "Attorney — $320/hr" },
      { date: "2026-06-09", desc: "Contract review", detail: "Master services agreement, first pass", qty: 2.5, rate: 320, tax: false },
      { date: "2026-06-16", desc: "Revisions & client call", detail: "Redline discussion, 45 min call", qty: 1, rate: 320, tax: false },
      { section: "Paralegal — $120/hr" },
      { date: "2026-06-17", desc: "Document preparation", detail: "Exhibits, signature packet", qty: 2, rate: 120, tax: false },
      { section: "Disbursements" },
      { desc: "Filing fees", detail: "Court filing — no tax", qty: 1, rate: 75, tax: false },
    ],
    notes: "Net 30. Time billed in 0.1-hour increments. Retainer applied where applicable.", pay: "Wire / trust account", tax: 0,
  },
  realestate: {
    name: "Summit Realty", details: "220 Market St, Seattle, WA 98101\nagents@summitrealty.com",
    items: [
      { desc: "Listing photography", detail: "Photos + drone", qty: 1, rate: 350, tax: false },
      { desc: "Home staging", detail: "Consultation + partial staging", qty: 1, rate: 900, tax: false },
      { desc: "Marketing package", detail: "Flyers + online boost", qty: 1, rate: 250, tax: true },
    ],
    notes: "Due at closing or within 30 days.", pay: "Check or wire", tax: 8.1,
  },
  marketing: {
    name: "Amplify Marketing", details: "77 Growth Ave, Austin, TX 78701\naccounts@amplify.co",
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Monthly", scope: "Retainer month 4 of 12. Ad spend is passed through at cost and invoiced separately." },
    items: [
      { section: "Retainer" },
      { desc: "Monthly retainer", detail: "Strategy + content + reporting", qty: 1, rate: 2500, tax: false },
      { desc: "Paid ads management", detail: "Campaign optimization", qty: 1, rate: 600, tax: false },
      { section: "Out of scope this month" },
      { desc: "Landing page build", detail: "Approved 8 June, 12 hrs @ $145", qty: 12, rate: 145, tax: false },
    ],
    notes: "Net 15. Ad spend billed separately at cost. Out-of-scope work is quoted and approved before it starts.", pay: "ACH / card", tax: 0,
  },
  itservices: {
    name: "Northbridge IT Services", details: "410 Server Rd, Dallas, TX 75201\nsupport@northbridge.it",
    timesheet: true,
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Monthly", scope: "Managed plan — June. Support hours beyond the 4 included are billed at the rate below." },
    items: [
      { section: "Support hours" },
      { date: "2026-06-04", desc: "Mail server migration", detail: "Remote, out of hours", qty: 3.5, rate: 125, tax: false },
      { date: "2026-06-12", desc: "On-site — network fault", detail: "Switch replacement + testing", qty: 2.5, rate: 125, tax: false },
      { section: "Project & licenses" },
      { desc: "Workstation setup", detail: "Per device", qty: 3, rate: 90, tax: false },
      { desc: "Antivirus & backup licenses", detail: "Annual, per seat", qty: 10, rate: 12, tax: true },
    ],
    notes: "Net 30. Managed plan billed monthly; additional hours itemized above.", pay: "ACH / card", tax: 8.25,
  },
  florist: {
    name: "Bloom & Stem Florist", details: "5 Petal Ln, Nashville, TN 37201\norders@bloomstem.com",
    items: [
      { desc: "Bridal bouquet", detail: "Seasonal, designer's choice", qty: 1, rate: 185, tax: true },
      { desc: "Centerpieces", detail: "Low arrangements", qty: 8, rate: 45, tax: true },
      { desc: "Delivery & setup", detail: "Venue", qty: 1, rate: 60, tax: false },
    ],
    notes: "50% deposit to book. Final count due 2 weeks prior.", pay: "Card or bank transfer", tax: 9.25,
  },
  eventplanning: {
    name: "Grand Events Co", details: "300 Celebration Blvd, Miami, FL 33101\nhello@grandevents.co",
    items: [
      { desc: "Event planning fee", detail: "Full-service coordination", qty: 1, rate: 2200, tax: false },
      { desc: "Day-of coordination", detail: "10 hrs on-site", qty: 1, rate: 800, tax: false },
      { desc: "Vendor management", detail: "Sourcing + contracts", qty: 1, rate: 500, tax: false },
    ],
    notes: "40% deposit to reserve. Balance due 14 days before the event.", pay: "Card or bank transfer", tax: 0,
  },
  // Generic hourly billing — a freelancer's month of dated entries. Deliberately
  // trade-neutral: the point of the page is the timesheet, not the industry.
  hourlyinvoice: {
    name: "Dana Whitmore", details: "44 Rowan St, Seattle, WA 98104\ndana@whitmore.work",
    timesheet: true,
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Monthly", scope: "Hours worked 1–30 June against the agreed scope. Rate $95/hr, billed in 15-minute increments." },
    items: [
      { date: "2026-06-04", desc: "Requirements & scoping", detail: "Kickoff call, notes, backlog draft", qty: 3.25, rate: 95, tax: false },
      { date: "2026-06-10", desc: "Build — checkout flow", detail: "Implementation + unit tests", qty: 7.5, rate: 95, tax: false },
      { date: "2026-06-17", desc: "Build — admin screens", detail: "Two screens, review fixes", qty: 6, rate: 95, tax: false },
      { date: "2026-06-24", desc: "QA & handover", detail: "Bug fixes, docs, walkthrough", qty: 4.25, rate: 95, tax: false },
    ],
    notes: "Net 14. Hours are logged as work happens and billed in 15-minute increments. Query any entry within 7 days.",
    pay: "Bank transfer — details on request. Stripe link available.", tax: 0,
  },
  // Pressure washing — one-off exterior work priced by surface, sold on the
  // before/after. The photo block is the whole pitch for this trade.
  pressurewashing: {
    name: "ClearJet Pressure Washing", details: "18 Harbor Rd, Tampa, FL 33602\n(555) 448-1120",
    jobAddr: "3021 Bayshore Blvd, Tampa, FL 33629",
    items: [
      { section: "Labor" },
      { desc: "Driveway & walkway wash", detail: "Surface cleaner + post-treatment, approx. 1,400 sq ft", qty: 1400, rate: 0.18, tax: false },
      { desc: "House soft wash", detail: "Two storeys, siding + soffits, low-pressure", qty: 1, rate: 385, tax: false },
      { section: "Materials" },
      { desc: "Detergent & surface treatment", detail: "Sodium hypochlorite mix, mildewcide", qty: 1, rate: 60, tax: true },
    ],
    notes: "Payment due on completion. Results photographed before and after. Re-clean within 14 days if anything was missed.",
    pay: "Card, Venmo, or check on site", tax: 7.5,
  },
  // Recurring service billed monthly in arrears for weekly visits — the shape
  // most maintenance businesses actually invoice in.
  recurringinvoice: {
    name: "Northgate Property Maintenance", details: "240 Foundry St, Raleigh, NC 27601\naccounts@northgatepm.com",
    jobAddr: "Foundry Row Apartments — 15 Foundry St, Raleigh, NC 27601",
    svc: { from: "2026-06-01", to: "2026-06-30", freq: "Weekly", scope: "Grounds maintenance, 4 visits this period. Common areas, car park sweep and bin store each visit." },
    items: [
      { section: "Recurring service" },
      { desc: "Grounds maintenance visit", detail: "Common areas, car park sweep, bin store · 4 visits", qty: 4, rate: 185, tax: false },
      { section: "Additional this period" },
      { desc: "Gutter clear — Block B", detail: "Requested 12th, completed same week", qty: 1, rate: 240, tax: false },
    ],
    notes: "Billed monthly in arrears for the period shown. Net 14. Missed visits are credited on the following invoice.",
    pay: "ACH / bank transfer — details on file. Card on request.", tax: 0,
  },
  // A deposit request: the document asks for a percentage up front to book the
  // job. Deposit due is a printed request — it doesn't change the total.
  depositinvoice: {
    name: "BrightHome Services LLC", details: "9 Depot Rd, Denver, CO 80205\n(555) 222-9090",
    jobAddr: "1420 S Emerson St, Denver, CO 80210",
    items: [
      { desc: "Kitchen remodel — as quoted", detail: "Cabinets, counters, backsplash per estimate EST-0031", qty: 1, rate: 8400, tax: false },
    ],
    deposit: { val: 30, type: "pct" },
    schedule: [
      { label: "Deposit — to schedule the work", due: "", amount: 2520 },
      { label: "Balance — on completion", due: "", amount: 5880 },
    ],
    notes: "30% deposit due to reserve your start date. Balance invoiced on completion. Warranty: 1 year on labor.",
    pay: "Check or bank transfer. Routing/Acct on request.", tax: 0,
  },
  // Progress billing: milestone 2 of 3 on a larger job. The schedule shows the
  // whole payment plan; Amount paid records the milestones already invoiced.
  progressbilling: {
    name: "BrightHome Services LLC", details: "9 Depot Rd, Denver, CO 80205\n(555) 222-9090",
    jobAddr: "1420 S Emerson St, Denver, CO 80210",
    items: [
      { desc: "Kitchen remodel — progress payment 2 of 3", detail: "Cabinets installed, counters templated (milestone reached)", qty: 1, rate: 3360, tax: false },
    ],
    schedule: [
      { label: "1 · Deposit — paid", due: "", amount: 2520 },
      { label: "2 · Cabinets installed — this invoice", due: "", amount: 3360 },
      { label: "3 · Final — on completion", due: "", amount: 2520 },
    ],
    notes: "Progress payment per the agreed schedule. Final invoice on completion and walkthrough.",
    pay: "Check or bank transfer. Routing/Acct on request.", tax: 0,
  },
  dj: {
    name: "Nightshift DJ & Events", details: "12 Vinyl Ct, Brooklyn, NY 11222\nbook@nightshiftdj.com",
    items: [
      { desc: "DJ performance", detail: "4 hours, reception", qty: 1, rate: 1200, tax: false },
      { desc: "Lighting & sound", detail: "Dancefloor package", qty: 1, rate: 350, tax: false },
      { desc: "Additional hour", detail: "Overtime", qty: 1, rate: 200, tax: false },
    ],
    notes: "50% deposit to book. Balance due on event day.", pay: "Venmo, card, or bank transfer", tax: 0,
  },
};

// `intl` is a BCP-47 tag (e.g. "de-DE") so grouping/decimal separators follow the
// reader's region: 1.234,56 in Germany, 1 234,56 in France, 1,234.56 in the US.
// Currencies with no minor unit in everyday use — writing "¥1,200.00" on a
// Japanese invoice is simply wrong, so these render as whole numbers.
export const ZERO_DECIMAL = new Set(["JPY", "KRW", "IDR", "VND"]);

// Currencies written after the amount in their home market: "1 234,56 kr",
// "1 234,56 zł", "100.000 ₫". Putting the symbol in front looks wrong on a
// local invoice.
export const SUFFIX_CURRENCY = new Set(["SEK", "PLN", "VND"]);

export function money(n, currency = "USD", intl = "en-US") {
  const v = Number.isFinite(n) ? n : 0;
  const d = ZERO_DECIMAL.has(currency) ? 0 : 2;
  const sym = CURRENCIES[currency] || "$";
  const num = v.toLocaleString(intl, { minimumFractionDigits: d, maximumFractionDigits: d });
  // CURRENCIES stores suffix symbols with a trailing space ("kr ") for the
  // prefix layout, so trim before appending.
  return SUFFIX_CURRENCY.has(currency) ? `${num} ${sym.trim()}` : sym + num;
}

// How many decimals this currency actually prints. Yen has no minor unit, so a
// total carrying fractional yen isn't a rounding nicety — it's a number the
// client cannot pay.
export function currencyDecimals(currency) { return ZERO_DECIMAL.has(currency) ? 0 : 2; }

// Round to `d` decimals, half away from zero, without binary-float surprises.
// 1.005 is stored as 1.00499999999999989…, so a plain Math.round(v * 100)
// returns 1.00 where every accounting system says 1.01. Snapping the scaled
// value to 6 decimals first removes the representation error while leaving a
// genuine 1.004999 alone.
export function roundMoney(n, d = 2) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  const f = Math.pow(10, d);
  const scaled = Number((Math.abs(v) * f).toFixed(6));
  return (v < 0 ? -1 : 1) * Math.round(scaled) / f;
}

// Every figure returned here is already rounded to the currency's precision, and
// `total` is the exact sum of the lines the document prints. That invariant is
// the point: the sheet used to round only at display time, so a line of 1.035
// printed "1.04", tax at 20% printed "0.21", and the total printed "1.24" —
// visibly a cent short of the two lines above it.
//
// Tax is charged on the DISCOUNTED base. VAT, GST and most US sales-tax regimes
// treat a seller's discount as reducing the taxable amount; charging tax on the
// pre-discount figure overstated it on every discounted invoice (£1,000 at 20%
// VAT less 10% billed £1,100 instead of £1,080). Since the discount applies to
// the whole subtotal while only some lines may be taxable, it is apportioned pro
// rata across the taxable share rather than taken out of one side.
// FROZEN. The arithmetic every document created before the 2026-08 fix was
// billed with: tax charged on the pre-discount base, and no rounding until the
// figures reached the screen. It is wrong, and it is kept for exactly one
// reason — a saved invoice must reopen, re-share and re-print showing the same
// numbers as the PDF the client already has in their inbox. Nothing new routes
// here, and nothing in here should ever be "improved".
function legacyTotals(items, { taxRate, discVal, discType, shipping, paid, depositVal, depositType }) {
  let subtotal = 0, taxable = 0;
  for (const it of items) {
    if (it.section !== undefined) continue;
    const amt = (Number(it.qty) || 0) * (Number(it.rate) || 0);
    subtotal += amt;
    if (it.tax) taxable += amt;
  }
  const taxAmt = (taxable * (Number(taxRate) || 0)) / 100;
  const dv = Number(discVal) || 0;
  const discAmt = discType === "pct" ? (subtotal * dv) / 100 : dv;
  const ship = Number(shipping) || 0;
  const total = subtotal + taxAmt + ship - discAmt;
  const due = total - (Number(paid) || 0);
  const depv = Number(depositVal) || 0;
  const depositAmt = depositType === "pct" ? (total * depv) / 100 : depv;
  return { subtotal, taxAmt, discAmt, ship, total, due, depositAmt, taxableBase: taxable, decimals: null, taxMode: "gross" };
}

// taxMode "net" (the default, and what every new document is stamped with)
// runs the corrected arithmetic below. taxMode "gross" replays legacyTotals.
// Records saved before the fix carry no taxMode field at all — the callers
// treat that absence as "gross", which is why the default here is only ever
// reached by documents that are genuinely new.
export function computeTotals(items, { taxRate = 0, discVal = 0, discType = "pct", shipping = 0, paid = 0, depositVal = 0, depositType = "pct", decimals = 2, taxMode = "net" } = {}) {
  if (taxMode === "gross") return legacyTotals(items, { taxRate, discVal, discType, shipping, paid, depositVal, depositType });
  const R = (n) => roundMoney(n, decimals);
  let subtotal = 0, taxable = 0;
  for (const it of items) {
    if (it.section !== undefined) continue; // section header rows carry no amount
    // Round each line to what its row actually prints, then sum the printed
    // values — so the amount column adds up to the subtotal beneath it.
    const amt = R((Number(it.qty) || 0) * (Number(it.rate) || 0));
    subtotal += amt;
    if (it.tax) taxable += amt;
  }
  subtotal = R(subtotal);
  taxable = R(taxable);

  const dv = Number(discVal) || 0;
  // A discount can zero an invoice out but never drive it negative — a flat
  // discount typed larger than the subtotal used to produce a negative total
  // and, through the line below, negative tax.
  const discAmt = Math.min(Math.max(R(discType === "pct" ? (subtotal * dv) / 100 : dv), 0), subtotal);

  const taxableShare = subtotal > 0 ? taxable / subtotal : 0;
  const taxableBase = Math.max(0, R(taxable - discAmt * taxableShare));
  const taxAmt = R((taxableBase * (Number(taxRate) || 0)) / 100);

  const ship = R(shipping);
  const total = R(subtotal - discAmt + taxAmt + ship);
  const due = R(total - R(paid));
  // "Deposit due" is a request printed on the document (e.g. 30% to book the
  // job) — it never changes the total or the balance, it just tells the client
  // how much of the total is due now.
  const depv = Number(depositVal) || 0;
  const depositAmt = R(depositType === "pct" ? (total * depv) / 100 : depv);
  // taxableBase is returned so the sheet can state what the tax was charged on
  // once a discount has moved it away from the subtotal.
  return { subtotal, taxAmt, discAmt, ship, total, due, depositAmt, taxableBase, decimals, taxMode: "net" };
}

// What a stored record should be billed with. Anything saved before the fix has
// no taxMode field, and must keep the figures it went out with.
export function taxModeOf(snap) { return (snap && snap.taxMode) === "net" ? "net" : "gross"; }

// Subtotal of the section that STARTS at index i (a {section} row): sums the
// following item rows until the next section header or the end of the list.
// Rounds per line like computeTotals, so a section subtotal matches the rows
// printed above it.
export function sectionSubtotal(items, i, decimals = 2) {
  let sum = 0;
  for (let j = i + 1; j < items.length; j++) {
    if (items[j].section !== undefined) break;
    sum += roundMoney((Number(items[j].qty) || 0) * (Number(items[j].rate) || 0), decimals);
  }
  return roundMoney(sum, decimals);
}

export function nextInvNo(no) {
  const m = (no || "").match(/(\d+)(?!.*\d)/);
  if (!m) return (no || "INV") + "-COPY";
  const n = (parseInt(m[1], 10) + 1).toString().padStart(m[1].length, "0");
  return no.slice(0, m.index) + n + no.slice(m.index + m[1].length);
}
