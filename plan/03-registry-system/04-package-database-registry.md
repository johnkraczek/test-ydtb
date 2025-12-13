# Unit 3.4: Package Database Registry System
**Folder**: `07-package-database-registry`

**Purpose**: Implement system for packages to register their database schemas with the core

**Context**:
- Core database has workspace tables (Unit 2.1)
- Packages need to register their own tables with workspace isolation
- Must handle schema versioning and migrations
- Need to collect all package schemas for unified database management

**Definition of Done**:
- ✅ Database registry API implemented for schema registration
- ✅ Schema validation and workspace ID enforcement
- ✅ Migration collection and ordering system
- ✅ Package schema versioning support
- ✅ Database initialization pipeline that applies all registered schemas
- ✅ Runtime schema registration for dynamic package loading

**Steps**:
1. Create database registry interfaces and types
2. Implement schema registration API
3. Add schema validation for workspace isolation compliance
4. Create migration collection and dependency resolution
5. Implement database initialization pipeline
6. Add runtime schema registration for development
7. Create utilities for package developers to register schemas

**Files to Create**:
- `/apps/core/src/lib/registry/database.ts`
- `/apps/core/src/lib/registry/migrations.ts`
- `/apps/core/src/lib/db/initialize.ts`
- `/apps/core/src/types/database-registry.ts`

**Database Registry API**:
```typescript
// Packages will register schemas like this:
registry.registerDatabase({
  packageName: '@ydtb/basic',
  schema: basicSchema,
  migrations: [migration001, migration002],
  dependencies: [], // Other packages this depends on
  version: '1.0.0'
});
```

**Key Features**:
1. **Schema Registration**: Packages register their Drizzle schemas
2. **Workspace Isolation Validation**: Ensures all tables have workspaceId foreign key
3. **Migration Ordering**: Handles dependencies between package migrations
4. **Version Management**: Tracks schema versions for each package
5. **Runtime Registration**: Supports hot-reloading in development

**Integration Points**:
- Called during package initialization (Unit 7.2)
- Used by Basic Package Database (Unit 6.3)
- Required for database initialization (updated in Unit 2.1)
- Environment variables registered via env registry (Unit 1.2)

**Validation Rules**:
- All package tables must be prefixed with `ydtb_`
- All tables must have a foreign key to `ydtb_workspaces.id` named `workspaceId`
- Schema must be valid Drizzle schema
- Migrations must be idempotent
- Circular dependencies between packages are rejected