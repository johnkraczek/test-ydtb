-- Database reset/seed script created at 2025-12-15T21:59:30.988Z
-- This script contains the initial seed data for the database

-- Seed users
INSERT INTO ydtb_users (id, name, email, emailVerified, image, metadata, createdAt, updatedAt) VALUES ('Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n', 'John Kraczek', 'john@kraczek.com', '1970-01-01T00:00:00.001Z', '', '{"id":"Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n","name":"John Kraczek","email":"john@kraczek.com","emailVerified":true,"image":null,"twoFactorEnabled":false,"createdAt":"2025-12-14T05:17:23.913Z","updatedAt":"2025-12-15T21:49:50.212Z"}', '2025-12-14T05:17:23.913Z', '2025-12-15T21:49:50.212Z');

-- Seed workspaces
INSERT INTO ydtb_workspaces (id, name, slug, metadata, createdAt, updatedAt) VALUES ('seQlI6FCrlYpIhfhP0fPbbFyG3eTryox', 'abc', 'abc', '{"description":"","type":"Company","tools":[],"iconType":"lucide","icon":"Building2","iconColor":"indigo","backgroundColor":"indigo"}', '2025-12-15T21:50:15.620Z', '2025-12-15T21:50:15.622Z');

-- Seed accounts
INSERT INTO ydtb_accounts (id, userId, providerId, accountId, accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt) VALUES ('EdftQ5DJ9IGsDvPs2bOqoCrth32ZIaIG', 'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n', 'credential', 'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n', NULL, NULL, NULL, NULL, NULL, NULL, 'c45e860a7f6fb2033b51794f8db50b39:dbae3752ef6ef995bbf752993df073c7e5f99a898823b32bfabd1fa79c7822c6874ae9358a5754edb540f92ee97790e05477b7e64ebd91f0f849faf29739ef1d', '2025-12-14T05:17:23.927Z', '2025-12-14T05:17:23.927Z');

-- Seed sessions
INSERT INTO ydtb_sessions (id, userId, token, expiresAt, user, ipAddress, userAgent, activeOrganizationId, createdAt, updatedAt) VALUES ('FzD3838MIlnyqzzkJ7drYIuzqyxdDkW8', 'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n', 'gqbcWqSSzU3fsrg3iJwrgIxYZSpjzHE4', '2025-12-22T21:49:58.789Z', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'seQlI6FCrlYpIhfhP0fPbbFyG3eTryox', '2025-12-15T21:49:58.790Z', '2025-12-15T21:50:15.767Z');

-- Seed workspace members
INSERT INTO ydtb_workspace_members (id, organizationId, userId, role, createdAt) VALUES ('TAhECfEJO8s2OpDUbxCXcEPaaXs874jK', 'seQlI6FCrlYpIhfhP0fPbbFyG3eTryox', 'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n', 'owner', '2025-12-15T21:50:15.627Z');

