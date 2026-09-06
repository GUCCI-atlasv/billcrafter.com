// Mock data for the dashboard + admin console (front-end complete with seeded data).
// In production these come from D1 via the API routes (see app/api/* and db/schema.sql).

export const MOCK_USER = { name: "Demo User", email: "demo.user@gmail.com", plan: "free", exportsUsed: 3, exportLimit: 10 };

export const MOCK_INVOICES = [
  { no: "INV-0007", type: "invoice",  client: "Acme Studio",          issued: "Jun 24, 2026", due: "Jul 8, 2026",   amt: 2400, status: "Sent" },
  { no: "QUO-0002", type: "quote",    client: "Acme Studio",          issued: "Jun 22, 2026", due: "Valid Jul 22",  amt: 7500, status: "Sent" },
  { no: "EST-0003", type: "estimate", client: "BrightHome Services",  issued: "Jun 20, 2026", due: "Valid Jul 20",  amt: 1180, status: "Draft" },
  { no: "REC-0002", type: "receipt",  client: "Northwind Co",         issued: "Jun 12, 2026", due: "Paid Jun 12",   amt: 5280, status: "Paid" },
  { no: "INV-0006", type: "invoice",  client: "Northwind Co",         issued: "Jun 12, 2026", due: "Jun 26, 2026",  amt: 5280, status: "Paid" },
  { no: "INV-0005", type: "invoice",  client: "Lumen Media",          issued: "May 30, 2026", due: "Jun 13, 2026",  amt: 3000, status: "Overdue" },
  { no: "INV-0004", type: "invoice",  client: "BrightHome Services",  issued: "May 18, 2026", due: "Jun 1, 2026",   amt: 990,  status: "Paid" },
];

export const MOCK_CLIENTS = [
  { name: "Northwind Co",        email: "ap@northwind.com",        n: 4, total: 14820 },
  { name: "Acme Studio",         email: "billing@acmestudio.co",   n: 3, total: 11700 },
  { name: "BrightHome Services", email: "office@brighthome.com",   n: 2, total: 2170 },
  { name: "Lumen Media",         email: "finance@lumen.media",     n: 1, total: 3000 },
];

export const MOCK_ITEMS = [
  { name: "Website design",   desc: "Responsive layout, up to 5 pages", rate: 1800, tax: false },
  { name: "Hourly consulting", desc: "Senior advisory, per hour",       rate: 185,  tax: false },
  { name: "Logo & brand kit", desc: "Logo, palette, fonts",             rate: 600,  tax: false },
  { name: "Monthly retainer", desc: "Ongoing support",                  rate: 2500, tax: false },
  { name: "Materials",        desc: "Supplies (taxable)",               rate: 340,  tax: true },
];

export const MOCK_PROFILE = {
  name: "Demo Studio LLC", email: "hello@demostudio.com",
  address: "22 Studio Ln, Austin, TX 78701", taxId: "EIN 88-1234567",
  currency: "USD ($)", taxRate: "8.25%", terms: "Net 14",
  template: "Modern · Black", numberFormat: "INV-0001", payment: "Stripe · PayPal · Bank",
};

// Admin console mock data
export const MOCK_ADMIN_USERS = [
  { email: "demo.user@gmail.com",   plan: "free", exports: "3/10",  joined: "Jun 2026", status: "Active" },
  { email: "sara@brighthome.com",   plan: "Pro",  exports: "∞",     joined: "Jun 2026", status: "Active" },
  { email: "mike@lumen.media",      plan: "free", exports: "10/10", joined: "May 2026", status: "Active" },
  { email: "anon-device-9f3a",      plan: "anon", exports: "1/1",   joined: "—",        status: "Anon" },
];

export const MOCK_ADMIN_KPIS = [
  { lb: "Total users", vl: "1,284", dl: "+62 this week" },
  { lb: "Pro subscribers", vl: "97", dl: "MRR $960.30" },
  { lb: "Exports (30d)", vl: "8,410", dl: "1.3 / user" },
  { lb: "Free → Pro", vl: "3.1%", dl: "trailing 30d" },
];
