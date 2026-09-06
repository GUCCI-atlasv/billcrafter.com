# BillCrafter — Product Requirements Document (As-Built)

**Product:** BillCrafter — free online invoice generator
**Domain:** [billcrafter.com](https://www.billcrafter.com)
**Operator:** CCC STUDIO (United States)
**Support:** support@billcrafter.com
**Document type:** As-built PRD — documents the product as currently shipped, not a forward-looking plan.
**Last updated:** July 18, 2026

---

## 1. Overview

BillCrafter is a free, browser-based tool that lets freelancers and small businesses create professional invoices, estimates, quotes, and receipts and export them as PDF, Word, or Excel — with no signup required to start. Editing and previewing are always free; a lightweight freemium model gates only the volume of exports. An optional Pro subscription ($9.90/month) removes limits and unlocks premium features.

The product is a single-page WYSIWYG editor wrapped in a set of SEO landing pages and a signed-in dashboard that persists a user's business details, clients, saved items, and document history in the cloud so billing can continue across sessions and devices.

### 1.1 Positioning

"Create and download a professional invoice in under a minute — free, no watermark, no account needed." BillCrafter competes with invoice-generator.com, Invoice Simple, and Zoho Invoice's free tier, differentiating on: a genuinely watermark-free free tier, a true what-you-see-is-what-you-get editor, a colored template library with real layout variety, and account-based continuity for repeat billing.

### 1.2 Target users

Freelancers, independent contractors, consultants, photographers, cleaners, and small-business owners in the US who need to bill clients occasionally and don't want heavyweight accounting software.

---

## 2. Goals & non-goals

### Goals
- Let anyone produce a correct, good-looking billing document with zero friction.
- Convert anonymous users into free accounts (email capture) and free accounts into Pro.
- Rank organically for high-intent "invoice generator" long-tail queries via a programmatic SEO matrix.
- Give the operator real operational visibility (users, revenue, email, payments, traffic) through an admin console.

### Non-goals
- Full accounting / bookkeeping, double-entry ledgers, or tax filing.
- Multi-user team collaboration and role management (a "Teams" tier is scaffolded in the data model but not sold).
- Native mobile apps.
- Storing raw card/payment credentials (handled entirely by the payment provider).

---

## 3. Tech stack & architecture

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19) |
| Hosting | Cloudflare, via OpenNext (`@opennextjs/cloudflare`) — runs on the Workers runtime |
| Database | Cloudflare D1 (SQLite) |
| Sessions | Cloudflare KV |
| Email | Resend HTTP API |
| Payments | Waffo Pancake (primary) with a PayPal no-code link as fallback |
| PDF export | html2pdf.js (loaded from CDN, client-side) |
| Styling | Custom CSS, dark monochrome theme |

**Runtime note:** because the app runs on the Cloudflare Workers runtime (not Node.js), all server cryptography (auth password hashing, payment request signing, webhook verification) is implemented with the Web Crypto API rather than Node's `crypto`.

---

## 4. Information architecture (shipped routes)

### Public pages
- `/` — Home: hero + live WYSIWYG invoice editor + marketing sections + pricing.
- `/templates` — Template gallery (28 templates across 7 visual styles).
- `/templates/[slug]` — Individual template landing page.
- `/[slug]` — Programmatic SEO landing pages (9 verticals; see §11).
- `/terms`, `/privacy` — Legal pages (CCC STUDIO, US governing law).
- `/contact` — Contact form + direct email channels.
- `/upgrade` — Pro subscription checkout.
- `/login`, `/signup` — Authentication.

### Signed-in
- `/dashboard` — User console (overview, invoices, clients, items, business profile).

### Admin
- `/admin` — Operator console (separate admin auth).

---

## 5. Core feature — the invoice editor

A client-side WYSIWYG editor (`components/InvoiceEditor.jsx`) embedded on the home page, template pages, and inside the dashboard.

### 5.1 Document types
Four types share one engine, each with correct terminology: **Invoice, Estimate, Quote, Receipt**.

### 5.2 Editing
- Live, what-you-see-is-what-you-get preview — the on-screen sheet is exactly what exports.
- Editable business ("From") block, client ("Bill to") block, line items (description, detail, qty, rate, auto-computed amount), and adjustments (discount, tax %, shipping, amount paid → balance due).
- Logo upload, currency selection, document number, issue/due dates, PO number, payment method, payment notes, and notes.
- Optional fields are clearly marked optional.
- Scenario presets (e.g. freelance, contractor, consulting, photography, cleaning, small business) prefill sensible defaults.

### 5.3 Templates
- **28 templates** across **7 CSS visual styles** (`classic`, `minimal`, `elegant`, `compact`, `mono`, `ruled`, `band`) — differing in layout, not just name.
- **12 colored accents** (color palette opened up beyond monochrome).

### 5.4 Export & delivery
- **PDF** (html2pdf), **Word** (.doc HTML blob), **Excel** (.xls HTML blob).
- **Print**.
- **Email invoice** — sends the generated PDF as an attachment to any recipient via Resend, with reply-to set to the sender's account email. Available to any signed-in user (free included).

### 5.5 Export quota (freemium gate)
| Plan | Export allowance |
| --- | --- |
| Anonymous | 1 export total |
| Free (signed-in) | 10 exports / month |
| Pro | Unlimited |

- Every export path (PDF/Word/Excel/email) counts against the allowance.
- For signed-in users the counter is authoritative **server-side** in D1 (`export_usage`, keyed by user + month), so it survives cache clears and works across devices; the client mirrors it in `localStorage`.
- After each export the UI shows remaining count; at ≤3 left it warns; on the last one it prompts to upgrade; when exhausted the export is gated behind a signup/upgrade prompt.
- For signed-in users, any export also auto-saves the document to their account so it appears in dashboard history and the activity heatmap.

---

## 6. Accounts & authentication

Real server-backed auth (D1 users table + KV sessions, cookie `bc_session`).

- **Email + password** — PBKDF2 hashing via Web Crypto. The in-editor modal does a smart "log in or auto-create account" flow so users never hit a dead end.
- **Magic link** — passwordless sign-in via a tokenized link emailed through Resend (`magic_tokens` table, 15-min expiry).
- **Google OAuth** — implemented in code but currently hidden/disabled (no Google Cloud project yet).
- Session reconciliation: the editor calls `/api/auth/me` on load so the real server session (and correct plan) is the source of truth, clearing any stale local-only login.

---

## 7. Signed-in dashboard

`/dashboard` — starts empty on a new account and fills in as the user works.

- **Overview** — welcome header with plan badge, KPI cards (invoices, clients, saved items, activity total), a **GitHub-style activity heatmap** (last 26 weeks, driven by real saved/exported documents), and recent invoices.
- **Invoices** — template picker to start a new document (kept in-app, not bounced to the home page) plus the user's saved records.
- **Clients** — CRUD address book with a "star / regular" favorite flag; email is format-validated (won't accept a bare string without `@`).
- **Items & services** — reusable line items with default rates and taxable flag.
- **Business profile** — auto-fills the "From" block on every document. Multiple profiles are reserved for a future Teams tier; free/Pro get one.
- **Upgrade banner** — free users see a persistent "Upgrade to Pro" entry point at the top of the dashboard.

Data persists to D1 through a generic per-user record store (`records` table: `id / user_id / kind / data-JSON`) via `/api/db/[kind]`, with a `localStorage` fallback layer.

---

## 8. Pricing & billing

### 8.1 Plans
| Plan | Price | What you get |
| --- | --- | --- |
| **Free** | $0 | Full editor, all templates, 10 exports/month, email delivery, cloud account |
| **Pro** | **$9.90 / month** | Unlimited exports, no watermark, premium templates & colors, email + tracking, priority support |

Pricing is intentionally simple — Free + Pro monthly only (no annual toggle, no Teams tier for sale).

### 8.2 Payments — Waffo Pancake (primary)
- **Checkout:** `/api/checkout` creates a Waffo Pancake subscription checkout session (API-Key auth, RSA-SHA256 request signing via Web Crypto) and redirects the user to the hosted checkout page.
- **Webhook:** `/webhooks` receives Pancake events, verifies the `X-Waffo-Signature` (`t=…,v1=…`, RSA-SHA256 over `${t}.${body}`, 5-minute replay window), dedups by `eventType+eventId`, and:
  - grants Pro on `subscription.activated` / `subscription.payment_succeeded` / `order.completed`,
  - revokes on `subscription.canceled` / `refund.succeeded`.
  - Matches the account by buyer email or by `orderMetadata.userId`.
- **Fallback:** if Waffo isn't fully configured, the Upgrade button falls back to a PayPal no-code payment link, and an admin can manually toggle a user to Pro.
- No card or PayPal credentials are ever stored by BillCrafter.

---

## 9. Admin console

`/admin` — separate admin authentication (KV sessions, cookie `bc_admin`; seeded superadmin). Live, D1-backed (not a demo). Panes:

- **Overview** — KPIs (users, Pro subscribers, invoices, clients) + recent users.
- **Users** — list with join dates and a one-click **Make Pro / Make Free** toggle.
- **Traffic** — unique visitors (distinct IPs), export totals, **top templates by exports**, and a recent-activity log with IP, country, user, template, and format.
- **Subscriptions** — Pro count and estimated MRR.
- **Payments** — Waffo webhook log (event, ref, amount, result: granted/revoked/unmatched/bad signature).
- **Email log** — every invoice email sent (sender, recipient, subject, status).
- **Content / SEO** — status of all SEO and template pages.
- **Audit log** — admin actions.

---

## 10. Analytics & operational logging

Four purpose-built D1 tables feed the admin console:

| Table | Purpose |
| --- | --- |
| `analytics_log` | Visitor IP/country (from Cloudflare headers) + template-usage events; one `visit` per session, one `export` per download |
| `email_log` | Invoice emails sent (metadata + delivery status) |
| `webhook_log` | Waffo payment events + entitlement outcome |
| `export_usage` | Per-user monthly export counter |

IP logging is disclosed in the privacy policy (Device & log data / Usage data).

---

## 11. SEO strategy

Programmatic landing-page matrix (`lib/seo.js`) — 9 vertical/intent pages, each a full editor pre-loaded with a relevant preset:

`freelance-invoice-generator`, `contractor-invoice-generator`, `consulting-invoice-generator`, `small-business-invoice-generator`, `photography-invoice-template`, `cleaning-invoice-template`, `estimate-generator`, `quote-generator`, `receipt-maker` — plus the 28 `/templates/[slug]` pages.

Technical SEO shipped: `app/sitemap.js`, `public/robots.txt`, per-page canonical URLs, Open Graph image, custom 404, web manifest, Yandex verification file. Off-page growth plan (directories, HARO/Featured, listicles) documented separately.

---

## 12. Legal & compliance

- **Terms of Service** and **Privacy Policy** — operator CCC STUDIO, US governing law, support@billcrafter.com; payment processor disclosed; no template placeholders remain.
- **Contact** page + form (routes to support@ via Resend) and direct channels (support@, privacy@, legal@).
- Session cookie described as strictly necessary; account/data deletion honored.

---

## 13. Data model (D1 tables)

`users` (id, email, password_hash, plan, created_at) · `magic_tokens` · `records` (generic per-user store for clients/items/profiles/invoices) · `admins` · `audit_log` · `subscriptions` · `email_log` · `webhook_log` · `export_usage` · `analytics_log`. Sessions live in KV.

---

## 14. Configuration (deployment secrets)

Set via `wrangler secret put`:
`EMAIL_API_KEY` (Resend), `EMAIL_FROM`, optional `CONTACT_TO`; `WAFFO_MERCHANT_ID`, `WAFFO_PRIVATE_KEY`, `WAFFO_PRO_PRODUCT_ID`, `WAFFO_WEBHOOK_PUBLIC_KEY`, optional `WAFFO_STORE_ID`; PayPal fallback vars. `APP_URL` in `[vars]`. D1 migrations `0002`–`0010` plus `schema.sql`.

---

## 15. Known limitations / future work

- Google login is built but disabled pending a Google Cloud project.
- Teams tier (multi-profile, seats) exists in the data model but is not sold.
- Waffo Pancake requires a subscription product to be created in the dashboard and secrets configured before it supersedes the PayPal fallback.
- No automated test suite yet; verification is via `node --check` and manual QA (production build runs on the maintainer's machine, not in the sandboxed dev environment).
