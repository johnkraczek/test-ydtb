# Unit 2.4: Workspace Management

## Purpose
Implement workspace management functionality using better-auth's organization plugin, including workspace context provider, workspace switching, and integration with existing workspace UI components.

## Context
- Must have Unit 2.2 (Core Authentication Setup) completed for organization plugin
- Must have Unit 2.3 (Authentication UI Pages) completed for user authentication
- Requires database schema updates to support organization plugin fields
- Updates existing WorkspaceDropdown component to use real data

## Definition of Done
- [ ] Organization plugin configured with workspace schema mapping
- [ ] Workspace context created with hooks for workspace state
- [ ] Workspace provider integrated in app providers
- [ ] Existing WorkspaceDropdown updated to use better-auth data
- [ ] Workspace switching API endpoints working
- [ ] Server actions for workspace management created
- [ ] Database schema updated with required organization fields
- [ ] Workspace state persists across page refreshes
- [ ] Loading states and error handling implemented

## Steps

### 1. Update Database Schema for Organization Plugin

First, update the database schema to support better-auth's organization plugin requirements:

Create migration file or run SQL directly:

```sql
-- Add to workspaces table
ALTER TABLE workspaces ADD COLUMN slug VARCHAR(255) UNIQUE NOT NULL DEFAULT '';
ALTER TABLE workspaces ADD COLUMN logo TEXT;
ALTER TABLE workspaces ADD COLUMN metadata JSONB DEFAULT '{}';

-- Add to workspace_members table
ALTER TABLE workspace_members ADD COLUMN status VARCHAR(50) DEFAULT 'active';

-- Session table will be updated automatically by better-auth to include:
-- ALTER TABLE session ADD COLUMN "activeOrganizationId" TEXT;
-- ALTER TABLE session ADD COLUMN "activeTeamId" TEXT;
```

### 2. Create Workspace Context
Create `/apps/core/src/context/workspace/workspace-context.tsx`:
```typescript
"use client";

import { createContext, useContext } from "react";
import type { Organization } from "@/lib/auth-client";

interface WorkspaceContextType {
  activeWorkspace: Organization | null;
  workspaces: Organization[] | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => void;
  createWorkspace: (data: { name: string; slug?: string; description?: string }) => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
```

### 3. Create Workspace Provider
Create `/apps/core/src/context/workspace/workspace-provider.tsx`:
```typescript
"use client";

import { useState, useCallback } from "react";
import {
  useActiveOrganization,
  useListOrganizations,
  setActiveOrganization,
  createOrganization as authCreateOrganization,
} from "@/lib/auth-client";
import { WorkspaceContext } from "./workspace-context";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: Props) {
  const { data: activeWorkspace, isLoading: isActiveLoading } = useActiveOrganization();
  const { data: workspaces, isLoading: isListLoading, refetch } = useListOrganizations();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const switchWorkspace = useCallback(async (workspaceId: string) => {
    setIsSwitching(true);
    try {
      await setActiveOrganization({
        organizationId: workspaceId,
      });
      // Refresh current page to update workspace-scoped data
      router.refresh();
    } catch (error) {
      console.error("Failed to switch workspace:", error);
    } finally {
      setIsSwitching(false);
    }
  }, [router]);

  const refreshWorkspaces = useCallback(() => {
    refetch();
  }, [refetch]);

  const createWorkspace = useCallback(async (data: {
    name: string;
    slug?: string;
    description?: string
  }) => {
    try {
      const result = await authCreateOrganization({
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          description: data.description,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to create workspace");
      }

      // Refresh the workspaces list
      refetch();

      // Switch to the new workspace
      if (result.data?.id) {
        await switchWorkspace(result.data.id);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  }, [refetch, switchWorkspace, router]);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace: activeWorkspace ?? null,
        workspaces: workspaces ?? null,
        isLoading: isActiveLoading || isListLoading || isSwitching,
        switchWorkspace,
        refreshWorkspaces,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
```

### 4. Update Providers Configuration
Update `/apps/core/src/context/providers.tsx` to include WorkspaceProvider:
```typescript
"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "~/context/theme/use-theme-color";
import { ThemePatternProvider } from "~/context/theme/use-theme-pattern";
import { SessionProvider } from "~/context/session/session-provider";
import { WorkspaceProvider } from "~/context/workspace/workspace-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeColorProvider>
        <ThemePatternProvider>
          <SessionProvider>
            <WorkspaceProvider>
              {children}
            </WorkspaceProvider>
          </SessionProvider>
        </ThemePatternProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  );
}
```

### 5. Update Existing Workspace Dropdown
Update `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx`:
```typescript
"use client";

import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, Plus, Search, Zap, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useWorkspace } from "~/context/workspace/workspace-context";

export function WorkspaceDropdown() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    activeWorkspace,
    workspaces,
    isLoading,
    switchWorkspace,
    createWorkspace
  } = useWorkspace();

  if (isLoading) {
    return (
      <div className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-md transition-all shadow-sm hover:shadow-md h-10 overflow-hidden pr-2">
        <div className="flex items-center justify-center px-3">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <Button
        variant="outline"
        className="h-10"
        onClick={() => {
          // Open create workspace dialog or navigate
          window.location.href = "/workspaces/new";
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Workspace
      </Button>
    );
  }

  const activeWorkspaceData = workspaces.find(ws => ws.id === activeWorkspace?.id) || workspaces[0];
  const initials = activeWorkspaceData?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WS';

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-md transition-all shadow-sm hover:shadow-md h-10 overflow-hidden pr-2">
          <div className="flex h-full w-10 items-center justify-center bg-primary font-bold text-sm text-primary-foreground transition-all">
            {initials}
          </div>
          <div className="flex flex-col text-left ml-2 mr-2 justify-center">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-none group-hover:text-primary transition-colors">
              {activeWorkspaceData?.name || "Select Workspace"}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-slate-500 text-[10px] leading-none">
                {activeWorkspaceData?.role || 'Member'}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px] p-0" sideOffset={8}>
        {/* Back to Agency View */}
        <div className="p-2 border-b border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 h-9 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agency View
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              className="w-full pl-8 h-9 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              placeholder="Find workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Workspaces List */}
        <div className="p-2 max-h-[240px] overflow-y-auto">
          <DropdownMenuLabel className="text-xs text-slate-500 font-medium px-2 py-1.5">
            Your Workspaces
          </DropdownMenuLabel>
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map((ws) => {
              const wsInitials = ws.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WS';
              const isActive = ws.id === activeWorkspace?.id;

              return (
                <DropdownMenuItem
                  key={ws.id}
                  className="flex items-center gap-3 p-2 cursor-pointer rounded-md"
                  onClick={() => switchWorkspace(ws.id)}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-xs text-white ${isActive ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-slate-600'}`}>
                    {wsInitials}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`font-medium text-sm ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {ws.name}
                    </span>
                    <span className="text-xs text-slate-400">{ws.role}</span>
                  </div>
                  {isActive && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              No workspaces found
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Create Workspace */}
        <div className="p-2">
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20"
            size="sm"
            onClick={() => {
              window.location.href = "/workspaces/new";
            }}
          >
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 6. Create Server Actions for Workspace Management
Create `/apps/core/src/server/actions/workspace.ts`:
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { workspaces, workspaceMembers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createWorkspace(data: {
  name: string;
  slug?: string;
  description?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's createOrganization method
    const result = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        metadata: {
          description: data.description,
        },
      },
    });

    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw new Error("Failed to create workspace");
  }
}

export async function getUserWorkspaces() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  try {
    // Use better-auth's listOrganizations method
    const workspaces = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return workspaces;
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);
    return [];
  }
}

export async function switchWorkspace(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's setActiveOrganization method
    await auth.api.setActiveOrganization({
      body: {
        organizationId: workspaceId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to switch workspace:", error);
    throw new Error("Failed to switch workspace");
  }
}

export async function getWorkspaceMembers(workspaceId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's getOrganizationMembers method
    const members = await auth.api.getOrganizationMembers({
      headers: await headers(),
      query: {
        organizationId: workspaceId,
      },
    });

    return members;
  } catch (error) {
    console.error("Failed to fetch workspace members:", error);
    return [];
  }
}

export async function inviteUserToWorkspace(data: {
  workspaceId: string;
  email: string;
  role: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  try {
    // Use better-auth's inviteUser method
    const result = await auth.api.inviteUser({
      body: {
        email: data.email,
        role: data.role,
        organizationId: data.workspaceId,
      },
    });

    revalidatePath(`/workspaces/${data.workspaceId}/members`);
    return result;
  } catch (error) {
    console.error("Failed to invite user:", error);
    throw new Error("Failed to invite user to workspace");
  }
}
```

### 7. Create Workspace Creation Page (Optional)
Create `/apps/core/src/app/workspaces/new/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWorkspace } from "~/context/workspace/workspace-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Building } from "lucide-react";

export default function NewWorkspacePage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { createWorkspace } = useWorkspace();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createWorkspace({
        name,
        slug: slug || undefined,
        description: description || undefined,
      });

      // Workspace provider handles redirection
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building className="h-8 w-8" />
              Create New Workspace
            </h1>
            <p className="text-muted-foreground mt-2">
              Set up a new workspace to organize your projects and team
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-lg">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Workspace Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    // Auto-generate slug if empty
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  placeholder="My Workspace"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-workspace"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be part of your workspace URL: app.ydtb.com/{slug}
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description of your workspace"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Workspace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

## Files to Create

1. `/apps/core/src/context/workspace/workspace-context.tsx` - Workspace context definition
2. `/apps/core/src/context/workspace/workspace-provider.tsx` - Workspace provider implementation
3. `/apps/core/src/server/actions/workspace.ts` - Server actions for workspace operations
4. `/apps/core/src/app/workspaces/new/page.tsx` - Workspace creation page (optional)

## Files to Update

1. `/apps/core/src/context/providers.tsx` - Add WorkspaceProvider
2. `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx` - Integrate with better-auth
3. Database schema - Add slug, logo, metadata, status fields
4. `/apps/core/src/server/auth.ts` - Ensure organization plugin is properly configured (done in Unit 2.2)

## Validation Checklist

- [ ] Database schema updated with required fields
- [ ] Workspace context and provider created without errors
- [ ] WorkspaceProvider integrated in providers.tsx
- [ ] Existing WorkspaceDropdown shows real workspace data
- [ ] Workspace switching updates session and UI
- [ ] Loading states displayed during workspace operations
- [ ] Error handling for failed operations
- [ ] Workspace creation through server action works
- [ ] Active workspace persists across page refreshes
- [ ] Workspace member roles displayed correctly
- [ ] Search functionality works in workspace dropdown

## Testing

```bash
# 1. Update database schema
# Run migrations or execute SQL directly

# 2. Start development server
bun run dev

# 3. Test workspace functionality
# - Login and create a new workspace
# - Verify workspace appears in dropdown
# - Switch between workspaces
# - Refresh page and verify active workspace persists
# - Test search in workspace dropdown

# 4. Test server actions
# - Create workspace through API
# - Switch workspace through API
# - Fetch workspace members

# 5. Test error scenarios
# - Try to switch to non-existent workspace
# - Create workspace with duplicate slug
# - Access workspace features without authentication
```

## Common Issues and Solutions

1. **Organization Plugin Not Working**:
   - Verify plugin is configured in auth.ts
   - Check database schema has required fields
   - Ensure API routes include organization endpoints

2. **Workspace Switching Not Persisting**:
   - Check that session table has activeOrganizationId column
   - Verify setActiveOrganization is called correctly
   - Ensure WorkspaceProvider wraps app properly

3. **Permission Errors**:
   - Check user has proper role in workspace
   - Verify workspace membership exists
   - Check that auth session is valid

4. **Slug Conflicts**:
   - Add uniqueness validation for workspace slugs
   - Auto-generate unique slugs on creation

## Integration Points

- **Unit 2.2**: Uses organization plugin from auth configuration
- **Unit 2.3**: Workspace creation flow after user signup
- **Unit 2.5**: Workspace-aware route protection
- **Existing Components**: Updates WorkspaceDropdown component
- **Database**: Extends workspace and workspace_members tables