-- Log of incoming Waffo payment webhooks (Admin console -> Payments).
--   wrangler d1 execute billcrafter --remote --file=./db/0007_webhook_log.sql

CREATE TABLE IF NOT EXISTS webhook_log (
  id          TEXT PRIMARY KEY,
  provider    TEXT NOT NULL DEFAULT 'waffo',
  event_type  TEXT,
  status      TEXT NOT NULL,   -- pro_granted | pro_revoked | paid_unmatched | received | bad_signature | error
  ref         TEXT,            -- email / merchantOrderId used to match a user
  amount      TEXT,
  currency    TEXT,
  raw         TEXT,            -- truncated raw payload for debugging
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_webhook_log_created ON webhook_log(created_at DESC);
