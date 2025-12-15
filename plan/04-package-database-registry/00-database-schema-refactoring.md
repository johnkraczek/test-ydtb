# Unit 4.0: Database Schema Refactoring
**Folder**: `04-package-database-registry`

**Purpose**: Refactor the monolithic database schema file into domain-specific modules for better organization and maintainability

**Context**:
- Current schema file `/apps/core/src/server/db/schema.ts` contains all tables in a single file
- As the system grows, this will become unwieldy
- Need to organize tables by business domain for better developer experience
- Will make it easier for packages to import only the schemas they need
- Must maintain all existing functionality during refactoring

**Current Schema Domains Identified**:
1. **Authentication**: Users, sessions, accounts, verifications, passkeys
2. **Workspaces**: Workspaces, workspace members, invitations
3. **Shared**: Utilities, common exports, relations

**Definition of Done**:
- [ ] Database schema refactored into domain-specific folders
- [ ] Common utilities extracted to shared folder
- [ ] All existing exports maintained
- [ ] Build passes without errors
- [ ] Database operations continue to work
- [ ] Migrations continue to work

**Implementation Steps**:
1. **Create database folder structure**:
   ```
   apps/core/src/server/db/
   ├── index.ts              # Main export file
   ├── utils/
   │   ├── index.ts         # Export all utilities
   │   └── table-builder.ts # pgTableCreator and common functions
   ├── auth/
   │   ├── index.ts         # Export all auth schemas
   │   ├── users.ts         # User table
   │   ├── sessions.ts      # Session table
   │   ├── accounts.ts      # Account table
   │   ├── verifications.ts # Verification table
   │   ├── passkeys.ts      # Passkey table
   │   └── relations.ts     # Auth relations
   ├── workspaces/
   │   ├── index.ts         # Export all workspace schemas
   │   ├── workspaces.ts    # Workspace table
   │   ├── members.ts       # Workspace members table
   │   ├── invitations.ts   # Invitation table
   │   └── relations.ts     # Workspace relations
   └── schema.ts            # Re-export everything (maintain backwards compatibility)
   ```

2. **Extract table builder and utilities**:
   - Move `createTable` function to `utils/table-builder.ts`
   - Add common field creators (e.g., `idField`, `timestamps`)
   - Create utility functions for common patterns

3. **Refactor authentication schemas**:
   - Move user table to `auth/users.ts`
   - Move session table to `auth/sessions.ts`
   - Move account table to `auth/accounts.ts`
   - Move verification table to `auth/verifications.ts`
   - Move passkey table to `auth/passkeys.ts`
   - Extract auth relations to `auth/relations.ts`

4. **Refactor workspace schemas**:
   - Move workspaces table to `workspaces/workspaces.ts`
   - Move workspace members table to `workspaces/members.ts`
   - Move invitations table to `workspaces/invitations.ts`
   - Extract workspace relations to `workspaces/relations.ts`

5. **Create export files**:
   - Create `auth/index.ts` to export all auth schemas
   - Create `workspaces/index.ts` to export all workspace schemas
   - Create `utils/index.ts` to export all utilities
   - Create main `index.ts` to export everything
   - Keep `schema.ts` as a re-export for backwards compatibility

6. **Update imports throughout the codebase**:
   - Search for imports from `schema.ts`
   - Update to use new domain-specific imports where appropriate
   - Ensure no breaking changes

**Files to Create**:
- `apps/core/src/server/db/utils/index.ts`
- `apps/core/src/server/db/utils/table-builder.ts`
- `apps/core/src/server/db/auth/index.ts`
- `apps/core/src/server/db/auth/users.ts`
- `apps/core/src/server/db/auth/sessions.ts`
- `apps/core/src/server/db/auth/accounts.ts`
- `apps/core/src/server/db/auth/verifications.ts`
- `apps/core/src/server/db/auth/passkeys.ts`
- `apps/core/src/server/db/auth/relations.ts`
- `apps/core/src/server/db/workspaces/index.ts`
- `apps/core/src/server/db/workspaces/workspaces.ts`
- `apps/core/src/server/db/workspaces/members.ts`
- `apps/core/src/server/db/workspaces/invitations.ts`
- `apps/core/src/server/db/workspaces/relations.ts`
- `apps/core/src/server/db/index.ts`

**Files to Update**:
- `apps/core/src/server/db/schema.ts` (convert to re-exports)

**Refactoring Guidelines**:
1. **Maintain Imports**: All existing imports must continue to work
2. **No Breaking Changes**: Database operations should work without modification
3. **Clear Exports**: Each domain has a clear index file with its exports
4. **Type Safety**: Maintain all TypeScript types and exports
5. **Documentation**: Add comments explaining the new structure

**Example of Refactored Structure**:

```typescript
// utils/table-builder.ts
import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ydtb_${name}`);

export const idField = () => text("id").primaryKey();
export const timestamps = () => ({
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

```typescript
// auth/users.ts
import { createTable, idField, timestamps } from "../utils";
import { text, boolean } from "drizzle-orm/pg-core";

export const user = createTable("users", {
  id: idField(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  ...timestamps(),
});
```

```typescript
// auth/index.ts
export * from "./users";
export * from "./sessions";
export * from "./accounts";
export * from "./verifications";
export * from "./passkeys";
export * from "./relations";
```

```typescript
// index.ts
export * from "./utils";
export * from "./auth";
export * from "./workspaces";

// Re-export types for backwards compatibility
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
// ... other types
```

**Build Verification**:
- After each domain is refactored, run `bun run build` to ensure no errors
- After completing all refactoring, run full test suite
- Verify database migrations still work
- Check that all exports are accessible

**Benefits of This Structure**:
1. **Better Organization**: Tables grouped by business domain
2. **Easier Navigation**: Developers can quickly find relevant tables
3. **Reduced Merge Conflicts**: Smaller files mean fewer conflicts
4. **Selective Imports**: Packages can import only what they need
5. **Clearer Dependencies**: Relations between domains are explicit

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Drizzle Schema Documentation](https://orm.drizzle.team/docs/goodies) - For schema patterns
- [TypeScript Module Exports](https://www.typescriptlang.org/docs/handbook/modules.html) - For export patterns

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Incremental Refactoring**: Move one table at a time and build
- **Import Verification**: Test that all imports still resolve
- **Type Checking**: Ensure all types are properly exported

**Migration Strategy**:
1. Create new folder structure
2. Move one table at a time
3. Build and test after each move
4. Update imports gradually
5. Remove old file only when everything works

This refactoring sets up the database schema for better scalability and makes it easier to implement the package database registry system that follows.