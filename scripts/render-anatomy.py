#!/usr/bin/env python3
"""Annotated "anatomy of a document" diagrams — the numbered-callout image that
Invoice Simple uses to explain what goes on an invoice. One per document type,
because the parts differ (a receipt has "amount paid", an estimate has "valid
until", etc.). Drawn, not photographed, so they match the real editor and never
go stale.

Usage: python3 scripts/render-anatomy.py public/anatomy
"""
import os, sys, html
import cairosvg
from PIL import Image

W, H = 1040, 720                     # 2x -> displayed ~520x360
BONE, INK, MUT, FAINT = "#F3F3EE", "#2D2F33", "#6B6F76", "#90969E"
RED, WASH, LINE = "#F43E01", "#FDECE5", "#E7E7E0"
F = "Montserrat,Poppins,Helvetica,Arial,sans-serif"

def esc(s):
    return html.escape(str(s or ""), quote=True)

# Per-type wording and the ordered list of callouts.
DOCS = {
    "invoice": {
        "word": "INVOICE", "party": "BILL TO", "d2": "Due", "total": "Total",
        "callouts": ["Header — the word “Invoice”", "Your business name & details", "Client name & details",
                     "Unique invoice number", "Issue date & due date", "Line items: description, qty, rate",
                     "Tax, discount & subtotal", "Balance due", "Payment terms & how to pay"],
    },
    "estimate": {
        "word": "ESTIMATE", "party": "PREPARED FOR", "d2": "Valid until", "total": "Estimated total",
        "callouts": ["Header — the word “Estimate”", "Your business name & details", "Client name & details",
                     "Estimate number", "Issue date & “valid until” date", "Scope: description, qty, rate",
                     "Tax & estimated subtotal", "Estimated total", "Assumptions & what’s excluded"],
    },
    "quote": {
        "word": "QUOTE", "party": "PREPARED FOR", "d2": "Valid until", "total": "Quoted total",
        "callouts": ["Header — the word “Quote”", "Your business name & details", "Client name & details",
                     "Quote number", "Issue date & validity date", "Deliverables: description, qty, price",
                     "Tax & subtotal", "Fixed quoted total", "Payment schedule & terms"],
    },
    "receipt": {
        "word": "RECEIPT", "party": "RECEIVED FROM", "d2": "Paid on", "total": "Total",
        "callouts": ["Header — the word “Receipt”", "Your business name & details", "Customer name & details",
                     "Receipt number", "Date payment was received", "What the payment was for",
                     "Tax & subtotal", "Amount paid", "Payment method (card, cash, transfer)"],
    },
}

def build(doc):
    sym = "$"
    dx, dy, dw, dh = 60, 60, 560, 600      # document rect
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
         f'<rect width="{W}" height="{H}" fill="{BONE}"/>']
    # paper
    o.append(f'<rect x="{dx+6}" y="{dy+8}" width="{dw}" height="{dh}" rx="12" fill="#000" opacity="0.06"/>')
    o.append(f'<rect x="{dx}" y="{dy}" width="{dw}" height="{dh}" rx="12" fill="#FFFFFF"/>')

    pad = 34
    # anchor points (y) for each numbered part, and where its badge sits
    parts = []

    # 1 header / logo
    y = dy + pad + 20
    o.append(f'<rect x="{dx+pad}" y="{y-18}" width="70" height="30" rx="6" fill="#EDEFF2"/>')
    o.append(f'<text x="{dx+pad+35}" y="{y+2}" font-family="{F}" font-size="11" fill="#9AA0A6" text-anchor="middle">LOGO</text>')
    o.append(f'<text x="{dx+dw-pad}" y="{y+6}" font-family="{F}" font-size="30" font-weight="700" fill="{INK}" text-anchor="end" letter-spacing="-1">{doc["word"]}</text>')
    parts.append((1, y - 4, "right"))

    # 2 business
    y += 46
    o.append(f'<text x="{dx+pad}" y="{y}" font-family="{F}" font-size="15" font-weight="600" fill="{INK}">Alex Rivera Design</text>')
    o.append(f'<text x="{dx+pad}" y="{y+18}" font-family="{F}" font-size="12" fill="{MUT}">22 Studio Ln, Austin, TX</text>')
    parts.append((2, y + 6, "left"))
    o.append(f'<rect x="{dx+pad}" y="{y+34}" width="{dw-2*pad}" height="2" fill="{INK}"/>')

    # 3 client  +  4 number  +  5 dates
    y += 74
    o.append(f'<text x="{dx+pad}" y="{y}" font-family="{F}" font-size="9.5" fill="#9AA0A6" letter-spacing="1">{doc["party"]}</text>')
    o.append(f'<text x="{dx+pad}" y="{y+18}" font-family="{F}" font-size="14" font-weight="600" fill="{INK}">Northwind Co.</text>')
    parts.append((3, y + 8, "left"))
    o.append(f'<text x="{dx+dw-pad}" y="{y}" font-family="{F}" font-size="12" fill="{MUT}" text-anchor="end">No. INV-0042</text>')
    parts.append((4, y - 4, "right"))
    o.append(f'<text x="{dx+dw-pad}" y="{y+20}" font-family="{F}" font-size="12" fill="{MUT}" text-anchor="end">Issued · {doc["d2"]}</text>')
    parts.append((5, y + 16, "right"))

    # 6 table
    y += 58
    o.append(f'<rect x="{dx+pad}" y="{y}" width="{dw-2*pad}" height="26" fill="{INK}"/>')
    o.append(f'<text x="{dx+pad+10}" y="{y+17}" font-family="{F}" font-size="10" fill="#FFFFFF" letter-spacing="1">DESCRIPTION</text>')
    o.append(f'<text x="{dx+dw-pad-10}" y="{y+17}" font-family="{F}" font-size="10" fill="#FFFFFF" text-anchor="end" letter-spacing="1">AMOUNT</text>')
    rows = [("Website design", "1,800.00"), ("Logo & brand kit", "600.00")]
    ry = y + 50
    for d, a in rows:
        o.append(f'<text x="{dx+pad+2}" y="{ry}" font-family="{F}" font-size="12.5" fill="#3F4348">{esc(d)}</text>')
        o.append(f'<text x="{dx+dw-pad-2}" y="{ry}" font-family="{F}" font-size="12.5" fill="#3F4348" text-anchor="end">{sym}{a}</text>')
        o.append(f'<rect x="{dx+pad}" y="{ry+9}" width="{dw-2*pad}" height="1" fill="#EEF0F2"/>')
        ry += 30
    parts.append((6, y + 46, "left"))

    # 7 subtotal/tax  8 total  9 notes
    ty = ry + 20
    o.append(f'<text x="{dx+dw-pad-150}" y="{ty}" font-family="{F}" font-size="12" fill="{MUT}">Subtotal</text>')
    o.append(f'<text x="{dx+dw-pad}" y="{ty}" font-family="{F}" font-size="12" fill="{MUT}" text-anchor="end">{sym}2,400.00</text>')
    o.append(f'<text x="{dx+dw-pad-150}" y="{ty+22}" font-family="{F}" font-size="12" fill="{MUT}">Tax (0%)</text>')
    o.append(f'<text x="{dx+dw-pad}" y="{ty+22}" font-family="{F}" font-size="12" fill="{MUT}" text-anchor="end">{sym}0.00</text>')
    parts.append((7, ty + 6, "right"))
    o.append(f'<rect x="{dx+dw-pad-190}" y="{ty+38}" width="190" height="2" fill="{INK}"/>')
    o.append(f'<text x="{dx+dw-pad-190}" y="{ty+62}" font-family="{F}" font-size="14" font-weight="700" fill="{INK}">{esc(doc["total"])}</text>')
    o.append(f'<text x="{dx+dw-pad}" y="{ty+62}" font-family="{F}" font-size="17" font-weight="700" fill="{INK}" text-anchor="end">{sym}2,400.00</text>')
    parts.append((8, ty + 52, "right"))
    ny = ty + 96
    o.append(f'<text x="{dx+pad}" y="{ny}" font-family="{F}" font-size="9.5" fill="#9AA0A6" letter-spacing="1">NOTES / PAYMENT</text>')
    o.append(f'<rect x="{dx+pad}" y="{ny+10}" width="220" height="7" rx="3" fill="#EDEFF2"/>')
    o.append(f'<rect x="{dx+pad}" y="{ny+26}" width="170" height="7" rx="3" fill="#EDEFF2"/>')
    parts.append((9, ny + 8, "left"))

    # numbered badges on the document
    for n, py, side in parts:
        bx = dx + 14 if side == "left" else dx + dw - 14
        o.append(f'<circle cx="{bx}" cy="{py}" r="13" fill="{RED}"/>')
        o.append(f'<text x="{bx}" y="{py+4.5}" font-family="{F}" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">{n}</text>')

    # legend on the right
    lx = dx + dw + 60
    o.append(f'<text x="{lx}" y="{dy+30}" font-family="{F}" font-size="16" font-weight="600" fill="{INK}">The 9 parts of a{"n" if doc["word"][0] in "AEIOU" else ""} {esc(doc["word"].lower())}</text>')
    ly = dy + 66
    for i, label in enumerate(doc["callouts"]):
        cy = ly + i * 62
        o.append(f'<circle cx="{lx+13}" cy="{cy}" r="13" fill="{WASH}"/>')
        o.append(f'<text x="{lx+13}" y="{cy+4.5}" font-family="{F}" font-size="13" font-weight="700" fill="#B02E00" text-anchor="middle">{i+1}</text>')
        o.append(f'<text x="{lx+38}" y="{cy+5}" font-family="{F}" font-size="14.5" fill="{INK}">{esc(label)}</text>')

    o.append("</svg>")
    return "\n".join(o)

def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else "public/anatomy"
    os.makedirs(outdir, exist_ok=True)
    for key, doc in DOCS.items():
        path = os.path.join(outdir, f"{key}.png")
        cairosvg.svg2png(bytestring=build(doc).encode(), write_to=path, output_width=W, output_height=H)
        Image.open(path).convert("RGB").save(path, optimize=True)
    print(f"generated {len(DOCS)} anatomy diagrams -> {outdir}")

if __name__ == "__main__":
    main()
