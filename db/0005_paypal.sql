-- Add provider columns to subscriptions for PayPal (and future providers).
--   wrangler d1 execute billcrafter --remote --file=./db/0005_paypal.sql
-- Run once. If a column already exists, SQLite errors — ignore that line.
ALTER TABLE subscriptions ADD COLUMN provider TEXT;
ALTER TABLE subscriptions ADD COLUMN provider_subscription_id TEXT;
