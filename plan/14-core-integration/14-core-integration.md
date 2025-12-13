# Unit 6.1: Update Core Components

## Folder: `14-core-integration`

## Purpose
Update the core application components to use the registry system for dynamic tool loading and rendering. This replaces static components with dynamic ones that are registered by packages.

## Context
- Registry system is implemented (Phase 3)
- Dynamic routing is working (Phase 4)
- Basic package is created (Phase 5)
- Core components need to be updated to:
  - Load tools from registry instead of being static
  - Render package-sidebars and headers
  - Handle navigation context correctly
  - Support multiple tools dynamically
- Must maintain backward compatibility during transition

## Definition of Done
- [ ] IconRail uses registry to display all registered tools
- [ ] ToolSidebar renders package-provided sidebar components
- [ ] ToolHeader renders package-provided header components
- [ ] Route context passed correctly to all components
- [ ] Fallbacks work when tools don't provide custom components
- [ ] Error handling for missing or invalid tools
- [ ] Performance optimizations (lazy loading)
- [ ] TypeScript types properly propagated
- [ ] No breaking changes to existing functionality

## Components to Update

### 1. IconRail Component
Update to fetch tools from registry and display them dynamically.

### 2. ToolSidebar Component
Update to render package-provided sidebar components with fallbacks.

### 3. ToolHeader Component
Update to render package-provided header components with fallbacks.

### 4. Dashboard Layout
Update to handle dynamic tool switching and context.

## Files to Update

### 1. `/apps/core/src/components/dashboard/sidebars/IconRail.tsx`
```typescript
"use client";

import { useTools } from "@/hooks/useRegistry";
import { useWorkspace } from "@/context/workspace/WorkspaceProvider";
import { ToolLink } from "@/components/navigation/ToolLink";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings } from "lucide-react";

export function IconRail() {
  const { tools, isLoading } = useTools();
  const { workspace } = useWorkspace();

  if (!workspace) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-14 flex-col items-center gap-2 py-4">
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-10 h-10 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-14 flex-col items-center gap-2 py-4">
      {/* Tool Icons */}
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <ToolLink
            key={tool.id}
            tool={tool}
            workspaceId={workspace.id}
            className="w-10 h-10 rounded-lg p-0 justify-center"
          />
        ))}
      </div>

      <Separator orientation="vertical" className="h-4" />

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          className="w-10 h-10 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Install Package"
        >
          <Plus className="h-4 w-4" />
        </button>

        <button
          className="w-10 h-10 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

### 2. `/apps/core/src/components/dashboard/sidebars/ToolSidebar.tsx`
```typescript
"use client";

import { useTool } from "@/hooks/useRegistry";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolComponentProps } from "@/types/registry";

interface ToolSidebarProps {
  toolId: string;
  workspaceId: string;
  navigation: Omit<ToolComponentProps["navigation"], "navigate"> & {
    navigate: (route: string[], params?: Record<string, string>) => string;
  };
  permissions: string[];
}

export function ToolSidebar({ toolId, workspaceId, navigation, permissions }: ToolSidebarProps) {
  const { tool, isLoading } = useTool(toolId);

  if (isLoading) {
    return (
      <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-6 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Tool not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const SidebarComponent = tool.sidebarComponent;

  // If tool provides its own sidebar component, use it
  if (SidebarComponent) {
    return (
      <Suspense fallback={<SidebarFallback />}>
        <SidebarComponent
          navigation={{
            ...navigation,
            navigate: navigation.navigate,
          }}
          workspaceId={workspaceId}
          permissions={permissions}
        />
      </Suspense>
    );
  }

  // Default sidebar
  return <DefaultSidebar tool={tool} workspaceId={workspaceId} />;
}

function SidebarFallback() {
  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultSidebar({ tool, workspaceId }: { tool: any; workspaceId: string }) {
  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <tool.icon className="h-5 w-5" />
          <span className="font-semibold">{tool.name || tool.id}</span>
        </div>
        {tool.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {tool.description}
          </p>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          This tool doesn't provide a custom sidebar.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Tool ID: {tool.id}
        </p>
      </div>
    </div>
  );
}
```

### 3. `/apps/core/src/components/dashboard/headers/ToolHeader.tsx`
```typescript
"use client";

import { useTool } from "@/hooks/useRegistry";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolComponentProps } from "@/types/registry";

interface ToolHeaderProps {
  toolId: string;
  workspaceId: string;
  navigation: Omit<ToolComponentProps["navigation"], "navigate"> & {
    navigate: (route: string[], params?: Record<string, string>) => string;
  };
  permissions: string[];
  pageTitle?: string;
  pageDescription?: string;
}

export function ToolHeader({
  toolId,
  workspaceId,
  navigation,
  permissions,
  pageTitle,
  pageDescription,
}: ToolHeaderProps) {
  const { tool, isLoading } = useTool(toolId);

  if (isLoading) {
    return (
      <div className="flex h-14 items-center px-4 border-b">
        <div className="animate-pulse flex items-center gap-4 flex-1">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="flex h-14 items-center px-4 border-b">
        <Card>
          <CardContent className="py-2 px-4">
            <p className="text-sm text-muted-foreground">
              Tool not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const HeaderComponent = tool.headerComponent;

  // If tool provides its own header component, use it
  if (HeaderComponent) {
    return (
      <Suspense fallback={<HeaderFallback />}>
        <HeaderComponent
          navigation={{
            ...navigation,
            navigate: navigation.navigate,
          }}
          workspaceId={workspaceId}
          permissions={permissions}
        />
      </Suspense>
    );
  }

  // Default header
  return (
    <DefaultHeader
      tool={tool}
      workspaceId={workspaceId}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    />
  );
}

function HeaderFallback() {
  return (
    <div className="flex h-14 items-center px-4 border-b">
      <div className="animate-pulse flex items-center gap-4 flex-1">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
      </div>
    </div>
  );
}

function DefaultHeader({
  tool,
  workspaceId,
  pageTitle,
  pageDescription,
}: {
  tool: any;
  workspaceId: string;
  pageTitle?: string;
  pageDescription?: string;
}) {
  return (
    <div className="flex h-14 items-center px-4 gap-4 border-b">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${workspaceId}/dashboard`}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${workspaceId}/dashboard`}>
              Tools
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <tool.icon className="h-4 w-4" />
              {tool.name || tool.id}
              {pageTitle && (
                <>
                  <BreadcrumbSeparator className="inline" />
                  {pageTitle}
                </>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page description */}
      <div className="ml-auto flex items-center gap-2">
        {pageDescription && (
          <span className="text-sm text-muted-foreground">
            {pageDescription}
          </span>
        )}
      </div>
    </div>
  );
}
```

### 4. `/apps/core/src/components/dashboard/DashboardLayout.tsx`
```typescript
"use client";

import { ReactNode } from "react";
import { IconRail } from "./sidebars/IconRail";
import { ToolSidebar } from "./sidebars/ToolSidebar";
import { ToolHeader } from "./headers/ToolHeader";
import { ErrorBoundary } from "../error/ErrorBoundary";
import { useWorkspace } from "@/context/workspace/WorkspaceProvider";
import { useParams, usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { workspace } = useWorkspace();
  const params = useParams();
  const pathname = usePathname();

  // Check if we're in a tool context
  const isToolRoute = pathname.includes("/tools/");
  const toolId = isToolRoute ? params.toolId?.[0] : null;

  if (!workspace) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // If not in a tool route, show default dashboard layout
  if (!isToolRoute) {
    return (
      <div className="flex h-full">
        <IconRail />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    );
  }

  // In a tool route, show tool layout
  return (
    <ErrorBoundary>
      <div className="flex h-full">
        <IconRail />

        <ToolSidebar
          toolId={toolId!}
          workspaceId={workspace.id}
          navigation={{
            toolId: toolId!,
            currentRoute: params.toolId?.slice(1) || [],
            routeParams: {},
            navigate: (route, params) => {
              const url = `/${workspace.id}/tools/${toolId}/${route.join("/")}`;
              const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
              return url + queryString;
            },
          }}
          permissions={[]} // TODO: Get actual permissions
        />

        <div className="flex-1 flex flex-col">
          <ToolHeader
            toolId={toolId!}
            workspaceId={workspace.id}
            navigation={{
              toolId: toolId!,
              currentRoute: params.toolId?.slice(1) || [],
              routeParams: {},
              navigate: (route, params) => {
                const url = `/${workspace.id}/tools/${toolId}/${route.join("/")}`;
                const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
                return url + queryString;
              },
            }}
            permissions={[]} // TODO: Get actual permissions
          />

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
```

## Installation Commands

Run these commands to install any missing dependencies:

```bash
# Install lucide-react for icons
bun add lucide-react

# Install if missing
bun add @radix-ui/react-separator
bun add @radix-ui/react-breadcrumb
```

## Validation Checklist

- [ ] IconRail displays all registered tools
- [ ] Tool icons navigate to correct routes
- [ ] Package sidebars render when provided
- [ ] Default sidebar shown when package doesn't provide one
- [ ] Package headers render when provided
- [ ] Default header shown when package doesn't provide one
- [ ] Breadcrumbs update correctly
- [ ] Error boundaries catch and display errors
- [ ] Loading states show during tool loading
- [ ] No console errors

## Testing the Integration

1. Navigate to the dashboard
2. Verify IconRail shows the Basic tool icon
3. Click on Basic tool
4. Verify custom sidebar and header render
5. Navigate to different pages within the tool
6. Check that breadcrumbs update correctly
7. Test error handling with invalid tool URLs

## Performance Considerations

1. **Lazy Loading**: Components are loaded on-demand
2. **Error Boundaries**: Prevent one tool from breaking others
3. **Suspense**: Show loading states during component loading
4. **Memoization**: Consider memoizing expensive computations

## Next Steps

After updating core components:
1. Implement package initialization (Unit 6.2)
2. Create comprehensive tests (Unit 7.2)
3. Write developer documentation (Unit 8.1)