-- Recurring invoices (Pro): a saved snapshot re-sent on a schedule.
--   wrangler d1 execute billcrafter --remote --file=./db/0013_recurring.sql

CREATE TABLE IF NOT EXISTS recurring (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  user_email  TEXT,
  title       TEXT,
  doc_json    TEXT NOT NULL,        -- invoice snapshot to reissue
  to_email    TEXT NOT NULL,        -- client recipient
  locale      TEXT DEFAULT 'en',
  freq        TEXT NOT NULL,        -- 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  next_run    INTEGER NOT NULL,     -- epoch ms
  last_run    INTEGER,
  runs        INTEGER NOT NULL DEFAULT 0,
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_recurring_user ON recurring(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_due ON recurring(active, next_run);
