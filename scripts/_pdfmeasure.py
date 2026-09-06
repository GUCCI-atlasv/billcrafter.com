#!/usr/bin/env python3
"""Measure where ink actually lands in an exported invoice.

Reads a PNG (render a PDF with `qlmanage -t -s 3000 -o DIR file.pdf`) and reports,
for the filled totals band, the band's own extent and the text's extent inside it.
Eyeballing a scaled screenshot is how the last three rounds of this bug got
misdiagnosed; these are the numbers instead.

Pure stdlib on purpose — no PIL on this machine.
"""
import sys
import zlib
import struct


def read_png(path):
    data = open(path, "rb").read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise SystemExit("not a PNG")
    pos, idat, meta = 8, [], None
    while pos < len(data):
        (ln,) = struct.unpack(">I", data[pos:pos + 4])
        typ = data[pos + 4:pos + 8]
        body = data[pos + 8:pos + 8 + ln]
        if typ == b"IHDR":
            meta = struct.unpack(">IIBBBBB", body)
        elif typ == b"IDAT":
            idat.append(body)
        elif typ == b"IEND":
            break
        pos += 12 + ln
    w, h, depth, color, _, _, interlace = meta
    if depth != 8 or interlace:
        raise SystemExit(f"unsupported PNG (depth={depth} interlace={interlace})")
    ch = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[color]
    raw = zlib.decompress(b"".join(idat))
    stride = w * ch
    out = bytearray(h * stride)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        f = raw[p]
        p += 1
        line = bytearray(raw[p:p + stride])
        p += stride
        if f == 1:
            for i in range(ch, stride):
                line[i] = (line[i] + line[i - ch]) & 255
        elif f == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 255
        elif f == 3:
            for i in range(stride):
                a = line[i - ch] if i >= ch else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 255
        elif f == 4:
            for i in range(stride):
                a = line[i - ch] if i >= ch else 0
                b = prev[i]
                c = prev[i - ch] if i >= ch else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 255
        out[y * stride:(y + 1) * stride] = line
        prev = line
    return w, h, ch, out


def main():
    path = sys.argv[1]
    w, h, ch, px = read_png(path)
    print(f"image {w}x{h}, {ch} channels")

    def lum(x, y):
        i = (y * w + x) * ch
        if ch >= 3:
            return (px[i] * 299 + px[i + 1] * 587 + px[i + 2] * 114) // 1000
        return px[i]

    # The filled band is the widest run of rows that are mostly dark. Scan the
    # whole page so this works regardless of where the totals table sits.
    # Longest contiguous dark run, not the total count: the band only covers the
    # right-hand third of the page, so a page-wide total would rank the thin
    # full-width rules above it.
    dark_rows = []
    for y in range(h):
        best = cur = 0
        for x in range(0, w, 4):
            cur = cur + 1 if lum(x, y) < 90 else 0
            if cur > best:
                best = cur
        dark_rows.append(best)
    thresh = (w / 4) * 0.20
    runs, cur = [], None
    for y, d in enumerate(dark_rows):
        if d >= thresh:
            cur = (cur[0], y) if cur else (y, y)
        elif cur:
            runs.append(cur)
            cur = None
    if cur:
        runs.append(cur)
    # Rules and table borders are also "mostly dark rows"; the band we want is a
    # fill with light text knocked out of it, so score runs by how much reversed
    # text they contain rather than by height alone.
    def light_inside(run):
        a, b = run
        return sum(
            1
            for y in range(a, b + 1)
            for x in range(0, w, 3)
            if lum(x, y) > 170
        )

    runs = [r for r in runs if r[1] - r[0] + 1 >= 12]
    if not runs:
        raise SystemExit("no filled band found")
    top, bot = max(runs, key=light_inside)
    band_h = bot - top + 1
    print(f"\nfilled band rows {top}..{bot}  height={band_h}px")

    # Horizontal extent of the band, so the text scan stays inside it.
    mid = (top + bot) // 2
    xs = [x for x in range(w) if lum(x, mid) < 90]
    x0, x1 = min(xs), max(xs)
    print(f"band spans x {x0}..{x1}  width={x1 - x0 + 1}px")

    # The seed run above stops at the first row of reversed text, because glyphs
    # break the contiguous dark run. Grow it back out over the band's own x range,
    # where a text row is still mostly fill.
    def banded(y):
        if y < 0 or y >= h:
            return False
        d = sum(1 for x in range(x0, x1 + 1, 3) if lum(x, y) < 90)
        return d > ((x1 - x0) / 3) * 0.35

    while banded(top - 1):
        top -= 1
    while banded(bot + 1):
        bot += 1
    band_h = bot - top + 1
    print(f"full band rows {top}..{bot}  height={band_h}px")

    # Light pixels inside a dark band are the text.
    text_rows = []
    for y in range(top, bot + 1):
        n = sum(1 for x in range(x0, x1 + 1) if lum(x, y) > 170)
        if n > 2:
            text_rows.append(y)
    if not text_rows:
        print("no text found inside band")
        return
    t0, t1 = min(text_rows), max(text_rows)
    above, below = t0 - top, bot - t1
    print(f"text rows {t0}..{t1}  height={t1 - t0 + 1}px")
    print(f"\ngap above text: {above}px")
    print(f"gap below text: {below}px")
    ratio = above / below if below else float("inf")
    print(f"above:below = {ratio:.2f}   ({'centred' if 0.6 < ratio < 1.7 else 'OFF-CENTRE'})")

    # A gap between the two cell backgrounds shows up as a light column.
    seams = []
    for x in range(x0, x1 + 1):
        n = sum(1 for y in range(top, bot + 1) if lum(x, y) > 140)
        if n > band_h * 0.7:
            seams.append(x)
    print(f"\nlight columns inside band: {seams if seams else 'none'}")


if __name__ == "__main__":
    main()
