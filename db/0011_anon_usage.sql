-- Anonymous (not-signed-in) export quota, keyed by IP.
-- Rolling per-month rather than lifetime: shared/CGNAT IPs would otherwise
-- permanently block legitimate first-time visitors.
--   wrangler d1 execute billcrafter --remote --file=./db/0011_anon_usage.sql

CREATE TABLE IF NOT EXISTS anon_usage (
  ip          TEXT NOT NULL,
  month       TEXT NOT NULL,   -- 'YYYY-MM'
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (ip, month)
);
