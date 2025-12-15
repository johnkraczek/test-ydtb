# Unit 4.2: Schema Validation and Workspace Isolation
**Folder**: `04-package-database-registry`

**Purpose**: Implement comprehensive validation to ensure all package schemas comply with workspace isolation requirements

**Context**:
- Multi-tenancy is a core requirement
- All data must be isolated by workspace
- Existing core tables already follow this pattern
- Need to prevent data leakage between workspaces
- Unit 4.1 provides the basic registry infrastructure

**Definition of Done**:
- [ ] Workspace isolation validation implemented
- [ ] Table prefix validation enforced
- [ ] Foreign key validation for workspaceId
- [ ] Index validation for performance
- [ ] Custom rule validation system

**Implementation Steps**:
1. **Create validation utilities** in `/apps/core/src/lib/registry/schema-validator.ts`:
   - Table name prefix validation
   - Workspace foreign key validation
   - Column validation rules
   - Index validation for workspace queries
   - Custom rule validator interface

2. **Implement validation rules**:
   - Check all tables have `ydtb_` prefix
   - Verify `workspaceId` column exists and is properly typed
   - Ensure `workspaceId` has proper foreign key constraint
   - Validate that indexes include workspaceId for performance
   - Check for potentially dangerous column types

3. **Add validation to registry**:
   - Integrate validator with database registry from Unit 4.1
   - Provide detailed error messages for validation failures
   - Add validation bypass flags for development (with warnings)

**Files to Create/Update**:
- Create: `/apps/core/src/lib/registry/schema-validator.ts`
- Update: `/apps/core/src/lib/registry/database.ts` (add validation calls from Unit 4.1)

**Validation Checklist**:
- [ ] Table names start with `ydtb_`
- [ ] All tables have `workspaceId` column
- [ ] `workspaceId` is properly typed as text
- [ ] `workspaceId` has foreign key to `ydtb_workspaces.id`
- [ ] Indexes exist for workspace-based queries
- [ ] No tables without workspace isolation

**Build Verification**:
- After creating schema validator, run `bun run build` to ensure TypeScript compilation
- After integrating with registry, run `bun run build` to verify validation works
- Test with invalid schemas to ensure validation catches errors

**Internal Communication Patterns**:
- Validation uses direct function calls to validator
- Errors thrown as ValidationException with details
- Registry calls validator before accepting schemas
- Development bypass uses environment variable

**Validation Error Examples**:
```typescript
// Table without ydtb_ prefix
Error: Table 'users' must be prefixed with 'ydtb_'

// Missing workspaceId
Error: Table 'ydtb_posts' must have a 'workspaceId' column

// Invalid workspaceId type
Error: Column 'workspaceId' in table 'ydtb_posts' must be of type text

// Missing foreign key
Error: Column 'workspaceId' in table 'ydtb_posts' must reference ydtb_workspaces.id
```

**Important URLs**:
Fetch the following URLs before starting implementation:
- [PostgreSQL Foreign Key Documentation](https://www.postgresql.org/docs/current/ddl-constraints.html) - For constraint patterns
- [Drizzle Schema Validation](https://orm.drizzle.team/docs/goodies#schema-validation) - For existing validation patterns

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Test Validation**: Create test cases with intentional violations
- **Clear Error Messages**: Ensure validation errors are descriptive and actionable