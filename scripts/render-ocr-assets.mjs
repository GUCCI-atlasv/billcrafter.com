// Pure-Node visual asset generator for BillCrafter's Receipt & Invoice OCR suite.
// Uses Next.js's built-in `next/og.js` (Satori + resvg WASM) — zero Python/Cairo needed.
//
// Generates:
//   - public/samples/sample-coffee-receipt.png
//   - public/samples/sample-hardware-invoice.png
//   - public/samples/sample-consulting-invoice.png
//   - public/anatomy/ocr-scanner.png          (1040x720)
//   - public/steps/ocr-step-1..3.png          (720x460)
//   - public/og/invoice-ocr-scanner.png       (1200x630)
//   - public/og/receipt-to-csv-converter.png  (1200x630)
//   - public/og/invoice-to-excel-converter.png(1200x630)
//   - public/og/best-free-invoice-ocr-software.png (1200x630)
//   - public/og/how-to-scan-receipts-to-excel.png  (1200x630)

import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og.js";

const BONE = "#F3F3EE";
const INK = "#2D2F33";
const MUT = "#6B6F76";
const FAINT = "#90969E";
const RED = "#F43E01";
const WASH = "#FDECE5";
const OK_BG = "#E7F4EC";
const OK_INK = "#1B6B3A";

const h = (type, props, ...children) => {
  const flat = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  return {
    type,
    props: {
      ...(props || {}),
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
};

async function renderPng(vnode, width, height, relPath) {
  const dest = path.resolve(relPath);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const res = new ImageResponse(vnode, { width, height });
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  console.log(`rendered ${relPath} (${buf.length} bytes)`);
}

// ----------------------------------------------------------------------------
// 1. Synthetic Sample Bills (public/samples/*)
// ----------------------------------------------------------------------------

function buildCoffeeReceipt() {
  const rows = [
    ["2x Flat White (12oz, Oat)", "$11.50"],
    ["1x Cold Brew Single Origin", "$5.25"],
    ["2x Almond Croissant", "$9.00"],
    ["1x Avocado Sourdough Toast", "$13.50"],
  ];
  return h(
    "div",
    {
      style: {
        width: "640px",
        height: "860px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E5E4DD",
        fontFamily: "monospace",
      },
    },
    h(
      "div",
      {
        style: {
          width: "490px",
          background: "#FAF8F2",
          border: "1px solid #D6D3C9",
          borderRadius: "6px",
          padding: "38px 36px",
          display: "flex",
          flexDirection: "column",
          color: "#22252A",
          boxShadow: "0 16px 36px rgba(0,0,0,0.12)",
        },
      },
      h("div", { style: { fontSize: "23px", fontWeight: 700, textAlign: "center" } }, "ROAST & CO. CRAFT COFFEE"),
      h("div", { style: { fontSize: "13px", color: "#5F6368", textAlign: "center", marginTop: "6px" } }, "412 Congress Ave, Austin, TX 78701"),
      h("div", { style: { fontSize: "13px", color: "#5F6368", textAlign: "center", marginTop: "2px" } }, "Tel: (512) 555-0194 · Reg #TX-88412"),
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "22px",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderTop: "1px dashed #B8B5AA",
            borderBottom: "1px dashed #B8B5AA",
            fontSize: "13px",
          },
        },
        h("span", null, "Order: CHK-4092"),
        h("span", null, "Date: 2026-11-08 08:42")
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "18px", paddingBottom: "18px", borderBottom: "1px dashed #B8B5AA" } },
        ...rows.map(([l, r]) =>
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", fontSize: "15px" } },
            h("span", null, l),
            h("span", { style: { fontWeight: 700 } }, r)
          )
        )
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "18px", fontSize: "15px" } },
        h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "SUBTOTAL"), h("span", null, "$39.25")),
        h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "SALES TAX (8.25%)"), h("span", null, "$3.24")),
        h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "TIP / GRATUITY"), h("span", null, "$7.85")),
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              paddingTop: "12px",
              borderTop: "2px solid #22252A",
              fontSize: "21px",
              fontWeight: 700,
            },
          },
          h("span", null, "TOTAL PAID"),
          h("span", null, "$50.34")
        )
      ),
      h(
        "div",
        { style: { marginTop: "24px", fontSize: "13px", color: "#5F6368", display: "flex", justifyContent: "space-between" } },
        h("span", null, "PAID: VISA *4242 (CONTACTLESS)"),
        h("span", null, "AUTH #09412C")
      ),
      h("div", { style: { marginTop: "22px", fontSize: "12px", color: "#85898E", textAlign: "center" } }, "*** CUSTOMER COPY · THANK YOU ***")
    )
  );
}

function buildInvoiceFixture({ titleWord, biz, bizSub, client, clientSub, invNo, issue, due, po, lines, sub, taxLabel, taxAmt, total }) {
  return h(
    "div",
    {
      style: {
        width: "820px",
        height: "960px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E8E8E1",
        fontFamily: "sans-serif",
      },
    },
    h(
      "div",
      {
        style: {
          width: "720px",
          height: "860px",
          background: "#FFFFFF",
          borderRadius: "10px",
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#16181C",
          boxShadow: "0 16px 36px rgba(0,0,0,0.10)",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", paddingBottom: "20px", borderBottom: "3px solid #16181C" } },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h("div", { style: { fontSize: "22px", fontWeight: 700 } }, biz),
            h("div", { style: { fontSize: "13px", color: "#5F6368", marginTop: "5px" } }, bizSub)
          ),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } },
            h("div", { style: { fontSize: "30px", fontWeight: 700, letterSpacing: "-0.02em" } }, titleWord),
            h("div", { style: { fontSize: "13px", color: "#5F6368", marginTop: "4px" } }, `#${invNo}`)
          )
        ),
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", marginTop: "24px" } },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h("div", { style: { fontSize: "11px", fontWeight: 700, color: "#8B9198", letterSpacing: "0.08em" } }, "BILL TO"),
            h("div", { style: { fontSize: "16px", fontWeight: 700, marginTop: "4px" } }, client),
            h("div", { style: { fontSize: "13px", color: "#5F6368", marginTop: "3px" } }, clientSub)
          ),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", fontSize: "13px" } },
            h("div", null, `Issued: ${issue}`),
            h("div", null, `Due: ${due}`),
            po ? h("div", { style: { fontWeight: 700 } }, `PO #: ${po}`) : null
          )
        ),
        // Table head
        h(
          "div",
          {
            style: {
              display: "flex",
              marginTop: "30px",
              padding: "10px 12px",
              background: "#16181C",
              color: "#FFFFFF",
              fontSize: "11.5px",
              fontWeight: 700,
              borderRadius: "5px",
            },
          },
          h("span", { style: { width: "330px" } }, "DESCRIPTION"),
          h("span", { style: { width: "70px", textAlign: "right" } }, "QTY"),
          h("span", { style: { width: "110px", textAlign: "right" } }, "RATE"),
          h("span", { style: { width: "114px", textAlign: "right" } }, "AMOUNT")
        ),
        ...lines.map(([desc, detail, qty, rate, amt]) =>
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                padding: "13px 12px",
                borderBottom: "1px solid #EAECEF",
                fontSize: "14px",
              },
            },
            h(
              "div",
              { style: { width: "330px", display: "flex", flexDirection: "column" } },
              h("span", { style: { fontWeight: 600 } }, desc),
              h("span", { style: { fontSize: "12px", color: "#6B7280", marginTop: "2px" } }, detail)
            ),
            h("span", { style: { width: "70px", textAlign: "right" } }, qty),
            h("span", { style: { width: "110px", textAlign: "right" } }, rate),
            h("span", { style: { width: "114px", textAlign: "right", fontWeight: 700 } }, amt)
          )
        )
      ),
      h(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "20px", borderTop: "1px solid #EAECEF" } },
        h("div", { style: { fontSize: "12.5px", color: "#6B7280", maxWidth: "330px" } }, "Synthetic test fixture generated by BillCrafter for OCR benchmarking."),
        h(
          "div",
          { style: { width: "260px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "Subtotal"), h("span", null, sub)),
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, taxLabel), h("span", null, taxAmt)),
          h(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "#16181C",
                color: "#FFFFFF",
                borderRadius: "6px",
                fontSize: "17px",
                fontWeight: 700,
              },
            },
            h("span", null, "Total Due"),
            h("span", null, total)
          )
        )
      )
    )
  );
}

// ----------------------------------------------------------------------------
// 2. OCR Extraction Anatomy Diagram (public/anatomy/ocr-scanner.png 1040x720)
// ----------------------------------------------------------------------------

function buildOcrAnatomy() {
  const badges = [
    ["1", "Vendor & Tax ID (EIN / VAT / GST)"],
    ["2", "Invoice # & ISO 8601 Dates"],
    ["3", "Itemized Qty × Unit Rate Rows"],
    ["4", "Separated Tax & Tip Columns"],
    ["5", "Auto Math-Verified Total"],
  ];

  return h(
    "div",
    {
      style: {
        width: "1040px",
        height: "720px",
        background: BONE,
        padding: "46px 52px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "sans-serif",
      },
    },
    // Left paper bill with callout pills
    h(
      "div",
      {
        style: {
          width: "430px",
          height: "610px",
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 14px 32px rgba(45,47,51,0.08)",
          border: "1px solid rgba(45,47,51,0.12)",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px" } },
            h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: RED, color: "#fff", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "1"),
            h("span", { style: { fontSize: "16px", fontWeight: 700, color: INK } }, "Summit Supply LLC")
          ),
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "6px" } },
            h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: RED, color: "#fff", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "2"),
            h("span", { style: { fontSize: "13px", color: MUT } }, "#SBS-1184 · 2026-11-10")
          )
        ),
        h("div", { style: { height: "3px", background: RED, borderRadius: "2px" } }),
        h(
          "div",
          { style: { background: "#FAFAF7", border: "1px dashed #D0D4DA", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" } },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px" } },
            h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: RED, color: "#fff", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "3"),
            h("span", { style: { fontSize: "12px", fontWeight: 700, color: MUT, letterSpacing: "0.06em" } }, "LINE ITEMS TABLE")
          ),
          h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: INK } }, h("span", null, "Birch Plywood 4x8 (6 × $58)"), h("strong", null, "$348.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: INK } }, h("span", null, "Interior Eggshell 5Gal (2 × $142.50)"), h("strong", null, "$285.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: INK } }, h("span", null, "Copper Tee Pack (3 × $34)"), h("strong", null, "$102.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: INK } }, h("span", null, "Boom Delivery (Exempt)"), h("strong", null, "$65.00"))
        ),
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" } },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "8px" } },
            h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: RED, color: "#fff", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "4"),
            h("span", { style: { fontSize: "13.5px", color: MUT } }, "Sales Tax (8.0% on materials)")
          ),
          h("strong", { style: { fontSize: "14px", color: INK } }, "$58.80")
        )
      ),
      h(
        "div",
        { style: { background: OK_BG, borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "8px" } },
          h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: RED, color: "#fff", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, "5"),
          h("span", { style: { width: "8px", height: "8px", borderRadius: "99px", background: OK_INK } }),
          h("span", { style: { fontSize: "14px", fontWeight: 700, color: OK_INK } }, "Math Verified Total")
        ),
        h("span", { style: { fontSize: "19px", fontWeight: 700, color: OK_INK } }, "$858.80")
      )
    ),

    // Right column: Legend + Structured Excel/CSV Output Card
    h(
      "div",
      {
        style: {
          width: "465px",
          height: "610px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        h("div", { style: { fontSize: "12px", fontWeight: 700, color: RED, letterSpacing: "0.12em" } }, "STRUCTURED AI VISION EXTRACTION"),
        h("div", { style: { fontSize: "26px", fontWeight: 700, color: INK, lineHeight: 1.2 } }, "Mapped straight into Excel, CSV & PDF columns"),
        ...badges.map(([num, text]) =>
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#FFFFFF",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(45,47,51,0.10)",
              },
            },
            h("span", { style: { width: "24px", height: "24px", borderRadius: "99px", background: WASH, color: RED, fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, num),
            h("span", { style: { fontSize: "14.5px", fontWeight: 600, color: INK } }, text)
          )
        )
      ),
      h(
        "div",
        {
          style: {
            background: INK,
            color: "#FFFFFF",
            borderRadius: "12px",
            padding: "18px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "4px" } },
          h("span", { style: { fontSize: "14px", fontWeight: 700 } }, "Ready for instant export"),
          h("span", { style: { fontSize: "12px", color: "#A9ADB4" } }, "UTF-8 CSV · 2-Sheet .xlsx (=SUM) · Vector PDF")
        ),
        h("span", { style: { background: RED, color: "#fff", padding: "7px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 } }, "No Sign-Up")
      )
    )
  );
}

// ----------------------------------------------------------------------------
// 3. Three Step Illustrations (public/steps/ocr-step-1..3.png 720x460)
// ----------------------------------------------------------------------------

function buildStepCard(stepNum, kicker, headline, rows, badgeText) {
  return h(
    "div",
    {
      style: {
        width: "720px",
        height: "460px",
        background: BONE,
        padding: "38px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      },
    },
    h(
      "div",
      {
        style: {
          width: "632px",
          height: "384px",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid rgba(45,47,51,0.12)",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 10px 26px rgba(45,47,51,0.07)",
        },
      },
      h(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
        h("span", { style: { fontSize: "12px", fontWeight: 700, color: RED, letterSpacing: "0.1em" } }, `STEP 0${stepNum} · ${kicker}`),
        h("span", { style: { background: stepNum === 2 ? OK_BG : WASH, color: stepNum === 2 ? OK_INK : RED, padding: "5px 12px", borderRadius: "99px", fontSize: "12.5px", fontWeight: 700 } }, badgeText)
      ),
      h("div", { style: { fontSize: "24px", fontWeight: 700, color: INK } }, headline),
      h(
        "div",
        { style: { background: "#FAFAF7", borderRadius: "10px", padding: "16px 18px", border: "1px solid #E7E7E0", display: "flex", flexDirection: "column", gap: "10px" } },
        ...rows.map(([left, right]) =>
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", fontSize: "15px", color: INK } },
            h("span", { style: { color: MUT } }, left),
            h("strong", null, right)
          )
        )
      )
    )
  );
}

// ----------------------------------------------------------------------------
// 4. OpenGraph Cards for New OCR & Guide Routes (1200x630)
// ----------------------------------------------------------------------------

function buildOgCard({ eyebrow, headline, sub, cta }) {
  return h(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        background: BONE,
        borderTop: `6px solid ${RED}`,
        padding: "58px 72px",
        fontFamily: "sans-serif",
      },
    },
    h(
      "div",
      {
        style: {
          width: "590px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "38px" } },
          h(
            "div",
            {
              style: {
                width: "38px",
                height: "42px",
                borderRadius: "8px",
                background: RED,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
              },
            },
            "AI"
          ),
          h("div", { style: { fontSize: "26px", fontWeight: 700, color: INK } }, "BillCrafter")
        ),
        h(
          "div",
          {
            style: {
              fontSize: "13px",
              fontWeight: 700,
              color: RED,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: "14px",
            },
          },
          eyebrow
        ),
        h(
          "div",
          {
            style: {
              fontSize: "44px",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.13,
              letterSpacing: "-0.03em",
              marginBottom: "18px",
            },
          },
          headline
        ),
        h("div", { style: { fontSize: "19px", color: MUT, lineHeight: 1.45 } }, sub)
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "16px" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "256px",
              height: "48px",
              borderRadius: "10px",
              background: INK,
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 700,
            },
          },
          cta
        ),
        h("div", { style: { fontSize: "15px", color: FAINT } }, "billcrafter.com · 100% Free · Zero Watermark")
      )
    ),

    // Right preview card showing Photo/PDF -> CSV/Excel extraction
    h(
      "div",
      {
        style: {
          width: "410px",
          height: "476px",
          marginTop: "20px",
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 14px 32px rgba(0,0,0,0.08)",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          h("span", { style: { fontSize: "12px", fontWeight: 700, color: RED } }, "EXTRACTED TABLE"),
          h("span", { style: { background: OK_BG, color: OK_INK, padding: "4px 10px", borderRadius: "99px", fontSize: "11.5px", fontWeight: 700 } }, "Math Verified")
        ),
        h("div", { style: { height: "2px", background: INK } }),
        h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: MUT } }, h("span", null, "Vendor"), h("strong", { style: { color: INK } }, "Summit Builders LLC")),
        h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: MUT } }, h("span", null, "Invoice #"), h("strong", { style: { color: INK } }, "SBS-2026-1184")),
        h(
          "div",
          { style: { marginTop: "8px", paddingTop: "10px", borderTop: "1px solid #EAECEF", display: "flex", flexDirection: "column", gap: "9px", fontSize: "13px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "Birch Plywood (6 × $58)"), h("strong", null, "$348.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "Interior Paint 5Gal (2x)"), h("strong", null, "$285.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "Copper Tee Pack (3x)"), h("strong", null, "$102.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between" } }, h("span", null, "Boom Delivery (Exempt)"), h("strong", null, "$65.00")),
          h("div", { style: { display: "flex", justifyContent: "space-between", color: MUT } }, h("span", null, "Sales Tax (8.0%)"), h("span", null, "$58.80"))
        )
      ),
      h(
        "div",
        {
          style: {
            background: INK,
            color: "#FFFFFF",
            borderRadius: "9px",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
        },
          h("span", { style: { fontSize: "13px", fontWeight: 600 } }, "CSV  |  Excel (.xlsx)  |  PDF"),
        h("span", { style: { fontSize: "16px", fontWeight: 700 } }, "$858.80")
      )
    )
  );
}

// Run all renders
await renderPng(buildCoffeeReceipt(), 640, 860, "public/samples/sample-coffee-receipt.png");

await renderPng(
  buildInvoiceFixture({
    titleWord: "INVOICE",
    biz: "Summit Builders Supply LLC",
    bizSub: "1890 Industrial Pkwy, Denver, CO 80216 · EIN 84-3920114",
    client: "BrightHome Remodeling",
    clientSub: "Job site: 1420 S Emerson St, Denver, CO 80210",
    invNo: "SBS-2026-1184",
    issue: "2026-11-10",
    due: "2026-11-24",
    po: "PO-EMERSON-04",
    lines: [
      ['3/4" Birch Plywood Sheet (4x8)', "Cabinetry backing · Taxed", "6", "$58.00", "$348.00"],
      ["Behr Pro Interior Eggshell (5 Gal)", "Warm Bone #N210-1 · Taxed", "2", "$142.50", "$285.00"],
      ['Copper Press Tee 3/4" Pack (10ct)', "Plumbing rough-in · Taxed", "3", "$34.00", "$102.00"],
      ["Job-site Boom Delivery & Unload", "Delivery service · Tax Exempt", "1", "$65.00", "$65.00"],
    ],
    sub: "$800.00",
    taxLabel: "Sales Tax (8.0% on $735)",
    taxAmt: "$58.80",
    total: "$858.80",
  }),
  820,
  960,
  "public/samples/sample-hardware-invoice.png"
);

await renderPng(
  buildInvoiceFixture({
    titleWord: "INVOICE",
    biz: "Meridian Digital Advisory Inc.",
    bizSub: "548 Market St, San Francisco, CA 94104 · EIN 94-7710290",
    client: "Northwind Logistics Corp.",
    clientSub: "Accounts Payable · 900 Lakefront Dr, Chicago, IL 60611",
    invNo: "INV-2026-0204",
    issue: "2026-11-01",
    due: "2026-12-01",
    po: "NW-PO-9931",
    lines: [
      ["Data warehouse architecture audit", "2026-10-08 · Principal Consultant", "12.0", "$195.00", "$2,340.00"],
      ["ETL pipeline migration & benchmark", "2026-10-16 · Data Engineer", "18.5", "$140.00", "$2,590.00"],
      ["Executive security readout & runbook", "2026-10-27 · Fixed milestone", "1", "$1,250.00", "$1,250.00"],
      ["Cloud staging cluster (pass-through)", "2026-10-29 · Reimbursable usage", "1", "$184.50", "$184.50"],
    ],
    sub: "$6,364.50",
    taxLabel: "Sales Tax (0%)",
    taxAmt: "$0.00",
    total: "$6,364.50",
  }),
  820,
  960,
  "public/samples/sample-consulting-invoice.png"
);

await renderPng(buildOcrAnatomy(), 1040, 720, "public/anatomy/ocr-scanner.png");

await renderPng(
  buildStepCard(
    1,
    "UPLOAD OR SNAP",
    "Drop PDFs, snap receipt photos, or paste Ctrl+V",
    [
      ["Input formats", "PDF · JPG · PNG · WebP · Clipboard"],
      ["Mobile support", "Direct rear-camera capture in browser"],
      ["Privacy", "Memory-only · Zero model training"],
    ],
    "3 Free Guest Scans / Day"
  ),
  720,
  460,
  "public/steps/ocr-step-1.png"
);

await renderPng(
  buildStepCard(
    2,
    "SIDE-BY-SIDE VERIFICATION",
    "Inspect itemized lines with instant math check",
    [
      ["Extracted Subtotal (4 items)", "$800.00"],
      ["Extracted Sales Tax (8.0%)", "$58.80"],
      ["Printed Total vs. Sum", "$858.80 == $858.80"],
    ],
    "Math Verified"
  ),
  720,
  460,
  "public/steps/ocr-step-2.png"
);

await renderPng(
  buildStepCard(
    3,
    "MULTI-FORMAT EXPORT",
    "Download Excel (.xlsx), CSV, or Client PDF",
    [
      ["Excel Workbook (.xlsx)", "Summary + Line Items (=SUM)"],
      ["UTF-8 BOM CSV", "Itemized · Expense Ledger · QBO/Xero"],
      ["Invoice Editor Bridge", "Bill reimbursable receipts as PDF"],
    ],
    "Zero Watermarks"
  ),
  720,
  460,
  "public/steps/ocr-step-3.png"
);

const ogSpecs = [
  {
    file: "public/og/invoice-ocr-scanner.png",
    eyebrow: "AI INVOICE & RECEIPT OCR · NO SIGN-UP",
    headline: "Free Invoice OCR Scanner to Excel & CSV",
    sub: "Extract vendor details, line items, tax, and math-verified totals from PDFs or photos in 2 seconds.",
    cta: "Scan Invoice Free →",
  },
  {
    file: "public/og/receipt-to-csv-converter.png",
    eyebrow: "BATCH EXPENSE SCANNER · 100% FREE",
    headline: "Receipt Photo to CSV & Excel Converter",
    sub: "Snap crumpled paper receipts on your phone or drag photos to export a clean UTF-8 expense ledger.",
    cta: "Convert Receipts Free →",
  },
  {
    file: "public/og/invoice-to-excel-converter.png",
    eyebrow: "TWO-SHEET .XLSX WORKBOOK · =SUM FORMULAS",
    headline: "Convert PDF & Image Invoices to Excel",
    sub: "Turn locked digital or scanned PDF invoices into formatted Microsoft Excel sheets instantly.",
    cta: "Download .xlsx Free →",
  },
  {
    file: "public/og/best-free-invoice-ocr-software.png",
    eyebrow: "2026 HANDS-ON BENCHMARK · 7 TOOLS TESTED",
    headline: "7 Best Free Invoice OCR Software (Tested)",
    sub: "Real accuracy scores on thermal receipts, contractor bills & B2B PDFs — with a live browser sandbox.",
    cta: "Read 2026 Benchmark →",
  },
  {
    file: "public/og/how-to-scan-receipts-to-excel.png",
    eyebrow: "STEP-BY-STEP GUIDE · NO APP NEEDED",
    headline: "How to Scan Receipt Photos to CSV & Excel",
    sub: "Turn a stack of phone receipt photos into one clean expense report without manual data entry.",
    cta: "Try Live Workflow →",
  },
];

for (const spec of ogSpecs) {
  await renderPng(buildOgCard(spec), 1200, 630, spec.file);
}
