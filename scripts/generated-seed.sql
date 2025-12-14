-- Seed data for YDTB database
-- Generated on 2025-12-14T05:52:43.878Z

-- 1. Insert sample users
INSERT INTO ydtb_users (id, name, email, email_verified, two_factor_enabled, created_at, updated_at)
VALUES
  ('deBv3Yj8plGQw5XIaJthil9MyXYPwutN', 'John Kraczek', 'john@kraczek.com', false, false, 'Sun Dec 14 2025 05:17:23 GMT-0700 (Mountain Standard Time)', 'Sun Dec 14 2025 05:17:23 GMT-0700 (Mountain Standard Time)');

-- 2. Insert accounts (passwords omitted for security)
-- NOTE: You'll need to add passwords manually using:
-- UPDATE ydtb_accounts SET password = '$2b$10$yourHashedPasswordHere' WHERE id = 'account_id';
INSERT INTO ydtb_accounts (id, user_id, provider_id, account_id, created_at, updated_at)
VALUES
  ('EdftQ5DJ9IGsDvPs2bOqoCrth32ZIaIG', 'deBv3Yj8plGQw5XIaJthil9MyXYPwutN', 'credential', 'deBv3Yj8plGQw5XIaJthil9MyXYPwutN', 'Sun Dec 14 2025 05:17:23 GMT-0700 (Mountain Standard Time)', 'Sun Dec 14 2025 05:17:23 GMT-0700 (Mountain Standard Time)');

-- 5. Add sample passwords for test accounts
-- password123 for deBv3Yj8plGQw5XIaJthil9MyXYPwutN
-- UPDATE ydtb_accounts SET password = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE id = 'EdftQ5DJ9IGsDvPs2bOqoCrth32ZIaIG';

