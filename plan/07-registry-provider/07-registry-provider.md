# Unit 3.3: Registry Context Provider

## Folder: `07-registry-provider`

## Purpose
Create a React context provider that makes the registry system available throughout the dashboard application and handles real-time updates when registry changes occur.

## Context
- Registry implementation is complete from Unit 3.2
- Need to provide registry access to all dashboard components
- Should handle registry state updates and trigger re-renders
- Must work with the workspace context from Unit 2.2
- Components need to access registry data without prop drilling
- Should provide convenient hooks for common registry operations
- Server components need access to registry data via Next.js API routes

## Definition of Done
- [ ] Registry context created with TypeScript types
- [ ] Provider wraps entire dashboard layout
- [ ] Registry state accessible from all components
- [ ] Updates propagate correctly to all consumers
- [ ] Custom hooks for easy registry access
- [ ] Server-side registry access via API routes
- [ ] Optimized to prevent unnecessary re-renders
- [ ] Error boundaries for registry failures
- [ ] Loading states for registry operations

## Architecture

The registry context system will provide:
- **Client-side context** for React components
- **Server-side API routes** for RSC access
- **Optimized subscriptions** to prevent over-rendering
- **Selective data access** for different component needs
- **Event listeners** for real-time updates

## Files to Create

### 1. `/apps/core/src/context/RegistryProvider.tsx`
```typescript
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { registry } from "@/lib/registry";
import type {
  Registry,
  ToolRegistration,
  CommandRegistration,
  SearchProviderRegistration,
  PageRegistration,
  ServiceRegistration,
  RegistryEvent,
  RegistryEventListener,
} from "@/types/registry";

interface RegistryContextType {
  // Registry instance
  registry: Registry;

  // Tool data
  tools: ToolRegistration[];
  getTool: (id: string) => ToolRegistration | undefined;
  getToolPages: (toolId: string) => PageRegistration[];

  // Command data
  commands: CommandRegistration[];
  getCommand: (id: string) => CommandRegistration | undefined;

  // Search provider data
  searchProviders: SearchProviderRegistration[];
  getSearchProvider: (id: string) => SearchProviderRegistration | undefined;

  // Page data
  pages: PageRegistration[];
  getPage: (id: string) => PageRegistration | undefined;

  // Service data
  services: ServiceRegistration[];
  getService: (id: string) => ServiceRegistration | undefined;

  // Package data
  loadedPackages: string[];
  isPackageLoaded: (packageId: string) => boolean;

  // Registry state
  isLoading: boolean;
  error: string | null;
}

const RegistryContext = createContext<RegistryContextType | null>(null);

interface RegistryProviderProps {
  children: React.ReactNode;
}

export function RegistryProvider({ children }: RegistryProviderProps) {
  const [tools, setTools] = useState<ToolRegistration[]>([]);
  const [commands, setCommands] = useState<CommandRegistration[]>([]);
  const [searchProviders, setSearchProviders] = useState<SearchProviderRegistration[]>([]);
  const [pages, setPages] = useState<PageRegistration[]>([]);
  const [services, setServices] = useState<ServiceRegistration[]>([]);
  const [loadedPackages, setLoadedPackages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs to track mounted state and prevent memory leaks
  const mountedRef = useRef(true);
  const listenersRef = useRef<Map<string, RegistryEventListener>>(new Map());

  // Initialize registry data
  useEffect(() => {
    async function initializeRegistry() {
      try {
        setIsLoading(true);
        setError(null);

        // Load initial data
        refreshRegistryData();

        // Set up event listeners
        setupEventListeners();

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize registry:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    }

    initializeRegistry();

    return () => {
      // Cleanup
      mountedRef.current = false;
      cleanupEventListeners();
    };
  }, []);

  const refreshRegistryData = () => {
    if (!mountedRef.current) return;

    setTools(registry.listTools());
    setCommands(registry.listCommands());
    setSearchProviders(registry.listSearchProviders());
    setPages(registry.listPages());
    setServices(registry.listServices());
    setLoadedPackages(registry.getLoadedPackages());
  };

  const setupEventListeners = () => {
    // Create debounced refresh function
    let timeoutId: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(refreshRegistryData, 50);
    };

    // Event handler wrapper
    const createHandler = (eventType: string): RegistryEventListener => {
      return () => {
        if (mountedRef.current) {
          debouncedRefresh();
        }
      };
    };

    // Register listeners
    const events = [
      "entry:registered",
      "entry:unregistered",
      "entry:updated",
      "package:loaded",
      "package:unloaded",
    ] as const;

    events.forEach((event) => {
      const handler = createHandler(event);
      registry.on(event, handler);
      listenersRef.current.set(event, handler);
    });
  };

  const cleanupEventListeners = () => {
    listenersRef.current.forEach((handler, event) => {
      registry.off(event, handler);
    });
    listenersRef.current.clear();
  };

  // Registry accessor methods
  const getTool = (id: string) => registry.getTool(id);
  const getCommand = (id: string) => registry.getCommand(id);
  const getSearchProvider = (id: string) => registry.getSearchProvider(id);
  const getPage = (id: string) => registry.getPage(id);
  const getService = (id: string) => registry.getService(id);
  const getToolPages = (toolId: string) => registry.listPages(toolId);
  const isPackageLoaded = (packageId: string) => loadedPackages.includes(packageId);

  const contextValue: RegistryContextType = {
    registry,
    tools,
    getTool,
    getToolPages,
    commands,
    getCommand,
    searchProviders,
    getSearchProvider,
    pages,
    getPage,
    services,
    getService,
    loadedPackages,
    isPackageLoaded,
    isLoading,
    error,
  };

  return (
    <RegistryContext.Provider value={contextValue}>
      {children}
    </RegistryContext.Provider>
  );
}

export function useRegistry() {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error("useRegistry must be used within a RegistryProvider");
  }
  return context;
}

// Selective hooks for optimized rendering
export function useTools(packageId?: string) {
  const { tools, getTool, getToolPages } = useRegistry();
  const filteredTools = packageId
    ? tools.filter(t => t.packageId === packageId)
    : tools;

  return { tools: filteredTools, getTool, getToolPages };
}

export function useCommands(packageId?: string) {
  const { commands, getCommand } = useRegistry();
  const filteredCommands = packageId
    ? commands.filter(c => c.packageId === packageId)
    : commands;

  return { commands: filteredCommands, getCommand };
}

export function useSearchProviders(packageId?: string) {
  const { searchProviders, getSearchProvider } = useRegistry();
  const filteredProviders = packageId
    ? searchProviders.filter(p => p.packageId === packageId)
    : searchProviders;

  return { searchProviders: filteredProviders, getSearchProvider };
}

export function useTool(toolId: string) {
  const { getTool, getToolPages } = useRegistry();
  const tool = getTool(toolId);
  const pages = tool ? getToolPages(toolId) : [];

  return { tool, pages };
}

export function useRegistryState() {
  const { isLoading, error, loadedPackages, isPackageLoaded } = useRegistry();
  return { isLoading, error, loadedPackages, isPackageLoaded };
}
```

### 2. `/apps/core/src/hooks/useRegistry.ts`
```typescript
/**
 * Registry hook exports
 * Centralizes all registry-related hooks for easy importing
 */

export {
  useRegistry,
  useTools,
  useCommands,
  useSearchProviders,
  useTool,
  useRegistryState,
} from "@/context/RegistryProvider";
```

### 3. `/apps/core/src/app/api/registry/tools/route.ts`
```typescript
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");

    const tools = registry.listTools(packageId || undefined);

    return NextResponse.json({
      tools: tools.map(tool => ({
        id: tool.id,
        packageId: tool.packageId,
        name: tool.name,
        description: tool.description,
        defaultRoute: tool.defaultRoute,
        requiresWorkspace: tool.requiresWorkspace,
        requiredPermissions: tool.requiredPermissions,
        // Don't expose component functions to client
      })),
    });
  } catch (error) {
    console.error("Failed to fetch tools:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 4. `/apps/core/src/app/api/registry/tools/[toolId]/route.ts`
```typescript
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";

interface Params {
  params: {
    toolId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tool = registry.getTool(params.toolId);

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Get pages for this tool
    const pages = registry.listPages(tool.id);

    return NextResponse.json({
      tool: {
        id: tool.id,
        packageId: tool.packageId,
        name: tool.name,
        description: tool.description,
        defaultRoute: tool.defaultRoute,
        requiresWorkspace: tool.requiresWorkspace,
        requiredPermissions: tool.requiredPermissions,
        pages: pages.map(page => ({
          id: page.id,
          route: page.route,
          title: page.title,
          description: page.description,
          hidden: page.hidden,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch tool:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 5. `/apps/core/src/app/api/registry/commands/route.ts`
```typescript
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get("packageId");

    const commands = registry.listCommands(packageId || undefined);

    return NextResponse.json({
      commands: commands.map(command => ({
        id: command.id,
        packageId: command.packageId,
        title: command.title,
        description: command.description,
        hotkey: command.hotkey,
        categories: command.categories,
        requiresWorkspace: command.requiresWorkspace,
        requiredPermissions: command.requiredPermissions,
        // Don't expose handler function to client
      })),
    });
  } catch (error) {
    console.error("Failed to fetch commands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 6. `/apps/core/src/app/api/registry/search/route.ts`
```typescript
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";
import type { SearchContext } from "@/types/registry";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchContext: SearchContext = await request.json();

    // Get all search providers
    const providers = registry.listSearchProviders();

    // Run search across all providers
    const searchPromises = providers.map(async (provider) => {
      try {
        if (provider.requiresWorkspace && !searchContext.workspaceId) {
          return [];
        }
        return await provider.search(searchContext);
      } catch (error) {
        console.error(`Search provider ${provider.id} failed:`, error);
        return [];
      }
    });

    const results = await Promise.all(searchPromises);
    const allResults = results.flat();

    return NextResponse.json({
      results: allResults,
      count: allResults.length,
    });
  } catch (error) {
    console.error("Failed to search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 7. `/apps/core/src/app/api/registry/packages/route.ts`
```typescript
import { NextResponse } from "next/server";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packages = registry.getLoadedPackages();

    return NextResponse.json({
      packages,
      count: packages.length,
    });
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Files to Update

### 1. `/apps/core/src/app/[workspaceId]/layout.tsx`
Add RegistryProvider to the layout:
```typescript
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WorkspaceProvider } from "@/context/workspace/WorkspaceProvider";
import { RegistryProvider } from "@/context/RegistryProvider";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const session = await auth();

  // Redirect unauthenticated users
  if (!session) {
    redirect("/login");
  }

  // Validate workspace ID format
  if (!/^[a-zA-Z0-9]{10,20}$/.test(params.workspaceId)) {
    redirect("/dashboard");
  }

  return (
    <RegistryProvider>
      <WorkspaceProvider>
        <Suspense fallback={<div>Loading workspace...</div>}>
          <DashboardLayout>{children}</DashboardLayout>
        </Suspense>
      </WorkspaceProvider>
    </RegistryProvider>
  );
}
```

### 2. `/apps/core/src/components/dashboard/error/RegistryErrorBoundary.tsx`
```typescript
"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RegistryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Registry Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Registry Error</AlertTitle>
              <AlertDescription>
                {this.state.error?.message || "An unknown error occurred with the registry system."}
              </AlertDescription>
            </Alert>
            <Button
              onClick={this.handleRetry}
              className="w-full mt-4"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Validation Checklist
- [ ] Registry context provides all necessary data
- [ ] Components can access registry via hooks
- [ ] Registry updates trigger re-renders
- [ ] No unnecessary re-renders occur
- [ ] Error boundary handles registry failures
- [ ] Server-side access works via API routes
- [ ] Loading states display properly
- [ ] Memory leaks are prevented
- [ ] Performance remains acceptable

## Testing Example

```typescript
// Using the registry in a component
import { useTools } from "@/hooks/useRegistry";

function ToolList() {
  const { tools, isLoading } = useTools();

  if (isLoading) return <div>Loading tools...</div>;

  return (
    <ul>
      {tools.map(tool => (
        <li key={tool.id}>{tool.name}</li>
      ))}
    </ul>
  );
}
```

## Common Issues and Solutions

1. **Too many re-renders**: Use selective hooks (useTools, useCommands) to only subscribe to needed data
2. **Memory leaks**: Ensure event listeners are cleaned up
3. **Stale data**: Debounce rapid updates to prevent excessive refreshes
4. **Server access**: Use API routes for server components

## Next Steps

After implementing the registry provider:
1. Create dynamic routing for tools (Unit 4.1)
2. Implement page registration system (Unit 4.2)
3. Build the first reference package (Phase 5)