// Pure-Node OG image generator for vertical landing pages using Next's built-in
// `next/og.js` (Satori + resvg WASM) — zero Python/Cairo dependencies.
//
// Usage:
//   node scripts/render-og-verticals.mjs                          # render all verticals
//   node scripts/render-og-verticals.mjs receipt-maker quote-generator
import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og.js";
import { VERTICALS } from "../lib/seo.js";
import { SCENARIOS, TYPES, computeTotals, CURRENCIES } from "../lib/invoice.js";

const BONE = "#F3F3EE";
const INK = "#2D2F33";
const MUT = "#6B6F76";
const FAINT = "#90969E";
const RED = "#F43E01";

const CLIENTS = {
  freelance: "Northwind Co.", contractor: "The Delgado Residence", consulting: "Acme Holdings",
  photography: "Sarah & Tom Chen", videography: "Lumen Media", design: "Fable Studio",
  cleaning: "Cedar Park Offices", smallbusiness: "Riverbend Cafe", plumbing: "M. Okafor",
  hvac: "Bright Valley HOA", retail: "Walk-in customer", rent: "Unit 4B — J. Park",
  tutoring: "The Nguyen Family", catering: "Vertex Corp Events",
  receipt: "Northwind Co.", quote: "Apex Retail Group",
  contractorestimate: "The Alvarez Residence", rentreceipt: "Apt 4B — Jordan Park",
  designquote: "Lumen Skincare Co.",
};

const h = (type, props, ...children) => ({
  type,
  props: { ...(props || {}), children: children.length <= 1 ? children[0] : children },
});

const fmtMoney = (sym, n) =>
  `${sym}${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const trunc = (s, max) => {
  const str = String(s || "");
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
};

function buildCard(v) {
  const s = SCENARIOS[v.scenario] || SCENARIOS.freelance;
  const ty = TYPES[v.type] || TYPES.invoice;
  const items = (s.items || [])
    .filter((i) => i.section === undefined)
    .slice(0, 3)
    .map((i) => ({
      desc: trunc(i.desc, 30),
      amount: fmtMoney(CURRENCIES.USD, (i.qty || 0) * (i.rate || 0)),
    }));
  const totals = computeTotals(s.items || [], { taxRate: s.tax || 0 });
  const isReceipt = v.type === "receipt";
  const headline = v.h1.replace(/^Free\s+/i, "").replace(/^./, (c) => c.toUpperCase());
  const sub = v.sub.split("—")[0].split(".")[0].trim();

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
    // Left column
    h(
      "div",
      {
        style: {
          width: "540px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        // Brand row
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" } },
          h(
            "div",
            {
              style: {
                width: "36px",
                height: "42px",
                borderRadius: "7px",
                background: RED,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
              },
            },
            "$"
          ),
          h("div", { style: { fontSize: "26px", fontWeight: 700, color: INK, letterSpacing: "-0.02em" } }, "BillCrafter")
        ),
        // Eyebrow
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
          "100% FREE · NO SIGN-UP · INSTANT PDF"
        ),
        // Headline
        h(
          "div",
          {
            style: {
              fontSize: headline.length > 38 ? "42px" : "46px",
              fontWeight: 700,
              color: INK,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              marginBottom: "18px",
            },
          },
          headline
        ),
        // Sub
        h(
          "div",
          { style: { fontSize: "19px", color: MUT, lineHeight: 1.45 } },
          trunc(sub, 92)
        )
      ),
      // Bottom CTA + URL
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "18px" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "212px",
              height: "48px",
              borderRadius: "10px",
              background: INK,
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: 700,
            },
          },
          "Download free PDF →"
        ),
        h("div", { style: { fontSize: "15px", color: FAINT } }, "billcrafter.com · No watermark")
      )
    ),
    // Right column — miniature live document
    h(
      "div",
      {
        style: {
          width: "450px",
          height: "468px",
          marginTop: "24px",
          background: "#FFFFFF",
          borderRadius: "14px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 14px 32px rgba(0,0,0,0.08)",
          position: "relative",
        },
      },
      isReceipt
        ? h(
            "div",
            {
              style: {
                position: "absolute",
                top: "178px",
                left: "135px",
                transform: "rotate(-18deg)",
                border: "3px solid rgba(27,107,58,0.22)",
                borderRadius: "8px",
                padding: "4px 18px",
                color: "rgba(27,107,58,0.24)",
                fontSize: "38px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                display: "flex",
              },
            },
            "PAID"
          )
        : null,
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        // Doc header
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: "16px",
              borderBottom: "2px solid #16181C",
            },
          },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", borderLeft: `4px solid ${RED}`, paddingLeft: "10px" } },
            h("div", { style: { fontSize: "15px", fontWeight: 700, color: INK } }, trunc(s.name || "Your Business", 25)),
            h("div", { style: { fontSize: "11.5px", color: MUT, marginTop: "3px" } }, `#${ty.prefix}-0001`)
          ),
          h(
            "div",
            { style: { fontSize: "26px", fontWeight: 700, color: "#16181C", letterSpacing: "-0.02em" } },
            ty.word.toUpperCase()
          )
        ),
        // Party
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", marginTop: "16px" } },
          h("div", { style: { fontSize: "9.5px", fontWeight: 700, color: "#9AA0A6", letterSpacing: "0.08em" } }, ty.party.toUpperCase()),
          h("div", { style: { fontSize: "13.5px", fontWeight: 700, color: INK, marginTop: "3px" } }, CLIENTS[v.scenario] || "Northwind Co.")
        ),
        // Table head
        h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              paddingBottom: "6px",
              borderBottom: "1.5px solid #16181C",
              fontSize: "9.5px",
              fontWeight: 700,
              color: "#16181C",
              letterSpacing: "0.08em",
            },
          },
          h("span", null, "DESCRIPTION"),
          h("span", null, "AMOUNT")
        ),
        // Rows
        ...items.map((it) =>
          h(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #EEF0F2",
                fontSize: "12px",
                color: "#3F4348",
              },
            },
            h("span", null, it.desc),
            h("span", { style: { fontWeight: 600 } }, it.amount)
          )
        )
      ),
      // Doc footer total
      h(
        "div",
        { style: { display: "flex", justifyContent: "flex-end" } },
        h(
          "div",
          {
            style: {
              width: "225px",
              background: isReceipt ? "#1B6B3A" : "#16181C",
              color: "#FFFFFF",
              borderRadius: "7px",
              padding: "9px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
          },
          h("span", { style: { fontSize: "12px", fontWeight: 600 } }, isReceipt ? "Paid in full" : ty.total),
          h("span", { style: { fontSize: "14.5px", fontWeight: 700 } }, fmtMoney(CURRENCIES.USD, totals.total))
        )
      )
    )
  );
}

const filterSlugs = process.argv.slice(2);
const targets = filterSlugs.length
  ? VERTICALS.filter((v) => filterSlugs.includes(v.slug))
  : VERTICALS;

const outDir = path.resolve("public/og");
await fs.mkdir(outDir, { recursive: true });

for (const v of targets) {
  const res = new ImageResponse(buildCard(v), { width: 1200, height: 630 });
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(outDir, `${v.slug}.png`);
  await fs.writeFile(dest, buf);
  console.log(`rendered ${dest} (${buf.length} bytes)`);
}
