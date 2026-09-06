-- Per-user monthly export counter (server-side quota for free accounts).
--   wrangler d1 execute billcrafter --remote --file=./db/0008_export_usage.sql

CREATE TABLE IF NOT EXISTS export_usage (
  user_id     TEXT NOT NULL,
  month       TEXT NOT NULL,   -- 'YYYY-MM'
  count       INTEGER NOT NULL DEFAULT 0,
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, month)
);
