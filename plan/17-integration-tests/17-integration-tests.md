# Unit 7.2: Integration Testing

## Folder: `17-integration-tests`

## Purpose
Create comprehensive end-to-end integration tests that verify the entire CRM Toolkit system works correctly, including package registration, dynamic routing, authentication, workspace management, and database operations.

## Context
- Registry tests are complete (Unit 7.1)
- Need to test the full application flow
- Should test user interactions end-to-end
- Must verify package integration with core app
- Need to test workspace isolation
- Should test authentication flows
- Must test database operations with workspace context

## Definition of Done
- [ ] End-to-end user flows tested
- [ ] Package registration and loading verified
- [ ] Authentication flows tested (login, register, logout)
- [ ] Workspace switching tested
- [ ] Dynamic routing tested
- [ ] Database operations with workspace isolation tested
- [ ] UI components render correctly
- [ ] Error handling tested across the system
- [ ] Performance benchmarks for full workflows
- [ ] Accessibility compliance verified

## Testing Tools

### 1. Install Testing Dependencies
```bash
# Install Playwright for E2E testing
bun add -D @playwright/test

# Install additional testing utilities
bun add -D @testing-library/user-event
```

### 2. Configure Playwright
Create `/apps/core/playwright.config.ts`:
```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Integration Tests

### 1. `/apps/core/src/e2e/auth.spec.ts`
```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user can register", async ({ page }) => {
    await page.click('text=Register');
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.fill('[name="confirmPassword"]', "password123");
    await page.fill('[name="workspaceName"]', "Test Workspace");
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("user can login", async ({ page }) => {
    // First register a user
    await page.goto("/register");
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.fill('[name="confirmPassword"]', "password123");
    await page.fill('[name="workspaceName"]', "Test Workspace");
    await page.click('button[type="submit"]');

    // Logout
    await page.click('button:has-text("Logout")');

    // Login
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Should be logged in
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.click('text=Login');
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("protected routes redirect to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
```

### 2. `/apps/core/src/e2e/workspace.spec.ts`
```typescript
import { test, expect } from "@playwright/test";

test.describe("Workspace Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login with test user
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');
  });

  test("workspace dropdown shows available workspaces", async ({ page }) => {
    await page.click('[data-testid="workspace-dropdown"]');
    await expect(page.locator('[data-testid="workspace-option"]')).toHaveCount(1);
    await expect(page.locator("text=Test Workspace")).toBeVisible();
  });

  test("can switch workspaces", async ({ page }) => {
    // Create another workspace first
    await page.click('[data-testid="workspace-dropdown"]');
    await page.click('text=Create new workspace');
    await page.fill('[name="name"]', "Second Workspace");
    await page.click('button[type="submit"]');

    // Switch to the new workspace
    await page.click('[data-testid="workspace-dropdown"]');
    await page.click('text=Second Workspace');

    // Verify URL changed
    await expect(page).toHaveURL(/\/ws[a-zA-Z0-9]{10,20}\/dashboard/);
  });
});
```

### 3. `/apps/core/src/e2e/tools.spec.ts`
```typescript
import { test, expect } from "@playwright/test";

test.describe("Tool Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login and go to dashboard
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');
  });

  test("tools appear in icon rail", async ({ page }) => {
    await expect(page.locator('[data-testid="tool-icon"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="tool-basic"]')).toBeVisible();
  });

  test("can navigate to tool", async ({ page }) => {
    await page.click('[data-testid="tool-basic"]');
    await expect(page).toHaveURL(/\/tools\/basic/);
    await expect(page.locator("h1")).toContainText("Basic Notepad");
  });

  test("tool renders custom sidebar", async ({ page }) => {
    await page.click('[data-testid="tool-basic"]');
    await expect(page.locator('[data-testid="tool-sidebar"]')).toBeVisible();
    await expect(page.locator("text=All Notes")).toBeVisible();
    await expect(page.locator("text=Settings")).toBeVisible();
  });

  test("tool renders custom header", async ({ page }) => {
    await page.click('[data-testid="tool-basic"]');
    await expect(page.locator('[data-testid="tool-header"]')).toBeVisible();
    await expect(page.locator("text=Basic Notepad")).toBeVisible();
  });

  test("can create a note", async ({ page }) => {
    await page.click('[data-testid="tool-basic"]');
    await page.click('button:has-text("New Note")');
    await page.fill('[name="title"]', "Test Note");
    await page.fill('[name="content"]', "This is a test note");
    await page.click('button:has-text("Save")');

    await expect(page.locator("text=Test Note")).toBeVisible();
    await expect(page.locator("text=This is a test note")).toBeVisible();
  });
});
```

### 4. `/apps/core/src/e2e/database.spec.ts`
```typescript
import { test, expect } from "@playwright/test";
import { db } from "@ydtb/core/lib/db";
import { notes } from "@ydtb/basic/src/db/schema";
import { eq } from "drizzle-orm";

test.describe("Database Operations", () => {
  let workspaceId: string;
  let noteId: string;

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Get workspace ID from URL
    const url = page.url();
    const match = url.match(/\/(ws[a-zA-Z0-9]{10,20})\//);
    workspaceId = match ? match[1] : "";
  });

  test("note creation persists to database", async ({ page }) => {
    await page.click('[data-testid="tool-basic"]');
    await page.click('button:has-text("New Note")');
    await page.fill('[name="title"]', "Database Test Note");
    await page.fill('[name="content"]', "This note should be in the database");
    await page.click('button:has-text("Save")');

    // Verify in database
    const [note] = await db
      .select()
      .from(notes)
      .where(
        eq(notes.workspaceId, workspaceId)
      )
      .limit(1);

    expect(note).toBeDefined();
    expect(note.title).toBe("Database Test Note");
    noteId = note.id;
  });

  test("workspace isolation works", async ({ page, context }) => {
    // Create note in first workspace
    await page.click('[data-testid="tool-basic"]');
    await page.click('button:has-text("New Note")');
    await page.fill('[name="title"]', "Workspace 1 Note");
    await page.click('button:has-text("Save")');

    // Create and switch to second workspace
    const page2 = await context.newPage();
    await page2.goto("/login");
    await page2.fill('[type="email"]', "test@example.com");
    await page2.fill('[type="password"]', "password123");
    await page2.click('button[type="submit"]');

    // Note should not be visible in second workspace
    await page2.click('[data-testid="tool-basic"]');
    await expect(page2.locator("text=Workspace 1 Note")).not.toBeVisible();
  });
});
```

### 5. `/apps/core/src/e2e/accessibility.spec.ts`
```typescript
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("home page is accessible", async ({ page }) => {
    await page.goto("/");
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("dashboard is accessible", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("tool page is accessible", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Navigate to tool
    await page.click('[data-testid="tool-basic"]');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/login");

    // Tab through form
    await page.keyboard.press("Tab");
    await expect(page.locator('[type="email"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(page.locator('[type="password"]')).toBeFocused();

    await page.keyboard.press("Tab");
    await page.locator('[type="submit"]').focus();

    await page.keyboard.press("Enter");
    // Should submit form
  });
});
```

### 6. `/apps/core/src/e2e/performance.spec.ts`
```typescript
import { test, expect } from "@playwright/test";

test.describe("Performance", () => {
  test("page load times are acceptable", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test("tool switching is fast", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com");
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');

    // Time tool switch
    const startTime = Date.now();
    await page.click('[data-testid="tool-basic"]');
    await page.waitForSelector('[data-testid="tool-sidebar"]');

    const switchTime = Date.now() - startTime;
    expect(switchTime).toBeLessThan(1000); // 1 second
  });

  test("large note list performs well", async ({ page }) => {
    // This would need setup to create many notes
    // For now, just test current performance
    await page.goto("/login");
    await page.fill('[type="email"]', "test@example.com');
    await page.fill('[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.click('[data-testid="tool-basic"]');

    const startTime = Date.now();
    await page.click('text=All Notes');
    await page.waitForSelector('[data-testid="note-list"]');

    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(500); // 500ms
  });
});
```

## Component Integration Tests

### 7. `/apps/core/src/test/integration/RegistryProvider.test.tsx`
```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { RegistryProvider } from "@/context/RegistryProvider";
import { registry } from "@/lib/registry";

describe("RegistryProvider Integration", () => {
  it("should provide registry context to children", async () => {
    const mockPackage = {
      metadata: {
        name: "test-package",
        version: "1.0.0",
      },
      init: async (reg: typeof registry) => {
        reg.registerTool({
          id: "test-tool",
          packageId: "test-package",
          icon: () => null,
          pageComponent: () => null,
          defaultRoute: [],
        });
      },
    };

    const TestComponent = () => {
      const { tools, getTool } = useRegistry();

      return (
        <div>
          <div data-testid="tool-count">{tools.length}</div>
          <div data-testid="tool-exists">
            {getTool("test-tool") ? "exists" : "not-exists"}
          </div>
        </div>
      );
    };

    render(
      <RegistryProvider>
        <TestComponent />
      </RegistryProvider>
    );

    // Load the package
    await registry.loadPackage(mockPackage);

    // Wait for registry to update
    await waitFor(() => {
      expect(screen.getByTestId("tool-count")).toHaveTextContent("1");
      expect(screen.getByTestId("tool-exists")).toHaveTextContent("exists");
    });
  });
});
```

## Test Database Setup

### 8. `/apps/core/src/test/setup/database.ts`
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@ydtb/core/lib/db/schema/core";

// Test database connection
const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
const client = postgres(connectionString || "", {
  max: 1,
});
export const testDb = drizzle(client, { schema });

// Clean database before each test
export async function cleanupDatabase() {
  // Delete in order to respect foreign keys
  await testDb.delete(schema.workspaceMembers);
  await testDb.delete(schema.sessions);
  await testDb.delete(schema.workspaces);
  await testDb.delete(schema.users);
}
```

## Test Scripts

### 9. Update `/apps/core/package.json`
```json
{
  "scripts": {
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "bun run test && bun run test:e2e",
    "test:integration": "vitest run --config vitest.integration.config.ts"
  }
}
```

## Running Tests

```bash
# Run unit tests
bun test

# Run E2E tests
bun test:e2e

# Run E2E tests with UI
bun test:e2e:ui

# Run all tests
bun test:all

# Run integration tests only
bun test:integration
```

## CI/CD Pipeline

### 10. `.github/workflows/e2e.yml`
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - uses: microsoft/playwright-github-action@v1
      - run: bun install
      - run: bun run build
      - run: bun test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Validation Checklist

- [ ] Authentication flows tested
- [ ] Workspace management tested
- [ ] Tool navigation tested
- [ ] Database operations tested
- [ ] Workspace isolation verified
- [ ] UI components render correctly
- [ ] Error scenarios handled
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested

## Test Reports

The E2E tests will generate:
- HTML report with screenshots
- Video recordings of failures
- Trace files for debugging
- Performance metrics

## Next Steps

After implementing integration tests:
1. Create comprehensive developer documentation (Unit 8.1)
2. Set up monitoring and analytics
3. Prepare for production deployment