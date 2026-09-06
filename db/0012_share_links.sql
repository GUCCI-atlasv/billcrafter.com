-- Shareable invoice links + view tracking (Pro).
--   wrangler d1 execute billcrafter --remote --file=./db/0012_share_links.sql

CREATE TABLE IF NOT EXISTS share_links (
  token       TEXT PRIMARY KEY,      -- random, unguessable
  user_id     TEXT NOT NULL,
  user_email  TEXT,
  doc_json    TEXT NOT NULL,         -- full invoice snapshot at share time
  title       TEXT,                  -- e.g. "INV-0042 · Northwind Co."
  locale      TEXT DEFAULT 'en',
  revoked     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_share_user ON share_links(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS share_views (
  id          TEXT PRIMARY KEY,
  token       TEXT NOT NULL,
  ip          TEXT,
  country     TEXT,
  ua          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_share_views_token ON share_views(token, created_at DESC);
