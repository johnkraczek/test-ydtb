# Unit 4.4: Database Initialization Pipeline
**Folder**: `04-package-database-registry`

**Purpose**: Create the initialization system that applies all registered schemas when the application starts

**Context**:
- Application must initialize database on startup
- Need to apply core schema first
- Package schemas must be applied after core
- Database operations must be atomic
- Units 4.1-4.3 provide registry, validation, and migration infrastructure

**Definition of Done**:
- [ ] Database initialization pipeline implemented
- [ ] Core schema applied first
- [ ] Package schemas applied in dependency order
- [ ] Error handling for initialization failures
- [ ] Database health checks

**Implementation Steps**:
1. **Create initialization system** in `/apps/core/src/lib/db/initialize.ts`:
   - Database connection setup
   - Core schema initialization
   - Package schema registration
   - Migration execution pipeline
   - Health check implementation

2. **Implement initialization flow**:
   - Connect to database
   - Apply core schema if needed
   - Register all package schemas
   - Run pending migrations
   - Verify database state

3. **Add error handling**:
   - Transaction wrapping for atomic operations
   - Detailed error reporting
   - Recovery strategies
   - Initialization state tracking

**Files to Create/Update**:
- Create: `/apps/core/src/lib/db/initialize.ts`
- Update: `/apps/core/src/lib/db/index.ts` (export initialization)
- Create: `/apps/core/src/scripts/init-database.ts` (standalone script)

**Initialization Pipeline**:
1. Validate database connection
2. Apply core schema (Better Auth + Workspaces)
3. Register package schemas from all packages
4. Resolve and run package migrations (using Unit 4.3)
5. Verify all tables and relationships
6. Report initialization status

**Database Connection Pattern**:
```typescript
async function initializeDatabase(config: DatabaseConfig) {
  const db = drizzle(config.databaseUrl, { schema: coreSchema });

  // Step 1: Validate connection
  await db.select().from(workspaces).limit(1);

  // Step 2: Apply core schema
  await applyCoreSchema(db);

  // Step 3: Register package schemas
  const registry = getDatabaseRegistry();
  await registry.loadPackageSchemas();

  // Step 4: Run migrations
  await runMigrations(db, registry.getMigrations());

  // Step 5: Health check
  await performHealthCheck(db);

  return db;
}
```

**Build Verification**:
- After creating initialization system, run `bun run build` to ensure TypeScript compilation
- After implementing initialization flow, run `bun run build` to verify pipeline
- After adding error handling, run `bun run build` to confirm robustness

**Internal Communication Patterns**:
- Initialization uses direct function calls to registry (Unit 4.1)
- Schema validation through validator (Unit 4.2)
- Migration execution through migration runner (Unit 4.3)
- Database operations through Drizzle ORM

**Error Handling Strategy**:
- Wrap entire initialization in transaction
- Log detailed error information
- Provide recovery suggestions
- Support initialization retries
- Track initialization state for debugging

**Standalone Script Usage**:
```bash
# Manual database initialization
bun run scripts/init-database.ts

# With options
bun run scripts/init-database.ts --dry-run --verbose
```

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Drizzle Database Connection](https://orm.drizzle.team/docs/getting-started) - For connection patterns
- [PostgreSQL Transaction Documentation](https://www.postgresql.org/docs/current/tutorial-transactions.html) - For atomic operations

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Test Transactions**: Verify transaction rollback on failures
- **Database Reset**: Use `bun db:reset:force` when testing initialization
- **Connection Testing**: Test with invalid database URLs to verify error handling