-- Admin sessions in D1 (avoids Cloudflare KV free-tier daily write limit).
--   wrangler d1 execute billcrafter --remote --file=./db/0007_admin_sessions.sql

CREATE TABLE IF NOT EXISTS admin_sessions (
  sid         TEXT PRIMARY KEY,
  admin_id    TEXT NOT NULL,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL,
  expires_at  INTEGER NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_exp ON admin_sessions(expires_at);
