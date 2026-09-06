import { ImageResponse } from "next/og";

// Shared branded OG image generator for the pages that don't have a hand-made
// static image under /public/og (verticals and templates already do — see
// their generateMetadata()). Usage: /og?title=...&eyebrow=...
//
// Pure code-drawn card (brand colors from globals.css --brand/--brand-wash),
// no image assets required. Renders via next/og (Satori + resvg, WASM) — on
// Cloudflare via OpenNext this runs in the Workers runtime, which supports
// WASM natively. Worth a quick smoke check after deploy (fetch /og directly
// and confirm it returns a real PNG) since this is the one piece here that
// can't be verified from a sandboxed build.
// OpenNext bundles this route into the main Cloudflare Worker. Keeping it on
// the default Node-compatible runtime avoids a separate unsupported edge bundle.
export const runtime = "nodejs";

const BRAND = "#F43E01";
const INK = "#16181C";
const WASH = "#FDECE5";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Free invoice generator").slice(0, 120);
  const eyebrow = (searchParams.get("eyebrow") || "BillCrafter").slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: WASH,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 12, background: BRAND,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 28, fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>BillCrafter</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: BRAND, textTransform: "uppercase", letterSpacing: 3 }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, color: INK, lineHeight: 1.15, maxWidth: 980, display: "flex" }}>
            {title}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
