// QR generation for crypto payment blocks.
//
// Uses the battle-tested `qrcode-generator` library (bundled, not a CDN) so the
// QR renders synchronously and prints deterministically in the PDF. We verified
// its output decodes back to the original string for real TRON / ERC-20 / BTC
// addresses and payment URIs (opencv QRCodeDetector round-trip, 6/6).
//
// EC level "M" is a good trade-off for a wallet address: solid damage tolerance
// without bloating the code. Byte mode (auto) handles mixed-case addresses.
import qrcode from "qrcode-generator";

// Returns an SVG string for `text`. A 4-module quiet zone is included per spec so
// scanners lock on reliably. Draw it via dangerouslySetInnerHTML.
export function qrSvg(text, { size = 132, quiet = 4, fg = "#16181C", bg = "#ffffff" } = {}) {
  const data = String(text || "").trim();
  if (!data) return "";
  const qr = qrcode(0, "M");        // 0 = auto-pick the smallest fitting version
  qr.addData(data);
  qr.make();
  const n = qr.getModuleCount();
  const total = n + quiet * 2;
  const cell = size / total;
  let rects = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) {
        rects += `<rect x="${((c + quiet) * cell).toFixed(2)}" y="${((r + quiet) * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`;
}
