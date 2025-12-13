# Unit 5.1: Basic Package Structure

## Folder: `10-basic-package`

## Purpose
Create a reference implementation package that demonstrates all features of the CRM Toolkit package architecture. This package will serve as a complete example for developers building their own packages.

## Context
- Registry system and dynamic routing are implemented (Phase 3-4)
- Need a complete example package to demonstrate:
  - Package structure and conventions
  - All registration APIs (tools, pages, commands, search)
  - Component patterns and best practices
  - Database integration with workspace isolation
  - Server-side features (actions, API routes, events)
- Should follow the established alias path conventions (@/, @ydtb/, ~/)
- Must be a complete, working example

## Package Overview

The "Basic" package will be a simple notepad/todo application that demonstrates:
- Tool registration with navigation
- Multiple pages (list, detail, settings)
- Custom sidebar and header components
- Database operations with workspace isolation
- Search integration
- Command palette integration
- Server actions and API routes

## Definition of Done
- [ ] Package directory structure created in `/packages/basic/`
- [ ] package.json configured with proper dependencies
- [ ] Index.ts with package initialization and registration
- [ ] TypeScript configuration set up
- [ ] Export structure organized
- [ ] Aliases configured for cross-package imports
- [ ] All stub components created with documentation
- [ ] Package builds without errors
- [ ] Integration with core app works

## Package Structure

```
packages/basic/
├── src/
│   ├── components/
│   │   ├── BasicIcon.tsx
│   │   ├── BasicSidebar.tsx
│   │   ├── BasicHeader.tsx
│   │   ├── BasicPage.tsx
│   │   ├── NoteList.tsx
│   │   ├── NoteDetail.tsx
│   │   └── NoteSettings.tsx
│   ├── db/
│   │   └── schema.ts
│   ├── services/
│   │   └── BasicService.ts
│   ├── server/
│   │   ├── actions.ts
│   │   ├── api/
│   │   │   └── webhooks.ts
│   │   ├── events/
│   │   │   └── handlers.ts
│   │   ├── commands/
│   │   │   └── index.ts
│   │   └── search/
│   │       └── provider.ts
│   ├── hooks/
│   │   └── useBasic.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Files to Create

### 1. `/packages/basic/package.json`
```json
{
  "name": "@ydtb/basic",
  "version": "1.0.0",
  "description": "Basic example package for CRM Toolkit",
  "keywords": ["crm", "toolkit", "example", "notepad"],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "type": "module",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components": "./src/components/index.ts",
    "./services": "./src/services/index.ts",
    "./types": "./src/types/index.ts"
  },
  "dependencies": {
    "@ydtb/core": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "zod": "^3.22.4",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.1.6"
  },
  "peerDependencies": {
    "next": "^14.0.0",
    "@radix-ui/react-*": "*",
    "class-variance-authority": "*"
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "build": "tsc"
  },
  "files": [
    "src/**/*",
    "README.md"
  ]
}
```

### 2. `/packages/basic/tsconfig.json`
```json
{
  "extends": "../../apps/core/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@ydtb/*": ["../../*"],
      "~/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. `/packages/basic/src/types/index.ts`
```typescript
/**
 * Type definitions for the Basic package
 */

import { z } from "zod";

// Note schema
export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  completed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  workspaceId: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;

// Create note input
export const CreateNoteSchema = NoteSchema.pick({
  title: true,
  content: true,
}).extend({
  id: z.string().uuid().optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

// Update note input
export const UpdateNoteSchema = NoteSchema.pick({
  title: true,
  content: true,
  completed: true,
}).partial();

export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

// Note filter options
export interface NoteFilter {
  search?: string;
  completed?: boolean;
  limit?: number;
  offset?: number;
}

// Package configuration
export interface BasicPackageConfig {
  defaultView: 'list' | 'grid';
  showCompleted: boolean;
  autoSave: boolean;
}
```

### 4. `/packages/basic/src/index.ts`
```typescript
/**
 * Basic package entry point
 * Initializes and registers all components with the registry
 */

import type { Registry, Package } from "@/types/registry";
import { BasicIcon } from "~/components/BasicIcon";
import { BasicSidebar } from "~/components/BasicSidebar";
import { BasicHeader } from "~/components/BasicHeader";
import { BasicPage } from "~/components/BasicPage";
import { NoteListPage } from "~/components/NoteList";
import { NoteDetailPage } from "~/components/NoteDetail";
import { NoteSettingsPage } from "~/components/NoteSettings";
import { registerCommands } from "~/server/commands";
import { registerSearchProvider } from "~/server/search/provider";
import { setupEventHandlers } from "~/server/events/handlers";
import { BasicService } from "~/services/BasicService";

/**
 * Package initialization function
 * Called when the package is loaded
 */
async function init(registry: Registry): Promise<void> {
  console.log("Initializing Basic package...");

  // Register the main tool
  registry.registerTool({
    id: "basic",
    packageId: "basic",
    name: "Basic Notepad",
    description: "A simple notepad and todo list manager",
    icon: BasicIcon,
    sidebarComponent: BasicSidebar,
    headerComponent: BasicHeader,
    pageComponent: BasicPage,
    defaultRoute: ["list"],
    requiresWorkspace: true,
    requiredPermissions: [],
    metadata: {
      category: "productivity",
      version: "1.0.0",
    },
  });

  // Register pages
  registry.registerPage({
    id: "basic-list",
    packageId: "basic",
    toolId: "basic",
    route: "list",
    title: "All Notes",
    description: "View all your notes and todos",
    component: NoteListPage,
    hidden: false,
    metadata: {
      icon: "List",
    },
  });

  registry.registerPage({
    id: "basic-detail",
    packageId: "basic",
    toolId: "basic",
    route: "note/:id",
    title: "Note Detail",
    description: "View and edit a specific note",
    component: NoteDetailPage,
    sidebarComponent: BasicSidebar,
    hidden: true,
    metadata: {
      icon: "FileText",
    },
  });

  registry.registerPage({
    id: "basic-settings",
    packageId: "basic",
    toolId: "basic",
    route: "settings",
    title: "Settings",
    description: "Configure the basic notepad",
    component: NoteSettingsPage,
    requiredPermissions: ["admin"],
    metadata: {
      icon: "Settings",
    },
  });

  // Register service
  registry.registerService({
    id: "basic-service",
    packageId: "basic",
    name: "Basic Service",
    description: "Handles note operations",
    factory: () => new BasicService(),
    singleton: true,
  });

  // Register commands
  registerCommands(registry);

  // Register search provider
  registerSearchProvider(registry);

  // Set up event handlers
  await setupEventHandlers(registry);

  console.log("Basic package initialized successfully!");
}

/**
 * Package cleanup function
 * Called when the package is unloaded
 */
async function cleanup(): Promise<void> {
  console.log("Cleaning up Basic package...");
  // Close database connections, clear timers, etc.
}

/**
 * Package definition
 */
const basicPackage: Package = {
  metadata: {
    name: "basic",
    version: "1.0.0",
    description: "A basic notepad and todo list package for CRM Toolkit",
    author: "CRM Toolkit Team",
    keywords: ["notepad", "todo", "notes", "example"],
    homepage: "https://github.com/your-org/crm-toolkit/packages/basic",
  },
  init,
  cleanup,
};

// Export the package
export default basicPackage;

// Export components for direct use
export {
  BasicIcon,
  BasicSidebar,
  BasicHeader,
  BasicPage,
  NoteListPage,
  NoteDetailPage,
  NoteSettingsPage,
};

// Export utilities and types
export { BasicService } from "~/services/BasicService";
export type { Note, CreateNoteInput, UpdateNoteInput } from "~/types";
```

### 5. `/packages/basic/src/components/index.ts`
```typescript
/**
 * Component exports for the Basic package
 */

export { BasicIcon } from "./BasicIcon";
export { BasicSidebar } from "./BasicSidebar";
export { BasicHeader } from "./BasicHeader";
export { BasicPage } from "./BasicPage";
export { NoteListPage } from "./NoteList";
export { NoteDetailPage } from "./NoteDetail";
export { NoteSettingsPage } from "./NoteSettings";
```

### 6. `/packages/basic/src/services/index.ts`
```typescript
/**
 * Service exports for the Basic package
 */

export { BasicService } from "./BasicService";
```

### 7. `/packages/basic/src/components/BasicIcon.tsx`
```typescript
/**
 * Icon component for the Basic tool
 */

import React from "react";
import type { ComponentType } from "@/types/registry";

interface BasicIconProps {
  className?: string;
  size?: number;
}

export const BasicIcon: ComponentType<BasicIconProps> = React.forwardRef<
  SVGSVGElement,
  BasicIconProps
>(({ className, size = 24 }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
      <line
        x1="16"
        y1="13"
        x2="8"
        y2="13"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="17"
        x2="8"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <polyline
        points="10,9 9,9 8,9"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
});

BasicIcon.displayName = "BasicIcon";
```

### 8. `/packages/basic/src/components/BasicPage.tsx`
```typescript
/**
 * Default page component for the Basic tool
 * Redirects to the list page
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ToolComponentProps } from "@/types/registry";

export function BasicPage(props: ToolComponentProps) {
  const { navigation } = props;
  const router = useRouter();

  useEffect(() => {
    // Redirect to the list page
    const listUrl = navigation.navigate(["list"]);
    router.replace(listUrl);
  }, [navigation, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

### 9. `/packages/basic/src/hooks/useBasic.ts`
```typescript
/**
 * Custom hooks for the Basic package
 */

import { useContext, createContext, ReactNode } from "react";
import type { BasicPackageConfig } from "~/types";

interface BasicContextType {
  config: BasicPackageConfig;
  updateConfig: (config: Partial<BasicPackageConfig>) => void;
}

const BasicContext = createContext<BasicContextType | null>(null);

interface BasicProviderProps {
  children: ReactNode;
  config: BasicPackageConfig;
  onConfigChange?: (config: BasicPackageConfig) => void;
}

export function BasicProvider({ children, config, onConfigChange }: BasicProviderProps) {
  const updateConfig = (newConfig: Partial<BasicPackageConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    onConfigChange?.(updatedConfig);
  };

  return (
    <BasicContext.Provider value={{ config, updateConfig }}>
      {children}
    </BasicContext.Provider>
  );
}

export function useBasic() {
  const context = useContext(BasicContext);
  if (!context) {
    throw new Error("useBasic must be used within a BasicProvider");
  }
  return context;
}
```

### 10. `/packages/basic/README.md`
```markdown
# Basic Package

A simple notepad and todo list package for CRM Toolkit that demonstrates all package features.

## Features

- Tool registration with custom icon, sidebar, and header
- Multiple pages (list, detail, settings)
- Database integration with workspace isolation
- Search integration
- Command palette integration
- Event handling
- Server actions and API routes

## Usage

This package is automatically loaded by the CRM Toolkit core application.

## Development

```bash
# Install dependencies
bun install

# Type check
bun run type-check

# Lint
bun run lint

# Build
bun run build
```

## Structure

- `components/` - React components
- `db/` - Database schemas
- `services/` - Business logic services
- `server/` - Server-side features
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
```

## Files to Update

### 1. Update `/apps/core/src/app/[workspaceId]/layout.tsx`
Add package imports (this will be done in Unit 6.2):

```typescript
// These will be imported when we implement package initialization
import basicPackage from "../../../../packages/basic/src";
```

### 2. Update root `package.json`
Add workspace configuration for the package:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## Validation Checklist

- [ ] Package directory structure created
- [ ] package.json configured with all fields
- [ ] TypeScript configuration working
- [ ] Index.ts loads and registers components
- [ ] All imports use correct alias paths
- [ ] Package can be imported by core app
- [ ] Type definitions are complete
- [ ] Components have proper TypeScript types
- [ ] README documentation is complete
- [ ] No build errors

## Testing the Package

After creating the package structure:

1. Install dependencies: `bun install` from root
2. Check types: `bun run type-check` in package directory
3. Try importing in core app
4. Verify registry registration works

## Next Steps

After creating the package structure:
1. Implement the components (Unit 5.2)
2. Add database features (Unit 5.3)
3. Implement server-side features (Unit 5.4)