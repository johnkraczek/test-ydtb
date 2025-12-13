# Unit 5.1: Dynamic Tool Routes

## Folder: `08-dynamic-routing`

## Purpose
Implement dynamic routing system that renders registered tools and their components based on URL patterns, allowing packages to register tools that are accessible via routes without hard-coding them in the Next.js file system.

## Context
- Registry system is implemented with tool registrations (Units 3.1-3.4)
- Tools need to be accessible via URLs like `/[workspaceId]/tools/[toolId]/...`
- Must pass route context (toolId, currentRoute, routeParams) to tool components
- Should handle workspace context and permissions
- Need 404 handling for unknown tools
- Must support nested routes within tools
- Should integrate with the existing dashboard layout

## Definition of Done
- [ ] Dynamic route handler implemented for tool URLs
- [ ] Tool components rendered correctly with proper props
- [ ] Route context passed (toolId, currentRoute, routeParams, navigate function)
- [ ] 404 handling for unknown tools
- [ ] Workspace context maintained and validated
- [ ] Permission checking before tool access
- [ ] Default route handling for tools
- [ ] Nested route parsing and parameter extraction
- [ ] Integration with dashboard layout and sidebar

## Routing Structure

The dynamic routing will handle URLs in this format:
```
/[workspaceId]/tools/[toolId]/[...routeSegments]
```

Examples:
- `/ws1234567890/tools/crm` → CRM tool with default route
- `/ws1234567890/tools/crm/contacts` → CRM tool contacts page
- `/ws1234567890/tools/crm/contacts/123` → CRM tool contact detail with parameter

## Files to Create

### 1. `/apps/core/src/app/[workspaceId]/tools/[...toolId]/page.tsx`
```typescript
import { notFound, redirect } from "next/navigation";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";
import { validateWorkspaceId } from "@/lib/utils/workspace";
import type { ToolRegistration, ToolComponentProps } from "@/type s/registry";

interface PageProps {
  params: {
    workspaceId: string;
    toolId: string[];
  };
  searchParams: Record<string, string>;
}

export default async function ToolPage({ params, searchParams }: PageProps) {
  const session = await auth();

  // Authentication check
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/tools/${params.toolId.join("/")}`)}`);
  }

  // Validate workspace ID
  if (!validateWorkspaceId(params.workspaceId)) {
    notFound();
  }

  // Extract tool ID and route
  const [toolId, ...routeSegments] = params.toolId;
  const currentRoute = routeSegments.length > 0 ? routeSegments : undefined;

  // Get tool registration
  const tool = registry.getTool(toolId);
  if (!tool) {
    notFound();
  }

  // Check workspace requirement
  if (tool.requiresWorkspace && !params.workspaceId) {
    redirect("/dashboard");
  }

  // Check permissions (in a real app, you'd check against user's workspace permissions)
  if (tool.requiredPermissions) {
    // TODO: Implement permission checking
    console.log("Checking permissions:", tool.requiredPermissions);
  }

  // Determine which route to use
  let effectiveRoute = currentRoute;
  if (!effectiveRoute || effectiveRoute.length === 0) {
    effectiveRoute = tool.defaultRoute;
  }

  // Extract route parameters (for dynamic segments like :id)
  const routeParams = extractRouteParams(effectiveRoute, tool);

  // Create navigation function
  const navigate = (route: string[], params?: Record<string, string>) => {
    const url = `/${params.workspaceId}/tools/${toolId}/${route.join("/")}`;
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return url + queryString;
  };

  // Prepare component props
  const componentProps: ToolComponentProps = {
    navigation: {
      toolId,
      currentRoute: effectiveRoute || [],
      routeParams,
      navigate: (route, params) => {
        // Client-side navigation will be handled by the tool component
        // This is a placeholder for the URL generation
        const url = navigate(route, params);
        console.log("Navigate to:", url);
      },
    },
    workspaceId: params.workspaceId,
    permissions: [], // TODO: Get actual user permissions
  };

  // Render the tool component
  const ToolComponent = tool.pageComponent;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ToolComponent {...componentProps} />
      </div>
    </div>
  );
}

function extractRouteParams(route: string[] | undefined, tool: ToolRegistration): Record<string, string> {
  if (!route) return {};

  const params: Record<string, string> = {};

  // Simple parameter extraction for segments that look like IDs
  // In a more sophisticated implementation, this would use the tool's route definitions
  route.forEach((segment, index) => {
    // Check if segment looks like a UUID or numeric ID
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment)) {
      params[`${index}Id`] = segment;
    } else if (/^\d+$/.test(segment)) {
      params[`${index}Id`] = segment;
    } else {
      params[index] = segment;
    }
  });

  return params;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const [toolId] = params.toolId;
  const tool = registry.getTool(toolId);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: `${tool.name || toolId} - CRM Toolkit`,
    description: tool.description,
  };
}
```

### 2. `/apps/core/src/app/[workspaceId]/tools/[...toolId]/layout.tsx`
```typescript
import { notFound } from "next/navigation";
import { registry } from "@/lib/registry";
import { Suspense } from "react";
import { ToolSidebar } from "@/components/dashboard/sidebars/ToolSidebar";
import { ToolHeader } from "@/components/dashboard/headers/ToolHeader";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    workspaceId: string;
    toolId: string[];
  };
}

export default function ToolLayout({ children, params }: LayoutProps) {
  const [toolId] = params.toolId;
  const tool = registry.getTool(toolId);

  if (!tool) {
    notFound();
  }

  return (
    <div className="h-full flex">
      {/* Tool Sidebar */}
      <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Suspense fallback={<div className="p-4">Loading sidebar...</div>}>
          {tool.sidebarComponent ? (
            <tool.sidebarComponent
              navigation={{
                toolId,
                currentRoute: params.toolId.slice(1),
                routeParams: {},
                navigate: () => {},
              }}
              workspaceId={params.workspaceId}
              permissions={[]}
            />
          ) : (
            <ToolSidebar tool={tool} workspaceId={params.workspaceId} />
          )}
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tool Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Suspense fallback={<div className="p-4">Loading header...</div>}>
            {tool.headerComponent ? (
              <tool.headerComponent
                navigation={{
                  toolId,
                  currentRoute: params.toolId.slice(1),
                  routeParams: {},
                  navigate: () => {},
                }}
                workspaceId={params.workspaceId}
                permissions={[]}
              />
            ) : (
              <ToolHeader tool={tool} workspaceId={params.workspaceId} />
            )}
          </Suspense>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Generate metadata for the layout
export async function generateMetadata({ params }: LayoutProps) {
  const [toolId] = params.toolId;
  const tool = registry.getTool(toolId);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: `${tool.name || toolId} - CRM Toolkit`,
    description: tool.description,
  };
}
```

### 3. `/apps/core/src/components/dashboard/sidebars/ToolSidebar.tsx`
```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ToolRegistration } from "@/types/registry";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Folder, File } from "lucide-react";

interface ToolSidebarProps {
  tool: ToolRegistration;
  workspaceId: string;
}

export function ToolSidebar({ tool, workspaceId }: ToolSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["main"]));

  // Build navigation tree from tool pages
  const navigationItems = buildNavigationTree(tool);

  return (
    <div className="flex h-full flex-col">
      {/* Tool Header */}
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

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              workspaceId={workspaceId}
              toolId={tool.id}
              pathname={pathname}
              openSections={openSections}
              onToggleSection={(id) => {
                const newSections = new Set(openSections);
                if (newSections.has(id)) {
                  newSections.delete(id);
                } else {
                  newSections.add(id);
                }
                setOpenSections(newSections);
              }}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

function buildNavigationTree(tool: ToolRegistration): NavigationItem[] {
  // For now, create a basic navigation structure
  // In a real implementation, this would be based on tool's page registrations
  const items: NavigationItem[] = [
    {
      id: "home",
      title: "Home",
      href: `/${tool.id}`,
      icon: File,
    },
  ];

  // Add default route as main page if different from "home"
  if (tool.defaultRoute && tool.defaultRoute.length > 0 && tool.defaultRoute[0] !== "home") {
    items.unshift({
      id: "default",
      title: "Main",
      href: `/${tool.id}/${tool.defaultRoute.join("/")}`,
      icon: File,
    });
  }

  // TODO: Add pages registered with the tool
  // const pages = registry.listPages(tool.id);
  // pages.forEach(page => {
  //   // Add to navigation tree
  // });

  return items;
}

interface NavigationItemProps {
  item: NavigationItem;
  workspaceId: string;
  toolId: string;
  pathname: string;
  openSections: Set<string>;
  onToggleSection: (id: string) => void;
}

function NavigationItem({
  item,
  workspaceId,
  toolId,
  pathname,
  openSections,
  onToggleSection,
}: NavigationItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openSections.has(item.id);
  const isActive = item.href
    ? pathname === `/${workspaceId}/tools/${item.href}`
    : false;

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={() => onToggleSection(item.id)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-2 py-1 h-auto",
              isActive && "bg-muted"
            )}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            {item.icon ? (
              <item.icon className="h-4 w-4 mr-2" />
            ) : (
              <Folder className="h-4 w-4 mr-2" />
            )}
            {item.title}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4 space-y-1">
          {item.children?.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              workspaceId={workspaceId}
              toolId={toolId}
              pathname={pathname}
              openSections={openSections}
              onToggleSection={onToggleSection}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={`/${workspaceId}/tools/${item.href}`}
      className={cn(
        "flex items-center px-2 py-1 rounded-sm hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-muted"
      )}
    >
      {item.icon ? (
        <item.icon className="h-4 w-4 mr-2" />
      ) : (
        <File className="h-4 w-4 mr-2" />
      )}
      {item.title}
    </Link>
  );
}
```

### 4. `/apps/core/src/components/dashboard/headers/ToolHeader.tsx`
```typescript
"use client";

import { type ToolRegistration } from "@/types/registry";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ToolHeaderProps {
  tool: ToolRegistration;
  workspaceId: string;
}

export function ToolHeader({ tool, workspaceId }: ToolHeaderProps) {
  return (
    <div className="flex h-14 items-center px-4">
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
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {/* Tool actions can go here */}
      </div>
    </div>
  );
}
```

### 5. `/apps/core/src/components/navigation/ToolLink.tsx`
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ToolRegistration } from "@/types/registry";

interface ToolLinkProps {
  tool: ToolRegistration;
  workspaceId: string;
  className?: string;
}

export function ToolLink({ tool, workspaceId, className }: ToolLinkProps) {
  const pathname = usePathname();
  const href = `/${workspaceId}/tools/${tool.id}`;
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
    >
      <tool.icon className="h-4 w-4" />
      <span>{tool.name || tool.id}</span>
    </Link>
  );
}
```

## Files to Update

### 1. `/apps/core/src/components/dashboard/sidebars/IconRail.tsx`
```typescript
"use client";

import { useTools } from "@/hooks/useRegistry";
import { useWorkspace } from "@/context/workspace/WorkspaceProvider";
import { ToolLink } from "@/components/navigation/ToolLink";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export function IconRail() {
  const { tools } = useTools();
  const { workspace } = useWorkspace();

  if (!workspace) {
    return null;
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

      {/* Add Tool Button */}
      <button className="w-10 h-10 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
```

## Validation Checklist

- [ ] Dynamic route handler correctly extracts tool ID and route
- [ ] Tool components render with proper props
- [ ] Route context includes navigation function
- [ ] 404 page shows for unknown tools
- [ ] Workspace context is validated
- [ ] Tool sidebar and header render correctly
- [ ] Navigation links work between tools
- [ ] Default routes are used when no route specified
- [ ] Breadcrumb navigation works
- [ ] Tool icons display in IconRail

## Testing Scenarios

1. **Direct tool access**: `/ws123/tools/crm`
2. **Nested routes**: `/ws123/tools/crm/contacts`
3. **Invalid tool**: `/ws123/tools/nonexistent` → 404
4. **Tool switching**: Navigate between different tools
5. **Default routes**: Tool without route uses default
6. **Workspace context**: Tools receive workspace ID
7. **Permissions**: Restricted tools are properly gated

## Common Issues and Solutions

1. **404 on valid tool**: Check if tool is registered in registry
2. **Missing props**: Ensure componentProps matches ToolComponentProps interface
3. **Navigation not working**: Verify URL generation in navigate function
4. **Stale data**: Registry may need refresh after tool registration
5. **Permission errors**: Implement proper permission checking logic

## Next Steps

After implementing dynamic routing:
1. Create page registration system (Unit 4.2)
2. Build the first reference package (Phase 5)
3. Implement package initialization in layout (Unit 6.2)