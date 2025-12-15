# Unit 3.4: Package Database Registry System
**Folder**: `04-package-database-registry`

## Overview
Implement a comprehensive system for packages to register their database schemas with the core application, ensuring proper workspace isolation and supporting schema migrations.

## Units of Work

The package database registry system has been broken down into the following units:

### [Unit 4.0: Database Schema Refactoring](./00-database-schema-refactoring.md)
Refactor the monolithic database schema file into domain-specific modules for better organization and maintainability.

### [Unit 4.1: Database Registry Core Infrastructure](./01-database-registry-core.md)
Create the foundational registry system that packages will use to register their database schemas.

### [Unit 4.2: Schema Validation and Workspace Isolation](./02-schema-validation.md)
Implement comprehensive validation to ensure all package schemas comply with workspace isolation requirements.

### [Unit 4.3: Migration Management System](./03-migration-management.md)
Create a system to collect, order, and execute migrations from all registered packages.

### [Unit 4.4: Database Initialization Pipeline](./04-database-initialization.md)
Create the initialization system that applies all registered schemas when the application starts.

### [Unit 4.5: Package Registration API](./05-package-registration-api.md)
Create the public API that packages will use to register their schemas and migrations.

### [Unit 4.6: Integration with Basic Package](./06-basic-package-integration.md)
Update the basic package to demonstrate database registration.

### [Unit 4.7: Database Registry Testing](./07-database-registry-testing.md)
Create comprehensive tests for the database registry system.

## Key Features

### 1. Schema Registration
Packages register their Drizzle schemas with the central registry:
```typescript
registry.registerDatabase({
  packageName: '@ydtb/basic',
  schema: basicSchema,
  migrations: [migration001, migration002],
  dependencies: [], // Other packages this depends on
  version: '1.0.0'
});
```

### 2. Workspace Isolation Validation
Ensures all tables have workspaceId foreign key:
- Automatic validation during registration
- Detailed error messages for violations
- Development-time warnings and suggestions

### 3. Migration Ordering
Handles dependencies between package migrations:
- Topological sort based on package dependencies
- Version-based migration selection
- Conflict detection and resolution

### 4. Version Management
Tracks schema versions for each package:
- Semantic versioning support
- Upgrade and downgrade paths
- Migration history tracking

### 5. Runtime Registration
Supports hot-reloading in development:
- Dynamic schema registration
- Hot-reload detection
- Development-only features

## Integration Points

### Upstream Dependencies
- Requires AuthContext Provider (implemented in Unit 0.1)
- Depends on database schema changes (Unit 2.1)
- Builds on environment registry pattern (Unit 3.2)

### Downstream Dependencies
- Required for Basic Package Database (Unit 6.3)
- Needed for Analytics Package (future)
- Essential for all future package development

### Related Work
- Similar to environment registry in `/apps/core/src/registry/env-registry.ts`
- Follows patterns from Better Auth schema definitions
- Integrates with existing database operations in `/apps/core/src/server/db/`

## Validation Rules

### Required Rules
1. **Table Prefix**: All tables must be prefixed with `ydtb_`
2. **Workspace Isolation**: All tables must have a foreign key to `ydtb_workspaces.id` named `workspaceId`
3. **Schema Validity**: Schema must be a valid Drizzle schema
4. **Idempotent Migrations**: Migrations must be safe to run multiple times
5. **No Circular Dependencies**: Circular dependencies between packages are rejected

### Recommended Rules
1. **Indexing**: Tables should have indexes on workspaceId for performance
2. **Naming Conventions**: Follow established naming patterns
3. **Column Types**: Use appropriate column types for workspace isolation
4. **Documentation**: Include table and column descriptions

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

## Important URLs

Fetch the following URLs before starting implementation:
- [Drizzle ORM Documentation](https://orm.drizzle.team/) - Review schema and migration patterns
- [Better Auth Database Guide](https://www.better-auth.com/docs/concepts/database) - Understand authentication database patterns
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Reference for database features and constraints

## Error Resolution and Debugging Guidelines

When implementing this unit, follow these practices:

- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Incremental Building**: Build after each unit completion (4.0, 4.1, 4.2, etc.)
- **Schema Validation**: Test schema validation with intentional violations
- **Migration Testing**: Verify migrations work in both directions
- **Database Reset**: Use `bun db:reset:force` when schema changes require it

## Communication Patterns

### Internal Communication
- Schema registration uses direct function calls to registry
- Migration execution uses internal Drizzle migrations API
- Package discovery uses filesystem scanning in development
- Validation errors thrown as exceptions with detailed messages

### External Integration
- Database operations through Drizzle ORM only
- No direct SQL queries in production code
- All database changes must go through migration system
- Package schemas registered at application startup

## Implementation Order

The units should be implemented in order:
1. **4.0**: Schema refactoring (organize existing code)
2. **4.1**: Core infrastructure (registry, types)
3. **4.2**: Schema validation (workspace isolation)
4. **4.3**: Migration system (ordering, execution)
5. **4.4**: Initialization pipeline (startup)
6. **4.5**: Public API (package interface)
7. **4.6**: Basic package integration (example)
8. **4.7**: Testing (comprehensive coverage)

Each unit must build successfully before proceeding to the next.