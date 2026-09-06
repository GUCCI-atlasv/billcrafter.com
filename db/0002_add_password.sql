-- Migration: add password_hash to users (for email+password auth).
-- Apply once if you already created the DB from an earlier schema.sql:
--   wrangler d1 execute billcrafter --remote --file=./db/0002_add_password.sql
-- (SQLite has no "IF NOT EXISTS" for ADD COLUMN; run once. If it errors that the
--  column exists, it's already applied — ignore.)
ALTER TABLE users ADD COLUMN password_hash TEXT;
