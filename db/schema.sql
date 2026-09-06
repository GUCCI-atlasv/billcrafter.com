-- BillCrafter — Cloudflare D1 schema (SQLite)
-- Apply: wrangler d1 execute billcrafter --file=./db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT,                             -- pbkdf2 (argon2/bcrypt also fine); null for OAuth-only
  plan          TEXT NOT NULL DEFAULT 'free',     -- 'free' | 'pro'
  comp          INTEGER NOT NULL DEFAULT 0,        -- 1 = complimentary/test Pro (entitled, but not a paying subscriber)
  locale        TEXT DEFAULT 'en',
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  expires_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS magic_tokens (
  token         TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  expires_at    INTEGER NOT NULL,
  used          INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS business_profile (
  user_id       TEXT PRIMARY KEY REFERENCES users(id),
  name          TEXT, logo_url TEXT, address TEXT, email TEXT, phone TEXT, tax_id TEXT,
  default_currency TEXT DEFAULT 'USD', default_tax_rate REAL DEFAULT 0,
  default_terms TEXT, brand_color TEXT DEFAULT '#16181C', template TEXT DEFAULT 'modern',
  number_format TEXT DEFAULT 'INV-0001'
);

CREATE TABLE IF NOT EXISTS clients (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  name          TEXT NOT NULL, email TEXT, address TEXT, phone TEXT,
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  name          TEXT NOT NULL, description TEXT, default_rate REAL DEFAULT 0, taxable INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS invoices (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  doc_type      TEXT NOT NULL DEFAULT 'invoice',   -- invoice | estimate | quote | receipt
  number        TEXT NOT NULL,
  client_name   TEXT, currency TEXT DEFAULT 'USD',
  issue_date    TEXT, due_date TEXT,
  status        TEXT NOT NULL DEFAULT 'Draft',      -- Draft | Sent | Viewed | Paid | Overdue
  total         REAL NOT NULL DEFAULT 0,
  data_json     TEXT NOT NULL,                      -- full document snapshot
  pdf_key       TEXT,                               -- R2 object key (archived PDF)
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id, created_at DESC);

-- (Export-quota tables are defined near the bottom of this file: `export_usage`
--  for signed-in accounts and `anon_usage` for IP-based anonymous limits.)

-- Generic per-user record store used by the dashboard (clients/items/profiles/invoices)
CREATE TABLE IF NOT EXISTS records (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  kind        TEXT NOT NULL,   -- 'client' | 'item' | 'profile' | 'invoice'
  data        TEXT NOT NULL,   -- JSON of the record fields
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_records_user_kind ON records(user_id, kind, created_at DESC);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id            TEXT PRIMARY KEY REFERENCES users(id),
  provider           TEXT,       -- 'paypal' | 'stripe'
  provider_subscription_id TEXT,
  stripe_customer_id TEXT, stripe_subscription_id TEXT,
  status             TEXT,       -- active | past_due | canceled
  current_period_end INTEGER
);

-- Admin console
CREATE TABLE IF NOT EXISTS admins (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,           -- argon2/bcrypt — NEVER plaintext
  role          TEXT NOT NULL DEFAULT 'support',  -- superadmin | support
  totp_secret   TEXT,                    -- 2FA
  must_change_password INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_email   TEXT NOT NULL,
  action        TEXT NOT NULL,
  target        TEXT,
  created_at    INTEGER NOT NULL
);

-- Seed admin: insert with a HASH generated offline. Example (replace the hash!):
-- INSERT INTO admins (id,email,password_hash,role,must_change_password,created_at)
-- VALUES ('adm_1','likethelocalsstudio@gmail.com','$argon2id$...REPLACE_ME...','superadmin',1, unixepoch());
-- The seed password is '123456' FOR FIRST LOGIN ONLY — force a change immediately.

-- Invoice email log (Admin console -> Email log)
CREATE TABLE IF NOT EXISTS email_log (
  id          TEXT PRIMARY KEY,
  user_id     TEXT,
  user_email  TEXT,
  to_email    TEXT NOT NULL,
  subject     TEXT,
  filename    TEXT,
  status      TEXT NOT NULL,   -- 'sent' | 'failed'
  error       TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_log_created ON email_log(created_at DESC);

-- Waffo payment webhook log (Admin console -> Payments)
CREATE TABLE IF NOT EXISTS webhook_log (
  id          TEXT PRIMARY KEY,
  provider    TEXT NOT NULL DEFAULT 'waffo',
  event_type  TEXT,
  event_id    TEXT,
  status      TEXT NOT NULL,
  ref         TEXT,
  amount      TEXT,
  currency    TEXT,
  raw         TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_webhook_log_created ON webhook_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_event ON webhook_log(event_type, event_id);

-- Per-user monthly export counter (free plan quota)
CREATE TABLE IF NOT EXISTS export_usage (
  user_id     TEXT NOT NULL,
  month       TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, month)
);

-- Analytics: visitor IPs + template usage (Admin -> Traffic)
CREATE TABLE IF NOT EXISTS analytics_log (
  id          TEXT PRIMARY KEY,
  event       TEXT NOT NULL,
  user_email  TEXT,
  ip          TEXT,
  country     TEXT,
  path        TEXT,
  template    TEXT,
  doc_type    TEXT,
  format      TEXT,
  referrer    TEXT,
  ua          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_template ON analytics_log(template);

-- Anonymous export quota by IP (rolling monthly)
CREATE TABLE IF NOT EXISTS anon_usage (
  ip          TEXT NOT NULL,
  month       TEXT NOT NULL,
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (ip, month)
);

-- Share links + view tracking (Pro)
CREATE TABLE IF NOT EXISTS share_links (
  token TEXT PRIMARY KEY, user_id TEXT NOT NULL, user_email TEXT,
  doc_json TEXT NOT NULL, title TEXT, locale TEXT DEFAULT 'en',
  revoked INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_share_user ON share_links(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS share_views (
  id TEXT PRIMARY KEY, token TEXT NOT NULL, ip TEXT, country TEXT, ua TEXT, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_share_views_token ON share_views(token, created_at DESC);

-- Recurring invoices (Pro)
CREATE TABLE IF NOT EXISTS recurring (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, user_email TEXT, title TEXT,
  doc_json TEXT NOT NULL, to_email TEXT NOT NULL, locale TEXT DEFAULT 'en',
  freq TEXT NOT NULL, next_run INTEGER NOT NULL, last_run INTEGER,
  runs INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_recurring_due ON recurring(active, next_run);
