# Unit 8.1: Developer Documentation

## Folder: `18-documentation`

## Purpose
Create comprehensive documentation for developers to understand, use, and extend the CRM Toolkit package architecture.

## Context
- All implementation units are complete
- Need to document the architecture for external developers
- Should include getting started guides
- Must provide API reference documentation
- Need examples for common use cases
- Should document best practices and patterns
- Must include troubleshooting guides

## Definition of Done
- [ ] Development guide created
- [ ] Package creation guide with examples
- [ ] Complete API reference documentation
- [ ] Architecture overview with diagrams
- [ ] Best practices and patterns documented
- [ ] Troubleshooting guide created
- [ ] Examples repository with sample packages
- [ ] Contributing guidelines
- [ ] Changelog and versioning guide
- [ ] Deployment documentation

## Documentation Structure

```
docs/
├── README.md                    # Main documentation index
├── development/
│   ├── getting-started.md      # Quick start guide
│   ├── architecture.md         # System architecture
│   ├── package-creation.md     # How to create packages
│   ├── best-practices.md       # Development best practices
│   └── testing.md              # Testing guidelines
├── api/
│   ├── registry.md             # Registry API
│   ├── components.md           # Component APIs
│   └── database.md             # Database APIs
├── examples/
│   ├── simple-tool.md          # Simple tool example
│   ├── database-package.md     # Package with database
│   └── ui-package.md           # UI-focused package
├── guides/
│   ├── authentication.md       # Auth integration
│   ├── deployment.md           # Deployment guide
│   └── migration.md            # Migration from v1
└── contributing.md             # Contributing guidelines
```

## Documentation Files

### 1. `/docs/README.md`
```markdown
# CRM Toolkit Documentation

Welcome to the CRM Toolkit documentation! This guide will help you understand and use the package-based architecture for building extensible CRM applications.

## Quick Links

- [Getting Started](development/getting-started.md) - New to CRM Toolkit? Start here
- [Package Creation](development/package-creation.md) - Learn to build packages
- [API Reference](api/registry.md) - Detailed API documentation
- [Examples](examples/) - Example packages and code samples

## What is CRM Toolkit?

CRM Toolkit is a modular, package-based CRM framework built with Next.js 16, React Server Components, and TypeScript. It allows you to:

- **Compose** your CRM from modular packages
- **Extend** functionality without modifying core code
- **Isolate** data by workspace for multi-tenancy
- **Integrate** seamlessly with existing tools

## Key Features

- 📦 **Package-based Architecture** - Modular, reusable components
- 🔌 **Dynamic Registration** - Load packages at runtime
- 🏢 **Multi-tenant Support** - Workspace isolation out of the box
- 🚀 **Performance Optimized** - Server components and lazy loading
- 🛡️ **Type Safe** - Full TypeScript support
- 🎨 **Extensible UI** - Customizable components and themes

## Architecture Overview

```
CRM Toolkit
├── Core Application          # Main Next.js app
│   ├── Authentication
│   ├── Workspace Management
│   └── Registry System
└── Packages                  # Modular extensions
    ├── CRM Tools
    ├── Integrations
    └── Custom Features
```

## Getting Started

1. **Installation**
   ```bash
   bun install crm-toolkit
   ```

2. **Create Your First Package**
   ```bash
   bunx crm-toolkit create-package my-tool
   ```

3. **Run the Application**
   ```bash
   bun run dev
   ```

## Community

- [GitHub Discussions](https://github.com/your-org/crm-toolkit/discussions) - Ask questions
- [Issues](https://github.com/your-org/crm-toolkit/issues) - Report bugs
- [Contributing](contributing.md) - How to contribute

## License

CRM Toolkit is MIT licensed. See [LICENSE](https://github.com/your-org/crm-toolkit/blob/main/LICENSE) for details.
```

### 2. `/docs/development/getting-started.md`
```markdown
# Getting Started with CRM Toolkit

This guide will help you set up CRM Toolkit and create your first package.

## Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL database
- Basic knowledge of React and TypeScript

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/crm-toolkit.git
cd crm-toolkit
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_toolkit"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External services
STRIPE_SECRET_KEY="sk_test_..."
SENDGRID_API_KEY="SG.xyz..."
```

### 4. Set Up the Database

```bash
# Run migrations
bun run db:migrate

# (Optional) Seed with sample data
bun run db:seed
```

### 5. Start the Development Server

```bash
bun run dev
```

Visit http://localhost:3000 to see CRM Toolkit in action.

## Project Structure

```
crm-toolkit/
├── apps/
│   └── core/                 # Main application
│       ├── src/
│       │   ├── app/          # Next.js app directory
│       │   ├── components/   # UI components
│       │   ├── lib/          # Utilities
│       │   └── types/        # TypeScript types
│       ├── package.json
│       └── tsconfig.json
├── packages/                 # Extensible packages
│   ├── basic/               # Example basic package
│   └── [your-packages]/     # Your custom packages
├── docs/                    # Documentation
├── drizzle/                 # Database migrations
├── package.json             # Workspace configuration
└── tsconfig.json            # TypeScript configuration
```

## Creating Your First Package

### 1. Use the Package Generator

```bash
bunx crm-toolkit create-package my-tool
```

This creates a new package in `packages/my-tool/` with the basic structure.

### 2. Define Your Tool

Edit `packages/my-tool/src/index.ts`:

```typescript
import type { Package } from "@ydtb/registry";

const myPackage: Package = {
  metadata: {
    name: "my-tool",
    version: "1.0.0",
    description: "My awesome CRM tool",
  },
  init: async (registry) => {
    registry.registerTool({
      id: "my-tool",
      packageId: "my-tool",
      name: "My Tool",
      description: "A custom CRM tool",
      icon: MyIcon,
      pageComponent: MyPage,
      defaultRoute: ["dashboard"],
    });
  },
};

export default myPackage;
```

### 3. Create Components

Create your React components in `packages/my-tool/src/components/`:

```typescript
// packages/my-tool/src/components/MyPage.tsx
export function MyPage({ navigation, workspaceId }: ToolComponentProps) {
  return (
    <div>
      <h1>My Tool Dashboard</h1>
      <p>Current workspace: {workspaceId}</p>
    </div>
  );
}
```

### 4. Test Your Package

Start the development server:

```bash
bun run dev
```

Your tool should appear in the dashboard!

## Next Steps

- [Learn about package architecture](package-creation.md)
- [Explore the API reference](../api/registry.md)
- [View example packages](../examples/)
- [Understand best practices](best-practices.md)
```

### 3. `/docs/development/package-creation.md`
```markdown
# Creating Packages

This guide explains how to create, structure, and publish packages for CRM Toolkit.

## Package Structure

A typical package structure looks like this:

```
my-package/
├── src/
│   ├── components/           # React components
│   │   ├── MyTool.tsx
│   │   ├── MySidebar.tsx
│   │   └── MyHeader.tsx
│   ├── db/                   # Database schema (optional)
│   │   └── schema.ts
│   ├── services/             # Business logic
│   │   └── MyService.ts
│   ├── server/               # Server-side features
│   │   ├── actions.ts
│   │   ├── api/
│   │   └── search.ts
│   ├── hooks/                # React hooks
│   │   └── useMyTool.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   └── index.ts              # Package entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Package Types

### 1. Tool Package
A package that provides a complete tool with its own UI, routes, and functionality.

**Example:** A CRM contact management tool

### 2. Integration Package
A package that integrates with external services or APIs.

**Example:** Stripe payment integration

### 3. Component Package
A package that provides reusable UI components.

**Example:** Advanced chart components

### 4. Service Package
A package that provides backend services or utilities.

**Example**: Email notification service

## Creating a Tool Package

### 1. Initialize the Package

```bash
mkdir packages/my-tool
cd packages/my-tool
bun init -y
```

### 2. Configure package.json

```json
{
  "name": "@ydtb/my-tool",
  "version": "1.0.0",
  "description": "My CRM tool",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@ydtb/core": "workspace:*",
    "react": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.1.6"
  }
}
```

### 3. Create the Package Entry Point

```typescript
// src/index.ts
import type { Package } from "@ydtb/registry";
import { MyIcon } from "./components/MyIcon";
import { MyPage } from "./components/MyPage";

export default {
  metadata: {
    name: "my-tool",
    version: "1.0.0",
    description: "My awesome CRM tool",
    author: "Your Name",
    keywords: ["crm", "tool"],
  },
  init: async (registry) => {
    // Register the main tool
    registry.registerTool({
      id: "my-tool",
      packageId: "my-tool",
      name: "My Tool",
      description: "A custom CRM tool",
      icon: MyIcon,
      pageComponent: MyPage,
      defaultRoute: ["dashboard"],
      requiresWorkspace: true,
    });

    // Register pages
    registry.registerPage({
      id: "my-tool-dashboard",
      packageId: "my-tool",
      toolId: "my-tool",
      route: "dashboard",
      title: "Dashboard",
      component: MyDashboard,
    });

    // Register commands
    registry.registerCommand({
      id: "my-tool-create",
      packageId: "my-tool",
      title: "Create New Item",
      handler: async (context) => {
        // Command implementation
      },
    });

    // Register search provider
    registry.registerSearchProvider({
      id: "my-tool-search",
      packageId: "my-tool",
      name: "My Tool Search",
      search: async (context) => {
        // Search implementation
      },
    });
  },
  cleanup: async () => {
    // Cleanup resources
  },
} as Package;
```

### 4. Create Components

```typescript
// src/components/MyIcon.tsx
import React from "react";

export function MyIcon({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      {/* Your icon SVG path */}
    </svg>
  );
}

// src/components/MyPage.tsx
"use client";

import type { ToolComponentProps } from "@ydtb/registry";

export function MyPage({ navigation, workspaceId, permissions }: ToolComponentProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Tool</h1>
      <p>Workspace: {workspaceId}</p>
      <p>Current route: {navigation.currentRoute.join("/")}</p>
    </div>
  );
}
```

## Package Best Practices

### 1. Naming Conventions

- Package names: `@ydtb/package-name`
- Tool IDs: `kebab-case`
- Component names: `PascalCase`
- File names: `kebab-case.tsx`

### 2. Exports

Only export what's necessary from your package:

```typescript
// Good - Specific exports
export { MyComponent, myFunction } from "./components";
export type { MyType } from "./types";

// Avoid - Export everything
export * from "./components";
```

### 3. TypeScript

Always provide TypeScript types:

```typescript
export interface MyComponentProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction, children }) => {
  // Implementation
};
```

### 4. Error Handling

Implement proper error boundaries:

```typescript
import { ErrorBoundary } from "@ydtb/core/components";

export function MyTool() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => console.error(error)}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Publishing Packages

### 1. Versioning

Use semantic versioning:

```json
{
  "version": "1.2.3"
}
```

- Major (1.x.x): Breaking changes
- Minor (x.2.x): New features
- Patch (x.x.3): Bug fixes

### 2. Changelog

Maintain a `CHANGELOG.md`:

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- New export feature
- Performance improvements

### Changed
- Updated component API

### Fixed
- Fixed navigation bug
```

### 3. Publishing

```bash
# Build the package
bun run build

# Run tests
bun test

# Publish to npm
bun publish
```

## Examples

- [Basic Tool Package](../examples/simple-tool.md)
- [Database Integration](../examples/database-package.md)
- [External API Integration](../examples/api-package.md)
```

### 4. `/docs/api/registry.md`
```markdown
# Registry API Reference

The Registry API allows packages to register tools, commands, pages, and other extensions with the CRM Toolkit core.

## Core Registry Methods

### registerTool(tool)

Register a new tool with the registry.

#### Parameters

- `tool: Omit<ToolRegistration, "type">` - The tool configuration

#### Example

```typescript
registry.registerTool({
  id: "my-tool",
  packageId: "my-package",
  name: "My Tool",
  description: "A custom CRM tool",
  icon: MyIcon,
  pageComponent: MyPage,
  defaultRoute: ["dashboard"],
  requiresWorkspace: true,
  requiredPermissions: ["read"],
});
```

#### ToolRegistration Interface

```typescript
interface ToolRegistration extends BaseRegistryEntry {
  type: "tool";
  icon: ComponentType<{ className?: string; size?: number }>;
  sidebarComponent?: ComponentType<ToolComponentProps>;
  headerComponent?: ComponentType<ToolComponentProps>;
  pageComponent: ComponentType<ToolComponentProps>;
  defaultRoute: string[];
  requiresWorkspace?: boolean;
  requiredPermissions?: string[];
  configSchema?: ZodSchema;
}
```

### registerCommand(command)

Register a command that appears in the command palette.

#### Parameters

- `command: Omit<CommandRegistration, "type">` - The command configuration

#### Example

```typescript
registry.registerCommand({
  id: "create-item",
  packageId: "my-package",
  title: "Create New Item",
  description: "Create a new item in the system",
  hotkey: "cmd+n",
  categories: ["create", "items"],
  handler: async (context) => {
    // Command implementation
    const newItem = await createItem(context);
    return newItem;
  },
  requiresWorkspace: true,
});
```

### registerPage(page)

Register a specific page for a tool.

#### Parameters

- `page: Omit<PageRegistration, "type">` - The page configuration

#### Example

```typescript
registry.registerPage({
  id: "item-detail",
  packageId: "my-package",
  toolId: "my-tool",
  route: "items/:id",
  title: "Item Details",
  component: ItemDetailPage,
  sidebarComponent: ItemDetailSidebar,
  requiredPermissions: ["read"],
});
```

### registerSearchProvider(provider)

Register a search provider for global search.

#### Parameters

- `provider: Omit<SearchProviderRegistration, "type">` - The provider configuration

#### Example

```typescript
registry.registerSearchProvider({
  id: "my-search",
  packageId: "my-package",
  name: "My Items",
  search: async (context) => {
    const results = await searchItems(context.query, context.workspaceId);
    return results.map(item => ({
      id: item.id,
      title: item.name,
      action: () => navigate(`/items/${item.id}`),
    }));
  },
});
```

## Retrieval Methods

### getTool(id: string)

Retrieve a tool by ID.

```typescript
const tool = registry.getTool("my-tool");
if (tool) {
  console.log(tool.name);
}
```

### listTools(packageId?: string)

List all tools, optionally filtered by package.

```typescript
// List all tools
const allTools = registry.listTools();

// List tools from specific package
const packageTools = registry.listTools("my-package");
```

## Event System

The registry emits events for various operations.

### on(event, listener)

Register an event listener.

```typescript
registry.on("entry:registered", (event) => {
  console.log(`Registered: ${event.entryId}`);
});
```

### off(event, listener)

Remove an event listener.

```typescript
const listener = (event) => console.log(event);
registry.on("entry:registered", listener);
registry.off("entry:registered", listener);
```

### emit(event)

Emit an event (used internally).

## Event Types

- `entry:registered` - When an entry is registered
- `entry:unregistered` - When an entry is unregistered
- `entry:updated` - When an entry is updated
- `package:loaded` - When a package is loaded
- `package:unloaded` - When a package is unloaded

## Package Management

### loadPackage(pkg)

Load and initialize a package.

```typescript
const myPackage = {
  metadata: { name: "my-tool", version: "1.0.0" },
  init: async (registry) => {
    // Register items
  },
};

await registry.loadPackage(myPackage);
```

### unloadPackage(packageId)

Unload a package and cleanup resources.

```typescript
await registry.unloadPackage("my-tool");
```

## Type Definitions

### BaseRegistryEntry

```typescript
interface BaseRegistryEntry {
  id: string;
  packageId: string;
  name?: string;
  description?: string;
  version?: string;
  dependencies?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}
```

### ToolComponentProps

Props passed to tool components:

```typescript
interface ToolComponentProps {
  navigation: {
    toolId: string;
    currentRoute: string[];
    routeParams: Record<string, string>;
    navigate: (route: string[], params?: Record<string, string>) => void;
  };
  workspaceId: string;
  permissions: string[];
}
```

## Error Handling

The registry throws errors for invalid operations:

```typescript
try {
  registry.registerTool(invalidTool);
} catch (error) {
  console.error("Registration failed:", error.message);
}
```

Common errors:
- `Duplicate ID` - Entry with same ID already exists
- `Circular dependency` - Dependencies form a cycle
- `Validation failed` - Invalid entry data
- `Package not found` - Trying to unload non-existent package
```

## Validation Checklist

After creating all documentation:

- [ ] All documentation files created
- [ ] Getting started guide works for new users
- [ ] API reference is complete
- [ ] Examples are tested and working
- [ ] Architecture diagrams included
- [ ] Troubleshooting guide covers common issues
- [ ] Contributing guidelines are clear
- [ ] Links between documents work
- [ ] Code examples are formatted correctly
- [ ] Documentation is accessible and easy to read

## Next Steps

1. Set up documentation website (e.g., Docusaurus)
2. Create video tutorials
3. Build example repository
4. Set up community forums
5. Write blog posts about features

---

Congratulations! You've now completed the entire implementation plan for the CRM Toolkit package architecture. The system includes:

- ✅ Complete monorepo structure with Bun
- ✅ Authentication and workspace management
- ✅ Dynamic package registry system
- ✅ Basic reference package implementation
- ✅ Comprehensive testing suite
- ✅ Full developer documentation

The CRM Toolkit is ready for development and can be extended with additional packages as needed.