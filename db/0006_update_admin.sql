-- Rotate seed admin to likethelocalsstudio@gmail.com / 123456.
--   wrangler d1 execute billcrafter --remote --file=./db/0006_update_admin.sql

DELETE FROM admins WHERE email IN ('guochi@atlasv.com', 'likethelocalsstudio@gmail.com')
  OR id IN ('adm_guochi', 'adm_likethelocals');

INSERT INTO admins (id, email, password_hash, role, must_change_password, created_at)
VALUES (
  'adm_likethelocals',
  'likethelocalsstudio@gmail.com',
  'pbkdf2$100000$Pyr+yKdjZAcuNdUTQV5Vag==$F19cCQMVlFXFFFPPHtJhEeFupLj6IHN0okJJxhmOQao=',
  'superadmin',
  0,
  1751000000000
);
