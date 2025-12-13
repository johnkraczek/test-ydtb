# Unit 3.1: Registry Types and Interfaces

## Folder: `05-registry-types`

## Purpose
Define comprehensive TypeScript interfaces and types for the registry system that will manage dynamic package loading, tool registration, and component rendering in the CRM Toolkit.

## Context
- The registry system is the core component that enables dynamic package loading
- Need comprehensive type definitions for all registry operations
- All registration APIs must be type-safe to prevent runtime errors
- Types should support all features from the architecture plan: tools, commands, search, pages, global routes, services, and extensions
- Must support both server-side and client-side operations
- Types need to be extensible for future package features

## Definition of Done
- [ ] All registry interfaces defined with comprehensive type safety
- [ ] Type exports organized in a logical structure
- [ ] Documentation comments (JSDoc) added for all interfaces
- [ ] Examples provided for each major type usage
- [ ] Discriminated unions for different registration types
- [ ] Generic types for extensibility
- [ ] Proper typing for React component registration
- [ ] Server action and API route type definitions
- [ ] Event system types for registry changes

## Registry System Overview

The registry system manages the following types of registrations:
1. **Tools** - Main package entities with navigation and routing
2. **Commands** - Global command palette actions
3. **Search Providers** - Custom search implementations
4. **Global Routes** - App-wide route registrations
5. **Pages** - Tool-specific page components
6. **Services** - Shared service instances
7. **Extensions** - Package extensions and plugins

## Files to Create

### `/apps/core/src/types/registry.ts`

```typescript
/**
 * Core registry system types for the CRM Toolkit package architecture
 * @fileoverview Defines all interfaces and types for package registration and management
 */

import { ComponentType, ReactNode } from "react";
import type { ZodSchema } from "zod";

// ============================================================================
// BASE REGISTRY TYPES
// ============================================================================

/**
 * Base interface for all registry entries
 */
interface BaseRegistryEntry {
  /** Unique identifier for the registration */
  id: string;
  /** Package that owns this registration */
  packageId: string;
  /** Optional human-readable name */
  name?: string;
  /** Optional description */
  description?: string;
  /** Version of the registration */
  version?: string;
  /** Dependencies on other registry entries */
  dependencies?: string[];
  /** Tags for categorization and searching */
  tags?: string[];
  /** Registration metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Type discriminator for different registry entry types
 */
type RegistryEntryType =
  | "tool"
  | "command"
  | "search"
  | "globalRoute"
  | "page"
  | "service"
  | "extension";

/**
 * Union type for all possible registry entries
 */
type RegistryEntry =
  | ToolRegistration
  | CommandRegistration
  | SearchProviderRegistration
  | GlobalRouteRegistration
  | PageRegistration
  | ServiceRegistration
  | ExtensionRegistration;

// ============================================================================
// TOOL REGISTRATION TYPES
// ============================================================================

/**
 * Component props for tool navigation
 */
interface ToolNavigationContext {
  /** Current tool ID */
  toolId: string;
  /** Current route within the tool */
  currentRoute: string[];
  /** Route parameters */
  routeParams: Record<string, string>;
  /** Navigate to a different route */
  navigate: (route: string[], params?: Record<string, string>) => void;
}

/**
 * Component props for tool rendering
 */
interface ToolComponentProps {
  /** Navigation context */
  navigation: ToolNavigationContext;
  /** Workspace context */
  workspaceId: string;
  /** User permissions in the workspace */
  permissions: string[];
}

/**
 * Tool registration interface
 */
interface ToolRegistration extends BaseRegistryEntry {
  type: "tool";
  /** Tool display icon component */
  icon: ComponentType<{ className?: string; size?: number }>;
  /** Sidebar component for the tool */
  sidebarComponent?: ComponentType<ToolComponentProps>;
  /** Header component for the tool */
  headerComponent?: ComponentType<ToolComponentProps>;
  /** Main page component */
  pageComponent: ComponentType<ToolComponentProps>;
  /** Default route for the tool */
  defaultRoute: string[];
  /** Whether the tool requires workspace context */
  requiresWorkspace?: boolean;
  /** Required permissions */
  requiredPermissions?: string[];
  /** Tool configuration schema */
  configSchema?: ZodSchema;
}

// ============================================================================
// COMMAND REGISTRATION TYPES
// ============================================================================

/**
 * Command execution context
 */
interface CommandContext {
  /** Current workspace ID */
  workspaceId: string;
  /** Current tool ID */
  toolId?: string;
  /** Selected text or data */
  selection?: unknown;
  /** Additional context data */
  data?: Record<string, unknown>;
}

/**
 * Command registration interface
 */
interface CommandRegistration extends BaseRegistryEntry {
  type: "command";
  /** Command title */
  title: string;
  /** Command description */
  description: string;
  /** Keyboard shortcut */
  hotkey?: string;
  /** Command categories */
  categories?: string[];
  /** Command handler function */
  handler: (context: CommandContext) => Promise<void | unknown>;
  /** Whether command requires workspace context */
  requiresWorkspace?: boolean;
  /** Required permissions */
  requiredPermissions?: string[];
}

// ============================================================================
// SEARCH PROVIDER REGISTRATION TYPES
// ============================================================================

/**
 * Search result item
 */
interface SearchResultItem {
  /** Unique ID for the result */
  id: string;
  /** Display title */
  title: string;
  /** Display description */
  description?: string;
  /** Icon component */
  icon?: ComponentType<{ className?: string }>;
  /** Action to perform when result is selected */
  action: () => void | Promise<void>;
  /** Keyboard shortcut */
  hotkey?: string;
  /** Metadata for the result */
  metadata?: Record<string, unknown>;
}

/**
 * Search query context
 */
interface SearchContext {
  /** Search query string */
  query: string;
  /** Current workspace ID */
  workspaceId: string;
  /** Search options */
  options?: {
    /** Maximum number of results */
    limit?: number;
    /** Search categories */
    categories?: string[];
    /** Include archived items */
    includeArchived?: boolean;
  };
}

/**
 * Search provider registration interface
 */
interface SearchProviderRegistration extends BaseRegistryEntry {
  type: "search";
  /** Provider display name */
  name: string;
  /** Provider description */
  description?: string;
  /** Search implementation function */
  search: (context: SearchContext) => Promise<SearchResultItem[]>;
  /** Whether provider requires workspace context */
  requiresWorkspace?: boolean;
  /** Search categories this provider handles */
  categories?: string[];
}

// ============================================================================
// GLOBAL ROUTE REGISTRATION TYPES
// ============================================================================

/**
 * Global route registration interface
 */
interface GlobalRouteRegistration extends BaseRegistryEntry {
  type: "globalRoute";
  /** Route pattern (supports wildcards) */
  route: string;
  /** Page component */
  component: ComponentType;
  /** Whether route requires authentication */
  requiresAuth?: boolean;
  /** Whether route requires workspace context */
  requiresWorkspace?: boolean;
  /** Required permissions */
  requiredPermissions?: string[];
  /** Route priority (higher numbers have priority) */
  priority?: number;
}

// ============================================================================
// PAGE REGISTRATION TYPES
// ============================================================================

/**
 * Page registration interface for tool-specific pages
 */
interface PageRegistration extends BaseRegistryEntry {
  type: "page";
  /** Tool ID this page belongs to */
  toolId: string;
  /** Page route pattern */
  route: string;
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Page component */
  component: ComponentType<ToolComponentProps>;
  /** Sidebar component override */
  sidebarComponent?: ComponentType<ToolComponentProps>;
  /** Header component override */
  headerComponent?: ComponentType<ToolComponentProps>;
  /** Whether page is visible in navigation */
  hidden?: boolean;
  /** Required permissions */
  requiredPermissions?: string[];
}

// ============================================================================
// SERVICE REGISTRATION TYPES
// ============================================================================

/**
 * Service instance interface
 */
interface ServiceInstance {
  /** Service name */
  name: string;
  /** Service instance */
  instance: unknown;
  /** Service initialization status */
  initialized: boolean;
  /** Service dependencies */
  dependencies?: string[];
  /** Cleanup function */
  cleanup?: () => void | Promise<void>;
}

/**
 * Service registration interface
 */
interface ServiceRegistration extends BaseRegistryEntry {
  type: "service";
  /** Service factory function */
  factory: () => Promise<unknown> | unknown;
  /** Whether service is a singleton */
  singleton?: boolean;
  /** Service initialization options */
  options?: Record<string, unknown>;
}

// ============================================================================
// EXTENSION REGISTRATION TYPES
// ============================================================================

/**
 * Extension registration interface
 */
interface ExtensionRegistration extends BaseRegistryEntry {
  type: "extension";
  /** Extension target */
  target: string;
  /** Extension implementation */
  extension: unknown;
  /** Extension configuration */
  config?: Record<string, unknown>;
}

// ============================================================================
// REGISTRY EVENT TYPES
// ============================================================================

/**
 * Registry event types
 */
type RegistryEventType =
  | "entry:registered"
  | "entry:unregistered"
  | "entry:updated"
  | "registry:cleared"
  | "package:loaded"
  | "package:unloaded";

/**
 * Registry event payload
 */
interface RegistryEvent {
  /** Event type */
  type: RegistryEventType;
  /** Registry entry ID */
  entryId?: string;
  /** Registry entry type */
  entryType?: RegistryEntryType;
  /** Package ID */
  packageId?: string;
  /** Event data */
  data?: unknown;
  /** Event timestamp */
  timestamp: Date;
}

/**
 * Event listener function type
 */
type RegistryEventListener = (event: RegistryEvent) => void;

// ============================================================================
// PACKAGE REGISTRATION TYPES
// ============================================================================

/**
 * Package metadata
 */
interface PackageMetadata {
  /** Package name */
  name: string;
  /** Package version */
  version: string;
  /** Package description */
  description?: string;
  /** Package author */
  author?: string;
  /** Package dependencies */
  dependencies?: string[];
  /** Package peer dependencies */
  peerDependencies?: string[];
  /** Package keywords */
  keywords?: string[];
  /** Package homepage */
  homepage?: string;
  /** Package repository */
  repository?: string;
}

/**
 * Package initialization function
 */
type PackageInitFunction = (registry: Registry) => void | Promise<void>;

/**
 * Package cleanup function
 */
type PackageCleanupFunction = () => void | Promise<void>;

/**
 * Package definition
 */
interface Package {
  /** Package metadata */
  metadata: PackageMetadata;
  /** Package initialization function */
  init: PackageInitFunction;
  /** Package cleanup function */
  cleanup?: PackageCleanupFunction;
  /** Package configuration schema */
  configSchema?: ZodSchema;
}

// ============================================================================
// REGISTRY API TYPES
// ============================================================================

/**
 * Registry interface
 */
interface Registry {
  // Core registration methods
  registerTool: (tool: Omit<ToolRegistration, "type">) => void;
  registerCommand: (command: Omit<CommandRegistration, "type">) => void;
  registerSearchProvider: (provider: Omit<SearchProviderRegistration, "type">) => void;
  registerGlobalRoute: (route: Omit<GlobalRouteRegistration, "type">) => void;
  registerPage: (page: Omit<PageRegistration, "type">) => void;
  registerService: (service: Omit<ServiceRegistration, "type">) => void;
  registerExtension: (extension: Omit<ExtensionRegistration, "type">) => void;

  // Retrieval methods
  getTool: (id: string) => ToolRegistration | undefined;
  getCommand: (id: string) => CommandRegistration | undefined;
  getSearchProvider: (id: string) => SearchProviderRegistration | undefined;
  getGlobalRoute: (id: string) => GlobalRouteRegistration | undefined;
  getPage: (id: string) => PageRegistration | undefined;
  getService: (id: string) => ServiceRegistration | undefined;
  getExtension: (id: string) => ExtensionRegistration | undefined;

  // List methods
  listTools: (packageId?: string) => ToolRegistration[];
  listCommands: (packageId?: string) => CommandRegistration[];
  listSearchProviders: (packageId?: string) => SearchProviderRegistration[];
  listGlobalRoutes: (packageId?: string) => GlobalRouteRegistration[];
  listPages: (toolId?: string, packageId?: string) => PageRegistration[];
  listServices: (packageId?: string) => ServiceRegistration[];
  listExtensions: (target?: string, packageId?: string) => ExtensionRegistration[];

  // Package management
  loadPackage: (pkg: Package) => Promise<void>;
  unloadPackage: (packageId: string) => Promise<void>;
  getLoadedPackages: () => string[];

  // Event system
  on: (event: RegistryEventType, listener: RegistryEventListener) => void;
  off: (event: RegistryEventType, listener: RegistryEventListener) => void;
  emit: (event: RegistryEvent) => void;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Base types
export type {
  BaseRegistryEntry,
  RegistryEntry,
  RegistryEntryType,
  RegistryEventListener,
};

// Tool types
export type {
  ToolRegistration,
  ToolNavigationContext,
  ToolComponentProps,
};

// Command types
export type {
  CommandRegistration,
  CommandContext,
};

// Search types
export type {
  SearchProviderRegistration,
  SearchResultItem,
  SearchContext,
};

// Global route types
export type {
  GlobalRouteRegistration,
};

// Page types
export type {
  PageRegistration,
};

// Service types
export type {
  ServiceRegistration,
  ServiceInstance,
};

// Extension types
export type {
  ExtensionRegistration,
};

// Event types
export type {
  RegistryEvent,
  RegistryEventType,
};

// Package types
export type {
  Package,
  PackageMetadata,
  PackageInitFunction,
  PackageCleanupFunction,
};

// Registry API type
export type { Registry };
```

## Usage Examples

### Example 1: Registering a Tool
```typescript
import { ToolRegistration } from "@/types/registry";

const myTool: Omit<ToolRegistration, "type"> = {
  id: "my-tool",
  packageId: "my-package",
  name: "My Tool",
  description: "A sample tool",
  icon: MyIcon,
  pageComponent: MyPage,
  defaultRoute: ["home"],
  requiredPermissions: ["read"],
};

registry.registerTool(myTool);
```

### Example 2: Registering a Command
```typescript
import { CommandRegistration } from "@/types/registry";

const myCommand: Omit<CommandRegistration, "type"> = {
  id: "create-item",
  packageId: "my-package",
  title: "Create New Item",
  description: "Creates a new item",
  hotkey: "cmd+n",
  handler: async (context) => {
    // Command logic
  },
};

registry.registerCommand(myCommand);
```

### Example 3: Creating a Package
```typescript
import { Package } from "@/types/registry";

const myPackage: Package = {
  metadata: {
    name: "my-package",
    version: "1.0.0",
    description: "My awesome package",
  },
  init: async (registry) => {
    // Register tools, commands, etc.
  },
  cleanup: async () => {
    // Cleanup resources
  },
};
```

## Validation Checklist
- [ ] All interfaces compile without errors
- [ ] TypeScript strict mode passes
- [ ] JSDoc comments are comprehensive
- [ ] Discriminated unions work correctly
- [ ] Generic types are properly constrained
- [ ] React component types are correct
- [ ] Server action types are defined
- [ ] Event system types are complete
- [ ] Package types include all necessary fields

## Next Steps
After defining the registry types:
1. Implement the core registry system (Unit 3.2)
2. Create the registry context provider (Unit 3.3)
3. Build dynamic routing for tools (Phase 4)