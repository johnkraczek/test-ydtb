# Unit 3.5: Authentication Protection

## Purpose
Implement route-level and component-level authentication protection using Next.js layouts, server components, and client-side guards to ensure only authenticated users can access protected resources.

## Context
- Must have Unit 2.2 (Core Authentication Setup) completed for session helpers
- Must have Unit 2.3 (Authentication UI Pages) completed for login/signup pages
- Must have Unit 2.4 (Workspace Management) completed for workspace context
- Uses Next.js 13+ app router patterns for route protection

## Definition of Done
- [ ] AuthGuard component created for layout-level protection
- [ ] Dashboard layout wrapped with authentication protection
- [ ] Server-side session helpers for protected routes
- [ ] Protected route patterns implemented
- [ ] Client-side protected component for dynamic routes
- [ ] Automatic redirection for unauthenticated users
- [ ] Loading states during authentication checks
- [ ] Error handling for authentication failures
- [ ] Workspace-aware protected routes (when needed)

## Steps

### 1. Create AuthGuard Component with Error Handling
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
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect(redirectTo);
    }

    return <>{children}</>;
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("AuthGuard failed:", error);
    redirect(redirectTo);
  }
}
```

### 2. Create Enhanced Server Session Helper with Error Handling
Create `/apps/core/src/lib/session.ts`:
```typescript
import { auth } from "@/server/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

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

export const getCurrentUser = cache(async () => {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
});

export const requireAuth = cache(async (redirectTo?: string) => {
  try {
    const session = await getSession();

    if (!session?.user) {
      redirect(redirectTo || "/login");
    }

    return session;
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Auth check failed:", error);
    redirect(redirectTo || "/login");
  }
});

export const requireWorkspace = cache(async () => {
  try {
    const session = await requireAuth();

    if (!session.activeOrganizationId) {
      redirect("/workspaces");
    }

    return session;
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Workspace check failed:", error);
    redirect("/workspaces");
  }
});
```

### 3. Create Dashboard Layout with Protection
Create or update `/apps/core/src/app/(dashboard)/layout.tsx`:
```typescript
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

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

### 4. Update Auth Layout to Redirect Authenticated Users
Update `/apps/core/src/app/(auth)/layout.tsx`:
```typescript
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AuthProvider } from "~/context/auth/auth-provider";

export const metadata: Metadata = {
  title: "Authentication | YDTB",
  description: "Sign in or create an account to get started",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect authenticated users away from auth pages
  try {
    const user = await getCurrentUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {
    // If we can't verify user state, allow access to auth pages
    console.error("Failed to check auth state in layout:", error);
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
```

### 5. Create Client-Side Protected Component
Create `/apps/core/src/components/auth/protected-component.tsx`:
```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedComponent({
  children,
  fallback,
  redirectTo = "/login"
}: ProtectedComponentProps) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push(redirectTo);
    }
  }, [session, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

### 6. Create Workspace-Aware Protected Component
Create `/apps/core/src/components/auth/workspace-protected-component.tsx`:
```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { useWorkspace } from "~/context/workspace/workspace-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface WorkspaceProtectedComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function WorkspaceProtectedComponent({
  children,
  fallback,
  redirectTo = "/workspaces"
}: WorkspaceProtectedComponentProps) {
  const { data: session, isLoading: isSessionLoading } = useSession();
  const { activeWorkspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login");
      return;
    }

    if (!isWorkspaceLoading && !activeWorkspace && session) {
      // User is logged in but has no workspace
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [session, activeWorkspace, isSessionLoading, isWorkspaceLoading, router, redirectTo]);

  const isLoading = isSessionLoading || isWorkspaceLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return fallback || null;
  }

  if (!activeWorkspace) {
    return (
      fallback || (
        <Alert className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to select or create a workspace to continue.
          </AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}
```

### 7. Create Middleware for Additional Protection (Optional)
Create `/apps/core/src/middleware.ts`:
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/server/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protected routes
  const isProtectedRoute = pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/workspaces") ||
                          pathname.startsWith("/settings");

  // Auth routes (redirect if authenticated)
  const isAuthRoute = pathname.startsWith("/login") ||
                     pathname.startsWith("/signup") ||
                     pathname.startsWith("/forgot-password") ||
                     pathname.startsWith("/reset-password");

  if (isProtectedRoute && !session?.user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### 8. Example Protected Server Page
Create `/apps/core/src/app/(dashboard)/dashboard/page.tsx`:
```typescript
import { getCurrentUser, requireWorkspace } from "@/lib/session";
import { UserWelcome } from "@/components/dashboard/user-welcome";
import { WorkspaceStats } from "@/components/dashboard/workspace-stats";

export default async function DashboardPage() {
  // This will redirect if not authenticated
  const user = await getCurrentUser();

  // This will redirect if no active workspace
  const workspaceSession = await requireWorkspace();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      <UserWelcome user={user!} />

      <WorkspaceStats workspaceId={workspaceSession.activeOrganizationId!} />

      {/* Rest of dashboard content */}
    </div>
  );
}
```

### 9. Example Protected Client Page
Create `/apps/core/src/app/(dashboard)/settings/profile/page.tsx`:
```typescript
"use client";

import { ProtectedComponent } from "~/components/auth/protected-component";
import { UserProfileForm } from "~/components/settings/user-profile-form";

export default function ProfileSettingsPage() {
  return (
    <ProtectedComponent>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <UserProfileForm />
      </div>
    </ProtectedComponent>
  );
}
```

### 10. Example Workspace-Scoped Protected Page
Create `/apps/core/src/app/(dashboard)/projects/page.tsx`:
```typescript
"use client";

import { WorkspaceProtectedComponent } from "~/components/auth/workspace-protected-component";
import { ProjectList } from "~/components/projects/project-list";
import { CreateProjectButton } from "~/components/projects/create-project-button";

export default function ProjectsPage() {
  return (
    <WorkspaceProtectedComponent>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage your workspace projects
            </p>
          </div>
          <CreateProjectButton />
        </div>

        <ProjectList />
      </div>
    </WorkspaceProtectedComponent>
  );
}
```

### 11. Create Higher-Order Protection Hook with Error Handling
Create `/apps/core/src/hooks/use-require-auth.ts`:
```typescript
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth(redirectTo = "/login") {
  const { data: session, isLoading, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!session || error)) {
      router.push(redirectTo);
    }
  }, [session, isLoading, error, router, redirectTo]);

  return { session, isLoading, error };
}
```

## Files to Create

1. `/apps/core/src/components/auth/auth-guard.tsx` - Server-side auth guard
2. `/apps/core/src/lib/session.ts` - Enhanced session helpers
3. `/apps/core/src/components/auth/protected-component.tsx` - Client-side protection
4. `/apps/core/src/components/auth/workspace-protected-component.tsx` - Workspace-aware protection
5. `/apps/core/src/middleware.ts` - Optional middleware for route protection
6. `/apps/core/src/hooks/use-require-auth.ts` - Auth protection hook

## Files to Update

1. `/apps/core/src/app/(dashboard)/layout.tsx` - Add AuthGuard wrapper
2. `/apps/core/src/app/(auth)/layout.tsx` - Add redirect for authenticated users
3. Protected pages - Add protection as needed

## Validation Checklist

- [ ] AuthGuard component prevents unauthenticated access with error handling
- [ ] Dashboard layout properly protected using AuthGuard
- [ ] Auth pages redirect authenticated users away from auth routes
- [ ] Server-side session helpers handle errors gracefully
- [ ] Client-side protected component functions correctly with error states
- [ ] Workspace-aware protection validates workspace selection
- [ ] Loading states display during auth checks
- [ ] Redirect URLs include proper query parameters
- [ ] Error handling for auth failures doesn't break redirects
- [ ] No middleware conflicts (using layout-level protection only)
- [ ] Separate auth pages (login, signup, forgot, reset) work independently
- [ ] SessionProvider properly wraps the application in providers.tsx

## Testing

```bash
# 1. Start development server
bun run dev

# 2. Test protected routes
# - Try accessing /dashboard while logged out
# - Should redirect to /login
# - After login, should redirect to /dashboard

# 3. Test auth routes
# - Visit /login while authenticated
# - Should redirect to /dashboard

# 4. Test client-side protection
# - Access protected client components
# - Verify redirect behavior
# - Check loading states

# 5. Test workspace protection
# - Access workspace-specific routes
# - Test with and without active workspace
# - Verify proper redirects

# 6. Test edge cases
# - Session expiration
# - Network errors during auth checks
# - Multiple tab scenarios
```

## Common Issues and Solutions

1. **Infinite Redirects**:
   - Check that auth pages aren't wrapped in AuthGuard
   - Ensure redirect URLs don't create loops
   - Verify error handling doesn't interfere with redirects

2. **Session Not Available**:
   - Verify SessionProvider wraps the app in providers.tsx
   - Check that auth API routes are working
   - Ensure cookies are being set properly
   - Check console for session errors

3. **Error Handling Issues**:
   - Ensure try/catch blocks properly handle redirect errors
   - Check for NEXT_REDIRECT errors in error handling
   - Verify null returns from session helpers

4. **Hydration Mismatches**:
   - Use appropriate protection patterns for SSR/client
   - Server components should use server-side helpers
   - Client components should use useSession hook with error state

5. **Performance Issues**:
   - Cache session data with React.cache
   - Avoid multiple auth checks in same render
   - Use error states to prevent repeated failed requests

## Key Implementation Notes

1. **No Unified Auth Component**: This implementation uses separate auth pages (login, signup, forgot, reset) as defined in Unit 3.2. There is no unified auth component.

2. **Error-First Approach**: All session helpers include comprehensive error handling with try/catch blocks that return null or redirect as appropriate.

3. **Layout-Level Protection**: Authentication is handled at the Next.js layout level, not through middleware.

4. **Separate UI Pages**: Auth pages remain as separate routes under `/app/(auth)/` with their own layouts and components.

## Integration Points

- **Unit 3.1**: Uses session helpers and auth configuration
- **Unit 3.2**: Protects routes that require authentication
- **Unit 3.3**: Workspace-aware protection for workspace-specific features
- **All Protected Routes**: Apply protection pattern to dashboard, settings, projects, etc.
- **API Routes**: Can use same session helpers for server-side auth checks