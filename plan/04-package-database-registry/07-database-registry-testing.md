# Unit 4.7: Database Registry Testing
**Folder**: `04-package-database-registry`

**Purpose**: Create comprehensive tests for the database registry system

**Context**:
- Critical system component needs thorough testing
- Must test validation, migrations, and edge cases
- Need to test with real database operations
- Should include integration tests
- Units 4.1-4.6 provide complete implementation to test

**Definition of Done**:
- [ ] Unit tests for all registry components
- [ ] Integration tests with database
- [ ] Validation rule tests
- [ ] Migration ordering tests
- [ ] Performance benchmarks

**Implementation Steps**:
1. **Create test setup**:
   - Test database configuration
   - Mock package schemas
   - Test utilities for registry
   - Cleanup procedures

2. **Implement unit tests**:
   - Registry functionality tests
   - Validation rule tests
   - Migration collector tests
   - Error handling tests

3. **Add integration tests**:
   - End-to-end registration flow
   - Real database operations
   - Multi-package scenarios
   - Failure recovery tests

**Files to Create/Update**:
- Create: `apps/core/src/__tests__/registry/database.test.ts`
- Create: `apps/core/src/__tests__/registry/schema-validator.test.ts`
- Create: `apps/core/src/__tests__/registry/migrations.test.ts`
- Create: `apps/core/src/__tests__/db/initialize.test.ts`

**Test Structure Example**:
```typescript
// database.test.ts
import { DatabaseRegistry } from '../../../lib/registry/database';
import { createTestSchema, createInvalidSchema } from '../helpers/schema';

describe('DatabaseRegistry', () => {
  let registry: DatabaseRegistry;

  beforeEach(() => {
    registry = new DatabaseRegistry();
  });

  describe('schema registration', () => {
    it('should register a valid schema', async () => {
      const schema = createTestSchema();
      await registry.register({
        packageName: '@test/package',
        version: '1.0.0',
        schema,
        migrations: [],
        dependencies: []
      });

      expect(registry.getSchema('@test/package')).toBe(schema);
    });

    it('should reject schemas without workspace isolation', async () => {
      const invalidSchema = createInvalidSchema();

      await expect(
        registry.register({
          packageName: '@test/invalid',
          version: '1.0.0',
          schema: invalidSchema,
          migrations: [],
          dependencies: []
        })
      ).rejects.toThrow('workspaceId required');
    });
  });
});
```

**Test Categories**:

### Unit Tests
- **Database Registry**: Registration, retrieval, duplicate detection
- **Schema Validator**: All validation rules, error messages
- **Migration System**: Collection, ordering, execution
- **Initialization**: Connection, schema application, error handling

### Integration Tests
- **Full Registration Flow**: From API to database
- **Multi-package Scenarios**: Dependencies, conflicts
- **Migration Execution**: Real database changes
- **Error Recovery**: Failure handling, rollback

### Performance Tests
- **Large Schema Registration**: Memory usage, speed
- **Complex Dependencies**: Resolution algorithm performance
- **Migration Execution**: Time benchmarks
- **Concurrent Registration**: Thread safety

**Test Database Setup**:
```typescript
// test-setup.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const testDbUrl = process.env.TEST_DATABASE_URL || 'postgresql://localhost/test_db';
const client = postgres(testDbUrl);
export const testDb = drizzle(client);

beforeAll(async () => {
  // Clean up test database
  await testDb.execute(sql`DROP SCHEMA public CASCADE`);
  await testDb.execute(sql`CREATE SCHEMA public`);
});

afterAll(async () => {
  await client.end();
});
```

**Mock Package Creation**:
```typescript
// helpers/package.ts
export function createMockPackage(name: string, dependencies: string[] = []) {
  return {
    packageName: `@test/${name}`,
    version: '1.0.0',
    schema: createTestSchema(name),
    migrations: createMockMigrations(name),
    dependencies
  };
}
```

**Build Verification**:
- After creating each test file, run `bun run build` to ensure TypeScript compilation
- Run `bun test` to verify tests execute
- Check test coverage with `bun test --coverage`

**Testing Commands**:
```bash
# Run all tests
bun test

# Run specific test suite
bun test apps/core/src/__tests__/registry/

# Run with coverage
bun test --coverage

# Watch mode for development
bun test --watch
```

**CI/CD Integration**:
- Tests run on every PR
- Database tests use isolated test database
- Performance tests run on schedule
- Coverage reports required for merge

**Important URLs**:
Fetch the following URLs before starting implementation:
- [Bun Testing Documentation](https://bun.sh/docs/cli/test) - For test framework
- [Test Database Best Practices](https://www.testcontainers.org/) - For test isolation

**Error Resolution and Debugging Guidelines**:
- **Zero Error Tolerance**: All build errors must be resolved before proceeding
- **Change-First Debugging**: When builds fail, immediately review recent changes with `git diff`
- **Test Isolation**: Ensure tests don't interfere with each other
- **Database Cleanup**: Verify test database is properly reset
- **Mock Data**: Use consistent mock data for predictable tests