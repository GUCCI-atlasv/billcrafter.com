// Template library. Each entry is a DISTINCT template: a visual style + accent +
// document type + industry pre-fill. Opening one loads the editor already configured,
// so every template genuinely looks and reads differently.
// Fields: slug, name, group, docType, style, accent, scenario, blurb

const A = {
  ink: "#16181C", indigo: "#4F46E5", blue: "#2563EB", sky: "#0EA5E9", teal: "#0D9488",
  green: "#0E9F6E", violet: "#7C3AED", pink: "#DB2777", orange: "#EA580C", red: "#DC2626",
  amber: "#D97706", slate: "#334155",
};

export const TEMPLATE_GROUPS = [
  "All", "Freelance & creative", "Trades & construction", "Home & auto",
  "Health & beauty", "Professional services", "Events & food",
  "Retail & business", "Estimates & quotes", "Receipts",
];

export const TEMPLATES = [
  // Freelance & creative
  { slug: "freelance-modern", name: "Freelance — Modern", group: "Freelance & creative", docType: "invoice", style: "modern", accent: A.indigo, scenario: "freelance", blurb: "Clean, professional invoice for freelancers." },
  { slug: "freelance-minimal", name: "Freelance — Minimal", group: "Freelance & creative", docType: "invoice", style: "minimal", accent: A.slate, scenario: "freelance", blurb: "Understated, no-fuss layout." },
  { slug: "freelance-mono", name: "Developer — Mono", group: "Freelance & creative", docType: "invoice", style: "mono", accent: A.teal, scenario: "design", blurb: "Monospace, developer-friendly." },
  { slug: "freelance-elegant", name: "Writer — Elegant", group: "Freelance & creative", docType: "invoice", style: "elegant", accent: A.ink, scenario: "freelance", blurb: "Centered serif, premium feel." },
  { slug: "photography-elegant", name: "Photography — Elegant", group: "Freelance & creative", docType: "invoice", style: "elegant", accent: A.pink, scenario: "photography", blurb: "For shoots, editing & licensing." },
  { slug: "photography-band", name: "Videography — Band", group: "Freelance & creative", docType: "invoice", style: "band", accent: A.violet, scenario: "videography", blurb: "Statement header for studios." },
  { slug: "design-mono", name: "Design studio — Mono", group: "Freelance & creative", docType: "invoice", style: "mono", accent: A.teal, scenario: "design", blurb: "Minimal monospace for designers." },
  { slug: "marketing-modern", name: "Marketing agency — Modern", group: "Freelance & creative", docType: "invoice", style: "modern", accent: A.violet, scenario: "marketing", blurb: "Retainers, ads and content billing." },
  { slug: "dj-band", name: "DJ & events — Band", group: "Freelance & creative", docType: "invoice", style: "band", accent: A.pink, scenario: "dj", blurb: "Performances, lighting and sound." },

  // Trades & construction
  { slug: "contractor-band", name: "Contractor — Band", group: "Trades & construction", docType: "invoice", style: "band", accent: A.orange, scenario: "contractor", blurb: "Bold header band, labor + materials." },
  { slug: "contractor-ruled", name: "Contractor — Ruled", group: "Trades & construction", docType: "invoice", style: "ruled", accent: A.ink, scenario: "contractor", blurb: "Strong rules, easy to read on site." },
  { slug: "contractor-compact", name: "Contractor — Compact", group: "Trades & construction", docType: "invoice", style: "compact", accent: A.slate, scenario: "contractor", blurb: "Dense layout for many line items." },
  { slug: "electrician-band", name: "Electrician — Band", group: "Trades & construction", docType: "invoice", style: "band", accent: A.amber, scenario: "electrician", blurb: "Service call, labor and materials." },
  { slug: "plumbing-band", name: "Plumbing — Band", group: "Trades & construction", docType: "invoice", style: "band", accent: A.blue, scenario: "plumbing", blurb: "Trade invoice with tax on materials." },

  // Home & auto
  { slug: "cleaning-ruled", name: "Cleaning — Ruled", group: "Home & auto", docType: "invoice", style: "ruled", accent: A.green, scenario: "cleaning", blurb: "Recurring cleaning jobs." },
  { slug: "cleaning-compact", name: "Cleaning — Compact", group: "Home & auto", docType: "invoice", style: "compact", accent: A.teal, scenario: "cleaning", blurb: "Quick service billing." },
  { slug: "hvac-modern", name: "HVAC — Modern", group: "Home & auto", docType: "invoice", style: "modern", accent: A.sky, scenario: "hvac", blurb: "Service call + parts." },
  { slug: "landscaping-modern", name: "Landscaping — Modern", group: "Home & auto", docType: "invoice", style: "modern", accent: A.green, scenario: "landscaping", blurb: "Lawn care and seasonal work." },
  { slug: "handyman-ruled", name: "Handyman — Ruled", group: "Home & auto", docType: "invoice", style: "ruled", accent: A.slate, scenario: "handyman", blurb: "Labor + materials, simple and clear." },
  { slug: "autorepair-compact", name: "Auto repair — Compact", group: "Home & auto", docType: "invoice", style: "compact", accent: A.slate, scenario: "autorepair", blurb: "Diagnostics, labor and parts." },
  { slug: "pestcontrol-modern", name: "Pest control — Modern", group: "Home & auto", docType: "invoice", style: "modern", accent: A.green, scenario: "pestcontrol", blurb: "One-off and recurring treatments." },
  { slug: "moving-ruled", name: "Moving company — Ruled", group: "Home & auto", docType: "invoice", style: "ruled", accent: A.blue, scenario: "moving", blurb: "Crew hours, truck and materials." },

  // Health & beauty
  { slug: "salon-elegant", name: "Hair salon — Elegant", group: "Health & beauty", docType: "invoice", style: "elegant", accent: A.pink, scenario: "salon", blurb: "Cuts, color and treatments." },
  { slug: "massage-minimal", name: "Massage therapy — Minimal", group: "Health & beauty", docType: "invoice", style: "minimal", accent: A.teal, scenario: "massage", blurb: "Sessions and add-ons." },
  { slug: "trainer-modern", name: "Personal trainer — Modern", group: "Health & beauty", docType: "invoice", style: "modern", accent: A.orange, scenario: "personaltrainer", blurb: "Session packages and programs." },

  // Professional services
  { slug: "consulting-modern", name: "Consulting — Modern", group: "Professional services", docType: "invoice", style: "modern", accent: A.blue, scenario: "consulting", blurb: "Hourly & retainer billing." },
  { slug: "consulting-elegant", name: "Consulting — Elegant", group: "Professional services", docType: "invoice", style: "elegant", accent: A.ink, scenario: "consulting", blurb: "Refined serif for advisory work." },
  { slug: "consulting-classic", name: "Consulting — Classic", group: "Professional services", docType: "invoice", style: "classic", accent: A.slate, scenario: "consulting", blurb: "Traditional, formal presentation." },
  { slug: "accounting-classic", name: "Accounting — Classic", group: "Professional services", docType: "invoice", style: "classic", accent: A.slate, scenario: "accounting", blurb: "Bookkeeping and payroll retainers." },
  { slug: "legal-classic", name: "Legal — Classic", group: "Professional services", docType: "invoice", style: "classic", accent: A.ink, scenario: "legal", blurb: "Attorney time, paralegal and fees." },
  { slug: "realestate-modern", name: "Real estate — Modern", group: "Professional services", docType: "invoice", style: "modern", accent: A.blue, scenario: "realestate", blurb: "Photography, staging and marketing." },
  { slug: "it-mono", name: "IT services — Mono", group: "Professional services", docType: "invoice", style: "mono", accent: A.teal, scenario: "itservices", blurb: "Managed IT, setup and licenses." },

  // Events & food
  { slug: "catering-band", name: "Catering — Band", group: "Events & food", docType: "invoice", style: "band", accent: A.amber, scenario: "catering", blurb: "Per-guest events billing." },
  { slug: "florist-elegant", name: "Florist — Elegant", group: "Events & food", docType: "invoice", style: "elegant", accent: A.pink, scenario: "florist", blurb: "Arrangements, delivery and setup." },
  { slug: "events-band", name: "Event planner — Band", group: "Events & food", docType: "invoice", style: "band", accent: A.violet, scenario: "eventplanning", blurb: "Planning, coordination and vendors." },

  // Retail & business
  { slug: "smallbiz-modern", name: "Small business — Modern", group: "Retail & business", docType: "invoice", style: "modern", accent: A.indigo, scenario: "smallbusiness", blurb: "General-purpose business invoice." },
  { slug: "smallbiz-minimal", name: "Tutoring — Minimal", group: "Retail & business", docType: "invoice", style: "minimal", accent: A.green, scenario: "tutoring", blurb: "Simple, per-session billing." },
  { slug: "retail-compact", name: "Retail — Compact", group: "Retail & business", docType: "invoice", style: "compact", accent: A.red, scenario: "retail", blurb: "Itemized sales with tax." },

  // Estimates & quotes
  { slug: "estimate-modern", name: "Estimate — Modern", group: "Estimates & quotes", docType: "estimate", style: "modern", accent: A.orange, scenario: "contractor", blurb: "Send before the work starts." },
  { slug: "estimate-elegant", name: "Estimate — Elegant", group: "Estimates & quotes", docType: "estimate", style: "elegant", accent: A.ink, scenario: "consulting", blurb: "Polished proposal-style estimate." },
  { slug: "quote-modern", name: "Quote — Modern", group: "Estimates & quotes", docType: "quote", style: "modern", accent: A.blue, scenario: "design", blurb: "Formal price quote." },
  { slug: "quote-minimal", name: "Quote — Minimal", group: "Estimates & quotes", docType: "quote", style: "minimal", accent: A.slate, scenario: "freelance", blurb: "Fast, clean quote." },

  // Receipts
  { slug: "receipt-modern", name: "Receipt — Modern", group: "Receipts", docType: "receipt", style: "modern", accent: A.green, scenario: "photography", blurb: "Proof of payment, paid in full." },
  { slug: "receipt-compact", name: "Retail receipt — Compact", group: "Receipts", docType: "receipt", style: "compact", accent: A.red, scenario: "retail", blurb: "Simple cash/card receipt." },
  { slug: "rent-receipt", name: "Rent receipt — Ruled", group: "Receipts", docType: "receipt", style: "ruled", accent: A.teal, scenario: "rent", blurb: "Monthly rent payment receipt." },
];

export function getTemplate(slug) { return TEMPLATES.find((t) => t.slug === slug) || null; }

// Industry categories become their own SEO hub pages at /templates/c/<slug>.
export const catSlug = (group) =>
  group.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const TEMPLATE_CATEGORIES = TEMPLATE_GROUPS.filter((g) => g !== "All").map((g) => ({ group: g, slug: catSlug(g) }));
export const getCategoryBySlug = (slug) => TEMPLATE_CATEGORIES.find((c) => c.slug === slug) || null;
export const templatesInGroup = (group) => TEMPLATES.filter((t) => t.group === group);
