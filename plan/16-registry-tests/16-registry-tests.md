# Unit 7.1: Registry Testing

## Folder: `16-registry-tests`

## Purpose
Create comprehensive unit tests for the registry system to ensure all registration functions, type validation, event emission, and dependency tracking work correctly.

## Context
- Registry system is fully implemented (Unit 3.2)
- Need to test all registration methods and edge cases
- Should validate type safety and error handling
- Must test event emission and dependency resolution
- Need to ensure circular dependency detection works
- Should test package loading/unloading functionality

## Definition of Done
- [ ] All registration functions have unit tests
- [ ] Type validation is tested with valid and invalid inputs
- [ ] Event emission is verified for all operations
- [ ] Dependency tracking and circular detection tested
- [ ] Edge cases and error conditions covered
- [ ] Package loading/unloading tested
- [ ] Performance benchmarks for large numbers of entries
- [ ] Memory leak tests
- [ ] Test coverage > 90%

## Testing Strategy

1. **Unit Tests**: Test each function in isolation
2. **Integration Tests**: Test registry with mock packages
3. **Type Tests**: Verify TypeScript type enforcement
4. **Performance Tests**: Measure performance with many entries
5. **Edge Case Tests**: Boundary conditions and error states

## Test Setup

### 1. Install Testing Dependencies
```bash
# Install test dependencies
bun add -d vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom

# Install type testing
bun add -d @types/node tsd
```

### 2. Configure Vitest
Create `/apps/core/vitest.config.ts`:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ydtb": path.resolve(__dirname, "../.."),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3. Test Setup File
Create `/apps/core/src/test/setup.ts`:
```typescript
import { vi } from "vitest";

// Mock Next.js
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/test",
  useParams: () => ({ workspaceId: "test" }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock NextAuth
vi.mock("@ydtb/core/lib/auth", () => ({
  auth: () =>
    Promise.resolve({
      user: { id: "test-user", workspaceId: "test-workspace" },
    }),
}));

// Mock database
vi.mock("@ydtb/core/lib/db", () => ({
  db: {
    query: {},
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
```

## Test Files

### 1. `/apps/core/src/lib/registry/__tests__/registry.test.ts`
```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { registry } from "../index";
import type { ToolRegistration, CommandRegistration } from "@/types/registry";

describe("Registry", () => {
  beforeEach(() => {
    // Clear registry before each test
    // Note: In a real implementation, you'd have a reset method
    registry.listTools().forEach(tool => {
      registry.unloadPackage(tool.packageId);
    });
  });

  describe("Tool Registration", () => {
    it("should register a tool with valid data", () => {
      const tool: Omit<ToolRegistration, "type"> = {
        id: "test-tool",
        packageId: "test-package",
        name: "Test Tool",
        description: "A test tool",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: ["home"],
      };

      registry.registerTool(tool);
      const retrieved = registry.getTool("test-tool");

      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe("test-tool");
      expect(retrieved!.type).toBe("tool");
    });

    it("should emit event when tool is registered", async () => {
      const mockListener = vi.fn();
      registry.on("entry:registered", mockListener);

      const tool: Omit<ToolRegistration, "type"> = {
        id: "test-tool",
        packageId: "test-package",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
      };

      registry.registerTool(tool);

      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "entry:registered",
          entryId: "test-tool",
          entryType: "tool",
          packageId: "test-package",
        })
      );
    });

    it("should reject duplicate tool registration", () => {
      const tool: Omit<ToolRegistration, "type"> = {
        id: "test-tool",
        packageId: "test-package",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
      };

      registry.registerTool(tool);

      expect(() => registry.registerTool(tool)).toThrow();
    });
  });

  describe("Command Registration", () => {
    it("should register a command with valid data", () => {
      const command: Omit<CommandRegistration, "type"> = {
        id: "test-command",
        packageId: "test-package",
        title: "Test Command",
        description: "A test command",
        handler: vi.fn(),
      };

      registry.registerCommand(command);
      const retrieved = registry.getCommand("test-command");

      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe("test-command");
      expect(retrieved!.type).toBe("command");
    });

    it("should list commands by package", () => {
      const command1: Omit<CommandRegistration, "type"> = {
        id: "command-1",
        packageId: "package-1",
        title: "Command 1",
        handler: vi.fn(),
      };

      const command2: Omit<CommandRegistration, "type"> = {
        id: "command-2",
        packageId: "package-2",
        title: "Command 2",
        handler: vi.fn(),
      };

      registry.registerCommand(command1);
      registry.registerCommand(command2);

      const package1Commands = registry.listCommands("package-1");
      const package2Commands = registry.listCommands("package-2");

      expect(package1Commands).toHaveLength(1);
      expect(package1Commands[0].id).toBe("command-1");
      expect(package2Commands).toHaveLength(1);
      expect(package2Commands[0].id).toBe("command-2");
    });
  });

  describe("Dependencies", () => {
    it("should prevent circular dependencies", () => {
      const tool1: Omit<ToolRegistration, "type"> = {
        id: "tool-1",
        packageId: "test",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
        dependencies: ["tool-2"],
      };

      const tool2: Omit<ToolRegistration, "type"> = {
        id: "tool-2",
        packageId: "test",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
        dependencies: ["tool-1"],
      };

      registry.registerTool(tool1);

      expect(() => registry.registerTool(tool2)).toThrow(
        "Circular dependency detected"
      );
    });
  });

  describe("Package Management", () => {
    it("should load and unload packages", async () => {
      const mockPackage = {
        metadata: {
          name: "test-package",
          version: "1.0.0",
        },
        init: vi.fn(),
        cleanup: vi.fn(),
      };

      await registry.loadPackage(mockPackage);

      expect(mockPackage.init).toHaveBeenCalledWith(registry);
      expect(registry.getLoadedPackages()).toContain("test-package");

      await registry.unloadPackage("test-package");

      expect(mockPackage.cleanup).toHaveBeenCalled();
      expect(registry.getLoadedPackages()).not.toContain("test-package");
    });
  });
});
```

### 2. `/apps/core/src/lib/registry/__tests__/validation.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import { validateToolRegistration } from "../validation/tool";
import { validateCommandRegistration } from "../validation/command";
import type { ToolRegistration } from "@/types/registry";

describe("Registry Validation", () => {
  describe("Tool Validation", () => {
    it("should validate a correct tool registration", () => {
      const tool = {
        id: "test-tool",
        packageId: "test-package",
        name: "Test Tool",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: ["home"],
      };

      expect(() => validateToolRegistration(tool)).not.toThrow();
    });

    it("should reject tool without required fields", () => {
      const tool = {
        id: "test-tool",
        // Missing packageId
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
      };

      expect(() => validateToolRegistration(tool)).toThrow();
    });

    it("should reject tool with invalid ID", () => {
      const tool = {
        id: "", // Invalid empty ID
        packageId: "test-package",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
      };

      expect(() => validateToolRegistration(tool)).toThrow();
    });
  });

  describe("Command Validation", () => {
    it("should validate a correct command registration", () => {
      const command = {
        id: "test-command",
        packageId: "test-package",
        title: "Test Command",
        handler: () => {},
      };

      expect(() => validateCommandRegistration(command)).not.toThrow();
    });

    it("should reject command without handler", () => {
      const command = {
        id: "test-command",
        packageId: "test-package",
        title: "Test Command",
        // Missing handler
      };

      expect(() => validateCommandRegistration(command)).toThrow();
    });
  });
});
```

### 3. `/apps/core/src/lib/registry/__tests__/events.test.ts`
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { EventEmitter } from "events";
import type { RegistryEvent } from "@/types/registry";

describe("Registry Events", () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it("should emit events with correct structure", (done) => {
    const expectedEvent: RegistryEvent = {
      type: "entry:registered",
      entryId: "test-entry",
      timestamp: new Date(),
    };

    eventEmitter.on(expectedEvent.type, (event: RegistryEvent) => {
      expect(event.type).toBe(expectedEvent.type);
      expect(event.entryId).toBe(expectedEvent.entryId);
      expect(event.timestamp).toBeInstanceOf(Date);
      done();
    });

    eventEmitter.emit(expectedEvent.type, expectedEvent);
  });

  it("should handle multiple event listeners", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventEmitter.on("test-event", listener1);
    eventEmitter.on("test-event", listener2);

    eventEmitter.emit("test-event", { data: "test" });

    expect(listener1).toHaveBeenCalledWith({ data: "test" });
    expect(listener2).toHaveBeenCalledWith({ data: "test" });
  });

  it("should remove event listeners", () => {
    const listener = vi.fn();

    eventEmitter.on("test-event", listener);
    eventEmitter.off("test-event", listener);
    eventEmitter.emit("test-event", { data: "test" });

    expect(listener).not.toHaveBeenCalled();
  });
});
```

### 4. `/apps/core/src/lib/registry/__tests__/performance.test.ts`
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { registry } from "../index";

describe("Registry Performance", () => {
  beforeEach(() => {
    // Clear registry
    registry.listTools().forEach(tool => {
      registry.unloadPackage(tool.packageId);
    });
  });

  it("should handle many tool registrations efficiently", () => {
    const startTime = performance.now();
    const toolCount = 1000;

    for (let i = 0; i < toolCount; i++) {
      registry.registerTool({
        id: `tool-${i}`,
        packageId: "perf-test",
        icon: () => null,
        pageComponent: () => null,
        defaultRoute: [],
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should register 1000 tools in under 100ms
    expect(duration).toBeLessThan(100);
    expect(registry.listTools()).toHaveLength(toolCount);
  });

  it("should handle many event listeners efficiently", () => {
    const listenerCount = 100;
    const listeners = Array.from({ length: listenerCount }, () => vi.fn());

    // Add listeners
    listeners.forEach((listener, i) => {
      registry.on(`event-${i}`, listener);
    });

    const startTime = performance.now();

    // Emit all events
    listeners.forEach((_, i) => {
      registry.emit({
        type: `event-${i}`,
        timestamp: new Date(),
      } as any);
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should emit 100 events to 100 listeners in under 50ms
    expect(duration).toBeLessThan(50);

    // Verify all listeners were called
    listeners.forEach(listener => {
      expect(listener).toHaveBeenCalled();
    });
  });
});
```

### 5. `/apps/core/src/lib/registry/__tests__/types.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import type { RegistryEntry, ToolRegistration } from "@/types/registry";

describe("Registry Types", () => {
  it("should correctly type discriminate registry entries", () => {
    const tool: ToolRegistration = {
      type: "tool",
      id: "test-tool",
      packageId: "test-package",
      icon: () => null,
      pageComponent: () => null,
      defaultRoute: [],
    };

    const isTool = (entry: RegistryEntry): entry is ToolRegistration => {
      return entry.type === "tool";
    };

    expect(isTool(tool)).toBe(true);
  });

  it("should enforce required properties", () => {
    // This should fail type checking
    // @ts-expect-error - Missing required properties
    const invalidTool: ToolRegistration = {
      type: "tool",
      id: "test",
      // Missing required fields
    };

    expect(invalidTool).toBeDefined();
  });
});
```

## Type Tests

### 6. `/apps/core/src/lib/registry/__tests__/registry.type.test.ts`
```typescript
import { expectTypeOf } from "tsd";
import type { Registry, ToolRegistration } from "@/types/registry";

// Type tests for the registry
expectTypeOf<Registry>().toHaveProperty("registerTool");
expectTypeOf<Registry>().toHaveProperty("getTool");
expectTypeOf<Registry>().toHaveProperty("listTools");

// Test function signatures
expectTypeOf<Registry["registerTool"]>()
  .parameters.toEqualTypeOf<[tool: Omit<ToolRegistration, "type">]>();
expectTypeOf<Registry["getTool"]>()
  .parameters.toEqualTypeOf<[id: string]>();
```

## Test Scripts

### 7. Update `/apps/core/package.json`
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests with UI
bun test:ui

# Run tests once
bun test:run

# Watch mode
bun test:watch

# Generate coverage report
bun test:coverage
```

## Validation Checklist

- [ ] All registration functions tested
- [ ] Type validation verified
- [ ] Event emission tested
- [ ] Dependency resolution tested
- [ ] Package loading/unloading tested
- [ ] Performance benchmarks passing
- [ ] Type tests passing
- [ ] Test coverage > 90%
- [ ] No memory leaks detected

## Test Coverage Report

The tests should achieve >90% coverage for:
- Registry implementation
- Validation functions
- Event system
- Package management
- Type definitions

## Continuous Integration

Add to `.github/workflows/test.yml`:
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test:run
      - run: bun test:coverage
```

## Next Steps

After implementing registry tests:
1. Create integration tests (Unit 7.2)
2. Write developer documentation (Unit 8.1)