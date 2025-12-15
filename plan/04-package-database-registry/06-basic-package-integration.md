# Unit 4.6: Integration with Basic Package
**Folder**: `04-package-database-registry`

**Purpose**: Update the basic package to demonstrate database registration

**Context**:
- The `@ydtb/basic` package already exists
- It currently only registers environment variables
- Should serve as a reference for other packages
- Need to add sample tables with workspace isolation
- Units 4.1-4.5 provide the complete registration infrastructure

**Definition of Done**:
- [ ] Basic package registers database schema
- [ ] Sample tables with workspace isolation
- [ ] Migration examples included
- [ ] Documentation for package developers

**Implementation Steps**:
1. **Add database schema to basic package**:
   - Create sample tables following workspace isolation
   - Add workspaceId foreign key
   - Include proper indexes
   - Create example migrations

2. **Update package registration**:
   - Modify `packages/basic/src/index.ts` to register database
   - Keep existing environment variable registration
   - Add version and dependency tracking

3. **Create documentation**:
   - Update package README with database registration
   - Include examples of best practices
   - Document migration patterns

**Files to Create/Update**:
- Create: `packages/basic/src/database.ts`
- Update: `packages/basic/src/index.ts`
- Update: `packages/basic/README.md`
- Create: `packages/basic/drizzle/` (for migrations)

**Sample Schema Example**:
```typescript
// packages/basic/src/database.ts
import { registerDatabase, createWorkspaceTable } from '@ydtb/core/registry';
import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

// Example workspace-isolated table
export const basicNotes = createWorkspaceTable('basic_notes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  workspaceIdx: index('basic_notes_workspace_idx').on(table.workspaceId),
  titleIdx: index('basic_notes_title_idx').on(table.title),
}));

// Register with the central registry
registerDatabase({
  packageName: '@ydtb/basic',
  version: '1.0.0',
  schema: { basicNotes },
  migrations: [
    {
      id: '001-create-basic-notes',
      version: '1.0.0',
      up: async (db) => { /* Migration SQL */ },
      down: async (db) => { /* Rollback SQL */ }
    }
  ],
  dependencies: [] // No dependencies
});
```

**Updated Package Index**:
```typescript
// packages/basic/src/index.ts
import { z } from "zod";
import { registerModule } from "@ydtb/core/registry";
import "./database"; // Register database schema

// Existing environment registration
registerModule("basic", {
  server: {
    BASIC_API_URL: z.string().url().describe("Base URL for the basic API"),
    // ... other env vars
  },
  client: {
    NEXT_PUBLIC_BASIC_ENABLED: z.coerce.boolean().default(true),
    // ... other client vars
  },
});

// Export database schema for consumers
export * from './database';
```

**Migration Structure**:
```
packages/basic/drizzle/
├── 001-create-basic-notes/
│   ├── up.sql
│   └── down.sql
└── meta.json
```

**Build Verification**:
- After adding database schema, run `bun run build` from package root
- After updating package index, run `bun run build` to verify registration
- After creating documentation, run `bun run build` to confirm all files included

**Internal Communication Patterns**:
- Database registration uses API from Unit 4.5
- Schema validation through Unit 4.2
- Migration registration through Unit 4.3
- Package continues to use existing environment registry

**Best Practices Demonstrated**:
1. Table命名 with `ydtb_` prefix
2. Workspace isolation with `workspaceId`
3. Proper indexes for performance
4. Semantic versioning
5. Migration files with up/down scripts
6. Clear documentation

**Testing Integration**:
```bash
# From packages/basic directory
bun run build

# From apps/core directory
bun run build

# Test database reset and re-initialization
bun run db:reset:force
```

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Package README Template](https://github.com/styfle/package-json-template) - For documentation
- [Drizzle Migration Files](https://orm.drizzle.team/docs/migrations#migration-files) - For migration patterns

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Schema Validation**: Test with workspace isolation violations
- **Migration Testing**: Verify migrations work with database reset
- **Documentation Review**: Ensure examples are clear and correct