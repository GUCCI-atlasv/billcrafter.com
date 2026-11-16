// Synthetic demo sample bills for zero-cost, zero-signup interactive demos in
// `OcrWorkbench` and the Guides hub.
//
// All business names, addresses, and tax numbers below are fictional synthetic fixtures.
// Selecting a sample loads a preset demo result client-side with 0 API calls.

import { normalizeOcrResult } from "./ocrSchema.js";

export const OCR_SAMPLES = [
  {
    id: "coffee",
    chipLabel: "Crumpled café receipt",
    badge: "Thermal receipt · Tip + Tax",
    fileName: "roast-and-co-receipt.png",
    previewUrl: "/samples/sample-coffee-receipt.png",
    raw: {
      isBillingDocument: true,
      docType: "receipt",
      vendorName: "Roast & Co. Craft Coffee",
      vendorDetails: "412 Congress Ave, Austin, TX 78701\nTel: (512) 555-0194 · Reg #TX-88412",
      clientName: "",
      clientDetails: "",
      documentNumber: "CHK-4092",
      issueDate: "2026-11-08",
      dueDate: "2026-11-08",
      paymentMethod: "Visa *4242 (Contactless)",
      currency: "USD",
      lineItems: [
        { desc: "Flat White (12oz, Oat)", detail: "Client morning meeting", category: "Meals", qty: 2, rate: 5.75, amount: 11.50, taxable: true },
        { desc: "Cold Brew Single Origin", detail: "", category: "Meals", qty: 1, rate: 5.25, amount: 5.25, taxable: true },
        { desc: "Almond Croissant", detail: "Warmed", category: "Meals", qty: 2, rate: 4.50, amount: 9.00, taxable: true },
        { desc: "Avocado Sourdough Toast", detail: "Add poached egg", category: "Meals", qty: 1, rate: 13.50, amount: 13.50, taxable: true },
      ],
      subtotal: 39.25,
      discountAmount: 0,
      shippingAmount: 0,
      taxRatePercent: 8.25,
      taxAmount: 3.24,
      tipAmount: 7.85,
      amountPaid: 50.34,
      total: 50.34,
      notes: "Client breakfast meeting — project kickoff.",
      confidence: 0.97,
    },
  },
  {
    id: "hardware",
    chipLabel: "Contractor hardware bill",
    badge: "Trade invoice · Mixed tax",
    fileName: "summit-builders-supply-inv.png",
    previewUrl: "/samples/sample-hardware-invoice.png",
    raw: {
      isBillingDocument: true,
      docType: "invoice",
      vendorName: "Summit Builders Supply LLC",
      vendorDetails: "1890 Industrial Pkwy, Denver, CO 80216\nEIN: 84-3920114 · billing@summitbuilders.example",
      clientName: "BrightHome Remodeling",
      clientDetails: "Job site: 1420 S Emerson St, Denver, CO 80210",
      documentNumber: "SBS-2026-1184",
      issueDate: "2026-11-10",
      dueDate: "2026-11-24",
      poNumber: "PO-EMERSON-04",
      paymentMethod: "ACH / Net 14",
      currency: "USD",
      lineItems: [
        { desc: "3/4\" Birch Plywood Sheet (4x8)", detail: "Cabinetry backing · SKU #PLY-742", category: "Materials", qty: 6, rate: 58.00, amount: 348.00, taxable: true },
        { desc: " Behr Pro Interior Eggshell (5 Gal)", detail: "Warm Bone #N210-1", category: "Materials", qty: 2, rate: 142.50, amount: 285.00, taxable: true },
        { desc: "Copper Press Tee 3/4\" Pack (10ct)", detail: "Plumbing rough-in", category: "Materials", qty: 3, rate: 34.00, amount: 102.00, taxable: true },
        { desc: "Job-site Boom Delivery & Unload", detail: "Non-taxable delivery labor", category: "Shipping", qty: 1, rate: 65.00, amount: 65.00, taxable: false },
      ],
      subtotal: 800.00,
      discountAmount: 0,
      shippingAmount: 0,
      taxRatePercent: 8.0,
      taxAmount: 58.80,
      tipAmount: 0,
      amountPaid: 0,
      total: 858.80,
      notes: "8.0% sales tax applied to materials ($735.00); delivery service exempt.",
      confidence: 0.99,
    },
  },
  {
    id: "consulting",
    chipLabel: "B2B consulting invoice",
    badge: "Multi-rate · Timesheet",
    fileName: "meridian-advisory-inv-204.png",
    previewUrl: "/samples/sample-consulting-invoice.png",
    raw: {
      isBillingDocument: true,
      docType: "invoice",
      vendorName: "Meridian Digital Advisory Inc.",
      vendorDetails: "548 Market St, Ste 41200, San Francisco, CA 94104\nEIN: 94-7710290 · ar@meridian-advisory.example",
      clientName: "Northwind Logistics Corp.",
      clientDetails: "Accounts Payable · 900 Lakefront Dr, Chicago, IL 60611",
      documentNumber: "INV-2026-0204",
      issueDate: "2026-11-01",
      dueDate: "2026-12-01",
      poNumber: "NW-PO-9931",
      paymentMethod: "ACH Wire (Net 30)",
      currency: "USD",
      lineItems: [
        { date: "2026-10-08", desc: "Data warehouse architecture audit", detail: " Principal Consultant · 12.0 hrs @ $195/hr", category: "Labor", qty: 12, rate: 195.00, amount: 2340.00, taxable: false },
        { date: "2026-10-16", desc: "ETL pipeline migration & review", detail: "Data Engineer · 18.5 hrs @ $140/hr", category: "Labor", qty: 18.5, rate: 140.00, amount: 2590.00, taxable: false },
        { date: "2026-10-27", desc: "Executive security readout & runbook", detail: "Fixed milestone deliverable", category: "Labor", qty: 1, rate: 1250.00, amount: 1250.00, taxable: false },
        { date: "2026-10-29", desc: "Cloud staging cluster usage (pass-through)", detail: "October staging environment", category: "Software", qty: 1, rate: 184.50, amount: 184.50, taxable: false },
      ],
      subtotal: 6364.50,
      discountAmount: 0,
      shippingAmount: 0,
      taxRatePercent: 0,
      taxAmount: 0,
      tipAmount: 0,
      amountPaid: 0,
      total: 6364.50,
      notes: "Net 30 against Purchase Order #NW-PO-9931. Please remit via ACH.",
      confidence: 0.99,
    },
  },
];

// Deliberate discrepancy demo fixture (R07): shows how BillCrafter flags a
// math mismatch when a faded receipt digit or missing tax causes lines + tax
// not to equal the printed grand total.
export const OCR_DISCREPANCY_DEMO = {
  id: "discrepancy",
  chipLabel: "Math discrepancy demo",
  badge: "Demo · Needs review",
  fileName: "synthetic-creased-receipt-mismatch.png",
  previewUrl: "/samples/sample-coffee-receipt.png",
  raw: {
    isBillingDocument: true,
    docType: "receipt",
    vendorName: "Corner Bakery & Café (Synthetic Demo)",
    vendorDetails: "Synthetic demo fixture — deliberate $0.50 arithmetic discrepancy",
    clientName: "",
    clientDetails: "",
    documentNumber: "DEMO-ERR-01",
    issueDate: "2026-11-08",
    dueDate: "2026-11-08",
    paymentMethod: "Card *1024",
    currency: "USD",
    lineItems: [
      { desc: "Latte (12oz)", detail: "Synthetic demo row", category: "Meals", qty: 2, rate: 5.50, amount: 11.00, taxable: true },
      { desc: "Sourdough Loaf", detail: "Synthetic demo row", category: "Meals", qty: 1, rate: 8.50, amount: 8.50, taxable: true },
      { desc: "Almond Tart", detail: "Synthetic demo row", category: "Meals", qty: 1, rate: 6.50, amount: 6.50, taxable: true },
    ],
    subtotal: 26.00,
    discountAmount: 0,
    shippingAmount: 0,
    taxRatePercent: 7.69,
    taxAmount: 2.00,
    tipAmount: 0,
    amountPaid: 28.50,
    total: 28.50, // Lines + tax = 28.00 vs printed total 28.50 -> triggers Math Check warning
    notes: "Synthetic discrepancy fixture: subtotal (26.00) + tax (2.00) = 28.00, whereas printed total reads 28.50.",
    confidence: 0.74,
  },
};

export function loadSampleDocument(sampleId) {
  const found =
    sampleId === OCR_DISCREPANCY_DEMO.id
      ? OCR_DISCREPANCY_DEMO
      : OCR_SAMPLES.find((s) => s.id === sampleId) || OCR_SAMPLES[0];
  const doc = normalizeOcrResult(found.raw, found.fileName);
  return {
    sample: found,
    document: {
      ...doc,
      previewDataUrl: found.previewUrl,
      fullPreviewUrl: found.previewUrl,
      isPdf: false,
      isSample: true,
    },
  };
}
