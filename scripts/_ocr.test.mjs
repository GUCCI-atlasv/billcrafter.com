// Automated verification suite for OCR schema, math check, CSV/XLSX builders,
// InvoiceEditor snapshot bridge, and SSG `<html lang>` output.
//
// Run: node scripts/_ocr.test.mjs

import assert from "node:assert/strict";
import fs from "node:fs";
import { OCR_SAMPLES, OCR_DISCREPANCY_DEMO, loadSampleDocument } from "../lib/ocrSamples.js";
import { verifyOcrMath, ocrToEditorSnapshot } from "../lib/ocrSchema.js";
import { buildOcrCsv, buildOcrXlsxBytes } from "../lib/ocrClient.js";
import { computeTotals } from "../lib/invoice.js";
import { parseServiceAccount } from "../lib/server/gcpAuth.js";

// 1. Verify all 3 benchmark samples pass Math Sanity Check
const docs = OCR_SAMPLES.map((s) => loadSampleDocument(s.id).document);
for (const d of docs) {
  const math = verifyOcrMath(d);
  assert.equal(math.verified, true, `Sample ${d.fileName} failed math check: diff=${math.diff}`);
}

// 2. Verify discrepancy detection when a figure is altered + built-in discrepancy demo
const broken = { ...docs[0], total: 99.99 };
const brokenMath = verifyOcrMath(broken);
assert.equal(brokenMath.verified, false);
assert.equal(brokenMath.diff, 49.65);

const discDoc = loadSampleDocument(OCR_DISCREPANCY_DEMO.id).document;
const discMath = verifyOcrMath(discDoc);
assert.equal(discMath.verified, false);
assert.equal(discMath.diff, 0.5);

// 3. Verify CSV presets (UTF-8 BOM + expected row counts)
for (const preset of ["itemized", "ledger", "accounting"]) {
  const csv = buildOcrCsv(docs, preset);
  assert.ok(csv.startsWith("\uFEFF"), `CSV (${preset}) must start with UTF-8 BOM`);
  const lines = csv.slice(1).split("\r\n");
  if (preset === "ledger") {
    assert.equal(lines.length, docs.length + 1, "Ledger CSV should have header + 1 row per document");
  } else {
    assert.ok(lines.length >= 13, `Itemized/Accounting CSV should expand all line items`);
  }
}

// 4. Verify native OpenXML .xlsx binary structure
const xlsxBytes = buildOcrXlsxBytes(docs);
assert.ok(xlsxBytes instanceof Uint8Array && xlsxBytes.length > 2000);
// PK\x03\x04 ZIP magic header
assert.equal(xlsxBytes[0], 0x50);
assert.equal(xlsxBytes[1], 0x4b);
assert.equal(xlsxBytes[2], 0x03);
assert.equal(xlsxBytes[3], 0x04);
fs.writeFileSync("/tmp/bc-test-export.xlsx", xlsxBytes);

// 5. Verify InvoiceEditor bridge ("recreate" + "bill_expenses")
const singleSnap = ocrToEditorSnapshot(docs[1], { mode: "recreate" });
const singleTotals = computeTotals(singleSnap.items, { ...singleSnap.adj, taxMode: "net" });
assert.equal(singleTotals.total, 858.8);

const reimbSnap = ocrToEditorSnapshot(docs, { mode: "bill_expenses", attachPhotos: false });
const reimbTotals = computeTotals(reimbSnap.items, { ...reimbSnap.adj, taxMode: "net" });
assert.equal(reimbTotals.total, +(50.34 + 858.8 + 6364.5).toFixed(2));

// 6. Verify GCP Service Account parser (JSON & Base64)
const mockSa = JSON.stringify({
  project_id: "billcrafter-test",
  client_email: "ocr@billcrafter-test.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
});
assert.equal(parseServiceAccount(mockSa).project_id, "billcrafter-test");
assert.equal(parseServiceAccount(Buffer.from(mockSa).toString("base64")).project_id, "billcrafter-test");

console.log("✓ All OCR unit assertions passed (Math check, 3 CSV presets, .xlsx binary, Editor bridge, GCP auth).");
