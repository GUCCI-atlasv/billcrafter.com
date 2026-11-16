// Shared schema, normalizer, arithmetic verifier, and InvoiceEditor bridge for
// Receipt & Invoice OCR. Isomorphic (runs in both Cloudflare Workers and browser).

import { CURRENCIES, TYPES, roundMoney, currencyDecimals } from "./invoice.js";

export const EXPENSE_CATEGORIES = [
  "Materials",
  "Meals",
  "Travel",
  "Software",
  "Office",
  "Labor",
  "Utilities",
  "Equipment",
  "Shipping",
  "Other",
];

// Vertex AI / Gemini Structured Output schema (OpenAPI 3.0 subset).
export const OCR_RESPONSE_SCHEMA = {
  type: "OBJECT",
  required: ["isBillingDocument", "docType", "currency", "lineItems", "total"],
  properties: {
    isBillingDocument: {
      type: "BOOLEAN",
      description: "True if the uploaded image or PDF is an invoice, receipt, bill, quote, purchase order, or estimate.",
    },
    docType: {
      type: "STRING",
      enum: ["invoice", "receipt", "quote", "estimate"],
      description: "Classify retail/restaurant/paid slips as receipt; payment requests as invoice.",
    },
    vendorName: {
      type: "STRING",
      nullable: true,
      description: "Merchant, seller, or issuing business name.",
    },
    vendorDetails: {
      type: "STRING",
      nullable: true,
      description: "Seller address, phone, email, website, and tax ID (EIN/VAT/GST/ABN/MwSt/NIF/T-number) separated by newlines.",
    },
    clientName: {
      type: "STRING",
      nullable: true,
      description: "Buyer, customer, or Bill-To party name if present.",
    },
    clientDetails: {
      type: "STRING",
      nullable: true,
      description: "Buyer address, email, or phone separated by newlines.",
    },
    documentNumber: {
      type: "STRING",
      nullable: true,
      description: "Invoice number, receipt number, check/order number.",
    },
    issueDate: {
      type: "STRING",
      nullable: true,
      description: "Document or transaction date formatted as YYYY-MM-DD.",
    },
    dueDate: {
      type: "STRING",
      nullable: true,
      description: "Payment due date or quote valid-until date formatted as YYYY-MM-DD.",
    },
    poNumber: {
      type: "STRING",
      nullable: true,
      description: "Purchase order or reference number if stated.",
    },
    paymentMethod: {
      type: "STRING",
      nullable: true,
      description: "How it was or should be paid, e.g. Visa *4242, Cash, Bank Transfer, Zelle.",
    },
    currency: {
      type: "STRING",
      description: "3-letter ISO 4217 currency code (e.g. USD, EUR, GBP, CNY, PKR, BDT, CAD, AUD, JPY, HKD, TWD, INR, SGD, MXN, BRL). Default to USD if ambiguous.",
    },
    lineItems: {
      type: "ARRAY",
      description: "Every purchased item, service row, or fee line on the document.",
      items: {
        type: "OBJECT",
        required: ["desc", "qty", "rate", "amount"],
        properties: {
          date: { type: "STRING", nullable: true, description: "YYYY-MM-DD if the row carries its own date" },
          category: {
            type: "STRING",
            nullable: true,
            description: "Best-fit category: Materials, Meals, Travel, Software, Office, Labor, Utilities, Equipment, Shipping, or Other",
          },
          desc: { type: "STRING", description: "Clean item or service name" },
          detail: { type: "STRING", nullable: true, description: "SKU, unit notes, hours breakdown, or sub-description" },
          qty: { type: "NUMBER", description: "Quantity or hours (use 1 when not explicitly printed)" },
          rate: { type: "NUMBER", description: "Unit price before tax" },
          amount: { type: "NUMBER", description: "Line total (qty * rate, or printed line amount)" },
          taxable: { type: "BOOLEAN", nullable: true, description: "True if taxed, false if marked non-taxable/exempt" },
        },
      },
    },
    subtotal: { type: "NUMBER", nullable: true, description: "Pre-tax subtotal" },
    discountAmount: { type: "NUMBER", nullable: true, description: "Total discount amount as a positive number" },
    shippingAmount: { type: "NUMBER", nullable: true, description: "Shipping, delivery, or handling charge" },
    taxRatePercent: { type: "NUMBER", nullable: true, description: "Headline tax/VAT/GST percentage if printed (e.g. 8.25 or 19)" },
    taxAmount: { type: "NUMBER", nullable: true, description: "Total sales tax / VAT / GST amount" },
    tipAmount: { type: "NUMBER", nullable: true, description: "Gratuity / tip or service charge if present" },
    amountPaid: { type: "NUMBER", nullable: true, description: "Amount already paid or tendered" },
    total: { type: "NUMBER", description: "Final grand total on the document" },
    notes: { type: "STRING", nullable: true, description: "Payment terms, tax registration note, or memo" },
    confidence: { type: "NUMBER", description: "Overall extraction legibility confidence between 0.0 and 1.0" },
  },
};

export const OCR_SYSTEM_PROMPT = [
  "You are a precision financial document OCR parser for BillCrafter.",
  "Extract structured data from the uploaded invoice, receipt, quote, or estimate.",
  "Rules:",
  "1. If the image/PDF is clearly NOT a billing, receipt, quote, or financial document, set isBillingDocument=false and return empty lineItems and total=0.",
  "2. Preserve exact numbers printed on the document. Never invent line items.",
  "3. Convert dates to ISO YYYY-MM-DD whenever year/month/day can be determined.",
  "4. Map currency symbols accurately ($, €, £, ¥/RMB/元, Rs/PKR, ৳/BDT, C$, A$, HK$, NT$, ₹, S$, kr, R$, CHF) to 3-letter ISO codes (disambiguate CNY vs JPY from script/locale context).",
  "5. Separate tax, tip/gratuity, discount, and shipping from lineItems so they are not double-counted.",
  "6. Handle multi-language invoices (English, Simplified Chinese 增值税/税号, Traditional Chinese 統編/營業稅, Bengali ভ্যাট, German MwSt, Spanish IVA/IRPF, French TVA, Japanese 適格請求書/消費税, Portuguese) natively while keeping field keys strictly in the schema.",
].join("\n");

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const cleanDate = (s) => {
  if (!s || typeof s !== "string") return "";
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "";
};

const normalizeCurrency = (raw) => {
  const up = String(raw || "USD").trim().toUpperCase();
  if (CURRENCIES[up]) return up;
  const map = { "$": "USD", "US$": "USD", "€": "EUR", "£": "GBP", "¥": "JPY", "C$": "CAD", "A$": "AUD", "HK$": "HKD", "NT$": "TWD", "₹": "INR" };
  return map[up] || "USD";
};

/**
 * Normalizes raw Gemini JSON output into a clean, predictable client state object.
 */
export function normalizeOcrResult(raw = {}, fileName = "document") {
  const currency = normalizeCurrency(raw.currency);
  const dec = currencyDecimals(currency);
  const docType = TYPES[raw.docType] ? raw.docType : "invoice";

  const rawLines = Array.isArray(raw.lineItems) ? raw.lineItems : [];
  const lineItems = rawLines
    .filter((it) => it && (String(it.desc || "").trim() || num(it.amount) !== 0 || num(it.rate) !== 0))
    .map((it, idx) => {
      const qty = num(it.qty, 1) || 1;
      const amount = roundMoney(
        it.amount != null && Number.isFinite(Number(it.amount))
          ? Number(it.amount)
          : qty * num(it.rate, 0),
        dec
      );
      const rate =
        it.rate != null && Number.isFinite(Number(it.rate)) && Number(it.rate) !== 0
          ? roundMoney(Number(it.rate), dec)
          : roundMoney(qty !== 0 ? amount / qty : amount, dec);
      const cat = EXPENSE_CATEGORIES.includes(it.category) ? it.category : "Other";
      return {
        id: `ln_${idx}_${ Math.random().toString(36).slice(2, 6) }`,
        date: cleanDate(it.date),
        category: cat,
        desc: String(it.desc || "Item").trim(),
        detail: String(it.detail || "").trim(),
        qty,
        rate,
        amount,
        taxable: it.taxable !== false,
      };
    });

  const linesSum = roundMoney(
    lineItems.reduce((acc, r) => acc + num(r.amount, 0), 0),
    dec
  );

  const subtotal = raw.subtotal != null ? roundMoney(num(raw.subtotal, linesSum), dec) : linesSum;
  const discountAmount = roundMoney(Math.abs(num(raw.discountAmount, 0)), dec);
  const shippingAmount = roundMoney(Math.max(0, num(raw.shippingAmount, 0)), dec);
  const taxAmount = roundMoney(Math.max(0, num(raw.taxAmount, 0)), dec);
  const tipAmount = roundMoney(Math.max(0, num(raw.tipAmount, 0)), dec);
  const total = roundMoney(num(raw.total, subtotal - discountAmount + shippingAmount + taxAmount + tipAmount), dec);

  let taxRatePercent = raw.taxRatePercent != null ? num(raw.taxRatePercent, 0) : 0;
  if (!taxRatePercent && taxAmount > 0 && subtotal - discountAmount > 0) {
    taxRatePercent = Math.round((taxAmount / (subtotal - discountAmount)) * 10000) / 100;
  }

  return {
    isBillingDocument: raw.isBillingDocument !== false,
    docType,
    fileName,
    vendorName: String(raw.vendorName || "").trim(),
    vendorDetails: String(raw.vendorDetails || "").trim(),
    clientName: String(raw.clientName || "").trim(),
    clientDetails: String(raw.clientDetails || "").trim(),
    documentNumber: String(raw.documentNumber || "").trim(),
    issueDate: cleanDate(raw.issueDate),
    dueDate: cleanDate(raw.dueDate),
    poNumber: String(raw.poNumber || "").trim(),
    paymentMethod: String(raw.paymentMethod || "").trim(),
    currency,
    lineItems: lineItems.length
      ? lineItems
      : [{ id: "ln_0", date: "", category: "Other", desc: "", detail: "", qty: 1, rate: total, amount: total, taxable: true }],
    subtotal,
    discountAmount,
    shippingAmount,
    taxRatePercent,
    taxAmount,
    tipAmount,
    amountPaid: raw.amountPaid != null ? roundMoney(num(raw.amountPaid, 0), dec) : docType === "receipt" ? total : 0,
    total,
    notes: String(raw.notes || "").trim(),
    confidence: Math.max(0, Math.min(1, num(raw.confidence, 0.92))),
  };
}

/**
 * Real-time arithmetic check: verifies that line items - discount + shipping + tax + tip == total.
 */
export function verifyOcrMath(doc) {
  if (!doc) return { verified: false, computedTotal: 0, linesSum: 0, diff: 0 };
  const dec = currencyDecimals(doc.currency || "USD");
  const linesSum = roundMoney(
    (doc.lineItems || []).reduce((acc, r) => acc + num(r.amount, num(r.qty, 1) * num(r.rate, 0)), 0),
    dec
  );
  const computedTotal = roundMoney(
    linesSum - num(doc.discountAmount, 0) + num(doc.shippingAmount, 0) + num(doc.taxAmount, 0) + num(doc.tipAmount, 0),
    dec
  );
  const scannedTotal = roundMoney(num(doc.total, 0), dec);
  const diff = roundMoney(scannedTotal - computedTotal, dec);
  const tolerance = dec === 0 ? 1 : 0.02;
  const hasLines = (doc.lineItems || []).some((r) => String(r.desc || "").trim() || num(r.amount) > 0);

  return {
    verified: hasLines && Math.abs(diff) <= tolerance,
    linesSum,
    computedTotal,
    scannedTotal,
    diff,
  };
}

/**
 * Converts one or more OCR documents into an exact `InvoiceEditor.jsx` snapshot
 * (`loadSnap(snap)` compatible).
 *
 * Modes:
 *  - "recreate": Turns the active scanned document into a clean editable Invoice/Receipt/Quote/Estimate.
 *  - "bill_expenses": Bundles one or multiple scanned receipts into a client-facing
 *    reimbursement invoice under a "Reimbursable expenses" section, optionally attaching
 *    the receipt photos at the bottom of the PDF!
 */
export function ocrToEditorSnapshot(docsInput, { mode = "recreate", attachPhotos = true } = {}) {
  const docs = (Array.isArray(docsInput) ? docsInput : [docsInput]).filter(Boolean);
  if (!docs.length) return null;

  const today = new Date().toISOString().slice(0, 10);
  const due14 = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  })();

  if (mode === "bill_expenses") {
    const primary = docs[0];
    const currency = primary.currency || "USD";
    const dec = currencyDecimals(currency);
    const items = [{ section: "Reimbursable expenses" }];

    for (const d of docs) {
      const prefix = [d.issueDate, d.vendorName].filter(Boolean).join(" · ");
      if ((d.lineItems || []).length === 1 && !d.taxAmount && !d.tipAmount) {
        const it = d.lineItems[0];
        items.push({
          desc: prefix ? `${prefix} — ${it.desc || "Expense"}` : (it.desc || "Expense"),
          detail: [it.detail, d.documentNumber ? `Ref #${d.documentNumber}` : ""].filter(Boolean).join(" · "),
          qty: num(it.qty, 1) || 1,
          rate: roundMoney(num(it.rate, d.total), dec),
          tax: false,
        });
      } else {
        // Summarize each receipt as one clean reimbursable line (standard consulting/contractor practice)
        const summaryDesc = (d.lineItems || [])
          .map((i) => i.desc)
          .filter(Boolean)
          .slice(0, 3)
          .join(", ");
        items.push({
          desc: prefix || d.fileName || "Receipt expense",
          detail: [
            summaryDesc,
            d.documentNumber ? `Receipt #${d.documentNumber}` : "",
            d.taxAmount ? `incl. ${d.currency} ${d.taxAmount} tax` : "",
          ]
            .filter(Boolean)
            .join(" · "),
          qty: 1,
          rate: roundMoney(num(d.total, 0), dec),
          tax: false,
        });
      }
    }

    const photos = attachPhotos
      ? docs
          .filter((d) => d.previewDataUrl && d.previewDataUrl.startsWith("data:image/"))
          .slice(0, 6)
          .map((d) => ({
            src: d.previewDataUrl,
            cap: [d.vendorName || "Receipt", d.issueDate, d.total ? `${d.currency} ${d.total}` : ""].filter(Boolean).join(" · "),
          }))
      : [];

    return {
      id: "inv_" + Date.now(),
      type: "invoice",
      tpl: "modern",
      currency,
      taxMode: "net",
      stamp: "",
      items,
      photos,
      adj: {
        taxRate: 0,
        discVal: 0,
        discType: "pct",
        shipping: 0,
        paid: 0,
        depositVal: 0,
        depositType: "pct",
      },
      f: {
        fromName: "",
        fromDetails: "",
        toName: primary.clientName || "",
        toDetails: primary.clientDetails || "",
        jobAddr: "",
        svcFrom: "",
        svcTo: "",
        svcFreq: "",
        svcScope: "",
        timesheet: false,
        invNo: "INV-0001",
        issueDate: today,
        dueDate: due14,
        poNo: primary.poNumber || "",
        payMethod: "",
        payNote: "",
        notes: `Reimbursement for ${docs.length} attached expense receipt${docs.length > 1 ? "s" : ""}. Payment due within 14 days.`,
      },
    };
  }

  // Default mode: "recreate" single document 1:1
  const d = docs[0];
  const type = TYPES[d.docType] ? d.docType : "invoice";
  const currency = d.currency || "USD";
  const dec = currencyDecimals(currency);

  const items = (d.lineItems || []).map((it) => ({
    ...(it.date ? { date: it.date } : {}),
    desc: it.desc || "",
    detail: it.detail || "",
    qty: num(it.qty, 1) || 1,
    rate: roundMoney(num(it.rate, 0), dec),
    tax: it.taxable !== false,
  }));

  if (num(d.tipAmount, 0) > 0) {
    items.push({
      desc: "Tip / Gratuity",
      detail: "",
      qty: 1,
      rate: roundMoney(num(d.tipAmount, 0), dec),
      tax: false,
    });
  }

  const taxableBase = items
    .filter((i) => i.tax)
    .reduce((acc, i) => acc + num(i.qty, 1) * num(i.rate, 0), 0);
  const netTaxableBase = Math.max(0, taxableBase - num(d.discountAmount, 0));
  let derivedTaxRate = num(d.taxRatePercent, 0);
  if (num(d.taxAmount, 0) > 0 && netTaxableBase > 0) {
    derivedTaxRate = Math.round((num(d.taxAmount, 0) / netTaxableBase) * 10000) / 100;
  }

  return {
    id: "inv_" + Date.now(),
    type,
    tpl: type === "receipt" ? "compact" : "modern",
    currency,
    taxMode: "net",
    stamp: type === "receipt" ? "paid" : "",
    items: items.length ? items : [{ desc: "", detail: "", qty: 1, rate: 0, tax: true }],
    photos: [],
    adj: {
      taxRate: derivedTaxRate,
      discVal: roundMoney(num(d.discountAmount, 0), dec),
      discType: "flat",
      shipping: roundMoney(num(d.shippingAmount, 0), dec),
      paid: type === "receipt" ? roundMoney(num(d.total, 0), dec) : roundMoney(num(d.amountPaid, 0), dec),
      depositVal: 0,
      depositType: "pct",
    },
    f: {
      fromName: d.vendorName || "",
      fromDetails: d.vendorDetails || "",
      toName: d.clientName || "",
      toDetails: d.clientDetails || "",
      jobAddr: "",
      svcFrom: "",
      svcTo: "",
      svcFreq: "",
      svcScope: "",
      timesheet: items.some((i) => !!i.date),
      invNo: d.documentNumber || `${TYPES[type].prefix}-0001`,
      issueDate: d.issueDate || today,
      dueDate: d.dueDate || (type === "receipt" ? today : due14),
      poNo: d.poNumber || "",
      payMethod: d.paymentMethod || (type === "receipt" ? "Card" : ""),
      payNote: "",
      notes: d.notes || (type === "receipt" ? "Payment received — thank you!" : "Payment due within 14 days. Thank you!"),
    },
  };
}
