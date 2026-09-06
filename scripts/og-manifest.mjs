// Step 1 of OG image generation: read the real template / vertical / scenario
// data and emit a flat JSON manifest. Keeping this in Node means the images can
// never drift from lib/templates.js — regenerate and they follow.
//
// Usage: node scripts/og-manifest.mjs > /tmp/og-manifest.json
import { TEMPLATES } from "../lib/templates.js";
import { VERTICALS } from "../lib/seo.js";
import { SCENARIOS, TYPES, computeTotals, CURRENCIES } from "../lib/invoice.js";

const CLIENTS = {
  freelance: "Northwind Co.", contractor: "The Delgado Residence", consulting: "Acme Holdings",
  photography: "Sarah & Tom Chen", videography: "Lumen Media", design: "Fable Studio",
  cleaning: "Cedar Park Offices", smallbusiness: "Riverbend Cafe", plumbing: "M. Okafor",
  hvac: "Bright Valley HOA", retail: "Walk-in customer", rent: "Unit 4B — J. Park",
  tutoring: "The Nguyen Family", catering: "Vertex Corp Events",
};

function docFor(scenarioKey, typeKey) {
  const s = SCENARIOS[scenarioKey] || SCENARIOS.freelance;
  const ty = TYPES[typeKey] || TYPES.invoice;
  // Section header rows ({section:"Labor"}) carry no qty/rate — skip them here,
  // the OG card only has room for plain item lines anyway.
  const items = (s.items || []).filter((i) => i.section === undefined).slice(0, 3).map((i) => ({
    desc: i.desc, detail: i.detail || "", qty: i.qty, rate: i.rate,
    amount: (i.qty || 0) * (i.rate || 0),
  }));
  const totals = computeTotals(s.items || [], { taxRate: s.tax || 0 });
  return {
    word: ty.word, party: ty.party, totalLabel: ty.total, prefix: ty.prefix,
    from: s.name || "Your business",
    client: CLIENTS[scenarioKey] || "Northwind Co.",
    items, total: totals.total, subtotal: totals.subtotal,
    taxRate: s.tax || 0, taxAmt: totals.taxAmt,
    symbol: CURRENCIES.USD,
  };
}

const out = [];

for (const t of TEMPLATES) {
  out.push({
    kind: "template",
    file: `templates/${t.slug}.png`,
    eyebrow: `${t.group} · ${(TYPES[t.docType] || TYPES.invoice).word} template`,
    title: t.name,
    sub: t.blurb,
    style: t.style,
    accent: t.accent,
    doc: docFor(t.scenario, t.docType),
  });
}

for (const v of VERTICALS) {
  out.push({
    kind: "vertical",
    file: `${v.slug}.png`,
    eyebrow: "Free · no signup to download",
    title: v.h1.replace(/^Free /, "").replace(/^./, (c) => c.toUpperCase()),
    sub: v.sub.split("—")[0].split(".")[0].trim(),
    style: v.type === "estimate" || v.type === "quote" ? "minimal" : "modern",
    accent: "#16181C",
    doc: docFor(v.scenario, v.type),
  });
}

process.stdout.write(JSON.stringify(out, null, 0));
