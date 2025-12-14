# Unit 2.2: Authentication Implementation

## Folder: `03-authentication`

## Purpose
Implement a comprehensive authentication system using better-auth with email/password authentication, workspace management, and session handling, following ydtb project patterns.

## Context
- No current authentication implementation in the application
- Following ydtb project's better-auth implementation patterns
- Need email/password authentication with secure session management
- Must support workspace switching after login using better-auth organization plugin
- Users should be able to belong to multiple workspaces
- Sessions need to track both user and current workspace context
- Workspace state stored in session with `activeOrganizationId` field
- Authentication should integrate with the database schema from Unit 2.1
- better-auth will manage users and sessions with its own schema (auto-created)
- Environment variables handled through the Hybrid Approach from Unit 1.2

## Reference Implementation
For reference, you can view the existing passkey implementation at:
- `/Users/john/projects/ydtb-old` - Complete better-auth implementation with passkeys
- Key files to review:
  - `src/server/better-auth/config.ts` - Server configuration
  - `src/server/better-auth/client.ts` - Client configuration
  - `src/app/(auth)/login/page.tsx` - Login component with passkey support
  - `src/components/auth/auth-tabs.tsx` - Auth UI component example

## Definition of Done
- [ ] better-auth configured with drizzle adapter for PostgreSQL
- [ ] Email/password authentication working with secure password hashing
- [ ] **Passkey authentication enabled with @better-auth/passkey plugin**
- [ ] Passkey login button integrated in login page
- [ ] **Passkey registration flow implemented**
- [ ] Individual auth pages: login, signup, forgot-password, reset-password
- [ ] Password reset functionality implemented with better-auth
- [ ] Session management with 7-day expiration
- [ ] Auth component animated with framer-motion
- [ ] Workspace dropdown updated to use real data
- [ ] Automatic redirection for unauthenticated users
- [ ] Session hooks working on client and server
- [ ] better-auth tables auto-generated in database
- [ ] **Passkey database schema properly configured**
- [ ] **Organization plugin configured for workspace switching**
- [ ] **Workspace switching API endpoints working**
- [ ] **Client-side workspace context updates correctly**

## Steps

### 1. Install Dependencies
Install better-auth and required dependencies using Bun:
```bash
bun add better-auth @better-auth/passkey @better-auth/organization framer-motion
bun add -d @types/better-auth
```

**Notes**:
- `@better-auth/passkey` is required for passkey authentication support
- `@better-auth/organization` is required for workspace switching functionality
- `framer-motion` is required for the auth component animations

### 2. Configure better-auth Server
Create `apps/core/src/server/auth.ts` following ydtb pattern:
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { organization } from "@better-auth/organization";
import { env } from "@/env";  // From Unit 1.2
import { db } from "@/server/db";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      console.log("Password reset requested for:", user.email);
      console.log("Reset URL:", url);
      // TODO: Implement actual email sending
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    passkey({
      // Passkey configuration
      // Use default settings for WebAuthn
    }),
    organization({
      // Map our workspace schema to organization plugin
      schema: {
        organization: {
          tableName: "workspaces",
          fields: {
            name: "name",
            slug: "slug", // Add slug field to workspaces table
            logo: "logo",
            metadata: "metadata",
          },
        },
        member: {
          tableName: "workspace_members",
          fields: {
            organizationId: "workspaceId",
            userId: "userId",
            role: "role",
            status: "status",
          },
        },
      },
      // Allow users to create their own organizations
      allowUserToCreateOrganization: true,
    }),
  ],
});
```

### 3. Configure better-auth Client
Create `apps/core/src/lib/auth-client.ts`:
```typescript
import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import { organizationClient } from "@better-auth/organization/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [passkeyClient(), organizationClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgotPassword,
  resetPassword,
} = authClient;

// Organization-specific exports
export const {
  setActiveOrganization,
  setActiveTeam,
  useActiveOrganization,
  useActiveTeam,
  useListOrganizations,
  useOrganizationMembers,
} = authClient.organization;

export type Session = typeof authClient.$Infer.Session;
```

### 4. Create API Route Handler
Create `apps/core/src/app/api/auth/[...all]/route.ts`:
```typescript
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

### 5. Create Server Session Helper
Create `apps/core/src/server/auth-session.ts`:
```typescript
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/server/auth";

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
});

export const requireAuth = cache(async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
});
```

### 6. Create Authentication Pages
Create separate authentication pages using the UI components located at `/Users/john/projects/ydtb/plan/03-authentication/login/`.

**Reference Implementation**: See `/Users/john/projects/ydtb/plan/03-authentication/AUTH-UI-COMPONENTS.md` for detailed UI patterns and better-auth integration examples.

#### 6.1 Create Login Page
**File**: `/apps/core/src/app/(auth)/login/page.tsx`
- Convert the `login.tsx` component to use Next.js router instead of wouter
- Integrate with better-auth `signIn.email()` method
- Add passkey login using `signIn.passkey()`
- Include error handling and loading states
- Link to `/forgot-password` and `/signup`

#### 6.2 Create Signup Page
**File**: `/apps/core/src/app/(auth)/signup/page.tsx`
- Convert the `signup.tsx` component to use Next.js router
- Integrate with better-auth `signUp.email()` method
- Include full name field
- Handle workspace creation after signup (separate unit)
- Link back to `/login`

#### 6.3 Create Forgot Password Page
**File**: `/apps/core/src/app/(auth)/forgot-password/page.tsx`
- Convert the `forgot.tsx` component to use Next.js router
- Integrate with better-auth `forgotPassword()` method
- Show success state after sending reset link
- Link back to `/login`

#### 6.4 Create Password Reset Page
**File**: `/apps/core/src/app/(auth)/reset-password/page.tsx`
- Convert the `reset.tsx` component to use Next.js router
- Get token from URL search params
- Integrate with better-auth `resetPassword()` method
- Validate password confirmation
- Link back to `/login` after success

### 7. Implement Workspace Switching
Create a workspace context provider and hooks:

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

Create `/apps/core/src/context/workspace/workspace-provider.tsx`:
```typescript
"use client";

import { useState } from "react";
import {
  useActiveOrganization,
  useListOrganizations,
  setActiveOrganization,
} from "@/lib/auth-client";
import { WorkspaceContext } from "./workspace-context";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: Props) {
  const { data: activeWorkspace, isLoading: isActiveLoading } = useActiveOrganization();
  const { data: workspaces, isLoading: isListLoading, refetch } = useListOrganizations();
  const [isSwitching, setIsSwitching] = useState(false);

  const switchWorkspace = async (workspaceId: string) => {
    setIsSwitching(true);
    try {
      await setActiveOrganization({
        organizationId: workspaceId,
      });
      // The context will automatically update through the useActiveOrganization hook
    } catch (error) {
      console.error("Failed to switch workspace:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  const refreshWorkspaces = () => {
    refetch();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace: activeWorkspace ?? null,
        workspaces: workspaces ?? null,
        isLoading: isActiveLoading || isListLoading || isSwitching,
        switchWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
```

### 9. Create Session Provider
Create session provider and context in the context folder:

Create `/apps/core/src/context/session/session-provider.tsx`:
```typescript
"use client";

import { SessionProvider as BetterAuthSessionProvider } from "better-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  return <BetterAuthSessionProvider>{children}</BetterAuthSessionProvider>;
}
```

Update `/apps/core/src/context/providers.tsx` (already exists) to include the auth providers:
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

The providers.tsx file is already imported in the root layout, so no additional changes are needed there.

### 10. Create Workspace Server Components and Actions
Create server-side functions for workspace management using better-auth's organization plugin and Next.js patterns.

#### 10.1 Create Workspace Actions
Create `/apps/core/src/server/actions/workspace.ts`:
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { workspaces, workspaceMembers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateWorkspaceId } from "@/lib/utils/workspace";
import { redirect } from "next/navigation";

export async function createWorkspace(data: {
  name: string;
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
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
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
```

#### 10.2 Update Existing Workspace Dropdown
Update the existing `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx` to integrate with better-auth:

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
  const { activeWorkspace, workspaces, isLoading, switchWorkspace } = useWorkspace();

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
      <Button variant="outline" className="h-10">
        No Workspaces
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

### 11. Implement Layout-Level Authentication
Use Next.js layouts and server components to handle authentication, eliminating the need for middleware.

#### 11.1 Create Auth Layout Wrapper
Create `/apps/core/src/components/auth/auth-guard.tsx`:
```typescript
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function AuthGuard({
  children,
  redirectTo = "/login"
}: AuthGuardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
```

#### 11.2 Create Dashboard Layout
Create or update `/apps/core/src/app/(dashboard)/layout.tsx`:
```typescript
import {AuthGuard} from "@/components/auth/auth-guard";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
```

#### 11.3 Server-Side Session Helper
Create `/apps/core/src/lib/session.ts`:
```typescript
import { auth } from "@/server/auth";
import { cache } from "react";

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user;
});
```

#### 11.4 Protected Page Pattern
Example of a protected page using server components:
```typescript
import { getCurrentUser } from "@/lib/session";
import { UserWelcome } from "@/components/dashboard/user-welcome";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    // This shouldn't happen due to AuthGuard, but as a safety net
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <UserWelcome user={user} />
      {/* Rest of dashboard content */}
    </div>
  );
}
```

#### 11.5 Client-Side Protected Component
For client components that need authentication:
```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedComponent({
  children,
  fallback
}: ProtectedComponentProps) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return fallback || <div>Please log in</div>;
  }

  return <>{children}</>;
}
```

## Files to Create

### 1. `/apps/core/src/server/auth.ts`
Already created in step 2.

### 2. `/apps/core/src/lib/auth-client.ts`
Already created in step 3.

### 3. `/apps/core/src/app/api/auth/[...all]/route.ts`
Already created in step 4.

### 4. `/apps/core/src/server/auth-session.ts`
Already created in step 5.

### 5. `/apps/core/src/app/(auth)/login/page.tsx`
Already created in step 6.1 - Login page with email/password and passkey support.

### 6. `/apps/core/src/app/(auth)/signup/page.tsx`
Already created in step 6.2 - Signup page with full name, email, and password.

### 7. `/apps/core/src/app/(auth)/forgot-password/page.tsx`
Already created in step 6.3 - Forgot password page with email input.

### 8. `/apps/core/src/app/(auth)/reset-password/page.tsx`
Already created in step 6.4 - Password reset page with new password form.

### 9. `/apps/core/src/context/workspace/workspace-context.tsx`
Already created in step 7 - Workspace context for workspace switching.

### 10. `/apps/core/src/context/session/session-provider.tsx`
Already created in step 9 - Session provider wrapper.

### 11. `/apps/core/src/server/actions/workspace.ts`
Already created in step 10.1 - Server actions for workspace management.

### 12. `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx`
Already updated in step 10.2 - Integrated existing workspace dropdown with better-auth.

### 13. `/apps/core/src/components/auth/auth-guard.tsx`
Already created in step 11.1 - Auth guard component for layouts.

### 14. `/apps/core/src/app/(dashboard)/layout.tsx`
Already created in step 11.2 - Dashboard layout with auth protection.

### 15. `/apps/core/src/lib/session.ts`
Already created in step 11.3 - Server-side session helpers.


## Files to Update

### 1. `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx`
Already updated in step 10.2 to integrate with better-auth's organization plugin.

Key changes:
- Replaced mock data with real workspace data from `useWorkspace` hook
- Added loading state with spinner
- Integrated workspace switching via `switchWorkspace` function
- Display workspace roles from better-auth organization data
- Maintained existing UI design and search functionality

### 2. Update `/apps/core/package.json`
Add better-auth dependencies:
```json
{
  "dependencies": {
    "better-auth": "^1.4.3",
    "@better-auth/passkey": "^1.4.3",
    "@better-auth/organization": "^1.4.3",
    "framer-motion": "^10.16.4",
    "zod": "^3.22.4",
    "lucide-react": "^0.263.1"
  }
}
```

Notes:
- drizzle-adapter is included in better-auth package. No separate installation needed.
- `@better-auth/passkey` is required for passkey support.
- `@better-auth/organization` is required for workspace switching functionality.
- `framer-motion` is required for the auth component animations.
- `lucide-react` is used for icons.

## Validation Checklist

- [ ] better-auth installed and configured
- [ ] Database tables auto-generated by better-auth
- [ ] User can register with email/password
- [ ] User can login with correct credentials
- [ ] Invalid credentials show error message
- [ ] Password validation works (min 8 chars, uppercase, lowercase, number, special)
- [ ] Auth pages animated with framer-motion
- [ ] Navigation between auth pages works smoothly
- [ ] Password reset email sends with reset link
- [ ] Password reset flow completes successfully
- [ ] **User can add a passkey after registration**
- [ ] **User can login with passkey**
- [ ] **Passkey authentication works on supported devices**
- [ ] Workspace is created on registration via API
- [ ] User is automatically added as owner of workspace
- [ ] Session persists across page refreshes (7 days)
- [ ] Protected routes redirect to login
- [ ] Authenticated users can't access auth page
- [ ] Workspace dropdown shows real workspaces from organization plugin
- [ ] Workspace switching updates session correctly
- [ ] Active workspace persists across page refreshes
- [ ] Auth client hooks (useSession, useActiveOrganization) working

## Testing Workflow

```bash
# 1. Install dependencies
bun add better-auth @better-auth/passkey @better-auth/organization framer-motion zod lucide-react

# 2. Generate better-auth database tables
npx @better-auth/cli generate
# Or push directly to database:
npx @better-auth/cli migrate

# 3. Start development server
bun run dev

# 4. Test authentication flow
# - Visit /login
# - Test login with email/password
# - Test passkey login on supported devices
# - Navigate to /signup and test registration
# - Verify user creation and redirect to /dashboard
# - Test navigation between pages with smooth animations
# - Test forgot password flow from /forgot-password

# 5. Test protected routes
# - Try accessing /dashboard while logged out
# - Verify redirect to /login via AuthGuard component
# - Check session persistence after refresh
# - Test layout-level authentication in dashboard layout

# 6. Test passkey functionality
# - Register a new user
# - Add a passkey to the account (create a passkey management UI)
# - Login using the passkey button
# - Verify authentication without password
# - Test on devices with biometric support

# 7. Test workspace functionality
# - Verify workspace dropdown shows user's workspaces
# - Check role display (owner, admin, member)
# - Test switching between workspaces
# - Verify active workspace persists in session
# - Test workspace context updates across components
```

## Common Issues and Solutions

1. **Session Not Persisting**:
   - Verify `BETTER_AUTH_SECRET` is set in .env.local
   - Check that `NEXT_PUBLIC_APP_URL` matches your local URL

2. **Database Adapter Errors**:
   - Ensure database connection is working (test with `db.select().from(workspaces)`)
   - Verify PostgreSQL provider is set in drizzle adapter

3. **AuthGuard Not Working**:
   - Ensure the dashboard layout wraps children with AuthGuard
   - Check that server-side session fetching is working properly
   - Verify redirect URL is correct in AuthGuard props

4. **Environment Variables**:
   - Import from `@/env` (from Unit 1.2)
   - Verify all required env vars are in .env.example

5. **Client/Server Mismatch**:
   - Ensure authClient baseURL matches server URL
   - Check CORS settings if using different domains

6. **Passkey Issues**:
   - Ensure HTTPS is enabled (passkeys require secure context)
   - Verify user agent supports WebAuthn API
   - Check that `@better-auth/passkey` plugin is installed on both client and server
   - Passkeys require user verification (biometrics, PIN, etc.)

## Passkey Database Schema

The `@better-auth/passkey` plugin will automatically create a `passkey` table in your PostgreSQL database with the following schema:

```sql
CREATE TABLE passkey (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  public_key TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  credential_id TEXT NOT NULL UNIQUE,
  counter INTEGER NOT NULL DEFAULT 0,
  device_type TEXT NOT NULL,
  backed_up BOOLEAN NOT NULL DEFAULT false,
  transports TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  aaguid TEXT
);
```

**Key Fields**:
- `credential_id` - Unique identifier for the passkey credential
- `public_key` - Cryptographic public key for verification
- `counter` - Monitors for cloned credentials (replay attacks)
- `device_type` - Type of authenticator (e.g., "platform", "cross-platform")
- `backed_up` - Whether the passkey is synced to cloud storage
- `aaguid` - Authenticator Attestation GUID for device identification

The table will be automatically created when you run the better-auth migration or when the server starts for the first time.

### Organization Database Requirements

The organization plugin requires the following updates to your database:

1. **Add to workspaces table**:
```sql
ALTER TABLE workspaces ADD COLUMN slug VARCHAR(255) UNIQUE NOT NULL;
ALTER TABLE workspaces ADD COLUMN logo TEXT;
ALTER TABLE workspaces ADD COLUMN metadata JSONB;
```

2. **Add to workspace_members table**:
```sql
ALTER TABLE workspace_members ADD COLUMN status VARCHAR(50) DEFAULT 'active';
```

3. **Session table will be updated automatically** to include:
```sql
ALTER TABLE session ADD COLUMN "activeOrganizationId" TEXT;
ALTER TABLE session ADD COLUMN "activeTeamId" TEXT;
```

## Integration Points

- **Unit 1.2**: Environment variables from `@/env`
- **Unit 2.1**: Database schema and connection from `@/server/db`
- **Unit 6.2**: Package database registry will extend authentication

## Next Steps

After authentication is working:
1. Implement workspace context provider for automatic workspace switching
2. Create dynamic routing system with workspace-scoped URLs
3. Build the registry system for package management
4. Add social providers (GitHub, Google) if needed