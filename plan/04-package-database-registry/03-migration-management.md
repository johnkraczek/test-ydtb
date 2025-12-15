# Unit 4.3: Migration Management System
**Folder**: `04-package-database-registry`

**Purpose**: Create a system to collect, order, and execute migrations from all registered packages

**Context**:
- Drizzle ORM is used for database operations
- Packages may have dependencies on each other
- Migrations must be ordered correctly
- Need to handle package versions and upgrades
- Units 4.1 and 4.2 provide registry and validation infrastructure

**Definition of Done**:
- [ ] Migration collection system implemented
- [ ] Dependency resolution for migrations
- [ ] Version tracking for packages
- [ ] Migration ordering algorithm
- [ ] Rollback capability for failed migrations

**Implementation Steps**:
1. **Create migration types and interfaces** in `/apps/core/src/lib/registry/migrations.ts`:
   - Migration interface definition
   - Package migration metadata
   - Dependency graph types
   - Migration runner interface

2. **Implement migration collector**:
   - Collect migrations from all registered packages
   - Build dependency graph between packages
   - Topological sort for correct execution order
   - Version conflict detection

3. **Create migration runner**:
   - Execute migrations in correct order
   - Track migration execution history
   - Handle migration failures with rollback
   - Support for dry-run mode

**Files to Create/Update**:
- Create: `/apps/core/src/lib/registry/migrations.ts`
- Create: `/apps/core/src/lib/db/migration-history.ts` (for tracking)
- Update: `/apps/core/src/lib/registry/database.ts` (add migration integration from Unit 4.1)

**Migration Features**:
- Automatic dependency resolution
- Idempotent migration execution
- Version-based migration selection
- Rollback on failure
- Progress tracking and logging

**Migration Interface Example**:
```typescript
interface PackageMigration {
  id: string;
  packageName: string;
  version: string;
  dependencies: string[]; // Package names
  up: (db: DB) => Promise<void>;
  down?: (db: DB) => Promise<void>; // For rollback
}
```

**Dependency Resolution Algorithm**:
1. Build graph of package dependencies
2. Perform topological sort
3. Group migrations by package
4. Execute in dependency order
5. Track versions for each package

**Build Verification**:
- After creating migration types, run `bun run build` to ensure TypeScript compilation
- After implementing collector, run `bun run build` to verify dependency resolution
- After creating runner, run `bun run build` to confirm migration execution

**Internal Communication Patterns**:
- Migration collection uses registry from Unit 4.1
- Migration execution through Drizzle migration API
- History tracking uses direct database operations
- Error propagation through exceptions

**Migration History Table**:
```sql
CREATE TABLE ydtb_migration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name VARCHAR(255) NOT NULL,
  migration_id VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  executed_at TIMESTAMP DEFAULT NOW(),
  execution_time_ms INTEGER,
  UNIQUE(package_name, migration_id)
);
```

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Drizzle Migrations Guide](https://orm.drizzle.team/docs/migrations) - For migration patterns
- [Topological Sorting Algorithm](https://en.wikipedia.org/wiki/Topological_sorting) - For dependency resolution

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Test Dependencies**: Create test scenarios with complex dependencies
- **Verify Rollback**: Test rollback functionality with failing migrations