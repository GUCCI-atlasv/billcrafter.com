# BillCrafter — UI Redesign PRD (Groq-inspired)

**Product:** BillCrafter (billcrafter.com)
**Owner:** CCC STUDIO
**Type:** Visual redesign — design system replacement. No feature/logic changes.
**Reference:** [groq.com](https://groq.com) design language
**Status:** Draft for approval
**Date:** July 19, 2026

---

## 0. The one decision that needs your sign-off

**BillCrafter today is a dark monochrome site. Groq is a light site.**

Groq's actual system is: warm off-white ("bone") backgrounds, near-black text, and a single high-energy orange used *sparingly* as an accent. Their own brand guidance says backgrounds are "open fields of white and light gray allowing the orange to shine brightly."

So adopting Groq's style means **inverting BillCrafter from dark to light**, not just recoloring. This is the right call for this product for three reasons:

1. **The product is a document tool.** The invoice sheet is already a white page. Today it floats on near-black, which creates a harsh value jump. A bone background makes the sheet sit naturally in its canvas — the editor starts to look like paper on a desk.
2. **Print/export mental model.** Users are producing something that ends up white. A light UI reduces the surprise between screen and PDF.
3. **Trust in a billing context.** Light, high-contrast, typographic layouts read as more legitimate to SMB/freelance buyers than a dark "developer tool" aesthetic.

**Option A (recommended):** Full light theme, Groq-faithful.
**Option B (fallback):** Keep dark chrome, adopt only Groq's orange accent + Montserrat. Cheaper, but it will not read as "Groq-style" — it'll read as the current site with an orange accent.

Everything below specifies **Option A**. Say the word and I'll re-cut it for Option B.

---

## 1. Objective

Replace BillCrafter's current dark-monochrome visual system with a Groq-inspired light system — new color palette, new typography, refreshed components — while keeping every existing feature, route, and interaction behavior byte-for-byte identical.

### Success criteria
- Every page renders in the new system with no regressions in layout or function.
- All text/UI meets WCAG 2.1 AA contrast.
- The invoice document itself is visually unchanged (see §7 — this is a hard constraint).
- Lighthouse performance does not regress (font loading must be self-hosted/subset).

### Non-goals
- No changes to features, copy, routes, pricing, or backend.
- No new page types or IA changes.
- Not a logo redesign (existing folded-invoice mark is retained; see §6.9).

---

## 2. Reference analysis — what actually defines Groq's look

Grounded in Groq's live site metadata and published brand guidelines:

| Element | Groq's actual value |
| --- | --- |
| Background | `#F3F3EE` — warm bone / off-white (their declared `theme-color`) |
| Ink / secondary | `#2D2F33` — near-black, slightly cool |
| Primary accent | `#F43E01` — "Groq Orange", vermilion |
| Typeface | **Montserrat** — light, regular, medium, semi-bold |
| Mono | **Consolas** for code, chart labels, callouts |
| Accent usage | Deliberately restrained — accents and emphasis only, never large fills |

### The five traits worth stealing
1. **Warm neutral ground, not pure white.** The bone tone is what makes it feel designed rather than default.
2. **One loud color, used quietly.** Orange appears in maybe 3–5% of the pixel area — a rule, an arrow, a hover, one number.
3. **Big confident geometric headlines.** Montserrat semi-bold at large sizes, tight tracking, short lines.
4. **Editorial eyebrow labels.** Small uppercase kickers above headlines ("Inference is Fuel for AI") create rhythm and hierarchy cheaply.
5. **Generous vertical rhythm.** Sections breathe; content is not crammed.

### What to deliberately *not* copy
- Full-bleed autoplay video heroes (wrong for a utility tool; hurts LCP).
- Logo marquees / customer-proof carousels (we have no logos to show, and we already removed unearned social proof).

---

## 3. Design tokens

### 3.1 Color

```css
:root{
  /* Ground */
  --bg:        #F3F3EE;   /* warm bone — page background */
  --band:      #EDEDE6;   /* alternating section band */
  --card:      #FFFFFF;   /* raised surface */
  --elev:      #FAFAF7;   /* inset / editor canvas */

  /* Ink */
  --ink:       #2D2F33;   /* primary text */
  --ink-soft:  #4A4D53;   /* secondary text */
  --muted:     #6B6F76;   /* tertiary / labels */
  --faint:     #9096  9E; /* disabled, meta */

  /* Lines */
  --line:      rgba(45,47,51,.10);
  --line-2:    rgba(45,47,51,.18);

  /* Brand accent */
  --brand:     #F43E01;   /* Groq-style orange — accents, focus, hover */
  --brand-ink: #B02E00;   /* darkened orange — AA-safe orange TEXT on light */
  --brand-wash:#FDECE5;   /* 8% tint — badges, highlight rows */

  /* Inverted (buttons, dark blocks) */
  --solid:     #2D2F33;   /* primary button fill */
  --on-solid:  #FFFFFF;
}
```

**Accent discipline rule:** orange may be used for — focus rings, link hover, active nav underline, one KPI number per view, badges, the "Pro" tier highlight, chart/heatmap high values. It may **not** be used for — full-width backgrounds, primary button fills at small sizes, body copy, or the invoice document.

### 3.2 Contrast audit (WCAG 2.1 AA)

This is the part most Groq-clone attempts get wrong. Orange is a *low-contrast* color:

| Pair | Ratio | Verdict |
| --- | --- | --- |
| `--ink` #2D2F33 on `--bg` #F3F3EE | **12.1:1** | ✅ AAA |
| `--muted` #6B6F76 on `--bg` | **5.2:1** | ✅ AA |
| White on `--brand` #F43E01 | **3.8:1** | ❌ fails AA for small text |
| `--ink` on `--brand` | **3.5:1** | ❌ fails AA for small text |
| `--brand-ink` #B02E00 on `--bg` | **6.3:1** | ✅ AA |

**Consequences, and they are binding:**
- **Primary buttons use `--solid` (near-black) with white text**, not orange. This matches Groq — their own CTAs are dark/neutral, with orange reserved for accents.
- **Orange text on light must use `--brand-ink`**, never `--brand`.
- Orange at `--brand` is allowed for **large display type (≥24px semi-bold)**, icons, rules, and borders — all of which only need 3:1.

### 3.3 Typography

```css
--font-sans: Montserrat, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-mono: "SFMono-Regular", Consolas, Menlo, "Liberation Mono", monospace;
```

Montserrat is open-source (SIL OFL) — free for commercial use, no licensing risk. **Self-host via `next/font/google`** with `display: swap` and subset to `latin` so the redesign doesn't cost us LCP.

| Role | Size / weight / tracking |
| --- | --- |
| Display (hero h1) | 52px / 600 / −0.03em / 1.05 |
| H2 section | 34px / 600 / −0.02em / 1.15 |
| H3 card title | 19px / 600 / −0.01em |
| Body | 15px / 400 / 1.6 |
| Body small | 13.5px / 400 |
| Label / meta | 12.5px / 500 |
| **Eyebrow** | 12px / 600 / **+0.10em** / uppercase / `--brand-ink` |
| Button | 14px / 600 |
| Mono (numbers, IDs, code) | 13px / 400 |

Notes: Montserrat is geometric and runs *wider* than Inter — hero headlines will need ~10% more horizontal room or a slightly smaller size. Body text drops from 14px to 15px because Montserrat has a smaller x-height than Inter and reads small at 14.

### 3.4 Spacing, radius, elevation, motion

```css
--sp: 4px base scale → 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96
--r-sm: 6px;  --r-md: 10px;  --r-lg: 16px;  --r-pill: 999px;
--shadow-sm: 0 1px 2px rgba(45,47,51,.06);
--shadow-md: 0 4px 16px rgba(45,47,51,.08);
--shadow-lg: 0 12px 32px rgba(45,47,51,.10);   /* the invoice sheet */
--ease: cubic-bezier(.2,.6,.2,1);  --dur: 160ms;
```

Shadows must be **re-tuned, not reused**: the current sheet shadow is `rgba(0,0,0,.5)` — built for a near-black background. On bone that reads as dirt. Light-theme shadows are low-opacity and cool-neutral.

Section rhythm: 96px desktop / 56px mobile between major sections (up from today's ~46px) to get Groq's breathing room.

---

## 4. Token migration map

Existing CSS variables are reused by name wherever possible, so most of the change is a **single `:root` swap** plus targeted component fixes.

| Variable | Now (dark) | New (light) | Notes |
| --- | --- | --- | --- |
| `--bg` | `#0A0B0D` | `#F3F3EE` | inversion |
| `--band` | `#0E0F12` | `#EDEDE6` | |
| `--card` | `#111317` | `#FFFFFF` | |
| `--elev` | `#15171C` | `#FAFAF7` | |
| `--ink` | `#EDEEF0` | `#2D2F33` | inversion |
| `--ink-soft` | `#C4C7CE` | `#4A4D53` | |
| `--muted` | `#8A8F98` | `#6B6F76` | |
| `--faint` | `#6E7681` | `#90969E` | |
| `--line` | `rgba(255,255,255,.08)` | `rgba(45,47,51,.10)` | polarity flip |
| `--line-2` | `rgba(255,255,255,.16)` | `rgba(45,47,51,.18)` | polarity flip |
| `--white` / `--on-white` | `#FFF` / `#0A0B0D` | **rename** → `--solid` / `--on-solid` = `#2D2F33` / `#FFF` | these drove the old inverted buttons |
| `--accent` | `#16181C` | **do not touch** — see §7 | document-scoped, not brand |

**Hard-coded values that must be hunted down** (they will break on light):
- `.site-nav` background `rgba(10,11,13,.82)` → `rgba(243,243,238,.82)`
- `.sheet` shadow `rgba(0,0,0,.5)` → `--shadow-lg`
- `.btn-solid:hover` `#E3E3E6` → `#1B1D20`
- Heatmap levels `rgba(255,255,255,.20 → 1)` → orange ramp (§6.8)
- `.se:hover` `#F3F4F6` / `.se:focus` `#EDEFF2` → keep (document-scoped, §7)

---

## 5. Layout system

- Container: `--wrap: 1120px` (unchanged), gutter 24px desktop / 16px mobile.
- Grid: 12-col desktop, 6-col tablet, 4-col mobile.
- **Editor split stays `1fr 290px`** — do not restructure; only restyle.
- Breakpoints: 640 / 900 / 1120.

---

## 6. Component specification

### 6.1 Navigation
Sticky, `rgba(243,243,238,.82)` + `backdrop-filter: blur(10px)`, 1px bottom hairline. Height 64px (from 60). Links `--muted` → `--ink` on hover with a **2px orange underline animating in from left** (this single detail carries most of the Groq feel). CTA "Start free" = solid dark pill.

### 6.2 Buttons
| Variant | Spec |
| --- | --- |
| `.btn-solid` | `--solid` fill, white text, radius 10px, 10px/18px padding, hover `#1B1D20`, **primary CTA** |
| `.btn-line` | transparent, 1px `--line-2`, `--ink` text; hover border → `--brand` |
| `.btn-ghost` | transparent, `--ink-soft`; hover bg `rgba(45,47,51,.05)` |
| `.btn-accent` | **new** — `--brand` fill, white text, **min 15px semi-bold only** (large-text contrast exemption). Reserved for the single Upgrade CTA. |
| Focus | `box-shadow: 0 0 0 3px rgba(244,62,1,.35)` — orange focus ring globally |

### 6.3 Hero
Eyebrow (uppercase, orange, +0.10em) → 52px Montserrat 600 headline → 17px `--muted` sub → CTA row → trust meta line. Left-aligned, max 720px. No video.

### 6.4 The tool / editor shell
Container becomes `--card` (white) with `--line` border, radius 16px, `--shadow-md`. Editor canvas `--elev` (#FAFAF7) so the white invoice sheet still separates from its surroundings — **this is the most important visual relationship on the site** and must be checked in QA. Side panel `--card` with a left hairline.

### 6.5 Cards, panels, tables
White surfaces, 1px `--line`, radius 12px, `--shadow-sm`. Table headers: 12px/600 uppercase `--muted`, `--band` background, bottom hairline. Row hover `rgba(45,47,51,.03)`.

### 6.6 Pricing
Two cards (Free / Pro). Pro card: white with a **2px `--brand` border**, orange "Pro" badge in `--brand-wash` with `--brand-ink` text, price in 44px Montserrat 600. Free card: `--line` border. Keep the fixed `.btn { display:inline-block }` + `.btn-block { display:block }` rules — that fix resolved the earlier text-overlap bug and must survive the refactor.

### 6.7 Forms
Inputs: white bg, 1px `--line-2`, radius 8px, 15px text. Focus: `--brand` border + orange ring. Error: `#C0341A` text + border. Labels 12.5px/500 `--muted`.

### 6.8 Activity heatmap
Recolor from white-alpha ramp to an **orange ramp on bone** — the single best place to spend brand color:

| Level | Color |
| --- | --- |
| 0 | `#E7E7E0` |
| 1 | `#FBD9C8` |
| 2 | `#F9AE86` |
| 3 | `#F77441` |
| 4 | `#F43E01` |

Keep the `display:inline-block` + `flex:0 0 auto` fixes on `.heat-cell` (they resolved the legend layout bug).

### 6.9 Logo
The existing folded-invoice-with-$ mark is kept. It currently ships in white-on-dark and black variants — **the light theme uses the existing dark/black variant**, no redesign needed. Optional: an orange accent version for the favicon, subject to your approval.

### 6.10 Dashboard & Admin
Sidebar becomes `--band` with `--line` right border. Active nav item: `--card` white pill + **3px orange left bar** + `--ink` text. KPI cards: white, label `--muted` uppercase 12px, value 30px Montserrat 600, one designated "hero" KPI per view in `--brand-ink`. Status pills: paid/active = green wash; draft/neutral = grey wash; error = red wash — all as tinted backgrounds with dark text, never saturated fills.

---

## 7. Hard constraint — the invoice document is out of scope

**The rendered invoice/estimate/quote/receipt sheet must not change.** It is a printable artifact, and its appearance is a *user* choice, not a brand choice.

Specifically ring-fenced:
- `.sheet` and every `.sheet.{classic|minimal|elegant|compact|mono|ruled|band}` style.
- The `--accent` variable and the **12 user-selectable accent colors** — these are set per-document by the user via `style={{ "--accent": accent }}`. Groq orange must **not** become the document default, and must not be injected into the palette as a brand statement.
- `.se` inline-edit hover/focus states (`#F3F4F6` / `#EDEFF2`) — document-internal.
- All Word/Excel export HTML, which inlines its own colors.

**Only two document-adjacent things change:** the sheet's drop shadow (retuned for a light canvas) and the canvas color behind it. QA must confirm a byte-identical PDF export before and after.

---

## 8. Implementation plan

| Phase | Work | Est. |
| --- | --- | --- |
| **1. Tokens** | Swap `:root`; add Montserrat via `next/font/google`; rename `--white`/`--on-white` → `--solid`/`--on-solid`; add `--brand*` | 0.5d |
| **2. Hardcode sweep** | Fix the values listed in §4; grep for `rgba(255,255,255`, `#fff`, `rgba(0,0,0` across `globals.css` + inline styles in `.jsx` | 0.5d |
| **3. Core components** | Nav, buttons, hero, footer, cards, forms | 1d |
| **4. Editor shell** | Tool container, side panel, chips, template picker — *without touching `.sheet`* | 0.5d |
| **5. Marketing pages** | Home sections, pricing, templates gallery, legal, contact, upgrade | 1d |
| **6. Dashboard + Admin** | Sidebar, KPIs, tables, heatmap, banners, all 7 admin panes | 1d |
| **7. QA** | Contrast audit, PDF-export diff, responsive pass, cross-browser | 0.5d |

**Total ≈ 5 days.** Sequencing matters: phases 1–2 will make the site look temporarily broken until 3–6 land, so this should ship as one release, not incrementally to production.

### Files touched
- `app/globals.css` — the bulk of it
- `app/layout.jsx` — font registration
- Inline `style={{}}` props across `components/*.jsx` and `app/**/page.jsx` (numerous small hardcoded colors)
- `public/og.png`, favicon set — regenerate on the new bone background
- **Not touched:** any `app/api/**`, `lib/server/**`, or business logic

---

## 9. Risks

| Risk | Mitigation |
| --- | --- |
| **Orange fails contrast** if used for buttons/body text | Binding rules in §3.2 — dark CTAs, `--brand-ink` for orange text |
| **Invoice document drifts** during the refactor | §7 ring-fence + mandatory before/after PDF diff in QA |
| **Montserrat hurts LCP** | Self-host via `next/font`, `display:swap`, latin subset only |
| **Montserrat runs wide** — headlines wrap badly | Reduce hero to 48px if wrapping appears; test the longest SEO page titles |
| **Hardcoded dark colors survive** and produce white-on-white | Phase 2 systematic grep, not visual spot-checking |
| **OG image / favicons** still dark, inconsistent in shares | Regenerate in phase 5 |
| Dark-mode users experience a jarring flip | Acceptable — no dark mode was ever offered; optional `prefers-color-scheme` dark variant can be a v2 |

---

## 10. Acceptance criteria

- [ ] Zero hardcoded dark-theme colors remain (grep-verified).
- [ ] All text pairs pass WCAG AA; large-text exemptions documented.
- [ ] PDF, Word, and Excel exports are byte-identical to pre-redesign output.
- [ ] All 28 templates × 12 accents render correctly on the new canvas.
- [ ] Every route in the PRD §4 renders correctly at 375 / 768 / 1440.
- [ ] Admin's 7 panes fully restyled.
- [ ] Lighthouse performance ≥ pre-redesign score.
- [ ] Orange occupies < 5% of pixel area on any given screen.

---

## 11. Open questions for you

1. **Option A (full light) or Option B (dark + orange accent)?** — §0.
2. **Exact orange:** use Groq's `#F43E01` verbatim, or shift it (e.g. a warmer `#E8500A`) to avoid looking like a direct clone? Copying a competitor's exact brand color in an unrelated category is legally fine but reads as derivative.
3. **Favicon/logo:** keep pure black mark, or introduce an orange accent version?
4. **Dark mode as a v2 toggle** — worth scoping now, or defer?

> Note on Groq's marks: this is *design-language inspiration*, not asset reuse. We must not use Groq's logo, wordmark, or any brand asset. Montserrat is independently licensed (SIL OFL) and free to use.

---

**Sources:** [groq.com](https://groq.com) (live site metadata: `theme-color #F3F3EE`, brand color `#F43E01`) · [Groq Brand Guidelines](https://groq.humain.ai/brand-guidelines/) (Montserrat primary typeface; Consolas for code; orange as restrained accent on white/light-grey fields)
