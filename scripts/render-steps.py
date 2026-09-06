#!/usr/bin/env python3
"""Generate the three "How it works" step illustrations.

These sit next to the step text on the home page, so they're drawn at 2x for
retina and kept deliberately simple: each shows the one interaction the step is
describing, not a full screenshot of the app (which would be unreadable at
360px wide and would go stale every time the UI changes).

Usage: python3 scripts/render-steps.py public/steps
"""
import os, sys, html
import cairosvg
from PIL import Image

W, H = 720, 460                       # rendered at 2x -> displayed ~360x230
BONE, INK, MUT, FAINT = "#F3F3EE", "#2D2F33", "#6B6F76", "#90969E"
RED, WASH = "#F43E01", "#FDECE5"
LINE, PAPER = "#E7E7E0", "#FFFFFF"
F = "Montserrat,Poppins,Helvetica,Arial,sans-serif"

def esc(s):
    return html.escape(str(s or ""), quote=True)

def frame(inner, pad=0):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'<rect width="{W}" height="{H}" fill="{BONE}"/>{inner}</svg>')

def card(x, y, w, h, r=14):
    return (f'<rect x="{x+5}" y="{y+7}" width="{w}" height="{h}" rx="{r}" fill="#000" opacity="0.06"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{PAPER}"/>')

# ---------------------------------------------------------------- step 1
def step1():
    """Typing directly on the document: a focused field with a caret."""
    x, y, w, h = 90, 46, 540, 368
    o = [card(x, y, w, h)]
    o.append(f'<text x="{x+34}" y="{y+52}" font-family="{F}" font-size="19" font-weight="600" fill="{INK}">Alex Rivera Design</text>')
    o.append(f'<text x="{x+w-34}" y="{y+56}" font-family="{F}" font-size="30" font-weight="700" fill="{INK}" text-anchor="end" letter-spacing="-1">INVOICE</text>')
    o.append(f'<rect x="{x+34}" y="{y+74}" width="{w-68}" height="2" fill="{INK}"/>')

    # table header
    ty = y + 112
    o.append(f'<text x="{x+34}" y="{ty}" font-family="{F}" font-size="12" fill="{FAINT}" letter-spacing="1">DESCRIPTION</text>')
    o.append(f'<text x="{x+w-34}" y="{ty}" font-family="{F}" font-size="12" fill="{FAINT}" text-anchor="end" letter-spacing="1">AMOUNT</text>')

    # settled row
    o.append(f'<text x="{x+34}" y="{ty+40}" font-family="{F}" font-size="16" fill="#3F4348">Website design</text>')
    o.append(f'<text x="{x+w-34}" y="{ty+40}" font-family="{F}" font-size="16" fill="#3F4348" text-anchor="end">$1,800.00</text>')
    o.append(f'<rect x="{x+34}" y="{ty+52}" width="{w-68}" height="1" fill="#EEF0F2"/>')

    # the row being typed — highlighted field + caret
    ry = ty + 88
    o.append(f'<rect x="{x+26}" y="{ry-24}" width="300" height="36" rx="6" fill="#EDEFF2"/>')
    o.append(f'<rect x="{x+26}" y="{ry+10}" width="300" height="2" fill="{RED}"/>')
    o.append(f'<text x="{x+34}" y="{ry}" font-family="{F}" font-size="16" fill="{INK}">Logo &amp; brand kit</text>')
    o.append(f'<rect x="{x+178}" y="{ry-18}" width="2.5" height="24" fill="{RED}"/>')
    o.append(f'<text x="{x+w-34}" y="{ry}" font-family="{F}" font-size="16" fill="#3F4348" text-anchor="end">$600.00</text>')

    # live-updating total
    o.append(f'<rect x="{x+w-250}" y="{y+h-92}" width="216" height="2" fill="{INK}"/>')
    o.append(f'<text x="{x+w-250}" y="{y+h-62}" font-family="{F}" font-size="16" font-weight="600" fill="{INK}">Total</text>')
    o.append(f'<text x="{x+w-34}" y="{y+h-62}" font-family="{F}" font-size="21" font-weight="700" fill="{INK}" text-anchor="end">$2,400.00</text>')
    o.append(f'<text x="{x+w-34}" y="{y+h-36}" font-family="{F}" font-size="13" fill="{RED}" text-anchor="end">updates as you type</text>')
    return frame("".join(o))

# ---------------------------------------------------------------- step 2
def step2():
    """Choosing a layout and an accent colour."""
    o = []
    # document preview, accent applied
    x, y, w, h = 60, 46, 330, 368
    o.append(card(x, y, w, h))
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="13" rx="14" fill="{RED}"/>')
    o.append(f'<rect x="{x}" y="{y+8}" width="{w}" height="16" fill="{RED}"/>')
    o.append(f'<text x="{x+26}" y="{y+62}" font-family="{F}" font-size="15" font-weight="600" fill="{INK}">Alex Rivera Design</text>')
    o.append(f'<rect x="{x+w-108}" y="{y+40}" width="82" height="28" rx="5" fill="{RED}"/>')
    o.append(f'<text x="{x+w-67}" y="{y+60}" font-family="{F}" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">INVOICE</text>')
    o.append(f'<rect x="{x+26}" y="{y+96}" width="{w-52}" height="22" fill="{RED}"/>')
    for i, val in enumerate(["$1,800.00", "$600.00"]):
        ry = y + 148 + i * 34
        o.append(f'<rect x="{x+26}" y="{ry-14}" width="150" height="7" rx="3" fill="#EDEFF2"/>')
        o.append(f'<text x="{x+w-26}" y="{ry}" font-family="{F}" font-size="13" fill="#3F4348" text-anchor="end">{val}</text>')
        o.append(f'<rect x="{x+26}" y="{ry+10}" width="{w-52}" height="1" fill="#EEF0F2"/>')
    o.append(f'<rect x="{x+w-160}" y="{y+h-72}" width="134" height="2" fill="{RED}"/>')
    o.append(f'<text x="{x+w-26}" y="{y+h-44}" font-family="{F}" font-size="17" font-weight="700" fill="{RED}" text-anchor="end">$2,400.00</text>')

    # side panel: layout + accent pickers
    px, py, pw = 424, 46, 236
    o.append(card(px, py, pw, 368))
    o.append(f'<text x="{px+20}" y="{py+34}" font-family="{F}" font-size="12" font-weight="600" fill="{MUT}" letter-spacing="1">TEMPLATE STYLE</text>')
    styles = [("Modern", False), ("Band", True), ("Minimal", False), ("Elegant", False)]
    for i, (name, active) in enumerate(styles):
        by = py + 50 + i * 38
        fill, stroke, col = (WASH, RED, "#B02E00") if active else (PAPER, "#DDDDD6", "#4A4D53")
        o.append(f'<rect x="{px+18}" y="{by}" width="{pw-36}" height="30" rx="7" fill="{fill}" stroke="{stroke}" stroke-width="1.4"/>')
        o.append(f'<text x="{px+32}" y="{by+20}" font-family="{F}" font-size="14" font-weight="{"600" if active else "400"}" fill="{col}">{esc(name)}</text>')
        if active:
            o.append(f'<path d="M{px+pw-40} {by+15} l4 5 8-10" stroke="{RED}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')

    o.append(f'<text x="{px+20}" y="{py+228}" font-family="{F}" font-size="12" font-weight="600" fill="{MUT}" letter-spacing="1">ACCENT</text>')
    swatches = ["#F43E01", "#16181C", "#4F46E5", "#0D9488", "#DB2777", "#D97706"]
    for i, c in enumerate(swatches):
        sx = px + 20 + (i % 6) * 33
        sy = py + 244
        o.append(f'<rect x="{sx}" y="{sy}" width="26" height="26" rx="7" fill="{c}"/>')
        if i == 0:
            o.append(f'<rect x="{sx-4}" y="{sy-4}" width="34" height="34" rx="10" fill="none" stroke="{INK}" stroke-width="2.2"/>')
    o.append(f'<text x="{px+20}" y="{py+322}" font-family="{F}" font-size="13" fill="{FAINT}">8 layouts · 12 colours</text>')
    return frame("".join(o))

# ---------------------------------------------------------------- step 3
def step3():
    """Downloading the PDF — the file lands, exactly as previewed."""
    o = []
    x, y, w, h = 78, 34, 300, 350
    o.append(card(x, y, w, h))
    o.append(f'<text x="{x+24}" y="{y+40}" font-family="{F}" font-size="14" font-weight="600" fill="{INK}">Alex Rivera Design</text>')
    o.append(f'<text x="{x+w-24}" y="{y+42}" font-family="{F}" font-size="20" font-weight="700" fill="{INK}" text-anchor="end">INVOICE</text>')
    o.append(f'<rect x="{x+24}" y="{y+54}" width="{w-48}" height="2" fill="{INK}"/>')
    for i in range(3):
        ry = y + 92 + i * 30
        o.append(f'<rect x="{x+24}" y="{ry}" width="{130 - i*22}" height="7" rx="3" fill="#EDEFF2"/>')
        o.append(f'<rect x="{x+w-84}" y="{ry}" width="60" height="7" rx="3" fill="#EDEFF2"/>')
    o.append(f'<rect x="{x+w-150}" y="{y+h-84}" width="126" height="2" fill="{INK}"/>')
    o.append(f'<text x="{x+w-24}" y="{y+h-54}" font-family="{F}" font-size="17" font-weight="700" fill="{INK}" text-anchor="end">$2,400.00</text>')

    # arrow
    ax = x + w + 26
    o.append(f'<path d="M{ax} {y+170} h56" stroke="{RED}" stroke-width="3" stroke-linecap="round"/>')
    o.append(f'<path d="M{ax+44} {y+158} l14 12 -14 12" stroke="{RED}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')

    # downloaded file chip
    fx, fy = ax + 76, y + 96
    o.append(card(fx, fy, 190, 148, 12))
    o.append(f'<g transform="translate({fx+62},{fy+26}) scale(1.5)">')
    o.append(f'<path d="M15 6 h14 l7 7 v27 a2 2 0 0 1-2 2 H15 a2 2 0 0 1-2-2 V8 a2 2 0 0 1 2-2 Z" fill="{RED}"/>')
    o.append(f'<path d="M29 6 v7 h7" fill="none" stroke="#FFFFFF" stroke-width="2"/>')
    o.append(f'</g>')
    o.append(f'<text x="{fx+95}" y="{fy+124}" font-family="{F}" font-size="14" font-weight="600" fill="{INK}" text-anchor="middle">INV-0042.pdf</text>')

    # caption
    o.append(f'<rect x="{fx+16}" y="{fy+168}" width="158" height="34" rx="9" fill="{WASH}"/>')
    o.append(f'<text x="{fx+95}" y="{fy+190}" font-family="{F}" font-size="13" font-weight="600" fill="#B02E00" text-anchor="middle">No signup needed</text>')
    return frame("".join(o))

def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else "public/steps"
    os.makedirs(outdir, exist_ok=True)
    for name, fn in [("step-1-type.png", step1), ("step-2-customize.png", step2), ("step-3-download.png", step3)]:
        path = os.path.join(outdir, name)
        cairosvg.svg2png(bytestring=fn().encode(), write_to=path, output_width=W, output_height=H)
        Image.open(path).convert("RGB").save(path, optimize=True)
    print(f"generated 3 step images -> {outdir}")

if __name__ == "__main__":
    main()
