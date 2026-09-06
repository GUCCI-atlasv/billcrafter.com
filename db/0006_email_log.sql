-- Log of invoice emails sent from the editor, shown in the Admin console.
--   wrangler d1 execute billcrafter --remote --file=./db/0006_email_log.sql

CREATE TABLE IF NOT EXISTS email_log (
  id          TEXT PRIMARY KEY,
  user_id     TEXT,            -- sender's account id (may be null if unknown)
  user_email  TEXT,            -- sender's account email (reply-to)
  to_email    TEXT NOT NULL,   -- recipient
  subject     TEXT,
  filename    TEXT,
  status      TEXT NOT NULL,   -- 'sent' | 'failed'
  error       TEXT,            -- provider error detail when failed
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_log_created ON email_log(created_at DESC);
