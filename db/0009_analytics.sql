-- Lightweight analytics: visitor IPs and template usage (Admin -> Traffic).
--   wrangler d1 execute billcrafter --remote --file=./db/0009_analytics.sql

CREATE TABLE IF NOT EXISTS analytics_log (
  id          TEXT PRIMARY KEY,
  event       TEXT NOT NULL,   -- 'visit' | 'export'
  user_email  TEXT,            -- null for anonymous visitors
  ip          TEXT,
  country     TEXT,
  path        TEXT,
  template    TEXT,            -- template style id (export events)
  doc_type    TEXT,            -- invoice | estimate | quote | receipt
  format      TEXT,            -- pdf | email  (word/excel retired Aug 2026; old rows keep their value)
  referrer    TEXT,
  ua          TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_template ON analytics_log(template);
