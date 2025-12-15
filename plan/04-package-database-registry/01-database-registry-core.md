# Unit 4.1: Database Registry Core Infrastructure
**Folder**: `04-package-database-registry`

**Purpose**: Create the foundational registry system that packages will use to register their database schemas

**Context**:
- The project already has an environment registry system in `/apps/core/src/registry/`
- Database schema is defined in `/apps/core/src/server/db/schema.ts` using Drizzle ORM
- Core workspace tables are already defined with proper workspace isolation
- The `@ydtb/basic` package exists and already registers environment variables

**Definition of Done**:
- [ ] Database registry interface and types defined
- [ ] Schema registration API implemented
- [ ] Basic validation for schema structure
- [ ] Registry integration with existing registry system
- [ ] Package schema storage mechanism

**Implementation Steps**:
1. **Define types and interfaces** in `/apps/core/src/types/database-registry.ts`:
   - Package schema registration interface
   - Migration definition types
   - Registry configuration types
   - Validation rule interfaces

2. **Create database registry** in `/apps/core/src/lib/registry/database.ts`:
   - DatabaseRegistry class for managing package schemas
   - Schema registration method with validation
   - Package schema storage (in-memory for runtime)
   - Integration with existing registry exports

3. **Update registry index** to export database registry:
   - Add database registry to `/apps/core/src/registry/index.ts`
   - Ensure compatibility with environment registry

**Files to Create/Update**:
- Create: `/apps/core/src/types/database-registry.ts`
- Create: `/apps/core/src/lib/registry/database.ts`
- Update: `/apps/core/src/registry/index.ts`

**Validation Rules**:
- All tables must use `ydtb_` prefix
- All tables must have `workspaceId` foreign key referencing `ydtb_workspaces.id`
- Schema must be a valid Drizzle schema object
- Package name must be unique in registry
- Version must follow semantic versioning

**Build Verification**:
- After creating types, run `bun run build` to ensure TypeScript compilation
- After implementing registry, run `bun run build` to verify exports
- After updating index, run `bun run build` to confirm integration

**Internal Communication Patterns**:
- Registry uses direct function calls - no HTTP APIs
- Schema storage is in-memory for runtime access
- Validation throws exceptions with detailed error messages
- Integration with existing registry through shared exports

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview) - Review schema patterns
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - For type definitions

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Incremental Building**: Build after each major step to catch issues early
- **Type Safety**: Ensure all interfaces are properly typed