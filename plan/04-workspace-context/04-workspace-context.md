# Unit 2.2: Workspace Context Provider

## Folder: `04-workspace-context`

## Purpose
Create a workspace context system that provides workspace information and validation throughout the dashboard application. This ensures all components have access to the current workspace context and validates user permissions.

## Context
- The authentication system is in place from Unit 2.1
- Need to provide workspace context to all dashboard components
- Must validate user access to the requested workspace
- Dashboard routes should be wrapped with workspace context
- Workspace switching needs to update context and revalidate
- Components should be able to access workspace data without prop drilling

## Definition of Done
- [ ] Workspace context provider created with TypeScript types
- [ ] Workspace validation in layout prevents unauthorized access
- [ ] Dashboard layout uses workspace context wrapper
- [ ] Workspace switching updates context correctly
- [ ] Unauthorized access redirects to appropriate page
- [ ] Workspace data loading and error states handled
- [ ] Context provides workspace member role information
- [ ] Automatic workspace selection for users with single workspace

## Steps

### 1. Create Workspace Context
Set up React context with TypeScript for workspace state management.

### 2. Implement Workspace Provider
Create a provider component that fetches workspace data and validates access.

### 3. Create Workspace Layout
Implement a layout that wraps dashboard routes with workspace context.

### 4. Add Workspace Validation
Check user membership in the requested workspace before rendering content.

### 5. Update Routing Structure
Move dashboard routes under `[workspace]` dynamic segment.

### 6. Handle Workspace Switching
Implement logic to switch workspaces and update context.

### 7. Create Custom Hooks
Provide hooks for components to access workspace context easily.

## Files to Create

### 1. `/apps/core/src/context/workspace/WorkspaceProvider.tsx`
```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import type { Workspace, WorkspaceMember } from "@/lib/db/schema/core";

interface WorkspaceContextType {
  workspace: Workspace | null;
  memberRole: "owner" | "admin" | "member" | null;
  isLoading: boolean;
  error: string | null;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  hasPermission: (permission: "read" | "write" | "admin") => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [memberRole, setMemberRole] = useState<"owner" | "admin" | "member" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspace() {
      if (!session?.user?.id || !workspaceId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/workspaces/${workspaceId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Workspace not found");
          } else if (response.status === 403) {
            setError("Access denied to this workspace");
          } else {
            setError("Failed to load workspace");
          }
          return;
        }

        const data = await response.json();
        setWorkspace(data.workspace);
        setMemberRole(data.memberRole);
      } catch (err) {
        console.error("Failed to fetch workspace:", err);
        setError("An error occurred while loading the workspace");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspace();
  }, [session?.user?.id, workspaceId]);

  async function switchWorkspace(newWorkspaceId: string) {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/workspaces/${newWorkspaceId}/join`);

      if (!response.ok) {
        throw new Error("Failed to switch workspace");
      }

      router.push(`/${newWorkspaceId}/dashboard`);
      router.refresh();
    } catch (err) {
      console.error("Failed to switch workspace:", err);
      setError("Failed to switch workspace");
    }
  }

  function hasPermission(permission: "read" | "write" | "admin"): boolean {
    if (!memberRole) return false;

    switch (permission) {
      case "read":
        return true; // All members can read
      case "write":
        return memberRole === "admin" || memberRole === "owner";
      case "admin":
        return memberRole === "owner";
      default:
        return false;
    }
  }

  const contextValue: WorkspaceContextType = {
    workspace,
    memberRole,
    isLoading,
    error,
    switchWorkspace,
    hasPermission,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
```

### 2. `/apps/core/src/app/[workspaceId]/layout.tsx`
```typescript
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WorkspaceProvider } from "@/context/workspace/WorkspaceProvider";
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
    <WorkspaceProvider>
      <Suspense fallback={<div>Loading workspace...</div>}>
        <DashboardLayout>{children}</DashboardLayout>
      </Suspense>
    </WorkspaceProvider>
  );
}
```

### 3. `/apps/core/src/app/api/workspaces/[workspaceId]/route.ts`
```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/db/schema/core";
import { eq, and } from "drizzle-orm";

interface Params {
  params: {
    workspaceId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch workspace with user's membership
    const [workspace] = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        createdBy: workspaces.createdBy,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
        memberRole: workspaceMembers.role,
      })
      .from(workspaces)
      .leftJoin(
        workspaceMembers,
        and(
          eq(workspaceMembers.workspaceId, workspaces.id),
          eq(workspaceMembers.userId, session.user.id)
        )
      )
      .where(eq(workspaces.id, params.workspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (!workspace.memberRole) {
      return NextResponse.json(
        { error: "Access denied to this workspace" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        description: workspace.description,
        createdBy: workspace.createdBy,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      },
      memberRole: workspace.memberRole,
    });
  } catch (error) {
    console.error("Failed to fetch workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 4. `/apps/core/src/app/api/workspaces/[workspaceId]/join/route.ts`
```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/db/schema/core";
import { eq, and } from "drizzle-orm";

interface Params {
  params: {
    workspaceId: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of the workspace
    const [membership] = await db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, params.workspaceId),
          eq(workspaceMembers.userId, session.user.id)
        )
      )
      .limit(1);

    if (!membership) {
      return NextResponse.json(
        { error: "Access denied to this workspace" },
        { status: 403 }
      );
    }

    // Update user's session to include workspace
    // This will be handled by the client-side context update

    return NextResponse.json({
      success: true,
      workspaceId: params.workspaceId,
      role: membership.role,
    });
  } catch (error) {
    console.error("Failed to join workspace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 5. `/apps/core/src/app/api/workspaces/list/route.ts`
```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/db/schema/core";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all workspaces the user is a member of
    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaces)
      .innerJoin(
        workspaceMembers,
        eq(workspaceMembers.workspaceId, workspaces.id)
      )
      .where(eq(workspaceMembers.userId, session.user.id))
      .orderBy(workspaceMembers.joinedAt);

    return NextResponse.json({
      workspaces: userWorkspaces,
    });
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 6. `/apps/core/src/hooks/useWorkspaceList.ts`
```typescript
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { Workspace } from "@/lib/db/schema/core";

interface WorkspaceWithRole extends Workspace {
  role: "owner" | "admin" | "member";
  joinedAt: Date;
}

export function useWorkspaceList() {
  const { data: session } = useSession();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkspaces() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/workspaces/list");

        if (!response.ok) {
          throw new Error("Failed to fetch workspaces");
        }

        const data = await response.json();
        setWorkspaces(data.workspaces);
      } catch (err) {
        console.error("Failed to fetch workspaces:", err);
        setError("Failed to load workspaces");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkspaces();
  }, [session?.user?.id]);

  return { workspaces, isLoading, error };
}
```

## Files to Update

### 1. `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx`
```typescript
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/context/workspace/WorkspaceProvider";
import { useWorkspaceList } from "@/hooks/useWorkspaceList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronDown, Plus } from "lucide-react";

export function WorkspaceDropdown() {
  const router = useRouter();
  const { workspace: currentWorkspace } = useWorkspace();
  const { workspaces, isLoading } = useWorkspaceList();

  const handleSwitchWorkspace = useCallback(
    async (workspaceId: string) => {
      router.push(`/${workspaceId}/dashboard`);
      router.refresh();
    },
    [router]
  );

  if (!currentWorkspace) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Building2 className="h-4 w-4" />
          {currentWorkspace.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentWorkspace.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentWorkspace.description || "No description"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <DropdownMenuItem disabled>Loading workspaces...</DropdownMenuItem>
        ) : (
          workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => handleSwitchWorkspace(ws.id)}
              className="gap-2"
            >
              <div className="flex flex-1 items-center justify-between">
                <span>{ws.name}</span>
                {ws.id === currentWorkspace.id && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/workspaces/new")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 2. Move Dashboard Routes
Move all dashboard routes from `/dashboard/*` to `/[workspaceId]/dashboard/*`:
- `/app/dashboard/page.tsx` → `/app/[workspaceId]/dashboard/page.tsx`
- `/app/dashboard/settings/page.tsx` → `/app/[workspaceId]/dashboard/settings/page.tsx`
- etc.

### 3. Update `/apps/core/src/app/dashboard/page.tsx`
Create a redirect page that selects the appropriate workspace:
```typescript
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRedirect() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // TODO: Implement logic to select default workspace
  // For now, redirect to workspace selection
  redirect("/workspaces");
}
```

## Validation Checklist
- [ ] Workspace context provides workspace data
- [ ] Unauthorized workspace access redirects appropriately
- [ ] Workspace switching updates context correctly
- [ ] Components can access workspace via useWorkspace hook
- [ ] Permission checking works correctly
- [ ] Loading states display properly
- [ ] Error handling for invalid workspace IDs
- [ ] Session refreshes after workspace switch

## Testing Workflow
1. Log in with user account
2. Navigate to a specific workspace URL
3. Verify workspace context loads correctly
4. Try accessing workspace you're not a member of
5. Switch workspaces using dropdown
6. Check permission-based UI elements

## Common Issues and Solutions
1. **Context Not Updating**: Ensure router.refresh() is called after workspace switch
2. **Permission Errors**: Check that workspace membership is properly validated
3. **Infinite Reloads**: Verify useEffect dependencies are correct
4. **Type Errors**: Ensure all types are properly exported

## Next Steps
After workspace context is implemented:
1. Build the registry system for package management (Phase 3)
2. Implement dynamic routing for tools (Phase 4)
3. Create the first package implementation (Phase 5)