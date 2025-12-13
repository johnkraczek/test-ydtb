# Unit 4.2: Page Registration System

## Folder: `09-page-registration`

## Purpose
Implement a page registration system that allows tools to register specific pages with their own components, sidebar/header overrides, and route handling. This enables tools to have multiple pages with different layouts and functionality.

## Context
- Dynamic routing for tools is implemented (Unit 4.1)
- Tools need to register multiple pages beyond their default route
- Pages should be able to override the tool's default sidebar and header
- Need support for dynamic page rendering based on URL patterns
- Must handle route parameters and pass them to page components
- Should integrate with the existing dynamic routing system
- Pages can be hidden from navigation (e.g., detail views)

## Definition of Done
- [ ] Page registration API working with validation
- [ ] Page-specific component overrides (sidebar/header)
- [ ] Dynamic page rendering with correct component selection
- [ ] Route parameter handling and extraction
- [ ] Fallback to tool defaults when no page override
- [ ] Hidden pages not shown in navigation
- [ ] Page permissions checked before rendering
- [ ] Page metadata and titles handled correctly
- [ ] Integration with tool navigation system

## Page Registration Features

The page system supports:
- **Route patterns**: Static and dynamic routes with parameters
- **Component overrides**: Custom sidebar and header per page
- **Permissions**: Page-specific access control
- **Metadata**: Title, description, and navigation settings
- **Hidden pages**: Not shown in sidebar navigation
- **Parameter passing**: URL parameters passed to components

## Files to Create

### 1. `/apps/core/src/lib/registry/pages.ts`
```typescript
/**
 * Page registration utilities and helpers
 * Extends the registry with page-specific functionality
 */

import { z } from "zod";
import type { PageRegistration, ToolComponentProps } from "@/types/registry";

/**
 * Route pattern matching utilities
 */
export class RouteMatcher {
  /**
   * Convert a route pattern to a regex
   * Supports: static segments, :param, *wildcard
   */
  static patternToRegex(pattern: string): RegExp {
    // Escape special regex characters except for our patterns
    let regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\:([a-zA-Z_][a-zA-Z0-9_]*)/g, '([^/]+)') // :param
      .replace(/\\\*/g, '(.*)'); // *wildcard

    return new RegExp(`^${regexPattern}$`);
  }

  /**
   * Extract parameters from a route based on a pattern
   */
  static extractParams(pattern: string, actualRoute: string[]): Record<string, string> {
    const patternSegments = pattern.split('/');
    const params: Record<string, string> = {};

    patternSegments.forEach((segment, index) => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        params[paramName] = actualRoute[index] || '';
      } else if (segment === '*') {
        params['*'] = actualRoute.slice(index).join('/');
      }
    });

    return params;
  }

  /**
   * Check if a route matches a pattern
   */
  static matches(pattern: string, route: string[]): boolean {
    const regex = this.patternToRegex(pattern);
    return regex.test(route.join('/'));
  }
}

/**
 * Page resolution utilities
 */
export class PageResolver {
  /**
   * Find the best matching page for a given route
   */
  static findMatchingPage(
    pages: PageRegistration[],
    route: string[]
  ): PageRegistration | null {
    // First, look for exact matches
    for (const page of pages) {
      if (RouteMatcher.matches(page.route, route)) {
        return page;
      }
    }

    // If no exact match, try to find a parent pattern
    // This handles cases like detail views where you have a list page that can render details
    for (const page of pages) {
      const patternSegments = page.route.split('/');
      const routeStr = route.join('/');

      // Check if this could be a parent pattern
      if (patternSegments.some(s => s.includes(':') || s === '*')) {
        if (RouteMatcher.matches(page.route, route)) {
          return page;
        }
      }
    }

    return null;
  }

  /**
   * Extract page parameters from route
   */
  static extractPageParams(
    page: PageRegistration,
    route: string[]
  ): Record<string, string> {
    return RouteMatcher.extractParams(page.route, route);
  }

  /**
   * Build navigation tree from pages
   */
  static buildNavigationTree(pages: PageRegistration[]): NavigationNode[] {
    const tree: NavigationNode[] = [];
    const pageMap = new Map(pages.map(p => [p.id, p]));

    // Group pages by route hierarchy
    const rootPages = pages.filter(p => !p.route.includes('/') && !p.hidden);

    rootPages.forEach(page => {
      const node: NavigationNode = {
        id: page.id,
        title: page.title || page.id,
        href: page.route,
        icon: page.metadata?.icon as any,
      };

      // Find child pages
      const children = pages.filter(p =>
        p.route.startsWith(page.route + '/') &&
        !p.hidden &&
        p.route.split('/').length === page.route.split('/').length + 1
      );

      if (children.length > 0) {
        node.children = children.map(child => ({
          id: child.id,
          title: child.title || child.id,
          href: child.route,
          icon: child.metadata?.icon as any,
        }));
      }

      tree.push(node);
    });

    return tree;
  }
}

interface NavigationNode {
  id: string;
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationNode[];
}

/**
 * Enhanced page registration with additional methods
 */
export class EnhancedPageRegistration implements PageRegistration {
  constructor(
    public id: string,
    public packageId: string,
    public toolId: string,
    public route: string,
    public component: React.ComponentType<ToolComponentProps>,
    public options: {
      title?: string;
      description?: string;
      sidebarComponent?: React.ComponentType<ToolComponentProps>;
      headerComponent?: React.ComponentType<ToolComponentProps>;
      hidden?: boolean;
      requiredPermissions?: string[];
      metadata?: Record<string, unknown>;
    } = {}
  ) {}

  get sidebarComponent() {
    return this.options.sidebarComponent;
  }

  get headerComponent() {
    return this.options.headerComponent;
  }

  get title() {
    return this.options.title;
  }

  get description() {
    return this.options.description;
  }

  get hidden() {
    return this.options.hidden || false;
  }

  get requiredPermissions() {
    return this.options.requiredPermissions || [];
  }

  get metadata() {
    return this.options.metadata || {};
  }
}

/**
 * Page registration builder for easier page creation
 */
export class PageBuilder {
  private page: Partial<PageRegistration> = {};

  constructor(id: string, toolId: string, packageId: string) {
    this.page.id = id;
    this.page.toolId = toolId;
    this.page.packageId = packageId;
  }

  route(route: string): PageBuilder {
    this.page.route = route;
    return this;
  }

  title(title: string): PageBuilder {
    this.page.title = title;
    return this;
  }

  description(description: string): PageBuilder {
    this.page.description = description;
    return this;
  }

  component(component: React.ComponentType<ToolComponentProps>): PageBuilder {
    this.page.component = component;
    return this;
  }

  sidebar(sidebar: React.ComponentType<ToolComponentProps>): PageBuilder {
    this.page.sidebarComponent = sidebar;
    return this;
  }

  header(header: React.ComponentType<ToolComponentProps>): PageBuilder {
    this.page.headerComponent = header;
    return this;
  }

  hidden(hidden = true): PageBuilder {
    this.page.hidden = hidden;
    return this;
  }

  permissions(permissions: string[]): PageBuilder {
    this.page.requiredPermissions = permissions;
    return this;
  }

  metadata(metadata: Record<string, unknown>): PageBuilder {
    this.page.metadata = metadata;
    return this;
  }

  build(): PageRegistration {
    if (!this.page.route || !this.page.component) {
      throw new Error('Page must have route and component');
    }

    return {
      id: this.page.id,
      packageId: this.page.packageId!,
      toolId: this.page.toolId!,
      route: this.page.route,
      component: this.page.component,
      title: this.page.title,
      description: this.page.description,
      sidebarComponent: this.page.sidebarComponent,
      headerComponent: this.page.headerComponent,
      hidden: this.page.hidden,
      requiredPermissions: this.page.requiredPermissions,
      metadata: this.page.metadata,
    };
  }
}

/**
 * Helper function to create pages
 */
export function createPage(
  id: string,
  toolId: string,
  packageId: string
): PageBuilder {
  return new PageBuilder(id, toolId, packageId);
}
```

### 2. Update `/apps/core/src/app/[workspaceId]/tools/[...toolId]/page.tsx`
```typescript
import { notFound, redirect } from "next/navigation";
import { registry } from "@/lib/registry";
import { auth } from "@/lib/auth";
import { validateWorkspaceId } from "@/lib/utils/workspace";
import { PageResolver } from "@/lib/registry/pages";
import type { ToolRegistration, ToolComponentProps, PageRegistration } from "@/types/registry";

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

  // Check permissions
  if (tool.requiredPermissions) {
    // TODO: Implement permission checking
    console.log("Checking tool permissions:", tool.requiredPermissions);
  }

  // Get pages for this tool
  const toolPages = registry.listPages(toolId);

  // Find matching page or use tool default
  let page: PageRegistration | null = null;
  let effectiveRoute = currentRoute;

  if (currentRoute && currentRoute.length > 0) {
    // Try to find a matching page
    page = PageResolver.findMatchingPage(toolPages, currentRoute);

    if (page) {
      // Check page permissions
      if (page.requiredPermissions) {
        // TODO: Implement permission checking
        console.log("Checking page permissions:", page.requiredPermissions);
      }

      // Extract parameters from route
      effectiveRoute = currentRoute;
    } else {
      // No matching page, might be a dynamic route handled by the tool
      effectiveRoute = currentRoute;
    }
  } else {
    // No route specified, use tool default
    effectiveRoute = tool.defaultRoute;
  }

  // Extract route parameters
  let routeParams: Record<string, string> = {};
  if (page) {
    routeParams = PageResolver.extractPageParams(page, effectiveRoute || []);
  }

  // Include search params
  routeParams = { ...routeParams, ...searchParams };

  // Determine which component to render
  let ComponentToRender = tool.pageComponent;

  // If we have a matching page, use its component
  if (page) {
    ComponentToRender = page.component;
  }

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
        const url = navigate(route, params);
        console.log("Navigate to:", url);
        // In a real implementation, this would use Next.js router
      },
    },
    workspaceId: params.workspaceId,
    permissions: [], // TODO: Get actual user permissions
  };

  // Store page info for layout to use
  const pageContext = page ? {
    id: page.id,
    title: page.title,
    description: page.description,
    sidebarComponent: page.sidebarComponent,
    headerComponent: page.headerComponent,
  } : null;

  // Pass page context to layout via a search param
  const enhancedSearchParams = {
    ...searchParams,
    pageContext: pageContext ? JSON.stringify(pageContext) : undefined,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ComponentToRender {...componentProps} />
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params, searchParams }: PageProps) {
  const [toolId, ...routeSegments] = params.toolId;
  const tool = registry.getTool(toolId);

  if (!tool) {
    return {
      title: "Tool Not Found",
    };
  }

  // Check if we have page context from search params
  const pageContextStr = searchParams.pageContext;
  if (pageContextStr) {
    try {
      const pageContext = JSON.parse(pageContextStr);
      return {
        title: pageContext.title
          ? `${pageContext.title} - ${tool.name || toolId}`
          : `${tool.name || toolId} - CRM Toolkit`,
        description: pageContext.description || tool.description,
      };
    } catch {
      // Fall through to tool metadata
    }
  }

  return {
    title: `${tool.name || toolId} - CRM Toolkit`,
    description: tool.description,
  };
}
```

### 3. Update `/apps/core/src/app/[workspaceId]/tools/[...toolId]/layout.tsx`
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
  searchParams: Record<string, string>;
}

export default function ToolLayout({ children, params, searchParams }: LayoutProps) {
  const [toolId] = params.toolId;
  const tool = registry.getTool(toolId);

  if (!tool) {
    notFound();
  }

  // Extract page context if available
  let pageContext: any = null;
  if (searchParams.pageContext) {
    try {
      pageContext = JSON.parse(searchParams.pageContext);
    } catch {
      // Invalid page context, ignore
    }
  }

  // Determine which sidebar/header to use
  const SidebarComponent = pageContext?.sidebarComponent || tool.sidebarComponent;
  const HeaderComponent = pageContext?.headerComponent || tool.headerComponent;

  return (
    <div className="h-full flex">
      {/* Tool Sidebar */}
      <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Suspense fallback={<div className="p-4">Loading sidebar...</div>}>
          {SidebarComponent ? (
            <SidebarComponent
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
            <ToolSidebar
              tool={tool}
              workspaceId={params.workspaceId}
              currentPageId={pageContext?.id}
            />
          )}
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tool Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Suspense fallback={<div className="p-4">Loading header...</div>}>
            {HeaderComponent ? (
              <HeaderComponent
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
              <ToolHeader
                tool={tool}
                workspaceId={params.workspaceId}
                pageTitle={pageContext?.title}
                pageDescription={pageContext?.description}
              />
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
```

### 4. Update `/apps/core/src/components/dashboard/sidebars/ToolSidebar.tsx`
```typescript
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ToolRegistration, PageRegistration } from "@/types/registry";
import { PageResolver } from "@/lib/registry/pages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Folder, File } from "lucide-react";

interface ToolSidebarProps {
  tool: ToolRegistration;
  workspaceId: string;
  currentPageId?: string;
}

export function ToolSidebar({ tool, workspaceId, currentPageId }: ToolSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["main"]));

  // Build navigation tree from tool pages
  const navigationItems = useMemo(() => {
    const pages = registry.listPages(tool.id);
    return PageResolver.buildNavigationTree(pages);
  }, [tool.id]);

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
          {/* Default/Home page */}
          <NavigationItem
            item={{
              id: 'default',
              title: 'Home',
              href: `/${tool.id}`,
              icon: File,
            }}
            workspaceId={workspaceId}
            toolId={tool.id}
            pathname={pathname}
            isActive={currentPageId === 'default' || (currentPageId === undefined && pathname.endsWith(`/${tool.id}`))}
          />

          {/* Registered pages */}
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              workspaceId={workspaceId}
              toolId={tool.id}
              pathname={pathname}
              isActive={currentPageId === item.id}
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

interface NavigationItemProps {
  item: NavigationItem;
  workspaceId: string;
  toolId: string;
  pathname: string;
  isActive?: boolean;
  openSections?: Set<string>;
  onToggleSection?: (id: string) => void;
}

function NavigationItem({
  item,
  workspaceId,
  toolId,
  pathname,
  isActive = false,
  openSections = new Set(),
  onToggleSection,
}: NavigationItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openSections.has(item.id);

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={() => onToggleSection?.(item.id)}>
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
              isActive={pathname === `/${workspaceId}/tools/${child.href}`}
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

### 5. Update `/apps/core/src/components/dashboard/headers/ToolHeader.tsx`
```typescript
"use client";

import { type ToolRegistration } from "@/types/registry";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ToolHeaderProps {
  tool: ToolRegistration;
  workspaceId: string;
  pageTitle?: string;
  pageDescription?: string;
}

export function ToolHeader({ tool, workspaceId, pageTitle, pageDescription }: ToolHeaderProps) {
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

## Validation Checklist

- [ ] Page registration creates pages correctly
- [ ] Page components render when their route matches
- [ ] Page sidebar/header overrides work
- [ ] Route parameters are extracted and passed
- [ ] Hidden pages don't appear in navigation
- [ ] Page titles and metadata are used correctly
- [ ] Fallback to tool defaults works
- [ ] Navigation tree built from pages correctly
- [ ] Breadcrumb navigation includes page titles
- [ ] Permission checking works for pages

## Usage Examples

```typescript
// Registering a page with the registry
registry.registerPage(
  createPage('contact-detail', 'crm', 'my-crm-package')
    .route('contacts/:id')
    .title('Contact Details')
    .description('View and edit contact information')
    .component(ContactDetailPage)
    .sidebar(ContactDetailSidebar)
    .permissions(['read:contacts'])
    .build()
);

// Registering a hidden page (e.g., for modals or popups)
registry.registerPage(
  createPage('contact-modal', 'crm', 'my-crm-package')
    .route('contacts/:id/modal')
    .component(ContactModal)
    .hidden(true)
    .build()
);
```

## Next Steps

After implementing page registration:
1. Build the first reference package (Phase 5)
2. Implement package initialization in layout (Unit 6.2)
3. Create comprehensive testing (Phase 7)