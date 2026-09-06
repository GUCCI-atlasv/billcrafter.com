-- Complimentary / test Pro accounts.
-- A test account has FULL Pro entitlement (plan = 'pro', so every existing
-- `plan === 'pro'` check passes untouched) but is flagged comp = 1 so it is
-- excluded from paid-subscriber counts and MRR. Use it to exercise Pro features
-- without inflating revenue or going through checkout.
ALTER TABLE users ADD COLUMN comp INTEGER NOT NULL DEFAULT 0;
