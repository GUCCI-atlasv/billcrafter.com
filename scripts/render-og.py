#!/usr/bin/env python3
"""Step 2 of OG image generation: turn the manifest into 1200x630 PNGs.

Each image pairs the page's headline with a miniature of the *actual* document,
drawn in that template's layout style — so a "band" template's card really shows
a colour band, and an "elegant" one really shows a centred serif masthead.

Usage:
    node scripts/og-manifest.mjs > /tmp/og-manifest.json
    python3 scripts/render-og.py /tmp/og-manifest.json public/og
"""
import json, os, sys, html
import cairosvg
from PIL import Image

BONE, INK, MUT, FAINT, RED = "#F3F3EE", "#2D2F33", "#6B6F76", "#90969E", "#F43E01"
F = "Montserrat,Poppins,Helvetica,Arial,sans-serif"
SERIF = "Georgia,'Times New Roman',serif"
MONO = "'DejaVu Sans Mono',Consolas,monospace"

DOC = "M15 6 h14 l7 7 v27 a2 2 0 0 1-2 2 H15 a2 2 0 0 1-2-2 V8 a2 2 0 0 1 2-2 Z"
FOLD = "M29 6 v7 h7"

def esc(s):
    return html.escape(str(s or ""), quote=True)

def money(sym, n):
    return f"{sym}{n:,.2f}"

def trunc(s, n):
    s = str(s or "")
    return s if len(s) <= n else s[: n - 1] + "…"

def wrap(text, width):
    """Naive word wrap -> list of lines."""
    words, lines, cur = str(text or "").split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if len(t) <= width:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines

def mini_doc(e, x, y, w, h):
    """The miniature invoice, drawn per style."""
    d, style, acc = e["doc"], e["style"], e["accent"]
    sym = d["symbol"]
    fam = SERIF if style in ("elegant", "classic") else (MONO if style == "mono" else F)
    p = 26                      # inner padding
    cx = x + w / 2
    out = []

    # card + shadow
    out.append(f'<rect x="{x+7}" y="{y+9}" width="{w}" height="{h}" rx="12" fill="#000" opacity="0.07"/>')
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#FFFFFF"/>')

    top = y + p
    if style == "band":
        out.append(f'<path d="M{x} {y+12} h{w} v18 h-{w} Z" fill="{acc}"/>')
        out.append(f'<rect x="{x}" y="{y}" width="{w}" height="14" rx="12" fill="{acc}"/>')
        top = y + p + 22

    if style == "elegant":
        out.append(f'<text x="{cx}" y="{top+16}" font-family="{fam}" font-size="15" font-weight="600" fill="{INK}" text-anchor="middle">{esc(trunc(d["from"],28))}</text>')
        out.append(f'<text x="{cx}" y="{top+46}" font-family="{fam}" font-size="26" fill="{acc}" text-anchor="middle" letter-spacing="5">{esc(d["word"].upper())}</text>')
        out.append(f'<rect x="{x+p}" y="{top+60}" width="{w-2*p}" height="1" fill="#D7D2C6"/>')
        head = top + 92
    else:
        # left: business, right: document word
        if style == "modern":
            out.append(f'<rect x="{x+p}" y="{top-2}" width="4" height="34" fill="{acc}"/>')
            bx = x + p + 14
        else:
            bx = x + p
        out.append(f'<text x="{bx}" y="{top+14}" font-family="{fam}" font-size="15" font-weight="600" fill="{INK}">{esc(trunc(d["from"],26))}</text>')
        out.append(f'<text x="{bx}" y="{top+32}" font-family="{fam}" font-size="11" fill="{MUT}">{esc(d["prefix"])}-0042</text>')

        wordsize = 30 if style != "compact" else 24
        if style == "band":
            tw = len(d["word"]) * wordsize * 0.62 + 22
            out.append(f'<rect x="{x+w-p-tw}" y="{top-6}" width="{tw}" height="{wordsize+10}" rx="6" fill="{acc}"/>')
            out.append(f'<text x="{x+w-p-11}" y="{top+wordsize-6}" font-family="{fam}" font-size="{wordsize}" font-weight="600" fill="#FFFFFF" text-anchor="end">{esc(d["word"].upper())}</text>')
        else:
            col = INK if style in ("ruled", "minimal") else acc
            out.append(f'<text x="{x+w-p}" y="{top+wordsize-4}" font-family="{fam}" font-size="{wordsize}" font-weight="600" fill="{col}" text-anchor="end" letter-spacing="-0.5">{esc(d["word"].upper())}</text>')

        rule_y = top + 48
        if style == "ruled":
            out.append(f'<rect x="{x+p}" y="{rule_y}" width="{w-2*p}" height="3" fill="{INK}"/>')
        elif style == "minimal":
            out.append(f'<rect x="{x+p}" y="{rule_y}" width="{w-2*p}" height="1" fill="#E6E8EB"/>')
        elif style != "modern":
            out.append(f'<rect x="{x+p}" y="{rule_y}" width="{w-2*p}" height="2" fill="{acc}"/>')
        head = rule_y + 26

    # bill-to
    out.append(f'<text x="{x+p}" y="{head}" font-family="{fam}" font-size="9.5" fill="#9AA0A6" letter-spacing="1">{esc(d["party"].upper())}</text>')
    out.append(f'<text x="{x+p}" y="{head+17}" font-family="{fam}" font-size="13" font-weight="600" fill="{INK}">{esc(trunc(d["client"],26))}</text>')

    # table header
    th = head + 40
    if style in ("modern", "classic", "elegant"):
        out.append(f'<rect x="{x+p}" y="{th+13}" width="{w-2*p}" height="2" fill="{acc}"/>')
        out.append(f'<text x="{x+p}" y="{th+6}" font-family="{fam}" font-size="9" fill="{acc}" letter-spacing="1">DESCRIPTION</text>')
        out.append(f'<text x="{x+w-p}" y="{th+6}" font-family="{fam}" font-size="9" fill="{acc}" text-anchor="end" letter-spacing="1">AMOUNT</text>')
    elif style == "ruled":
        out.append(f'<rect x="{x+p}" y="{th+13}" width="{w-2*p}" height="2" fill="{INK}"/>')
        out.append(f'<text x="{x+p}" y="{th+6}" font-family="{fam}" font-size="9" fill="{INK}" letter-spacing="1">DESCRIPTION</text>')
        out.append(f'<text x="{x+w-p}" y="{th+6}" font-family="{fam}" font-size="9" fill="{INK}" text-anchor="end" letter-spacing="1">AMOUNT</text>')
    else:
        bg = "#F1F3F5" if style == "minimal" else acc
        fg = "#33373B" if style == "minimal" else "#FFFFFF"
        out.append(f'<rect x="{x+p}" y="{th-9}" width="{w-2*p}" height="22" fill="{bg}"/>')
        out.append(f'<text x="{x+p+8}" y="{th+6}" font-family="{fam}" font-size="9" fill="{fg}" letter-spacing="1">DESCRIPTION</text>')
        out.append(f'<text x="{x+w-p-8}" y="{th+6}" font-family="{fam}" font-size="9" fill="{fg}" text-anchor="end" letter-spacing="1">AMOUNT</text>')

    # rows
    row_h = 26 if style != "compact" else 20
    ry = th + 34
    for i, it in enumerate(d["items"][:3]):
        if style == "modern" and i % 2 == 0:
            out.append(f'<rect x="{x+p}" y="{ry-14}" width="{w-2*p}" height="{row_h}" fill="#FAFAFB"/>')
        out.append(f'<text x="{x+p+(8 if style not in ("modern","ruled","classic","elegant","minimal") else 0)}" y="{ry}" font-family="{fam}" font-size="11.5" fill="#3F4348">{esc(trunc(it["desc"],30))}</text>')
        out.append(f'<text x="{x+w-p-(8 if style not in ("modern","ruled","classic","elegant","minimal") else 0)}" y="{ry}" font-family="{fam}" font-size="11.5" fill="#3F4348" text-anchor="end">{esc(money(sym,it["amount"]))}</text>')
        if style == "ruled":
            out.append(f'<rect x="{x+p}" y="{ry+8}" width="{w-2*p}" height="1" fill="#C9CDD2"/>')
        elif style not in ("modern",):
            out.append(f'<rect x="{x+p}" y="{ry+8}" width="{w-2*p}" height="1" fill="#EEF0F2"/>')
        ry += row_h

    # total
    ty_ = y + h - 46
    if style == "modern":
        bw = (w - 2 * p) * 0.52
        out.append(f'<rect x="{x+w-p-bw}" y="{ty_-22}" width="{bw}" height="34" rx="6" fill="{acc}"/>')
        out.append(f'<text x="{x+w-p-bw+12}" y="{ty_}" font-family="{fam}" font-size="12" font-weight="600" fill="#FFFFFF">{esc(d["totalLabel"])}</text>')
        out.append(f'<text x="{x+w-p-12}" y="{ty_}" font-family="{fam}" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="end">{esc(money(sym,d["total"]))}</text>')
    else:
        out.append(f'<rect x="{x+w-p-190}" y="{ty_-20}" width="190" height="2" fill="{acc if style not in ("ruled","minimal") else INK}"/>')
        out.append(f'<text x="{x+w-p-190}" y="{ty_+2}" font-family="{fam}" font-size="12" font-weight="600" fill="{INK}">{esc(d["totalLabel"])}</text>')
        out.append(f'<text x="{x+w-p}" y="{ty_+2}" font-family="{fam}" font-size="15" font-weight="700" fill="{acc if style not in ("ruled","minimal") else INK}" text-anchor="end">{esc(money(sym,d["total"]))}</text>')

    return "\n".join(out)

def build_svg(e):
    title_lines = wrap(e["title"], 22)[:3]
    sub_lines = wrap(e["sub"], 40)[:2]
    ty = 232
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
        f'<rect width="1200" height="630" fill="{BONE}"/>',
        f'<rect width="1200" height="6" fill="{RED}"/>',
        # brand lockup
        f'<g transform="translate(80,66) scale(0.92)">',
        f'<path d="{DOC}" fill="{RED}"/>',
        f'<path d="{FOLD}" fill="none" stroke="#FFFFFF" stroke-width="2"/>',
        f'<rect x="18" y="18" width="13" height="2.3" rx="1.1" fill="#FFFFFF"/>',
        f'<rect x="18" y="23" width="9" height="2.3" rx="1.1" fill="#FFFFFF"/>',
        f'<text x="24.5" y="40" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF" font-family="{F}">$</text>',
        f'</g>',
        f'<text x="130" y="99" font-family="{F}" font-size="26" font-weight="600" letter-spacing="-0.9" fill="{INK}">BillCrafter</text>',
        # eyebrow
        f'<text x="80" y="176" font-family="{F}" font-size="14" font-weight="600" fill="{RED}" letter-spacing="2">{esc(e["eyebrow"].upper())}</text>',
    ]
    for i, ln in enumerate(title_lines):
        parts.append(f'<text x="80" y="{ty + i*54}" font-family="{F}" font-size="46" font-weight="600" fill="{INK}" letter-spacing="-1.4">{esc(ln)}</text>')
    sy = ty + len(title_lines) * 54 + 14
    for i, ln in enumerate(sub_lines):
        parts.append(f'<text x="80" y="{sy + i*28}" font-family="{F}" font-size="19" fill="{MUT}">{esc(ln)}</text>')

    # CTA + footer
    parts.append(f'<g transform="translate(80,{max(sy + len(sub_lines)*28 + 24, 470)})">')
    parts.append(f'<rect width="196" height="48" rx="10" fill="{INK}"/>')
    parts.append(f'<text x="98" y="31" font-family="{F}" font-size="16" font-weight="600" fill="#FFFFFF" text-anchor="middle">Edit this free</text>')
    parts.append(f'</g>')
    parts.append(f'<text x="80" y="578" font-family="{F}" font-size="15" fill="{FAINT}">billcrafter.com · PDF in one click</text>')

    parts.append(mini_doc(e, 690, 118, 430, 400))
    parts.append("</svg>")
    return "\n".join(parts)

def main():
    manifest_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/og-manifest.json"
    outdir = sys.argv[2] if len(sys.argv) > 2 else "public/og"
    entries = json.load(open(manifest_path))
    os.makedirs(os.path.join(outdir, "templates"), exist_ok=True)

    total = 0
    for e in entries:
        path = os.path.join(outdir, e["file"])
        os.makedirs(os.path.dirname(path), exist_ok=True)
        cairosvg.svg2png(bytestring=build_svg(e).encode(), write_to=path,
                         output_width=1200, output_height=630)
        Image.open(path).convert("RGB").save(path, optimize=True)
        total += 1
    print(f"generated {total} OG images -> {outdir}")

if __name__ == "__main__":
    main()
