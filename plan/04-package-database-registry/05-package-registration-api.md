# Unit 4.5: Package Registration API
**Folder**: `04-package-database-registry`

**Purpose**: Create the public API that packages will use to register their schemas and migrations

**Context**:
- Packages need a simple way to register schemas
- API should be similar to environment registry
- Must support both runtime and build-time registration
- Should provide helpful error messages
- Units 4.1-4.4 provide the underlying infrastructure

**Definition of Done**:
- [ ] Public registration API implemented
- [ ] Helper functions for common patterns
- [ ] TypeScript documentation and examples
- [ ] Development mode features
- [ ] Integration with package loading

**Implementation Steps**:
1. **Create registration API** in `/apps/core/src/lib/registry/register-database.ts`:
   - `registerDatabase` function for packages
   - `createSchema` helper for common patterns
   - `createMigration` helper utilities
   - Validation helpers for package developers

2. **Implement package discovery**:
   - Automatic package scanning in development
   - Dynamic registration on import
   - Hot-reload support for schema changes
   - Debug logging for development

3. **Add developer utilities**:
   - Schema validation helpers
   - Migration generation helpers
   - Testing utilities for package schemas
   - Documentation generators

**Files to Create/Update**:
- Create: `/apps/core/src/lib/registry/register-database.ts`
- Create: `/apps/core/src/lib/registry/dev-scanner.ts` (for development)
- Update: `/apps/core/src/registry/index.ts` (export new functions)

**API Usage Example**:
```typescript
// In package/src/database.ts
import { registerDatabase, createSchema } from '@ydtb/core/registry';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const packageTable = createTable('my_table', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

registerDatabase({
  packageName: '@ydtb/my-package',
  version: '1.0.0',
  schema: { packageTable },
  migrations: [...],
  dependencies: ['@ydtb/required-package']
});
```

**Helper Functions**:
```typescript
// Create a table with workspace isolation
const myTable = createWorkspaceTable('my_table', {
  id: text('id').primaryKey(),
  // workspaceId automatically added
  name: text('name').notNull()
});

// Create a migration
const addMyTableMigration = createMigration({
  id: '001-add-my-table',
  version: '1.0.0',
  up: async (db) => {
    await db.execute(sql`CREATE TABLE ...`);
  },
  down: async (db) => {
    await db.execute(sql`DROP TABLE ...`);
  }
});
```

**Build Verification**:
- After creating registration API, run `bun run build` to ensure TypeScript compilation
- After implementing package discovery, run `bun run build` to verify scanning
- After adding utilities, run `bun run build` to confirm helper functions

**Internal Communication Patterns**:
- Registration API calls database registry (Unit 4.1)
- Schema validation through validator (Unit 4.2)
- Migration registration through migration system (Unit 4.3)
- Package discovery uses filesystem scanning in development

**Development Features**:
- Hot-reload detection for schema changes
- Automatic package scanning
- Debug logging with detailed information
- Validation bypass flags with warnings
- Schema change notifications

**Package Auto-Discovery**:
```typescript
// In development, automatically discover and register packages
if (process.env.NODE_ENV === 'development') {
  const scanner = new PackageScanner();
  await scanner.discoverAndRegister('./packages');
}
```

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Node.js File System](https://nodejs.org/api/fs.html) - For package scanning
- [Drizzle Schema Helpers](https://orm.drizzle.team/docs/goodies) - For schema patterns

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **API Testing**: Test API with example packages
- **Hot Reload**: Verify hot-reload detects schema changes correctly
- **Clear Messages**: Ensure API errors are developer-friendly