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

## Future Integration: Tools Registry

### Tools Database Tables (Planned)
From Unit 3.6 (Post-Signup Workspace Onboarding Wizard), the following tables will be needed for workspace tools management:

```sql
-- Tools catalog
CREATE TABLE ydtb_tools (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  is_active BOOLEAN DEFAULT true
);

-- Workspace tool associations
CREATE TABLE ydtb_workspace_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(20) NOT NULL REFERENCES ydtb_workspaces(id) ON DELETE CASCADE,
  tool_id VARCHAR(20) NOT NULL REFERENCES ydtb_tools(id) ON DELETE CASCADE,
  enabled_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(workspace_id, tool_id)
);
```

### Implementation Notes:
1. **Phase 1**: Tools configuration will be stored in `workspaces.metadata` as JSON array of tool IDs
2. **Phase 2**: When implementing structured tool management, these tables should:
   - Be created as part of the core database schema (not package-specific)
   - Include proper `workspaceId` foreign key for workspace isolation
   - Support tool registration system where packages can register their tools
   - Allow tools to be enabled/disabled per workspace

### Package Integration Considerations:
- Packages that provide workspace tools should be able to register them in `ydtb_tools`
- Tool associations should respect workspace isolation (via `workspace_id`)
- Consider adding a `package_name` field to `ydtb_tools` to track which package provides each tool
- The registry system should validate that tool-related tables from packages follow the same pattern