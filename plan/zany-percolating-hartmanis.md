# Plan: Package Architecture and Interface Definition for Dynamic Tool Registration

## Executive Summary
This plan establishes a monorepo package architecture with a well-defined interface for dynamic tool registration. The focus is on creating a scalable system where packages can register tools, commands, and searchable content with the main application. Key components include:

- **Monorepo Structure**: Clear separation between core UI package and feature packages
- **Package Interface**: Standardized registration API for tools, commands, and search providers
- **Basic Package**: A comprehensive reference implementation showcasing all interface capabilities

## Overview
Create a package-based architecture that allows independent development and registration of tools within a unified dashboard interface. The system supports comprehensive registration capabilities including tools, commands, search providers, global routes, context providers, menu items, database integrations, event bus, services, and extension points through a standardized interface.

## Package Registration Capabilities

### 1. System Integration (Packages ↔ Core)

#### Tools
- **Purpose**: Add navigation items with full routing control under their tool path
- **Scope**: Tool controls all routes under `/{toolId}/*`
- **Example**: Media package controls `/media/*`, `/media/folders/:id`, `/media/upload`

#### Global Routes
- **Purpose**: Register routes outside tool control
- **Types**:
  - Auth routes: `/login`, `/register`, `/forgot-password`
  - Admin routes: `/admin/users`, `/admin/settings`, `/admin/packages`
  - API routes (External): REST endpoints for external service integration
    - Webhooks: `/api/webhooks/:package`
    - Integrations: `/api/integrations/:package`
    - Public APIs: `/api/public/:package`
  - Global routes: `/dashboard`, `/profile`, `/agency`

#### Context Providers
- **Purpose**: Wrap React Context around different scopes
- **Scopes**:
  - Global: Wrapped around entire app (e.g., theme, auth)
  - Tool: Wrapped around tool routes only (e.g., media context)
  - Route: Wrapped around specific routes (e.g., edit context)

#### Menu Items
- **Purpose**: Add menu items outside tool control
- **Locations**:
  - User menu: Profile items, package-specific settings
  - Context menu: Right-click actions on shared data types
  - Utility menu: Global utilities, help, shortcuts

#### Database Integration
- **Purpose**: Define how packages interact with the database
- **Features**:
  - Table definitions with schemas
  - Tight coupling: Shared tables, foreign keys, triggers
  - Loose coupling: Internal API endpoints, events, services

### 2. Package-to-Package Integration

**Important**: All package-to-package communication happens internally within the application at build/runtime and is NOT exposed as external REST APIs. External API routes are registered separately through Global Routes.

#### Internal Communication Patterns

##### Event Bus
- **Purpose**: Allow packages to communicate through internal events
- **Use Cases**:
  - Media package emits `media:uploaded` event
  - Analytics package subscribes to track uploads
  - Notifications package subscribes to alert users
- **Implementation**: In-memory event emitter, not HTTP

##### Service Registry
- **Purpose**: Share functionality between packages through direct service injection
- **Examples**:
  - Storage service used by media, documents, and backup packages
  - Email service used by notifications, workflows, and CRM
  - AI service used by content generation and analytics
- **Implementation**: Direct function/method calls, not REST APIs

##### Extension Points
- **Purpose**: Allow packages to extend functionality of other packages
- **Examples**:
  - Media package registers image preview extensions
  - Analytics package registers chart type extensions
  - Workflow package registers action step extensions
- **Implementation**: Component registration and direct rendering

##### Loose Coupling (as defined in Database Integration)
- **Purpose**: Decoupled but internal communication
- **Types**:
  - Event-based: Internal event system
  - Service-based: Service registry lookup
  - Interface-based: Direct function/interface calls (NOT external APIs)

##### Package Dependencies
- **Purpose**: Define and manage inter-package relationships
- **Types**:
  - Strict: Direct import coupling at build time
  - Loose: Interface-based coupling through services/events at runtime

#### Internal vs External Communication Patterns

**Important**: Internal communication within the application uses direct function calls (either across RSC boundary or server-side), NOT HTTP requests. HTTP APIs are ONLY for external system integration.

##### Internal Package Communication

**1. RSC Client-Server Boundary**
- **Mechanism**: Direct function calls between client components and server functions
- **Technology**: React Server Components boundary
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Client components fetching data from server
  - Form submissions and mutations
  - Server actions for client interactions

**2. Server-Side Package-to-Package Communication**
- **Mechanism**: Direct function calls between packages on the server
- **Technology**: Internal function imports/calls
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Package A calling functions from Package B
  - Shared services and utilities
  - Database operations
  - Internal business logic

```typescript
// Example: RSC call from client to server
import { getMediaFiles } from '@ydtb/media/server';

// Client component calling server function
export default async function AnalyticsPage() {
  // RSC boundary call - client to server
  const mediaFiles = await getMediaFiles();

  return <AnalyticsDashboard mediaData={mediaFiles} />;
}
```

```typescript
// Example: Server-side package-to-package call
// In packages/analytics/src/server/services.ts
import { processMediaFile } from '@ydtb/media/server';

export async function generateAnalyticsReport() {
  // Internal server function call - no RSC boundary
  const processedMedia = await processMediaFile(/* ... */);

  // This is a direct function call between server modules
  return processedMedia;
}
```

##### External API Registration (HTTP)
Only for integration with external systems:
- **Mechanism**: HTTP endpoints exposed to outside world
- **Technology**: Next.js API routes
- **Authentication**: Required for all external endpoints
  - API keys for service-to-service communication
  - OAuth/JWT for third-party integrations
  - Signature verification for webhooks
- **Use Cases**:
  - Webhooks from external services (with signature verification)
  - Public APIs for third-party integration (with API keys)
  - Mobile app backends (with OAuth/JWT)
  - Internal package webhooks (with authenticated calls)

```typescript
// Example: Registering external HTTP endpoint
registerGlobalRoute({
  path: '/api/webhooks/analytics',
  handler: AnalyticsWebhookHandler,  // HTTP handler
  type: 'external',
  config: {
    method: 'POST',
    auth: {
      type: 'signature',        // HMAC signature verification
      secret: process.env.WEBHOOK_SECRET,
      header: 'X-Signature'
    },
    rateLimit: {
      windowMs: 60000,          // 1 minute
      maxRequests: 100
    },
    cors: {
      origins: ['https://trusted-service.com'],
      credentials: true
    }
  }
});

// Example: Public API with API key authentication
registerGlobalRoute({
  path: '/api/v1/analytics/data/:id',
  handler: AnalyticsDataHandler,
  type: 'external',
  config: {
    method: 'GET',
    auth: {
      type: 'apikey',
      header: 'X-API-Key'
    },
    rateLimit: {
      windowMs: 60000,
      maxRequests: 1000
    }
  }
});
```

This separation ensures:
1. **Security**: Internal function calls stay internal, no exposure
2. **Performance**: Direct function calls are faster than HTTP (both RSC and server-side)
3. **Type Safety**: All internal calls maintain full TypeScript types
4. **Flexibility**: External HTTP APIs can be versioned independently

## Phase 1: Monorepo Package Architecture

### 1.0 Alias Path Conventions (IMPORTANT)

All code in this monorepo MUST use alias imports instead of relative paths. This is strictly enforced to maintain clarity and avoid path maintenance issues.

**Alias Definitions**:
- **`@/`** - Core application functionality only
  - Imports from `apps/core/src/`
  - Example: `@/lib/registry`, `@/components/ui`, `@/context/providers`
  - Used by: All packages importing core functionality

- **`@ydtb/[package]`** - Cross-package imports
  - Imports from `packages/[package]/src/`
  - Example: `@ydtb/media/components`, `@ydtb/analytics/server`
  - Used by: Packages importing from other packages

- **`~/`** - Local imports within a package
  - Imports from current package's `src/` directory
  - Example: `~/components/BasicIcon`, `~/services/BasicService`
  - Used by: Code importing within its own package

**Examples**:
```typescript
// ✅ Correct - Importing core registry
import { registerTool } from '@/lib/registry';

// ✅ Correct - Cross-package import
import { MediaService } from '@ydtb/media/server';

// ✅ Correct - Local import within package
import { BasicIcon } from '~/components';

// ❌ WRONG - Never use relative paths like this
import { registerTool } from '../../../../../core/src/lib/registry';
import { MediaService } from '../../media/src/server';
import { BasicIcon } from './components';
```

**TypeScript Configuration**:
Each package and the core app must configure these paths in their `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["../../apps/core/src/*"],
      "@ydtb/*": ["../../packages/*/src/*"],
      "~/*": ["./src/*"]
    }
  }
}
```

**Rule of Thumb**: When writing code, always ask:
- Am I importing core functionality? → Use `@/`
- Am I importing from another package? → Use `@ydtb/[package]`
- Am I importing within my own package? → Use `~/`

### 1.1 Define Monorepo Structure
Create a clear separation between the core infrastructure package and feature packages:

```
/ydtb-monorepo
├── packages/
│   ├── basic/                  # Example basic package (@ydtb/basic)
│   │   ├── src/
│   │   │   ├── components/     # Tool-specific UI components
│   │   │   │   ├── BasicIcon.tsx       # Tool icon
│   │   │   │   ├── BasicSidebar.tsx    # Sidebar component
│   │   │   │   ├── BasicHeader.tsx     # Page header (shows header registration)
│   │   │   │   └── BasicWebhookHandler.tsx # API route example
│   │   │   ├── hooks/          # Tool-specific hooks
│   │   │   │   ├── useBasicData.ts       # Example hook for data fetching
│   │   │   │   └── useBasicService.ts    # Example of service consumption
│   │   │   ├── types/          # Tool-specific types
│   │   │   │   └── basic.ts              # Basic-specific types
│   │   │   ├── services/       # Business logic services
│   │   │   │   ├── BasicService.ts       # Service implementation example
│   │   │   │   └── BasicEventHandler.ts  # Event handling service
│   │   │   ├── providers/      # Context providers
│   │   │   │   └── BasicProvider.tsx     # Context provider example
│   │   │   ├── extensions/     # Extension points
│   │   │   │   └── BasicExtension.tsx    # Extension point example
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── BasicPage.tsx         # Main page component
│   │   │   │   ├── ItemPage.tsx          # Item details page
│   │   │   │   └── SettingsPage.tsx      # Tool settings page
│   │   │   ├── server/         # Server-side code
│   │   │   │   ├── actions.ts            # Server actions for client components
│   │   │   │   ├── routes.ts             # Server-side functions
│   │   │   │   └── api/                  # External API endpoints (if needed)
│   │   │   │       └── webhooks.ts       # Webhook handlers
│   │   │   ├── db/            # Database schema
│   │   │   │   ├── schema.ts             # Drizzle schema definitions
│   │   │   │   └── index.ts              # Database exports
│   │   │   ├── commands/      # Command palette commands
│   │   │   │   └── index.ts              # Command definitions
│   │   │   ├── search/        # Search provider
│   │   │   │   └── provider.ts           # Search provider implementation
│   │   │   ├── events/        # Event handlers
│   │   │   │   ├── handlers.ts           # Event handlers
│   │   │   │   └── index.ts              # Event registration
│   │   │   ├── middleware/    # Route middleware (if needed)
│   │   │   │   └── index.ts              # Middleware definitions
│   │   │   └── index.ts        # Entry point and registration
│   │   ├── package.json
│   │   ├── drizzle.config.ts             # Drizzle configuration
│   │   └── README.md
│   │
│   └── workflows/              # Future workflow package (@ydtb/workflows)
│       ├── src/
│       └── package.json
│
└── apps/
    └── core/                   # Core Next.js application
        ├── src/
        │   ├── app/
        │   │   ├── (auth)/       # Auth routes (both login/register on the same page. )
        │   │   │   ├── login/
        │   │   ├── [workspace]/   # Workspace-scoped routes (ALL dashboard routes)
        │   │   │   ├── layout.tsx    # Dashboard layout with registry
        │   │   │   ├── page.tsx
        │   │   │   └── [tools]/       # Dynamic tool routes
        │   │   ├── api/          # API routes
        │   │   │   ├── [workspace]/v1/  # Workspace-scoped API routes
        │   │   │   │   └── [tool]/[tool specific route]
        │   │   │   └── auth/
        │   │   ├── globals.css
        │   │   └── layout.tsx    # Root layout
        │   ├── components/
        │   │   ├── dashboard/     # Existing dashboard components
        │   │   │   ├── DashboardFooter.tsx
        │   │   │   ├── customization/
        │   │   │   │   └── CustomizeNavigationDialog.tsx
        │   │   │   ├── headers/
        │   │   │   │   ├── CommandPalette.tsx
        │   │   │   │   ├── HelpDropdown.tsx
        │   │   │   │   ├── MainHeader.tsx
        │   │   │   │   ├── NotificationDropdown.tsx
        │   │   │   │   ├── ProfileAvatar.tsx
        │   │   │   │   ├── ToolHeader.tsx
        │   │   │   │   └── WorkspaceDropdown.tsx
        │   │   │   └── sidebars/
        │   │   │       ├── IconRail.tsx
        │   │   │       └── ToolSidebar.tsx
        │   │   └── ui/            # Base UI components
        │   │       └── ...
        │   ├── context/       # React contexts and providers
        │   │   ├── providers.tsx          # Existing providers (add RegistryProvider here)
        │   │   ├── RegistryProvider.tsx   # NEW: Registry provider for packages
        │   │   ├── auth/                  # Authentication context
        │   │   │   └── auth.ts      
        │   │   ├── sidebar/
        │   │   │   └── use-sidebar.tsx
        │   │   └── theme/
        │   │       ├── theme-provider.tsx
        │   │       ├── use-theme-color.tsx
        │   │       └── use-theme-pattern.tsx
        │   ├── lib/
        │   │   ├── db/           # Database configuration and schema
        │   │   │   ├── index.ts          # Database connection and instance
        │   │   │   ├── schema.ts         # Global schema (imports from packages)
        │   │   │   └── migrations/       # All database migrations
        │   │   ├── registry/      # Registration systems (NEW)
        │   │   │   ├── tools.ts
        │   │   │   ├── commands.ts
        │   │   │   ├── search.ts
        │   │   │   └── index.ts
        │   │   ├── services/      # Global services
        │   │   │   ├── eventBus.ts
        │   │   │   └── serviceRegistry.ts
        │   │   ├── utils/        # Existing utilities
        │   │   │   └── ...
        │   │   └── api/          # API route handlers
        │   │   └── validation.ts # Zod schemas
        │   ├── server/
        │   └── types/            # Type definitions
        │       ├── registry.ts    # Registration interfaces
        │       ├── next-auth.d.ts
        │       └── index.ts
        ├── package.json
        └── tsconfig.json
```

### 1.2 Package Dependencies
Define clear dependency relationships between packages:

**Feature Packages** (`@ydtb/basic`, `@ydtb/workflows`):
- Can declare dependencies on other packages
- May require specific packages to be present for functionality
- Own their UI, business logic, and routes
- Register with core app through global registration functions
- Types are shared through TypeScript path mapping or direct imports
- Package dependencies are resolved during initialization, ensuring required packages exist

**Core Application**:
- Owns ALL infrastructure:
  - Registration systems implementation
  - Type definitions for registration
  - Global providers (theme, auth, registry)
  - Event bus and service registry
  - All CORE UI components (layout and base)
  - Database connections and migrations
- Imports feature packages to trigger their registration
- Provides global registration API that packages call

### 1.3 Integration with Existing Application

The package architecture integrates with the existing application as follows:

**Key Integration Points**:

1. **Workspace Context**:
   - Workspace ID extracted from URL params in all routes (`app/[workspace]/...`)
   - Validated for user access permissions
   - Passed to all components for data isolation
   - Used in ALL database queries for multi-tenancy

2. **Dashboard Layout** (`app/[workspace]/layout.tsx`):
   - Validates workspace access for current user
   - Imports and initializes packages
   - Uses registry to render registered tools
   - Manages tool state and navigation
   - Provides workspace context to all child components

3. **Tool Routes** (`app/[workspace]/[...toolId]/page.tsx`):
   - Dynamic routing for registered tools within workspace context
   - Renders tool-specific components with workspace context
   - Provides workspace-scoped tool context
   - All routes are prefixed with workspace ID

4. **Server Function Integration**:
   - Packages receive workspace context in all server functions
   - Core app provides base server functions (auth, users, workspaces)
   - Tool-specific server functions namespaced under package modules
   - Client-server communication uses RSC boundary
   - Server-side package-to-package communication uses direct function calls
   - No HTTP requests for internal communication
   - All data operations automatically filtered by workspace

5. **Database Integration**:
   - Core app owns database connection and ALL migrations
   - Core app's schema.ts imports and combines all package schemas
   - ALL package tables include `workspaceId` field for data isolation
   - Shared tables (users, workspaces, sessions) managed by core
   - Migrations are generated at the core app level from the combined schema
   - Workspace membership tracked in join tables

#### Core Application Database Schema

The core application defines the central database schema that all packages reference:

```typescript
// apps/core/src/lib/db/schema/core.ts
import { pgTable, text, timestamp, boolean, uuid, integer } from 'drizzle-orm/pg-core';

// Workspaces table - central to multi-tenancy
export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(), // Up to 20-character alphanumeric workspace ID
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  settings: text('settings'), // JSON string for workspace settings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  ownerId: text('owner_id').notNull().references(() => users.id),
});

// Users table - core user management
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Workspace members - many-to-many relationship
export const workspaceMembers = pgTable('workspace_members', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'owner', 'admin', 'member', 'viewer'
  joinedAt: timestamp('joined_at').defaultNow(),
}, (table) => ({
  uniqueUserWorkspace: {
    columns: [table.workspaceId, table.userId],
    unique: true,
  },
}));

// Sessions table for authentication
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id').references(() => workspaces.id), // Optional: for workspace-specific sessions
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
});

// Example of a shared settings table
export const userSettings = pgTable('user_settings', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  uniqueUserWorkspaceKey: {
    columns: [table.userId, table.workspaceId, table.key],
    unique: true,
  },
}));
```

**Important Notes**:
- The `workspaces` table uses an up to 20-character alphanumeric string as the primary key (`id`)
- All package tables must reference `workspaces.id` for their `workspaceId` column
- The `workspaceMembers` table tracks user permissions within each workspace
- Session management can optionally be workspace-scoped
- Shared settings support both user-level and workspace-level configurations

#### Workspace ID Validation

Workspace IDs must follow these rules:
- 10 to 20 characters long
- Only alphanumeric characters (a-z, A-Z, 0-9)
- Case-sensitive
- Unique across all workspaces

```typescript
// Validation utility for workspace IDs
export function isValidWorkspaceId(id: string): boolean {
  return /^[a-zA-Z0-9]{10,20}$/.test(id);
}

// Zod schema for validation
import { z } from 'zod';
export const workspaceIdSchema = z.string().regex(/^[a-zA-Z0-9]{10,20}$/, {
  message: "Workspace ID must be 10-20 alphanumeric characters"
});
```

### 1.4 Global Registration API

The core app provides a simple global registration API that packages can import and use:

```typescript
// apps/core/src/lib/registry/index.ts
// Global registration functions - available to all tools

export function registerTool(tool: ToolRegistration): void {
  // Implementation lives in core app
}

export function registerCommand(command: CommandRegistration): void {
  // Implementation lives in core app
}

export function registerSearchProvider(provider: SearchProviderRegistration): void {
  // Implementation lives in core app
}

// Tools import these directly from core app
export { registerTool, registerCommand, registerSearchProvider };
```

**Tool Registration Pattern**:
```typescript
// packages/basic/src/index.ts
import { registerTool, registerCommand } from '@/lib/registry'; // Core app import
import { BasicIcon, BasicSidebar, BasicHeader } from '~/components'; // Local package import

// Register the basic tool
registerTool({
  id: 'basic',
  name: 'Basic',
  version: '1.0.0',
  description: 'Basic example tool',

  // Tool configuration
  icon: BasicIcon,
  routes: ['/basic', '/basic/:id'],
  sidebar: BasicSidebar,
  header: BasicHeader,
  order: 0
});

// Register commands for this tool
registerCommand({
  id: 'basic-action',
  title: 'Basic Action',
  description: 'Example command',
  action: () => alert('Basic action executed!'),
  shortcut: ['cmd', 'b']
});

// Import and register all other capabilities
import {
  registerPages,
  registerDatabaseIntegration,
  registerGlobalRoute,
  registerSearchProvider,
  registerService,
  registerEventBus,
  registerExtension
} from '@/lib/registry';

import { registerBasicCommands } from '~/commands';
import { registerBasicSearch } from '~/search';
import { setupEventHandlers } from '~/events';
import { registerBasicExtensions } from '~/extensions';
import { BasicService } from '~/services/BasicService';
import { POST as webhookHandler } from '~/server/api/webhooks';

// Register pages
registerPages('basic', [
  {
    route: '/basic',
    title: 'Basic Tool Overview',
    component: BasicPage
  },
  {
    route: '/basic/:id',
    title: 'Basic Item Details',
    component: ItemPage
  },
  {
    route: '/basic/settings',
    title: 'Settings',
    component: SettingsPage
  }
]);

// Register database integration
registerDatabaseIntegration({
  toolId: 'basic',
  tables: [
    {
      name: 'basic_items',
      schema: './src/db/schema',
      dependencies: ['users']
    }
  ]
});

// Register external webhook endpoint
registerGlobalRoute({
  path: '/api/webhooks/basic',
  handler: webhookHandler,
  type: 'external',
  config: {
    method: 'POST',
    auth: {
      type: 'signature',
      secret: process.env.BASIC_WEBHOOK_SECRET,
      header: 'X-Signature'
    }
  }
});

// Register search provider
registerBasicSearch();

// Register service for other packages
registerService({
  name: 'basicService',
  implementation: new BasicService()
});

// Register event handlers
setupEventHandlers();

// Register extension points
registerBasicExtensions();

// Register commands
registerBasicCommands();

// Export components for other packages
export { BasicIcon, BasicSidebar, BasicHeader };
```

This approach:
- Eliminates any complex dependency injection
- Makes packages explicitly dependent on core app (which is fine in a monorepo)
- Keeps the registration API simple and direct
- Allows core app to control all infrastructure

**Tool Registration**:
Each package registers its tool once:

```typescript
// packages/analytics/src/index.ts
import { registerTool } from '@/lib/registry';
import { AnalyticsIcon, AnalyticsSidebar, AnalyticsHeader } from '~/components';

// Register the analytics tool
registerTool({
  id: 'analytics',
  name: 'Analytics',
  version: '1.0.0',
  description: 'Analytics dashboard and reporting',
  dependencies: ['media', 'workflows'], // Requires these packages
  optionalDependencies: ['crm'], // Optional dependencies

  // Tool configuration
  icon: AnalyticsIcon,
  routes: ['/analytics', '/analytics/reports'],
  sidebar: AnalyticsSidebar,
  header: AnalyticsHeader,
  order: 10,

  // Database requirements
  databaseTables: [
    {
      name: 'analytics_events',
      schema: './schema/analytics_events.sql',
      dependencies: ['media_files', 'users'] // Foreign key dependencies
    }
  ]
});
```

**Dependency Resolution Process**:
1. Core app collects all tool registrations
2. Builds dependency graph
3. Validates all dependencies exist
4. Reports missing or circular dependencies
5. Initializes tools in dependency order
6. Skips tools with unmet dependencies (with clear error logging)

## Phase 2: Package Interface Definition

### 2.1 Core Registration Interfaces
Define standardized interfaces for package registration in `/apps/core/src/types/registry.ts`:

```typescript
// Tool registration interface
export interface ToolRegistration {
  // Core identification
  id: string;
  name: string;
  version: string;
  description?: string;

  // Tool dependencies (other npm packages/tools)
  dependencies?: string[]; // Required tools
  optionalDependencies?: string[]; // Optional tools
  peerDependencies?: string[]; // Packages that should be installed separately

  // Database requirements
  databaseTables?: TableDefinition[];

  // Tool metadata
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;

  // Tool configuration
  icon: React.ComponentType<{ className?: string }>;
  routes: string[]; // Routes this tool handles
  sidebar?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;
  header?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;
  order?: number;

  // Lifecycle hooks
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
}

// Dependency graph interface
export interface DependencyGraph {
  tools: Map<string, ToolRegistration>;
  dependencies: Map<string, string[]>;
  dependents: Map<string, string[]>;
  sorted: string[]; // Topologically sorted tools
}

// Simplified command registration
export interface CommandRegistration {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
  action: () => void | Promise<void>;
}

// Simplified search provider registration
export interface SearchProviderRegistration {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  search: (query: string) => Promise<SearchResult[]>;
}

// Search result interface
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  action: () => void | Promise<void>;
}

// Table definition interface
export interface TableDefinition {
  name: string;
  schema: string; // Drizzle schema module path
  dependencies?: string[]; // Table dependencies (foreign keys)
  indexes?: IndexDefinition[];
}

// Index definition interface
export interface IndexDefinition {
  name: string;
  columns: string[];
  unique?: boolean;
}

// Database integration interface
export interface DatabaseIntegration {
  toolId: string;
  tables: TableDefinition[];
  seeds?: string; // Path to seed data directory (optional)
}

```

### 2.2 Registration API Design
The core app implements registration functions in `/apps/core/src/lib/registry/index.ts`:

```typescript
// Tool registration API
// Used when a package registers its tool with the system
export function registerTool(tool: ToolRegistration): void;
export function unregisterTool(toolId: string): void;
export function getRegisteredTools(): ToolRegistration[];
export function getToolById(toolId: string): ToolRegistration | undefined;
export function checkToolDependencies(toolIds: string[]): boolean;
export function getDependencyGraph(): DependencyGraph;

// Command registration API
// Used by tools to register commands for the command palette
export function registerCommands(toolId: string, commands: CommandDefinition[]): void;
export function unregisterCommands(toolId: string): void;
export function getRegisteredCommands(): CommandDefinition[];
export function getCommandsByTool(toolId: string): CommandDefinition[];

// Search provider registration API
// Used by tools to add searchable content to global search
export function registerSearchProvider(provider: SearchProvider): void;
export function unregisterSearchProvider(providerId: string): void;
export function getSearchProviders(): SearchProvider[];
export function searchAll(query: string): Promise<SearchResult[]>;

// Global route registration API
// Used by tools to register external HTTP endpoints (webhooks, APIs)
export function registerGlobalRoute(route: GlobalRouteRegistration): void;
export function unregisterGlobalRoute(path: string): void;
export function getGlobalRoutes(): GlobalRouteRegistration[];

// Context provider registration API
// Used by tools to wrap specific routes or the entire app with context
export function registerContextProvider(provider: ContextProviderRegistration): void;
export function unregisterContextProvider(id: string): void;
export function getContextProviders(scope?: string): ContextProviderRegistration[];

// Menu item registration API
// Used by tools to add items to navigation menus
export function registerMenuItem(item: MenuItemRegistration): void;
export function unregisterMenuItem(id: string): void;
export function getMenuItems(location: string): MenuItemRegistration[];

// Database integration API
// Used by tools to register their database schema and tables
export function registerDatabaseIntegration(integration: DatabaseIntegration): void;
export function getDatabaseIntegrations(): DatabaseIntegration[];
export function getToolTables(toolId: string): TableDefinition[];

// Event bus API
// Used for internal tool-to-tool communication via events
export function registerEventBus(registration: EventBusRegistration): void;
export function getEventBus(): EventBusRegistration | null;
export function publishEvent(event: string, data: any): void;
export function subscribeToEvent(event: string, handler: (data: any) => void): () => void;

// Service registry API
// Used by tools to share services with other tools
export function registerService(service: ServiceRegistration): void;
export function unregisterService(name: string): void;
export function getService<T>(name: string): T | null;

// Extension point API
// Used by tools to allow other tools to extend their functionality
export function registerExtension(extension: ExtensionPoint): void;
export function unregisterExtension(id: string): void;
export function getExtensions(pointId?: string): ExtensionPoint[];
```

### 2.3 Package Entry Point Pattern
Define a standard pattern for package entry points:

```typescript
// In packages/basic/src/index.ts
import { registerTool, registerCommand } from '@/lib/registry'; // Core app import
import { BasicIcon, BasicSidebar, BasicHeader } from '~/components'; // Local package import

// Register the tool with the core app
registerTool({
  id: 'basic',
  name: 'Basic Example',
  description: 'Example package showcasing tool registration',
  icon: BasicIcon,
  routes: ['/basic', '/basic/:id'],
  sidebar: BasicSidebar,
  header: BasicHeader,
  order: 0
});

// Register commands
registerCommand({
  id: 'basic-action',
  title: 'Basic Action',
  description: 'Example command demonstrating command registration',
  action: () => {
    // STUB: Implement your action here
    alert('Basic action executed!');
  },
  shortcut: ['cmd', 'b']
});

registerCommand({
  id: 'show-notifications',
  title: 'Show Notifications',
  description: 'Example command with notification',
  action: () => {
    // STUB: Implement your notification logic
    console.log('Notification shown from Basic package');
  }
});

// Export components for other packages if needed
export { BasicIcon, BasicSidebar, BasicHeader };
```

## Phase 3: Example Package Implementation - Basic Package

### 3.1 Package Structure
Create the basic package with the following structure:

```
packages/basic/
├── src/
│   ├── components/
│   │   ├── BasicIcon.tsx         # Icon component (showcases icon registration)
│   │   ├── BasicSidebar.tsx      # Sidebar content (demonstrates sidebar control)
│   │   ├── BasicHeader.tsx       # Page header (shows header registration)
│   │   └── BasicWebhookHandler.tsx # API route example
│   ├── hooks/
│   │   ├── useBasicData.ts       # Example hook for data fetching
│   │   └── useBasicService.ts    # Example of service consumption
│   ├── types/
│   │   └── basic.ts              # Basic-specific types
│   ├── services/
│   │   ├── BasicService.ts       # Service implementation example
│   │   └── BasicEventHandler.ts  # Event handling service
│   ├── providers/
│   │   └── BasicProvider.tsx     # Context provider example
│   ├── extensions/
│   │   └── BasicExtension.tsx    # Extension point example
│   ├── pages/
│   │   ├── BasicPage.tsx         # Main page component
│   │   ├── ItemPage.tsx          # Item details page
│   │   └── SettingsPage.tsx      # Tool settings page
│   ├── server/
│   │   ├── actions.ts            # Server actions for client components
│   │   ├── routes.ts             # Server-side functions
│   │   └── api/                  # External API endpoints (if needed)
│   │       └── webhooks.ts       # Webhook handlers
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema definitions
│   │   └── index.ts              # Database exports
│   ├── commands/
│   │   └── index.ts              # Command palette commands
│   ├── search/
│   │   └── provider.ts           # Search provider implementation
│   ├── events/
│   │   ├── handlers.ts           # Event handlers
│   │   └── index.ts              # Event registration
│   ├── middleware/
│   │   └── index.ts              # Route middleware (if needed)
│   └── index.ts                  # Entry point and registration
├── package.json
├── drizzle.config.ts             # Drizzle configuration
└── README.md
```

### 3.2 Purpose of the Basic Package

The Basic package serves as a reference implementation that:
1. **Demonstrates all registration capabilities** with working examples
2. **Provides stub implementations** with clear documentation
3. **Acts as a jumping-off point** for creating new packages
4. **Shows best practices** for package structure and organization
5. **Includes comprehensive comments** explaining each registration type

### 3.3 Stub Implementation Guidelines

Each stub in the Basic package includes:
- Clear `// STUB:` comments indicating what needs implementation
- Working mock implementations that demonstrate the concept
- Comments explaining how to adapt for real-world use
- Type definitions to ensure compile-time safety

### 3.4 Core Components Implementation

#### BasicIcon Component
```typescript
// src/components/BasicIcon.tsx
import { Sparkles } from 'lucide-react';

interface BasicIconProps {
  className?: string;
}

export function BasicIcon({ className }: BasicIconProps) {
  return <Sparkles className={className} />;
}
```

#### BasicSidebar Component
```typescript
// src/components/BasicSidebar.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function BasicSidebar() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="p-4 space-y-4">
      <Card className="p-3">
        <h4 className="font-medium mb-2">Basic Package Examples</h4>
        <p className="text-sm text-muted-foreground">
          This sidebar demonstrates package control over sidebar content.
          The component is self-contained and imports UI components directly.
        </p>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full justify-start"
          variant={activeSection === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </Button>
        <Button
          className="w-full justify-start"
          variant={activeSection === 'commands' ? 'default' : 'ghost'}
          onClick={() => setActiveSection('commands')}
        >
          Commands <Badge variant="secondary" className="ml-auto">2</Badge>
        </Button>
      </div>

      <Card className="p-3">
        <h5 className="font-medium mb-1">STUB Implementation</h5>
        <p className="text-xs text-muted-foreground">
          Replace this content with your actual sidebar implementation.
          Each button should trigger different functionality in your tool.
        </p>
      </Card>
    </div>
  );
}
```

#### BasicHeader Component
```typescript
// src/components/BasicHeader.tsx
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BasicHeaderProps {
  title?: string;
}

export function BasicHeader({ title = "Basic Example Tool" }: BasicHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Badge variant="outline">Example</Badge>
        <Badge variant="secondary">STUB</Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline">
          View Docs
        </Button>
        <Button>
          Try Basic Action
        </Button>
      </div>
    </div>
  );
}
```

#### Sidebar Navigation Context

The sidebar component needs access to the current route to highlight active navigation items. There are two approaches:

**Option 1: Pass route context to sidebar (Recommended)**
```typescript
// Update ToolRegistration to include context for sidebar
export interface ToolRegistration {
  // ... other properties

  sidebar?: React.ComponentType<{
    toolId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;
}

// The core app passes route context to both header and sidebar
export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = getToolById(toolId);

  const currentRoute = `/${toolId}${params.slug ? '/' + params.slug.join('/') : ''}`;

  return (
    <div className="tool-page">
      {/* Both components receive route context */}
      {tool.header && (
        <tool.header
          toolId={toolId}
          currentRoute={currentRoute}
          routeParams={params}
        />
      )}

      <div className="flex">
        {tool.sidebar && (
          <tool.sidebar
            toolId={toolId}
            currentRoute={currentRoute}
            routeParams={params}
          />
        )}

        <div className="tool-content">
          {/* ... */}
        </div>
      </div>
    </div>
  );
}

// Updated sidebar implementation
interface ToolSidebarProps {
  toolId: string;
  currentRoute: string;
  routeParams: Record<string, string | string[]>;
}

export function BasicSidebar({ toolId, currentRoute, routeParams }: ToolSidebarProps) {
  // Define navigation items with their routes
  const navigationItems = [
    { id: 'overview', label: 'Overview', route: '/basic', icon: HomeIcon },
    { id: 'items', label: 'All Items', route: '/basic/items', icon: ListIcon },
    { id: 'settings', label: 'Settings', route: '/basic/settings', icon: SettingsIcon },
  ];

  return (
    <div className="p-4 space-y-4">
      <Card className="p-3">
        <h4 className="font-medium mb-2">Basic Tool Navigation</h4>
      </Card>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          // Check if this item is active based on current route
          const isActive = currentRoute === item.route ||
                          (item.route !== '/basic' && currentRoute.startsWith(item.route));

          return (
            <Button
              key={item.id}
              className="w-full justify-start"
              variant={isActive ? 'default' : 'ghost'}
              onClick={() => {
                // Navigate to the route (use router or link component)
                window.location.href = item.route;
              }}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Show additional context if we're viewing a specific item */}
      {routeParams.id && (
        <Card className="p-3">
          <h5 className="font-medium mb-1">Current Item</h5>
          <p className="text-sm text-muted-foreground">
            Viewing Item #{routeParams.id}
          </p>
          <Button size="sm" className="mt-2" variant="outline">
            View Details
          </Button>
        </Card>
      )}
    </div>
  );
}
```

**Option 2: Use React Context (Alternative)**
```typescript
// Create a navigation context in the core app
// apps/core/src/context/navigation-context.tsx
import { createContext, useContext } from 'react';

interface NavigationContextType {
  toolId: string;
  currentRoute: string;
  routeParams: Record<string, string | string[]>;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

// Core app provides the context
export function NavigationProvider({
  children,
  toolId,
  currentRoute,
  routeParams
}: {
  children: React.ReactNode;
  toolId: string;
  currentRoute: string;
  routeParams: Record<string, string | string[]>;
}) {
  return (
    <NavigationContext.Provider value={{ toolId, currentRoute, routeParams }}>
      {children}
    </NavigationContext.Provider>
  );
}

// Sidebar consumes the context
export function BasicSidebar() {
  const { currentRoute, routeParams } = useNavigation();

  // Use currentRoute and routeParams for navigation logic...
}
```

**Recommendation**: Use Option 1 (pass route context directly) because:
- More explicit and easier to understand
- No need for additional context providers
- Better for TypeScript type checking
- Avoids prop drilling issues with complex context hierarchies
- Easier to test and debug

#### Page Registration and Content Rendering

Tools need to register their pages with specific routes, sidebars, headers, and content. The core app provides a page registration system:

```typescript
// In apps/core/src/types/registry.ts

export interface PageRegistration {
  // Route this page handles
  route: string;

  // Page title and metadata
  title: string;
  description?: string;
  metadata?: {
    [key: string]: any;
  };

  // Optional overrides for this specific page
  sidebar?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;

  header?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;

  // Page content component (required)
  component: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;
}

// Update ToolRegistration to include page registration
export interface ToolRegistration {
  // ... other properties

  // Tool-level default components
  sidebar?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;

  header?: React.ComponentType<{
    toolId: string;
    workspaceId: string;
    currentRoute: string;
    routeParams: Record<string, string | string[]>;
  }>;

  // Page registrations (optional - can use default sidebar/header)
  pages?: PageRegistration[];
}
```

```typescript
// In apps/core/src/lib/registry/pages.ts
export function registerPages(toolId: string, pages: PageRegistration[]): void;
export function getPageForRoute(toolId: string, route: string): PageRegistration | null;

// Example: Basic tool registers its pages
// packages/basic/src/index.ts
import { registerTool, registerPages, registerCommand } from '@/lib/registry';
import { BasicIcon } from './components';
import { BasicPage } from './pages/BasicPage';
import { ItemPage } from './pages/ItemPage';
import { SettingsPage } from './pages/SettingsPage';

// Register the tool
registerTool({
  id: 'basic',
  name: 'Basic',
  version: '1.0.0',
  description: 'Basic example tool',
  icon: BasicIcon,
  routes: ['/basic', '/basic/:id', '/basic/settings'],
  order: 0
});

// Register pages with their routes
registerPages('basic', [
  {
    route: '/basic',
    title: 'Basic Tool Overview',
    component: BasicPage
  },
  {
    route: '/basic/:id',
    title: 'Basic Item Details',
    description: 'View and manage basic items',
    component: ItemPage,
    // Override header for item detail page
    header: ItemDetailHeader
  },
  {
    route: '/basic/settings',
    title: 'Settings',
    description: 'Configure basic tool settings',
    component: SettingsPage
  }
]);
```

```typescript
// Core app page rendering logic
// apps/core/src/app/(dash)/tools/[...toolId]/page.tsx
import { useParams } from 'next/navigation';
import { getToolById, getPageForRoute } from '@/lib/registry';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = getToolById(toolId);

  if (!tool) return <div>Tool not found</div>;

  // Build the current route from URL params
  const route = `/${toolId}${params.slug ? '/' + params.slug.join('/') : ''}`;

  // Get the page registration for this route
  const page = getPageForRoute(toolId, route);

  // Use page-specific components if available, otherwise use tool defaults
  const HeaderComponent = page?.header || tool.header;
  const SidebarComponent = page?.sidebar || tool.sidebar;
  const PageComponent = page?.component;

  if (!PageComponent) {
    // This can happen if route is registered but no page component
    return (
      <div className="flex items-center justify-center h-64">
        <div>Page not found for route: {route}</div>
      </div>
    );
  }

  return (
    <div className="tool-page">
      {/* Render header if available */}
      {HeaderComponent && (
        <HeaderComponent
          toolId={toolId}
          currentRoute={route}
          routeParams={params}
        />
      )}

      <div className="flex flex-1">
        {/* Render sidebar if available */}
        {SidebarComponent && (
          <div className="w-64 border-r">
            <SidebarComponent
              toolId={toolId}
              currentRoute={route}
              routeParams={params}
            />
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 p-6">
          <PageComponent
            toolId={toolId}
            currentRoute={route}
            routeParams={params}
          />
        </main>
      </div>
    </div>
  );
}

// Example page component implementation
// packages/basic/src/pages/ItemPage.tsx
import { Card, Button } from '@/components/ui';
import { Badge } from '@/components/ui/badge';

interface ItemPageProps {
  toolId: string;
  currentRoute: string;
  routeParams: Record<string, string | string[]>;
}

export default function ItemPage({ toolId, currentRoute, routeParams }: ItemPageProps) {
  const itemId = routeParams.id as string;

  // Example of fetching data for this item
  // In RSC, you can directly fetch data
  // const item = await getItem(itemId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Item Details</h1>
        <Badge variant="outline">ID: {itemId}</Badge>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Item Information</h2>
        {/* Page content here */}
        <p>This is the content for item {itemId}</p>

        <div className="mt-4 space-x-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </Card>

      {/* Additional page sections */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Related Items</h3>
        {/* Related items content */}
      </Card>
    </div>
  );
}
```

**Benefits of this approach**:
1. **Fine-grained control**: Each route can have its own components
2. **Consistent API**: All pages receive the same props (`toolId`, `currentRoute`, `routeParams`)
3. **Flexible overrides**: Pages can override sidebar/header when needed
4. **Clean separation**: Page logic is separate from routing logic
5. **Type safety**: Full TypeScript support for all props

**Page Component Guidelines**:
- Pages are React components that render the main content area
- They receive route context via props (no need for hooks)
- Can be Server Components (for data fetching) or Client Components
- Should focus on content, not layout (layout is handled by core app)
- Can import their own sub-components and utilities

#### Dynamic Header Content

The header component receives route information to display context-sensitive content:

```typescript
// The core app passes route context to the header component
// In apps/core/src/app/(dash)/tools/[...toolId]/page.tsx
import { useParams } from 'next/navigation';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const tool = getToolById(toolId);

  // Get current route (e.g., '/basic', '/basic/123')
  const currentRoute = `/${toolId}${params.slug ? '/' + params.slug.join('/') : ''}`;

  if (!tool) return <div>Tool not found</div>;

  const HeaderComponent = tool.header;

  return (
    <div className="tool-page">
      {/* Header receives current route for context */}
      <HeaderComponent
        toolId={toolId}
        currentRoute={currentRoute}
        routeParams={params}
      />

      {/* Tool content rendered here */}
      <div className="tool-content">
        {/* ... */}
      </div>
    </div>
  );
}

// Updated header interface and implementation
interface ToolHeaderProps {
  toolId: string;
  currentRoute: string;
  routeParams: Record<string, string | string[]>;
}

export function BasicHeader({ toolId, currentRoute, routeParams }: ToolHeaderProps) {
  // Example: Show different titles based on route
  const getTitle = () => {
    if (currentRoute === '/basic') return 'Basic Tool Overview';
    if (currentRoute.startsWith('/basic/') && routeParams.id) {
      return `Basic Item #${routeParams.id}`;
    }
    return 'Basic Tool';
  };

  // Example: Show different actions based on route
  const getActions = () => {
    if (currentRoute.startsWith('/basic/') && routeParams.id) {
      return (
        <>
          <Button variant="outline">Edit Item</Button>
          <Button>Delete Item</Button>
        </>
      );
    }

    return (
      <>
        <Button variant="outline">View Docs</Button>
        <Button>Create New</Button>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-semibold">{getTitle()}</h1>
        <Badge variant="outline">Basic</Badge>
        {routeParams.id && <Badge variant="secondary">Editing</Badge>}
      </div>

      <div className="flex items-center space-x-2">
        {getActions()}
      </div>
    </div>
  );
}
```

This approach allows headers to:
- Display different titles based on the current route
- Show/hide actions based on context (e.g., edit mode)
- Access route parameters for item-specific operations
- Maintain breadcrumb navigation
- Update metadata based on current view

#### BasicWebhookHandler Component (API Route Example)
```typescript
// src/components/BasicWebhookHandler.tsx
import { NextRequest, NextResponse } from 'next/server';

// STUB: Example webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // STUB: Implement your webhook logic here
    console.log('Basic webhook received:', body);

    // Example: Process the webhook data
    const processedData = {
      received: body,
      processed: true,
      timestamp: new Date().toISOString()
    };

    // STUB: Update your database or trigger events here
    // await updateDatabase(processedData);
    // publishEvent('webhook:processed', processedData);

    return NextResponse.json({
      success: true,
      message: 'Basic webhook processed successfully',
      data: processedData
    });
  } catch (error) {
    console.error('Basic webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
```

### 3.5 Package Configuration
Create `package.json` for the basic package:

```json
{
  "name": "@ydtb/basic",
  "version": "1.0.0",
  "description": "Basic example package showcasing all interface capabilities",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@ydtb/core": "workspace:*",
    "lucide-react": "^0.263.1",
    "zod": "^3.22.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "next": "^13.0.0"
  }
}
```

### 3.6 Registration in Core App
Show how to use the package in the core app:

```typescript
// apps/core/src/app/(dash)/layout.tsx
import { DashboardMainHeader, IconRail, ToolSidebar } from "@/components/layout";
import { ToolProvider } from "@/components/providers/ToolProvider";
import { getRegisteredTools } from "@/lib/registry";

// Import packages to trigger their registration
import "@ydtb/basic"; // This registers the basic tool as a reference
// import "@ydtb/workflows"; // Future packages

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const registeredTools = getRegisteredTools();

  return (
    <ToolProvider tools={registeredTools}>
      <div className="flex h-screen">
        {/* Core app header - owned by core app */}
        <DashboardMainHeader user={session?.user} />

        {/* Tool navigation sidebar - owned by core app */}
        <IconRail tools={registeredTools} />

        {/* Tool content wrapper - owned by core app */}
        <ToolSidebar>
          {children}
        </ToolSidebar>
      </div>
    </ToolProvider>
  );
}
```

### 3.7 Supporting File Examples

#### BasicService.ts
```typescript
// src/services/BasicService.ts
import { z } from 'zod';

// STUB: Example service implementation
export class BasicService {
  async doSomething(input: string): Promise<string> {
    // STUB: Implement your service logic
    return `Processed: ${input}`;
  }

  async getData(): Promise<any[]> {
    // STUB: Fetch and return data
    return [
      { id: 1, name: 'Example 1' },
      { id: 2, name: 'Example 2' }
    ];
  }
}
```

#### BasicProvider.tsx
```typescript
// src/providers/BasicProvider.tsx
import { createContext, useContext, useReducer } from 'react';

interface BasicState {
  // STUB: Define your context state
  data: any[];
  loading: boolean;
}

interface BasicContextValue {
  state: BasicState;
  dispatch: React.Dispatch<any>;
}

const BasicContext = createContext<BasicContextValue | undefined>(undefined);

// STUB: Implement your context provider
export function BasicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    (state: BasicState, action: any) => {
      // STUB: Implement your reducer logic
      return state;
    },
    { data: [], loading: false }
  );

  return (
    <BasicContext.Provider value={{ state, dispatch }}>
      {children}
    </BasicContext.Provider>
  );
}

export function useBasicContext() {
  const context = useContext(BasicContext);
  if (!context) {
    throw new Error('useBasicContext must be used within BasicProvider');
  }
  return context;
}
```

#### Database Schema (Drizzle)

All package tables MUST include workspaceId for proper data isolation in multi-tenant scenarios.

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';

// Note: The workspaces table is defined in the core application schema
// and is referenced by all package tables for proper workspace isolation

// Basic items table
export const basicItems = pgTable('basic_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  workspaceId: text('workspace_id', { length: 20 }).notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('active'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdBy: text('created_by').references(() => users.id), // Foreign key to core users table
});

// Categories table (example of table within package)
export const basicCategories = pgTable('basic_categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  workspaceId: text('workspace_id', { length: 20 }).notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Many-to-many relationship between items and categories
export const basicItemCategories = pgTable('basic_item_categories', {
  itemId: integer('item_id').references(() => basicItems.id),
  categoryId: integer('category_id').references(() => basicCategories.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.itemId, table.categoryId] })
}));

// Import core tables references (if needed)
import { users, workspaces } from '@ydtb/core/db/schema';

// Export all schemas
export type BasicItem = typeof basicItems.$inferSelect;
export type NewBasicItem = typeof basicItems.$inferInsert;
export type BasicCategory = typeof basicCategories.$inferSelect;
export type NewBasicCategory = typeof basicCategories.$inferInsert;
```

#### Database Configuration
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

// Note: This is only for local development and type checking
// Actual migrations are managed by the core application
export default {
  schema: './src/db/schema.ts',
  out: './.drizzle', // Not used for actual migrations
  driver: 'pg',
  dbCredentials: {
    // These will be inherited from core app's database connection
    // The package doesn't manage its own database connection
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

#### Database Registration in Package
```typescript
// src/index.ts (add to existing registration)
import { registerTool, registerDatabaseIntegration } from '@/lib/registry';

// Register the tool
registerTool({
  id: 'basic',
  name: 'Basic',
  version: '1.0.0',
  description: 'Basic example tool',
  icon: BasicIcon,
  routes: ['/basic', '/basic/:id', '/basic/settings'],
  order: 0,

  // Register database requirements
  databaseTables: [
    {
      name: 'basic_items',
      schema: './src/db/schema',
      dependencies: ['users'], // Depends on core users table
      indexes: [
        {
          name: 'idx_basic_items_status',
          columns: ['status'],
        },
        {
          name: 'idx_basic_items_created_by',
          columns: ['created_by'],
        }
      ]
    },
    {
      name: 'basic_categories',
      schema: './src/db/schema',
      indexes: [
        {
          name: 'idx_basic_categories_name',
          columns: ['name'],
          unique: true
        }
      ]
    },
    {
      name: 'basic_item_categories',
      schema: './src/db/schema',
      dependencies: ['basic_items', 'basic_categories']
    }
  ]
});

// Also register database integration for additional configuration
registerDatabaseIntegration({
  toolId: 'basic',
  tables: [
    {
      name: 'basic_items',
      schema: './src/db/schema',
      dependencies: ['users'],
      indexes: [
        { name: 'idx_basic_items_status', columns: ['status'] }
      ]
    }
  ],
  // Note: No migrations path - migrations are handled by core app
  seeds: './src/db/seeds' // Optional: package can provide seed data
});
```

#### Database Usage Example
```typescript
// packages/basic/src/services/BasicService.ts
import { db } from '@/lib/db'; // Use core app's database instance
import { basicItems, basicCategories, BasicItem } from '~/db/schema';
import { eq, and } from 'drizzle-orm';

export class BasicService {
  // Get all items for the current workspace and user
  async getItems(workspaceId: string, userId: string): Promise<BasicItem[]> {
    return await db.select()
      .from(basicItems)
      .where(and(
        eq(basicItems.workspaceId, workspaceId),
        eq(basicItems.createdBy, userId)
      ));
  }

  // Create a new item
  async createItem(data: {
    name: string;
    description?: string;
    workspaceId: string;
    userId: string;
  }): Promise<BasicItem> {
    const [item] = await db.insert(basicItems)
      .values({
        workspaceId: data.workspaceId,
        name: data.name,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return item;
  }

  // Get item with categories
  async getItemWithCategories(itemId: number, workspaceId: string, userId: string) {
    return await db.query.basicItems.findFirst({
      where: and(
        eq(basicItems.id, itemId),
        eq(basicItems.workspaceId, workspaceId),
        eq(basicItems.createdBy, userId)
      ),
      with: {
        itemCategories: {
          with: {
            category: true
          }
        }
      }
    });
  }
}
```

#### Server Actions and API Endpoints
```typescript
// packages/basic/src/server/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BasicService } from '~/services/BasicService';

// Server action for creating items
export async function createBasicItem(formData: FormData, workspaceId: string) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  // Get current user from session
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const service = new BasicService();
  await service.createItem({
    name,
    description,
    workspaceId,
    userId: session.user.id
  });

  revalidatePath('/basic');
  redirect('/basic');
}

// Server function for RSC calls
export async function getBasicItems(workspaceId: string) {
  const session = await getSession();
  if (!session?.user?.id) return [];

  const service = new BasicService();
  return service.getItems(workspaceId, session.user.id);
}
```

```typescript
// packages/basic/src/server/api/webhooks.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/crypto';

// External webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('X-Signature');

  // Verify webhook signature
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const data = JSON.parse(body);

  // Process webhook
  console.log('Basic webhook received:', data);

  // Publish event for other packages
  publishEvent('basic:webhook_received', data);

  return NextResponse.json({ received: true });
}
```

#### Command Palette Integration
```typescript
// packages/basic/src/commands/index.ts
import { registerCommand } from '@/lib/registry';

export const basicCommands = [
  {
    id: 'basic-create-item',
    title: 'Create New Item',
    description: 'Create a new basic item',
    icon: PlusIcon,
    action: async () => {
      // Navigate to create page or open modal
      window.location.href = '/basic/new';
    },
    shortcut: ['cmd', 'shift', 'n']
  },
  {
    id: 'basic-search-items',
    title: 'Search Basic Items',
    description: 'Search through basic items',
    icon: SearchIcon,
    action: async () => {
      // Focus search input
      document.getElementById('basic-search')?.focus();
    },
    shortcut: ['cmd', 'k']
  }
];

// Register all commands
export function registerBasicCommands() {
  basicCommands.forEach(command => {
    registerCommand(command);
  });
}
```

#### Search Provider Implementation
```typescript
// packages/basic/src/search/provider.ts
import { registerSearchProvider } from '@/lib/registry';
import { BasicService } from '~/services/BasicService';

export class BasicSearchProvider {
  async search(query: string) {
    const service = new BasicService();
    const items = await service.searchItems(query);

    return items.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      category: 'Basic Items',
      action: () => {
        window.location.href = `/basic/${item.id}`;
      }
    }));
  }
}

// Register search provider
export function registerBasicSearch() {
  registerSearchProvider({
    id: 'basic-search',
    name: 'Basic Items',
    icon: BasicIcon,
    search: (query: string) => new BasicSearchProvider().search(query)
  });
}
```

#### Event Handling
```typescript
// packages/basic/src/events/handlers.ts
import { subscribeToEvent, publishEvent } from '@/lib/registry';

export function setupEventHandlers() {
  // Listen to events from other packages
  subscribeToEvent('user:login', (user) => {
    console.log('User logged in:', user);
    // Initialize basic package data for user
  });

  subscribeToEvent('media:file_uploaded', (file) => {
    console.log('File uploaded in media package:', file);
    // Process file in basic package if needed
  });

  // Publish events for other packages
  export const publishBasicEvent = (type: string, data: any) => {
    publishEvent(`basic:${type}`, data);
  };
}
```

#### Extension Points
```typescript
// packages/basic/src/extensions/BasicExtension.tsx
import { registerExtension } from '@/lib/registry';
import { Card } from '@/components/ui/card';

export const BasicExtensionPoint = {
  id: 'basic-item-preview',
  name: 'Basic Item Preview',
  description: 'Preview for basic items',

  // Other packages can register components here
  registered: [] as Array<{
    id: string;
    component: React.ComponentType<{ item: any }>;
    order: number;
  }>,

  // Register a new extension
  register(extension: any) {
    this.registered.push(extension);
    this.registered.sort((a, b) => a.order - b.order);
  },

  // Render all extensions for an item
  render(item: any) {
    return (
      <div className="space-y-4">
        {this.registered.map(ext => (
          <Card key={ext.id} className="p-4">
            <ext.component item={item} />
          </Card>
        ))}
      </div>
    );
  }
};

// Register the extension point
export function registerBasicExtensions() {
  registerExtension(BasicExtensionPoint);
}
```

#### Database Migration Management

In this architecture, the core application manages all database migrations centrally:

```typescript
// apps/core/src/lib/db/schema.ts
import { users } from './schema/core';  // Core app tables
import { basicItems, basicCategories } from '@ydtb/basic/db/schema';
// Import from other packages as needed...

// Combine all schemas for migration generation
export const schema = {
  // Core tables
  users,

  // Package tables
  basicItems,
  basicCategories,

  // ... more package schemas
};

// Export everything for migration generation
export * from './schema/core';
export * from '@ydtb/basic/db/schema';
```

```bash
# In the core app directory
# Generate migrations from the combined schema
npx drizzle-kit generate

# Run migrations (only done by core app)
npx drizzle-kit migrate
```

This approach ensures:
1. **Single source of truth**: All migrations are generated from one schema
2. **Dependency management**: Core app can control migration order based on dependencies
3. **No conflicts**: Packages can't create conflicting migrations
4. **Version control**: All schema changes are tracked in the core app

## Implementation Steps

1. **Update Monorepo Structure**
   - Create `packages/` directory for tool packages
   - Move existing app to `apps/core/` maintaining current structure
   - Configure package.json files with workspace dependencies
   - Setup TypeScript project references

2. **Implement Registry in Core App**
   - Create `/apps/core/src/lib/registry/` with registration systems
   - Add registration interfaces to `/apps/core/src/types/registry.ts`
   - Implement in-memory storage for registered tools, commands, and providers

3. **Update Dashboard Layout**
   - Modify `/apps/core/src/app/(dash)/layout.tsx` to import packages
   - Add registry provider to wrap the dashboard
   - Implement dynamic tool rendering using registered tools
   - Create tool route handler at `/apps/core/src/app/(dash)/tools/[...toolId]/page.tsx`

4. **Create Example Package**
   - Implement `packages/basic/` with all required components
   - Add registration code in `packages/basic/src/index.ts`
   - Import from core app registry functions

5. **Integration Testing**
   - Verify package registration works on app startup
   - Test tool visibility and ordering in IconRail
   - Validate dynamic routing to package tools
   - Check that existing auth and API routes still work

6. **Migration Strategy**
   - Existing features can be gradually extracted to packages
   - Core functionality (auth, users, settings) remains in core app
   - New features implemented as packages from the start

### 3.5 Package Integration Examples

#### Consuming Services in Another Package
```typescript
// packages/analytics/src/hooks/useBasicAnalytics.ts
import { getService, subscribeToEvent } from '@ydtb/core/registry';

export function useBasicAnalytics() {
  const basicService = getService('basicService');

  // Subscribe to basic package events
  useEffect(() => {
    const unsubscribe = subscribeToEvent('basic:notification', (data) => {
      // Track basic package notifications
      track('basic_notification', {
        message: data.message,
        type: data.type
      });
    });

    return unsubscribe;
  }, []);

  return {
    getBasicStats: async () => {
      // STUB: Example of consuming the basic service
      const data = await basicService.getData();
      return {
        totalItems: data.length,
        lastUpdated: new Date().toISOString()
      };
    }
  };
}
```

#### Using Extensions
```typescript
// packages/documents/src/components/FilePreview.tsx
import { getExtensions } from '@ydtb/core/registry';

export function FilePreview({ file }) {
  const extensions = getExtensions();

  // Find extension that can handle this file type
  const extension = extensions.find(ext =>
    ext.accepts.includes(file.type)
  );

  if (extension) {
    const PreviewComponent = extension.component;
    return <PreviewComponent file={file} />;
  }

  // Fallback preview
  return <DefaultPreview file={file} />;
}
```

#### Internal vs External Communication Examples

##### RSC Client-Server Communication
```typescript
// packages/analytics/src/components/AnalyticsPage.tsx
// Client component calling server function across RSC boundary

import { getAnalyticsData } from '~/server';  // Local server function

// This is a Server Component that can be imported by client
export default async function AnalyticsPage() {
  // RSC boundary call - fetches data from server
  const analyticsData = await getAnalyticsData();

  return <AnalyticsDashboard data={analyticsData} />;
}
```

##### Server-Side Package Integration
```typescript
// packages/analytics/src/server/generateReport.ts
// Server-side module calling other packages

import { getMediaStats } from '@ydtb/media/server';      // Cross-package server call
import { getWorkflowData } from '@ydtb/workflows/server'; // Cross-package server call

export async function generateReport() {
  // These are direct server function calls between packages
  const mediaStats = await getMediaStats();      // No RSC boundary
  const workflowData = await getWorkflowData();  // No RSC boundary

  // Process and combine data from multiple packages
  return {
    media: mediaStats,
    workflows: workflowData
  };
}
```

##### Client Component with Server Actions
```typescript
// packages/analytics/src/components/AnalyticsClient.tsx
'use client';

import { createReport } from '~/actions';  // Local server action

export default function AnalyticsClient() {
  const handleClick = async () => {
    // Server action crosses RSC boundary
    await createReport({
      type: 'user_activity',
      timestamp: new Date()
    });
  };

  return <button onClick={handleClick}>Create Report</button>;
}
```

##### External HTTP API Registration (Exposed to outside systems)
```typescript
// packages/basic/src/api/endpoints.ts
// This IS exposed as external HTTP API

import { registerGlobalRoute } from '@ydtb/core/registry';

// Register webhook endpoint for external services
registerGlobalRoute({
  path: '/api/webhooks/basic/processed',
  component: BasicWebhookHandler,
  type: 'api',
  apiConfig: {
    method: 'POST',
    auth: true, // Requires API key authentication
    rateLimit: {
      windowMs: 60000, // 1 minute
      maxRequests: 100
    },
    cors: {
      origins: ['https://external-service.com'],
      methods: ['POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  }
});

// Register public HTTP endpoint for external access
registerGlobalRoute({
  path: '/api/public/data/:id',
  component: PublicDataAccess,
  type: 'api',
  apiConfig: {
    method: 'GET',
    auth: false, // Public access
    rateLimit: {
      windowMs: 60000,
      maxRequests: 1000
    }
  }
});
```

##### Tight Database Coupling Example
```typescript
// packages/media/migrations/create_media_tables.sql
-- Media package tables
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(20) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  path TEXT NOT NULL,
  folder_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(20) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tight coupling with workflows package
CREATE TABLE workflow_media_attachments (
  workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
  media_file_id UUID REFERENCES media_files(id) ON DELETE CASCADE,
  PRIMARY KEY (workflow_id, media_file_id)
);
```

## Success Criteria

- Clean monorepo structure with independent packages
- Well-defined package interface that's easy to implement
- Basic example package that demonstrates all interface features with stubs
- Clear documentation and examples for creating new packages
- Type-safe registration system with IntelliSense support
- Seamless package-to-package integration through well-defined contracts
- Flexible database integration patterns (tight and loose coupling)
- Extensible architecture through service registry and extension points
- Basic package serves as a comprehensive reference implementation