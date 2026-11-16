// Client-side file preprocessing (image compression + PDF reader) and zero-dependency
// RFC 4180 UTF-8 CSV + ECMA-376 OpenXML (.xlsx) multi-sheet workbook exporters.

import { verifyOcrMath } from "./ocrSchema.js";
import { roundMoney, currencyDecimals } from "./invoice.js";

const MAX_IMAGE_EDGE = 1600;
const MAX_PDF_BYTES = Math.floor(4.5 * 1024 * 1024);

/**
 * Prepares a user-selected File (image or PDF) for `/api/ocr`.
 * - Images (up to 15 MB raw) are downscaled on an HTML5 canvas to <= 1600px JPEG (0.85)
 *   so 8 MB phone photos shrink to ~220 KB and upload in ~200ms while preserving crisp digits.
 * - PDFs (<= 4.5 MB) are read directly as base64 (`application/pdf`), which Gemini 2.5 Flash
 *   reads natively across pages without requiring a 1.5 MB client-side PDF renderer.
 */
export async function prepareOcrFile(file) {
  if (!file) throw new Error("No file provided.");
  const name = file.name || "document";
  const type = (file.type || "").toLowerCase();

  if (type === "application/pdf" || /\.pdf$/i.test(name)) {
    if (file.size > MAX_PDF_BYTES) {
      const err = new Error("This PDF is over 4.5 MB. Take a screenshot (⌘V / Ctrl+V) or upload a smaller PDF.");
      err.code = "too_large";
      throw err;
    }
    const dataUrl = await readAsDataUrl(file);
    const base64 = dataUrl.split(",")[1] || "";
    return {
      fileName: name,
      mimeType: "application/pdf",
      dataBase64: base64,
      previewDataUrl: dataUrl,
      isPdf: true,
    };
  }

  if (type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(name)) {
    if (file.size > 16 * 1024 * 1024) {
      const err = new Error("Image exceeds 16 MB. Please upload a smaller photo.");
      err.code = "too_large";
      throw err;
    }
    const rawDataUrl = await readAsDataUrl(file);
    const compressedDataUrl = await compressOcrImage(rawDataUrl, MAX_IMAGE_EDGE);
    const mimeMatch = compressedDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const dataBase64 = mimeMatch ? mimeMatch[2] : compressedDataUrl.split(",")[1] || "";
    // Also produce a compact preview (<= 720px) so attaching receipt photos into
    // InvoiceEditor stays light enough for D1 storage.
    const thumbDataUrl = await compressOcrImage(compressedDataUrl, 720, 0.8);
    return {
      fileName: name,
      mimeType,
      dataBase64,
      previewDataUrl: thumbDataUrl || compressedDataUrl,
      fullPreviewUrl: compressedDataUrl,
      isPdf: false,
    };
  }

  const err = new Error("Unsupported file format. Please upload a JPG, PNG, WebP image, or a PDF file.");
  err.code = "unsupported_mime";
  throw err;
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (ev) => resolve(String(ev.target?.result || ""));
    r.onerror = () => reject(r.error || new Error("Failed to read file."));
    r.readAsDataURL(file);
  });
}

function compressOcrImage(src, maxEdge = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width || 1, img.height || 1));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      try {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // Fill white background so transparent PNG invoices remain high-contrast in JPEG
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

// ============================================================================
// CSV Exporter (UTF-8 BOM + 3 presets: itemized | ledger | accounting)
// ============================================================================

function csvCell(val) {
  if (val == null) return "";
  const s = String(val).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function fmtNum(val, currency = "USD") {
  const n = Number(val || 0);
  if (!Number.isFinite(n)) return "0";
  const dec = currencyDecimals(currency);
  return roundMoney(n, dec).toFixed(dec);
}

export function buildOcrCsv(docsInput, preset = "itemized") {
  const docs = (Array.isArray(docsInput) ? docsInput : [docsInput]).filter(Boolean);
  const rows = [];

  if (preset === "ledger") {
    // 1 row per receipt/invoice — ideal for monthly expense reports
    rows.push([
      "Date",
      "Vendor",
      "Receipt_or_Invoice_No",
      "Doc_Type",
      "Primary_Category",
      "Items_Summary",
      "Currency",
      "Subtotal",
      "Discount",
      "Shipping",
      "Tax",
      "Tip",
      "Total",
      "Payment_Method",
      "Math_Verified",
      "Notes",
    ]);
    for (const d of docs) {
      const lines = d.lineItems || [];
      const primaryCat = lines[0]?.category || "Other";
      const summary = lines
        .map((l) => l.desc)
        .filter(Boolean)
        .join("; ");
      const math = verifyOcrMath(d);
      rows.push([
        d.issueDate || "",
        d.vendorName || "",
        d.documentNumber || "",
        d.docType || "receipt",
        primaryCat,
        summary,
        d.currency || "USD",
        fmtNum(d.subtotal, d.currency),
        fmtNum(d.discountAmount, d.currency),
        fmtNum(d.shippingAmount, d.currency),
        fmtNum(d.taxAmount, d.currency),
        fmtNum(d.tipAmount, d.currency),
        fmtNum(d.total, d.currency),
        d.paymentMethod || "",
        math.verified ? "Yes" : "Review",
        d.notes || "",
      ]);
    }
  } else if (preset === "accounting") {
    // QuickBooks / Xero bill-import friendly column layout
    rows.push([
      "*ContactName",
      "*InvoiceNumber",
      "*InvoiceDate",
      "*DueDate",
      "Description",
      "*Quantity",
      "*UnitAmount",
      "LineAmount",
      "*AccountCode",
      "*TaxType",
      "TaxAmount",
      "Currency",
    ]);
    for (const d of docs) {
      const lines = d.lineItems?.length ? d.lineItems : [{ desc: "Bill item", qty: 1, rate: d.total, amount: d.total, category: "Other", taxable: false }];
      lines.forEach((ln, idx) => {
        rows.push([
          d.vendorName || "Vendor",
          d.documentNumber || `SCAN-${idx + 1}`,
          d.issueDate || "",
          d.dueDate || d.issueDate || "",
          [ln.desc, ln.detail].filter(Boolean).join(" — "),
          ln.qty ?? 1,
          fmtNum(ln.rate, d.currency),
          fmtNum(ln.amount, d.currency),
          ln.category || "Expenses",
          ln.taxable ? "Tax on Purchases" : "Tax Exempt",
          idx === 0 ? fmtNum(d.taxAmount, d.currency) : "0.00",
          d.currency || "USD",
        ]);
      });
    }
  } else {
    // Default: "itemized" — every line item with parent document context
    rows.push([
      "Source_File",
      "Doc_Type",
      "Document_No",
      "Issue_Date",
      "Due_Date",
      "Vendor_Name",
      "Client_Name",
      "Currency",
      "Line_No",
      "Category",
      "Description",
      "Detail",
      "Quantity",
      "Unit_Rate",
      "Taxable",
      "Line_Amount",
      "Doc_Subtotal",
      "Doc_Tax",
      "Doc_Tip",
      "Doc_Total",
      "Payment_Method",
    ]);
    for (const d of docs) {
      const lines = d.lineItems?.length ? d.lineItems : [{ desc: "", detail: "", qty: 1, rate: d.total, amount: d.total, category: "Other", taxable: true }];
      lines.forEach((ln, idx) => {
        rows.push([
          d.fileName || "scan",
          d.docType || "invoice",
          d.documentNumber || "",
          d.issueDate || "",
          d.dueDate || "",
          d.vendorName || "",
          d.clientName || "",
          d.currency || "USD",
          idx + 1,
          ln.category || "Other",
          ln.desc || "",
          ln.detail || "",
          ln.qty ?? 1,
          fmtNum(ln.rate, d.currency),
          ln.taxable === false ? "No" : "Yes",
          fmtNum(ln.amount, d.currency),
          fmtNum(d.subtotal, d.currency),
          fmtNum(d.taxAmount, d.currency),
          fmtNum(d.tipAmount, d.currency),
          fmtNum(d.total, d.currency),
          d.paymentMethod || "",
        ]);
      });
    }
  }

  // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens €, £, ¥, Chinese/Japanese cleanly
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
}

export function suggestedExportName(docs, ext = "csv", preset = "itemized") {
  const list = (Array.isArray(docs) ? docs : [docs]).filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);
  if (list.length === 1) {
    const d = list[0];
    const vendor = String(d.vendorName || d.documentNumber || "scanned-bill")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32);
    const dt = d.issueDate || today;
    return `${vendor || "bill"}-${dt}.${ext}`;
  }
  const tag = preset === "ledger" ? "expense-ledger" : "ocr-export";
  return `billcrafter-${tag}-${today}-${list.length}files.${ext}`;
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadOcrCsv(docs, preset = "itemized") {
  const csv = buildOcrCsv(docs, preset);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = suggestedExportName(docs, "csv", preset);
  triggerBlobDownload(blob, filename);
  return filename;
}

// ============================================================================
// Native Zero-Dependency OpenXML (.xlsx) Multi-Sheet Workbook Builder
// Produces a 100% genuine Microsoft Excel .xlsx archive with:
//   - Sheet 1: "Summary" (with styled header, numeric currency cells, and =SUM() formulas)
//   - Sheet 2: "Line Items" (full itemized breakdown across all scanned bills)
// ============================================================================

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildZipStore(entries) {
  const enc = new TextEncoder();
  const files = entries.map((e) => {
    const nameBytes = enc.encode(e.name);
    const dataBytes = typeof e.content === "string" ? enc.encode(e.content) : e.content;
    return { nameBytes, dataBytes, crc: crc32(dataBytes) };
  });

  let localSize = 0;
  let centralSize = 0;
  for (const f of files) {
    localSize += 30 + f.nameBytes.length + f.dataBytes.length;
    centralSize += 46 + f.nameBytes.length;
  }

  const out = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(out.buffer);
  let offset = 0;
  const offsets = [];

  for (const f of files) {
    offsets.push(offset);
    view.setUint32(offset, 0x04034b50, true); // Local file header signature
    view.setUint16(offset + 4, 20, true);     // Version needed (2.0)
    view.setUint16(offset + 6, 0x0800, true); // UTF-8 filename flag
    view.setUint16(offset + 8, 0, true);      // Compression: 0 = Store
    view.setUint16(offset + 10, 0, true);     // Mod time
    view.setUint16(offset + 12, 0x596d, true);// Mod date
    view.setUint32(offset + 14, f.crc, true);
    view.setUint32(offset + 18, f.dataBytes.length, true);
    view.setUint32(offset + 22, f.dataBytes.length, true);
    view.setUint16(offset + 26, f.nameBytes.length, true);
    view.setUint16(offset + 28, 0, true);
    out.set(f.nameBytes, offset + 30);
    out.set(f.dataBytes, offset + 30 + f.nameBytes.length);
    offset += 30 + f.nameBytes.length + f.dataBytes.length;
  }

  const centralStart = offset;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    view.setUint32(offset, 0x02014b50, true); // Central directory signature
    view.setUint16(offset + 4, 20, true);     // Version made by
    view.setUint16(offset + 6, 20, true);     // Version needed
    view.setUint16(offset + 8, 0x0800, true); // UTF-8 flag
    view.setUint16(offset + 10, 0, true);     // Store
    view.setUint16(offset + 12, 0, true);
    view.setUint16(offset + 14, 0x596d, true);
    view.setUint32(offset + 16, f.crc, true);
    view.setUint32(offset + 20, f.dataBytes.length, true);
    view.setUint32(offset + 24, f.dataBytes.length, true);
    view.setUint16(offset + 28, f.nameBytes.length, true);
    view.setUint16(offset + 30, 0, true);
    view.setUint16(offset + 32, 0, true);
    view.setUint16(offset + 34, 0, true);
    view.setUint16(offset + 36, 0, true);
    view.setUint32(offset + 38, 0, true);
    view.setUint32(offset + 42, offsets[i], true);
    out.set(f.nameBytes, offset + 46);
    offset += 46 + f.nameBytes.length;
  }

  const centralLen = offset - centralStart;
  view.setUint32(offset, 0x06054b50, true); // End of central directory
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, files.length, true);
  view.setUint16(offset + 10, files.length, true);
  view.setUint32(offset + 12, centralLen, true);
  view.setUint32(offset + 16, centralStart, true);
  view.setUint16(offset + 20, 0, true);

  return out;
}

function xmlEsc(s) {
  return String(s ?? "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colLetter(colIdx0) {
  let n = colIdx0 + 1;
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Style indices in styles.xml:
// 0 = normal text, 1 = dark bold header, 2 = currency decimal (#,##0.00),
// 3 = bold total label, 4 = bold total currency (#,##0.00)
function buildWorksheetXml(colWidths, matrix) {
  const colsXml = colWidths
    .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
    .join("");

  const rowsXml = matrix
    .map((row, rIdx) => {
      const rowNum = rIdx + 1;
      const cellsXml = row
        .map((cell, cIdx) => {
          if (cell == null) return "";
          const ref = `${colLetter(cIdx)}${rowNum}`;
          const sAttr = cell.style ? ` s="${cell.style}"` : "";
          if (cell.formula) {
            const cached = Number.isFinite(Number(cell.value)) ? Number(cell.value) : 0;
            return `<c r="${ref}"${sAttr}><f>${xmlEsc(cell.formula)}</f><v>${cached}</v></c>`;
          }
          if (cell.type === "n") {
            const n = Number(cell.value);
            const safe = Number.isFinite(n) ? n : 0;
            return `<c r="${ref}"${sAttr}><v>${safe}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr"${sAttr}><is><t xml:space="preserve">${xmlEsc(cell.value)}</t></is></c>`;
        })
        .join("");
      const ht = rIdx === 0 ? ' ht="24" customHeight="1"' : "";
      return `<row r="${rowNum}"${ht}>${cellsXml}</row>`;
    })
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<cols>${colsXml}</cols>` +
    `<sheetData>${rowsXml}</sheetData>` +
    `</worksheet>`
  );
}

export function buildOcrXlsxBytes(docsInput) {
  const docs = (Array.isArray(docsInput) ? docsInput : [docsInput]).filter(Boolean);

  // ---- Sheet 1: Summary ----
  const sumHeaders = [
    "Date",
    "Vendor / Merchant",
    "Doc #",
    "Type",
    "Currency",
    "Subtotal",
    "Discount",
    "Tax",
    "Tip",
    "Total",
    "Payment Method",
    "Math Check",
  ];
  const sumMatrix = [sumHeaders.map((h) => ({ type: "s", value: h, style: 1 }))];

  let sumSub = 0, sumDisc = 0, sumTax = 0, sumTip = 0, sumTot = 0;
  docs.forEach((d) => {
    const math = verifyOcrMath(d);
    const sub = Number(d.subtotal || 0);
    const disc = Number(d.discountAmount || 0);
    const tax = Number(d.taxAmount || 0);
    const tip = Number(d.tipAmount || 0);
    const tot = Number(d.total || 0);
    sumSub += sub; sumDisc += disc; sumTax += tax; sumTip += tip; sumTot += tot;

    sumMatrix.push([
      { type: "s", value: d.issueDate || "" },
      { type: "s", value: d.vendorName || "" },
      { type: "s", value: d.documentNumber || "" },
      { type: "s", value: d.docType || "invoice" },
      { type: "s", value: d.currency || "USD" },
      { type: "n", value: sub, style: 2 },
      { type: "n", value: disc, style: 2 },
      { type: "n", value: tax, style: 2 },
      { type: "n", value: tip, style: 2 },
      { type: "n", value: tot, style: 2 },
      { type: "s", value: d.paymentMethod || "" },
      { type: "s", value: math.verified ? "Verified" : "Check" },
    ]);
  });

  if (docs.length > 0) {
    const lastDataRow = docs.length + 1;
    sumMatrix.push([
      { type: "s", value: "TOTAL", style: 3 },
      { type: "s", value: `${docs.length} document${docs.length > 1 ? "s" : ""}`, style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: docs[0]?.currency || "USD", style: 3 },
      { formula: `SUM(F2:F${lastDataRow})`, value: roundMoney(sumSub, 2), style: 4 },
      { formula: `SUM(G2:G${lastDataRow})`, value: roundMoney(sumDisc, 2), style: 4 },
      { formula: `SUM(H2:H${lastDataRow})`, value: roundMoney(sumTax, 2), style: 4 },
      { formula: `SUM(I2:I${lastDataRow})`, value: roundMoney(sumTip, 2), style: 4 },
      { formula: `SUM(J2:J${lastDataRow})`, value: roundMoney(sumTot, 2), style: 4 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
    ]);
  }

  const sheet1Xml = buildWorksheetXml([13, 26, 15, 11, 10, 13, 12, 12, 11, 14, 18, 13], sumMatrix);

  // ---- Sheet 2: Line Items ----
  const lineHeaders = [
    "Issue Date",
    "Vendor",
    "Doc #",
    "Category",
    "Item Description",
    "Details",
    "Qty",
    "Unit Rate",
    "Taxable",
    "Line Amount",
    "Currency",
  ];
  const lineMatrix = [lineHeaders.map((h) => ({ type: "s", value: h, style: 1 }))];
  let totalLinesCount = 0;
  let totalLinesSum = 0;

  docs.forEach((d) => {
    const lines = d.lineItems?.length ? d.lineItems : [];
    lines.forEach((ln) => {
      totalLinesCount += 1;
      const amt = Number(ln.amount || 0);
      totalLinesSum += amt;
      lineMatrix.push([
        { type: "s", value: ln.date || d.issueDate || "" },
        { type: "s", value: d.vendorName || "" },
        { type: "s", value: d.documentNumber || "" },
        { type: "s", value: ln.category || "Other" },
        { type: "s", value: ln.desc || "" },
        { type: "s", value: ln.detail || "" },
        { type: "n", value: Number(ln.qty ?? 1) },
        { type: "n", value: Number(ln.rate || 0), style: 2 },
        { type: "s", value: ln.taxable === false ? "No" : "Yes" },
        { type: "n", value: amt, style: 2 },
        { type: "s", value: d.currency || "USD" },
      ]);
    });
  });

  if (totalLinesCount > 0) {
    const endRow = totalLinesCount + 1;
    lineMatrix.push([
      { type: "s", value: "TOTAL LINES", style: 3 },
      { type: "s", value: `${totalLinesCount} items`, style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { type: "s", value: "", style: 3 },
      { formula: `SUM(J2:J${endRow})`, value: roundMoney(totalLinesSum, 2), style: 4 },
      { type: "s", value: docs[0]?.currency || "USD", style: 3 },
    ]);
  }

  const sheet2Xml = buildWorksheetXml([13, 24, 14, 14, 32, 26, 9, 13, 10, 14, 10], lineMatrix);

  const contentTypesXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    `</Types>`;

  const rootRelsXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`;

  const workbookXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets>` +
    `<sheet name="Summary" sheetId="1" r:id="rId1"/>` +
    `<sheet name="Line Items" sheetId="2" r:id="rId2"/>` +
    `</sheets>` +
    `</workbook>`;

  const wbRelsXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>` +
    `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`;

  const stylesXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.00"/></numFmts>` +
    `<fonts count="3">` +
    `<font><sz val="11"/><color rgb="FF16181C"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="11"/><color rgb="FF16181C"/><name val="Calibri"/></font>` +
    `</fonts>` +
    `<fills count="4">` +
    `<fill><patternFill patternType="none"/></fill>` +
    `<fill><patternFill patternType="gray125"/></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FF2D2F33"/></patternFill></fill>` +
    `<fill><patternFill patternType="solid"><fgColor rgb="FFF3F3EE"/></patternFill></fill>` +
    `</fills>` +
    `<borders count="2">` +
    `<border><left/><right/><top/><bottom/><diagonal/></border>` +
    `<border><left/><right/><top style="thin"><color rgb="FFD0D4DA"/></top><bottom style="double"><color rgb="FF2D2F33"/></bottom><diagonal/></border>` +
    `</borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="5">` +
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
    `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>` +
    `<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
    `<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>` +
    `<xf numFmtId="164" fontId="2" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>` +
    `</cellXfs>` +
    `</styleSheet>`;

  return buildZipStore([
    { name: "[Content_Types].xml", content: contentTypesXml },
    { name: "_rels/.rels", content: rootRelsXml },
    { name: "xl/workbook.xml", content: workbookXml },
    { name: "xl/_rels/workbook.xml.rels", content: wbRelsXml },
    { name: "xl/styles.xml", content: stylesXml },
    { name: "xl/worksheets/sheet1.xml", content: sheet1Xml },
    { name: "xl/worksheets/sheet2.xml", content: sheet2Xml },
  ]);
}

export function downloadOcrXlsx(docs) {
  const bytes = buildOcrXlsxBytes(docs);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = suggestedExportName(docs, "xlsx", "workbook");
  triggerBlobDownload(blob, filename);
  return filename;
}
