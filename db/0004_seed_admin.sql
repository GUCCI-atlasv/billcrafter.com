-- Seed the initial superadmin. Password below is a PBKDF2 hash of the seed
-- password '123456' (matching lib/server/auth). CHANGE IT after first login.
--   wrangler d1 execute billcrafter --remote --file=./db/0004_seed_admin.sql

INSERT OR IGNORE INTO admins (id, email, password_hash, role, must_change_password, created_at)
VALUES (
  'adm_likethelocals',
  'likethelocalsstudio@gmail.com',
  'pbkdf2$100000$Pyr+yKdjZAcuNdUTQV5Vag==$F19cCQMVlFXFFFPPHtJhEeFupLj6IHN0okJJxhmOQao=',
  'superadmin',
  0,
  1751000000000
);

-- To change the password later, use /admin → Account, or generate a new PBKDF2 hash and run:
-- UPDATE admins SET password_hash = 'pbkdf2$...' WHERE email = 'likethelocalsstudio@gmail.com';
