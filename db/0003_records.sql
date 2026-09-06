-- Generic per-user record store for dashboard entities
-- (clients / items / profiles / invoices). One table, JSON payload.
--   wrangler d1 execute billcrafter --remote --file=./db/0003_records.sql

CREATE TABLE IF NOT EXISTS records (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  kind        TEXT NOT NULL,   -- 'client' | 'item' | 'profile' | 'invoice'
  data        TEXT NOT NULL,   -- JSON of the record fields
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_records_user_kind ON records(user_id, kind, created_at DESC);
