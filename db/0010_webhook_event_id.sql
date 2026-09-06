-- Add event_id to webhook_log for Waffo Pancake idempotent dedup (eventType+eventId).
--   wrangler d1 execute billcrafter --remote --file=./db/0010_webhook_event_id.sql

ALTER TABLE webhook_log ADD COLUMN event_id TEXT;
CREATE INDEX IF NOT EXISTS idx_webhook_event ON webhook_log(event_type, event_id);
