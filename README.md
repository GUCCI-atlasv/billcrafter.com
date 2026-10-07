# BillCrafter

Free invoice generator for freelancers and small businesses — **Next.js (App Router)**, designed to deploy on **Cloudflare**. Black-and-white "Option D" design, WYSIWYG editor (edit directly on the invoice), Invoice / Estimate / Quote / Receipt document types, export-quota freemium, dashboard, and admin console.

> Status: **front-end complete with mock data + backend interface stubs**. The UI, editor, quota gating, dashboard and admin all run locally; auth / database / payments are stubbed with clear TODOs (see `app/api/*`, `db/schema.sql`, `wrangler.toml`).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
```

## Routes

| Path | What |
|---|---|
| `/` | Landing + WYSIWYG generator (the hero IS the tool) |
| `/freelance-invoice-generator`, `/contractor-invoice-generator`, `/estimate-generator`, `/quote-generator`, `/receipt-maker`, … | SEO matrix pages (config-driven, statically generated from `lib/seo.js`) |
| `/dashboard` | Logged-in area (mock): KPIs, invoice history, clients, items, business profile |
| `/admin` | Admin console. Seed login: `likethelocalsstudio@gmail.com` / `123456` |
| `/api/*` | Backend route stubs: export quota, auth (magic link / Google), invoices, admin login |

## Key concepts

- **WYSIWYG editor** — `components/InvoiceEditor.jsx` (client). Edit on the invoice itself; totals/tax/discount compute live; Type switcher (Invoice/Estimate/Quote/Receipt) with field differences + "convert to next".
- **Free model**: anonymous **1** export per day (by IP), registered accounts **unlimited**. No paid plans. Enforced server-side in `lib/server/quota.js` (the editor mirrors it for the counter).
- **Download PDF** — uses `html2pdf` (loaded from CDN) for a one-click file download; **Print** uses the browser dialog (vector). For production-grade vector PDFs, render server-side with **Cloudflare Browser Rendering** (Puppeteer) — see TODO below.
- **SEO matrix** — add a vertical/doc page by adding an object to `lib/seo.js` (near-zero marginal cost).
- **Icons / logo** — Concept 2 (folded invoice + $), monochrome, in `public/` (`favicon.svg`, `icon-192/512.png`, `apple-touch-icon.png`).

## Deploy to Cloudflare

Using **OpenNext** (recommended for App Router + API routes):

```bash
npm i -D @opennextjs/cloudflare wrangler
npx opennextjs-cloudflare build
npx wrangler deploy
```

Provision resources, then fill the IDs in `wrangler.toml`:

```bash
wrangler d1 create billcrafter
wrangler d1 execute billcrafter --file=./db/schema.sql
wrangler kv namespace create SESSIONS
wrangler r2 bucket create billcrafter-assets
# secrets:
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put EMAIL_API_KEY
```

## Authentication (implemented — email + password)

Real auth is wired against **D1 (users)** + **KV (sessions)** and runs in the Cloudflare worker:

- `POST /api/auth/register` — hashes the password (PBKDF2 via Web Crypto), inserts the user, creates a KV session, sets an httpOnly cookie.
- `POST /api/auth/login` — verifies the hash, creates a session.
- `GET /api/auth/me` — returns the signed-in user from the session cookie.
- `POST /api/auth/logout` — clears the session.

`/login` and `/signup` post to these; `/dashboard` calls `/api/auth/me` and redirects to `/login` if there's no session. Helpers: `lib/server/auth.js`.

**Setup (once):** apply the schema + migrations:
```bash
wrangler d1 execute billcrafter --remote --file=./db/schema.sql
wrangler d1 execute billcrafter --remote --file=./db/0002_add_password.sql   # adds users.password_hash
wrangler d1 execute billcrafter --remote --file=./db/0003_records.sql        # dashboard data (clients/items/profiles/invoices)
wrangler d1 execute billcrafter --remote --file=./db/0004_seed_admin.sql     # seed superadmin (likethelocalsstudio@gmail.com)
```

## Admin console (real, D1-backed)

`/admin` is real, not a demo. Login verifies a **hashed** password against the `admins` table and creates a separate admin session (cookie `bc_admin` in KV). It then shows **live data** from D1: user counts, Pro subscribers, saved invoices/clients, recent users, content/SEO pages, and the audit log. Routes: `app/api/admin/login|me|logout|stats|change-password`.

Seed admin: `likethelocalsstudio@gmail.com` / `123456` (the seed hash is in `db/0004_seed_admin.sql`). Change it after first login via **Account → Change password** in `/admin` (or `UPDATE admins …` in D1). Consider adding TOTP 2FA. Admin auth requires the deployed worker (D1/KV); under plain `next dev` the console shows a "backend unavailable" notice rather than faking data.

## Dashboard data (clients / items / profiles / invoices)

Stored per user in D1 via one generic `records` table (JSON payload), exposed through:
`GET/POST /api/db/{kind}` and `PUT/DELETE /api/db/{kind}/{id}` where `kind` ∈ `clients|items|profiles|invoices` (session-scoped). Client access is in `lib/api.js`, which **falls back to per-account localStorage** when the backend isn't available (local `next dev`), so the dashboard works in both places. A new account starts empty. The invoice editor also best-effort syncs saved invoices to `/api/db/invoices` (id-mapped so re-saving updates, not duplicates). Free/Pro keep one business profile; Teams can add multiple.
Then deploy: `npm run deploy` (OpenNext). Auth requires the worker runtime (D1/KV bindings); under plain `next dev` the API returns 503 and the UI falls back to a local demo session so you can still click through.

### Google sign-in (implemented)

1. In Google Cloud Console → Credentials, create an OAuth 2.0 Client ID (type: Web application).
2. Add the authorized redirect URI: `https://billcrafter.com/api/auth/google/callback` (and a `http://localhost:3000/...` one for local).
3. Set secrets:
   ```bash
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   ```
Flow: `/api/auth/google` → Google consent → `/api/auth/google/callback` exchanges the code, upserts the user in D1, creates a session, and redirects to `/dashboard`. If the credentials aren’t set, the button redirects back to `/login?e=google_not_configured`.

### Magic-link sign-in (implemented)

`POST /api/auth/magic` creates a single-use token (D1 `magic_tokens`, 15-min TTL) and emails a link via **Resend**; `GET /api/auth/magic/verify` consumes it and signs the user in. Configure:
```bash
wrangler secret put EMAIL_API_KEY      # Resend API key
# optional sender (verified domain), else defaults to login@billcrafter.com:
# add EMAIL_FROM under [vars] in wrangler.toml
```
Before you set `EMAIL_API_KEY`, the endpoint returns a one-time `devLink` in the response so you can test sign-in without email.

## Pricing model — free (since Sep 2026)

There are no paid plans and no payment code. Limits live in `lib/server/quota.js`:

- **No account:** 1 PDF export per UTC day, counted by IP (`anon_daily_usage`); status stamps are disabled (stripped server-side in `/api/pdf`).
- **Free account:** unlimited exports, email, share links, recurring invoices, stamps and multiple business profiles.

Apply the migration once: `wrangler d1 execute billcrafter --remote --file=./db/0016_free_model.sql`. `/upgrade` permanently redirects to `/signup`. Old PayPal secrets can be removed with `wrangler secret delete PAYPAL_CLIENT_ID` (etc.).

## Backend TODO (to go from scaffold → production)

- [x] **OAuth / magic link**: implemented — set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and `EMAIL_API_KEY` (Resend) to activate. (see above)
- [ ] **D1**: apply `db/schema.sql`; wire invoices/clients/items/profile CRUD. (`app/api/invoices`)
- [ ] **Export quota**: move the counter server-side (`export_usage`), enforce 1 / 10-mo / unlimited. (`app/api/export`)
- [x] **Billing**: PayPal Subscriptions implemented (`/upgrade` + `app/api/paypal/*`). Stripe remains an optional second provider (`app/api/stripe/webhook` stub).
- [ ] **PDF**: Cloudflare Browser Rendering for vector, text-selectable, paginated PDFs.
- [ ] **R2**: store uploaded logos + archived invoice PDFs.
- [ ] **Admin**: real auth — hashed password (argon2/bcrypt) + **2FA** + forced reset of the seed password; audit logging. (`app/api/admin/login`)

## ⚠️ Security note on the seed admin

`likethelocalsstudio@gmail.com` / `123456` is a **first-login seed only**. Before production: change it in `/admin → Account`, require **TOTP 2FA**, and put the admin app behind a separate session/domain (e.g. Cloudflare Access). Shipping `123456` to production is equivalent to no password.
