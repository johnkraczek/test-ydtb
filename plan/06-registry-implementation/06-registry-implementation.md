# Unit 3.2: Registry Implementation

## Folder: `06-registry-implementation`

## Purpose
Implement the core registry system that manages dynamic package loading, tool registration, and provides type-safe APIs for all registry operations.

## Context
- Registry types have been defined in Unit 3.1
- Need an in-memory registry implementation for development
- Must provide all registration functions defined in the types
- Type validation on registration is required
- Event system for registry changes
- Dependency tracking between registry entries
- Singleton pattern for global registry instance
- Support for both client and server-side usage

## Definition of Done
- [ ] Registry implementation with Map-based storage
- [ ] All registration functions implemented and type-safe
- [ ] Type validation on registration using Zod schemas
- [ ] Event emission for all registry changes
- [ ] Registry exports available for packages
- [ ] Dependency tracking and resolution
- [ ] Package loading and unloading with cleanup
- [ ] Thread-safe operations for server environment
- [ ] Performance optimizations for lookups

## Architecture

The registry implementation will use:
- **Map storage** for O(1) lookups by ID
- **Separate Maps** for each registration type for efficiency
- **Event emitter** pattern for change notifications
- **Dependency graph** for tracking relationships
- **Singleton pattern** for global access
- **Namespace isolation** by package ID

## Files to Create

### 1. `/apps/core/src/lib/registry/index.ts`
```typescript
/**
 * Main registry implementation
 * Provides a singleton instance for managing all registry operations
 */

import { EventEmitter } from "events";
import { z } from "zod";
import type {
  Registry,
  RegistryEntry,
  RegistryEvent,
  RegistryEventType,
  Package,
  ServiceInstance,
} from "@/types/registry";
import { validateToolRegistration } from "./validation/tool";
import { validateCommandRegistration } from "./validation/command";
import { validateSearchProviderRegistration } from "./validation/search";
import { validateGlobalRouteRegistration } from "./validation/globalRoute";
import { validatePageRegistration } from "./validation/page";
import { validateServiceRegistration } from "./validation/service";
import { validateExtensionRegistration } from "./validation/extension";

class RegistryImpl extends EventEmitter implements Registry {
  // Storage for different registration types
  private tools = new Map<string, any>();
  private commands = new Map<string, any>();
  private searchProviders = new Map<string, any>();
  private globalRoutes = new Map<string, any>();
  private pages = new Map<string, any>();
  private services = new Map<string, ServiceInstance>();
  private extensions = new Map<string, any>();

  // Package tracking
  private loadedPackages = new Map<string, Package>();
  private packageEntries = new Map<string, Set<string>>(); // packageId -> entryIds

  // Dependency tracking
  private dependencyGraph = new Map<string, Set<string>>(); // entryId -> dependencies
  private reverseDependencyGraph = new Map<string, Set<string>>(); // entryId -> dependents

  constructor() {
    super();
    this.setMaxListeners(100); // Allow many listeners
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  private emitEvent(type: RegistryEventType, data?: {
    entryId?: string;
    entryType?: string;
    packageId?: string;
  }): void {
    const event: RegistryEvent = {
      type,
      entryId: data?.entryId,
      entryType: data?.entryType,
      packageId: data?.packageId,
      data: data?.data,
      timestamp: new Date(),
    };

    this.emit(type, event);
    this.emit("*", event); // Wildcard event for all changes
  }

  // ============================================================================
  // DEPENDENCY MANAGEMENT
  // ============================================================================

  private addDependencies(entryId: string, dependencies?: string[]): void {
    if (!dependencies || dependencies.length === 0) return;

    const deps = new Set(dependencies);
    this.dependencyGraph.set(entryId, deps);

    // Build reverse dependency graph
    deps.forEach((dep) => {
      if (!this.reverseDependencyGraph.has(dep)) {
        this.reverseDependencyGraph.set(dep, new Set());
      }
      this.reverseDependencyGraph.get(dep)!.add(entryId);
    });
  }

  private removeDependencies(entryId: string): void {
    const deps = this.dependencyGraph.get(entryId);
    if (deps) {
      deps.forEach((dep) => {
        const dependents = this.reverseDependencyGraph.get(dep);
        if (dependents) {
          dependents.delete(entryId);
          if (dependents.size === 0) {
            this.reverseDependencyGraph.delete(dep);
          }
        }
      });
    }
    this.dependencyGraph.delete(entryId);
  }

  private checkCircularDependency(entryId: string, dependencies: string[]): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (id: string): boolean => {
      if (recursionStack.has(id)) return true;
      if (visited.has(id)) return false;

      visited.add(id);
      recursionStack.add(id);

      const deps = this.dependencyGraph.get(id);
      if (deps) {
        for (const dep of deps) {
          if (hasCycle(dep)) return true;
        }
      }

      recursionStack.delete(id);
      return false;
    };

    // Add temporary dependencies for checking
    const tempDeps = new Set(dependencies);
    this.dependencyGraph.set(entryId, tempDeps);

    const result = hasCycle(entryId);

    // Remove temporary dependencies
    this.dependencyGraph.delete(entryId);

    return result;
  }

  // ============================================================================
  // REGISTRATION METHODS
  // ============================================================================

  registerTool(tool: any): void {
    // Validate registration
    const validated = validateToolRegistration(tool);

    // Check dependencies
    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for tool ${validated.id}`);
    }

    // Store tool
    this.tools.set(validated.id, { ...validated, type: "tool" });

    // Track dependencies
    this.addDependencies(validated.id, validated.dependencies);

    // Track package entry
    this.trackPackageEntry(validated.packageId, validated.id);

    // Emit event
    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "tool",
      packageId: validated.packageId,
    });
  }

  registerCommand(command: any): void {
    const validated = validateCommandRegistration(command);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for command ${validated.id}`);
    }

    this.commands.set(validated.id, { ...validated, type: "command" });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "command",
      packageId: validated.packageId,
    });
  }

  registerSearchProvider(provider: any): void {
    const validated = validateSearchProviderRegistration(provider);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for search provider ${validated.id}`);
    }

    this.searchProviders.set(validated.id, { ...validated, type: "search" });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "search",
      packageId: validated.packageId,
    });
  }

  registerGlobalRoute(route: any): void {
    const validated = validateGlobalRouteRegistration(route);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for global route ${validated.id}`);
    }

    this.globalRoutes.set(validated.id, { ...validated, type: "globalRoute" });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "globalRoute",
      packageId: validated.packageId,
    });
  }

  registerPage(page: any): void {
    const validated = validatePageRegistration(page);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for page ${validated.id}`);
    }

    this.pages.set(validated.id, { ...validated, type: "page" });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "page",
      packageId: validated.packageId,
    });
  }

  registerService(service: any): void {
    const validated = validateServiceRegistration(service);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for service ${validated.id}`);
    }

    this.services.set(validated.id, {
      ...validated,
      type: "service",
      initialized: false,
    });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "service",
      packageId: validated.packageId,
    });
  }

  registerExtension(extension: any): void {
    const validated = validateExtensionRegistration(extension);

    if (validated.dependencies && this.checkCircularDependency(validated.id, validated.dependencies)) {
      throw new Error(`Circular dependency detected for extension ${validated.id}`);
    }

    this.extensions.set(validated.id, { ...validated, type: "extension" });
    this.addDependencies(validated.id, validated.dependencies);
    this.trackPackageEntry(validated.packageId, validated.id);

    this.emitEvent("entry:registered", {
      entryId: validated.id,
      entryType: "extension",
      packageId: validated.packageId,
    });
  }

  // ============================================================================
  // RETRIEVAL METHODS
  // ============================================================================

  getTool(id: string) {
    return this.tools.get(id);
  }

  getCommand(id: string) {
    return this.commands.get(id);
  }

  getSearchProvider(id: string) {
    return this.searchProviders.get(id);
  }

  getGlobalRoute(id: string) {
    return this.globalRoutes.get(id);
  }

  getPage(id: string) {
    return this.pages.get(id);
  }

  getService(id: string) {
    return this.services.get(id);
  }

  getExtension(id: string) {
    return this.extensions.get(id);
  }

  // ============================================================================
  // LIST METHODS
  // ============================================================================

  listTools(packageId?: string) {
    const tools = Array.from(this.tools.values());
    return packageId ? tools.filter(t => t.packageId === packageId) : tools;
  }

  listCommands(packageId?: string) {
    const commands = Array.from(this.commands.values());
    return packageId ? commands.filter(c => c.packageId === packageId) : commands;
  }

  listSearchProviders(packageId?: string) {
    const providers = Array.from(this.searchProviders.values());
    return packageId ? providers.filter(p => p.packageId === packageId) : providers;
  }

  listGlobalRoutes(packageId?: string) {
    const routes = Array.from(this.globalRoutes.values());
    return packageId ? routes.filter(r => r.packageId === packageId) : routes;
  }

  listPages(toolId?: string, packageId?: string) {
    let pages = Array.from(this.pages.values());
    if (toolId) pages = pages.filter(p => p.toolId === toolId);
    if (packageId) pages = pages.filter(p => p.packageId === packageId);
    return pages;
  }

  listServices(packageId?: string) {
    const services = Array.from(this.services.values());
    return packageId ? services.filter(s => s.packageId === packageId) : services;
  }

  listExtensions(target?: string, packageId?: string) {
    let extensions = Array.from(this.extensions.values());
    if (target) extensions = extensions.filter(e => e.target === target);
    if (packageId) extensions = extensions.filter(e => e.packageId === packageId);
    return extensions;
  }

  // ============================================================================
  // PACKAGE MANAGEMENT
  // ============================================================================

  async loadPackage(pkg: Package): Promise<void> {
    if (this.loadedPackages.has(pkg.metadata.name)) {
      throw new Error(`Package ${pkg.metadata.name} is already loaded`);
    }

    try {
      // Initialize package entry tracking
      this.packageEntries.set(pkg.metadata.name, new Set());

      // Run package initialization
      await pkg.init(this);

      // Track loaded package
      this.loadedPackages.set(pkg.metadata.name, pkg);

      // Emit event
      this.emitEvent("package:loaded", {
        packageId: pkg.metadata.name,
        data: { metadata: pkg.metadata },
      });
    } catch (error) {
      // Cleanup on failure
      await this.unloadPackage(pkg.metadata.name);
      throw error;
    }
  }

  async unloadPackage(packageId: string): Promise<void> {
    const pkg = this.loadedPackages.get(packageId);
    if (!pkg) return;

    try {
      // Get all entries for this package
      const entries = this.packageEntries.get(packageId) || new Set();

      // Remove entries in reverse dependency order
      const sortedEntries = this.topologicalSort(Array.from(entries));
      for (const entryId of sortedEntries.reverse()) {
        await this.removeEntry(entryId);
      }

      // Run package cleanup
      if (pkg.cleanup) {
        await pkg.cleanup();
      }

      // Remove package tracking
      this.loadedPackages.delete(packageId);
      this.packageEntries.delete(packageId);

      // Emit event
      this.emitEvent("package:unloaded", {
        packageId,
      });
    } catch (error) {
      console.error(`Error unloading package ${packageId}:`, error);
      throw error;
    }
  }

  getLoadedPackages(): string[] {
    return Array.from(this.loadedPackages.keys());
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private trackPackageEntry(packageId: string, entryId: string): void {
    if (!this.packageEntries.has(packageId)) {
      this.packageEntries.set(packageId, new Set());
    }
    this.packageEntries.get(packageId)!.add(entryId);
  }

  private async removeEntry(entryId: string): Promise<void> {
    // Remove from all storage maps
    this.tools.delete(entryId);
    this.commands.delete(entryId);
    this.searchProviders.delete(entryId);
    this.globalRoutes.delete(entryId);
    this.pages.delete(entryId);

    // Handle service cleanup
    const service = this.services.get(entryId);
    if (service && service.cleanup) {
      await service.cleanup();
    }
    this.services.delete(entryId);

    this.extensions.delete(entryId);

    // Remove dependencies
    this.removeDependencies(entryId);

    // Emit event
    this.emitEvent("entry:unregistered", {
      entryId,
    });
  }

  private topologicalSort(entries: string[]): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      visited.add(id);

      const deps = this.dependencyGraph.get(id);
      if (deps) {
        deps.forEach(dep => {
          if (entries.includes(dep)) {
            visit(dep);
          }
        });
      }

      result.push(id);
    };

    entries.forEach(visit);
    return result;
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  on(event: RegistryEventType, listener: RegistryEventListener): void {
    super.on(event, listener);
  }

  off(event: RegistryEventType, listener: RegistryEventListener): void {
    super.off(event, listener);
  }

  emit(event: RegistryEvent): void {
    super.emit(event.type, event);
  }
}

// Create singleton instance
const registry = new RegistryImpl();

export { registry };
export type { RegistryImpl };
```

### 2. `/apps/core/src/lib/registry/validation/tool.ts`
```typescript
import { z } from "zod";
import type { ToolRegistration } from "@/types/registry";

const toolNavigationContextSchema = z.object({
  toolId: z.string(),
  currentRoute: z.array(z.string()),
  routeParams: z.record(z.string()),
  navigate: z.function(),
});

const toolComponentPropsSchema = z.object({
  navigation: toolNavigationContextSchema,
  workspaceId: z.string(),
  permissions: z.array(z.string()),
});

export const validateToolRegistration = (tool: any): ToolRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    icon: z.function(), // Component type
    sidebarComponent: z.function().optional(),
    headerComponent: z.function().optional(),
    pageComponent: z.function(),
    defaultRoute: z.array(z.string()),
    requiresWorkspace: z.boolean().optional(),
    requiredPermissions: z.array(z.string()).optional(),
    configSchema: z.any().optional(), // ZodSchema
  });

  return schema.parse(tool);
};
```

### 3. `/apps/core/src/lib/registry/validation/command.ts`
```typescript
import { z } from "zod";
import type { CommandRegistration } from "@/types/registry";

export const validateCommandRegistration = (command: any): CommandRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    hotkey: z.string().optional(),
    categories: z.array(z.string()).optional(),
    handler: z.function(),
    requiresWorkspace: z.boolean().optional(),
    requiredPermissions: z.array(z.string()).optional(),
  });

  return schema.parse(command);
};
```

### 4. `/apps/core/src/lib/registry/validation/search.ts`
```typescript
import { z } from "zod";
import type { SearchProviderRegistration } from "@/types/registry";

export const validateSearchProviderRegistration = (provider: any): SearchProviderRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    search: z.function(),
    requiresWorkspace: z.boolean().optional(),
    categories: z.array(z.string()).optional(),
  });

  return schema.parse(provider);
};
```

### 5. `/apps/core/src/lib/registry/validation/globalRoute.ts`
```typescript
import { z } from "zod";
import type { GlobalRouteRegistration } from "@/types/registry";

export const validateGlobalRouteRegistration = (route: any): GlobalRouteRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    route: z.string().min(1),
    component: z.function(),
    requiresAuth: z.boolean().optional(),
    requiresWorkspace: z.boolean().optional(),
    requiredPermissions: z.array(z.string()).optional(),
    priority: z.number().optional(),
  });

  return schema.parse(route);
};
```

### 6. `/apps/core/src/lib/registry/validation/page.ts`
```typescript
import { z } from "zod";
import type { PageRegistration } from "@/types/registry";

export const validatePageRegistration = (page: any): PageRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    toolId: z.string().min(1),
    route: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    component: z.function(),
    sidebarComponent: z.function().optional(),
    headerComponent: z.function().optional(),
    hidden: z.boolean().optional(),
    requiredPermissions: z.array(z.string()).optional(),
  });

  return schema.parse(page);
};
```

### 7. `/apps/core/src/lib/registry/validation/service.ts`
```typescript
import { z } from "zod";
import type { ServiceRegistration } from "@/types/registry";

export const validateServiceRegistration = (service: any): ServiceRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    factory: z.function(),
    singleton: z.boolean().optional(),
    options: z.record(z.unknown()).optional(),
  });

  return schema.parse(service);
};
```

### 8. `/apps/core/src/lib/registry/validation/extension.ts`
```typescript
import { z } from "zod";
import type { ExtensionRegistration } from "@/types/registry";

export const validateExtensionRegistration = (extension: any): ExtensionRegistration => {
  const schema = z.object({
    id: z.string().min(1),
    packageId: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
    target: z.string().min(1),
    extension: z.unknown(),
    config: z.record(z.unknown()).optional(),
  });

  return schema.parse(extension);
};
```

### 9. `/apps/core/src/lib/registry/exports.ts`
```typescript
/**
 * Registry exports for packages
 * Provides a clean API for packages to interact with the registry
 */

import { registry } from "./index";
import type { Registry, Package } from "@/types/registry";

// Export the registry instance as the default export
export default registry;

// Export the registry type for TypeScript usage
export type { Registry };

// Export utility functions for common operations
export const createPackage = (pkg: Package): Package => pkg;

// Export validation schemas for packages to use
export * from "./validation/tool";
export * from "./validation/command";
export * from "./validation/search";
export * from "./validation/globalRoute";
export * from "./validation/page";
export * from "./validation/service";
export * from "./validation/extension";
```

## Files to Update

### `/apps/core/package.json`
Add dependencies using Bun:
```bash
bun add zod
```

This will add:
```json
{
  "dependencies": {
    "zod": "^3.22.4"
  }
}
```

## Validation Checklist
- [ ] Registry singleton works correctly
- [ ] All registration methods validate input
- [ ] Dependency tracking prevents circular dependencies
- [ ] Package loading/unloading works
- [ ] Events are emitted for all operations
- [ ] TypeScript types are enforced
- [ ] Performance benchmarks acceptable
- [ ] Memory usage remains reasonable
- [ ] Concurrent operations are safe

## Testing Example

```typescript
import registry from "@/lib/registry";

// Register a tool
registry.registerTool({
  id: "test-tool",
  packageId: "test-package",
  name: "Test Tool",
  pageComponent: TestComponent,
  defaultRoute: ["home"],
});

// Retrieve the tool
const tool = registry.getTool("test-tool");
console.log(tool?.name); // "Test Tool"

// Listen to events
registry.on("entry:registered", (event) => {
  console.log(`Entry registered: ${event.entryId}`);
});
```

## Next Steps
After implementing the registry:
1. Create the registry context provider (Unit 3.3)
2. Implement dynamic routing for registered tools (Unit 4.1)
3. Build page registration system (Unit 4.2)