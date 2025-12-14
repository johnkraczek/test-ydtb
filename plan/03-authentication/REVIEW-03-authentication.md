# Unit 2.1: Authentication Implementation

## Folder: `03-authentication`

## Purpose
Implement a comprehensive authentication system using better-auth with email/password authentication, workspace management, and session handling.

## Context
- No current authentication implementation in the application
- Need email/password authentication with secure session management
- Must support workspace switching after login
- Users should be able to belong to multiple workspaces
- Sessions need to track both user and current workspace context
- Authentication should integrate with the database schema from Unit 1.2
- better-auth will manage users and sessions with its own schema

## Definition of Done
- [ ] better-auth configured with custom adapter for our database
- [ ] Email/password authentication working with secure password hashing
- [ ] Workspace membership validation during login
- [ ] Session management with workspace context
- [ ] Protected route middleware implemented
- [ ] Auth pages (login, register) created and styled
- [ ] Workspace dropdown updated to use real data
- [ ] Automatic redirection for unauthenticated users
- [ ] Session refresh on workspace switching
- [ ] better-auth schemas created (users, sessions, accounts)

## Steps

### 1. Install and Configure better-auth
Install dependencies using Bun and set up better-auth with custom configuration for our needs.
```bash
bun add better-auth drizzle-adapter
bun add -d @types/better-auth
```

### 2. Configure better-auth with Drizzle Adapter
Set up better-auth with the Drizzle adapter and configure authentication providers.

### 3. Create Authentication Schemas
Let better-auth create its own user and session schemas in our database.

### 4. Create Authentication Pages
Build login and register pages with proper validation and error handling.

### 5. Implement Auth Middleware
Create middleware to protect routes and handle authentication redirects.

### 6. Update Workspace Dropdown
Modify the workspace dropdown to show real workspaces based on user membership.

### 7. Add API Routes
Create necessary API endpoints for authentication operations.

### 8. Implement Workspace Switching
Add functionality to switch between workspaces while maintaining session.

## Files to Create

### 1. `/apps/core/src/lib/auth/index.ts`
```typescript
import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, workspaces, workspaceMembers } from "@/lib/db/schema/core";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      ...DefaultSession["user"];
      id: string;
      workspaceId?: string;
    };
  }

  interface User {
    id: string;
    workspaceId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        workspaceId: { label: "Workspace", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
          with: {
            workspaceMembers: {
              with: {
                workspace: true
              }
            }
          }
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) {
          return null;
        }

        // If workspaceId provided, check membership
        if (credentials.workspaceId) {
          const isMember = user.workspaceMembers.some(
            member => member.workspaceId === credentials.workspaceId
          );

          if (!isMember) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          workspaceId: credentials.workspaceId as string || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.workspaceId = user.workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.workspaceId) {
        session.user.workspaceId = token.workspaceId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
});
```

### 2. `/apps/core/src/lib/auth/password.ts`
```typescript
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### 3. `/apps/core/src/app/(auth)/login/page.tsx`
```typescript
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
```

### 4. `/apps/core/src/app/(auth)/login/LoginForm.tsx`
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        workspaceId: formData.get("workspaceId") as string,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials or workspace access");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspaceId">Workspace ID (optional)</Label>
            <Input
              id="workspaceId"
              name="workspaceId"
              type="text"
              placeholder="Enter workspace ID"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 5. `/apps/core/src/app/(auth)/register/page.tsx`
```typescript
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
```

### 6. `/apps/core/src/app/(auth)/register/RegisterForm.tsx`
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validatePassword } from "@/lib/auth/password";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: password,
          workspaceName: formData.get("workspaceName"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?message=Registration successful");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspaceName">First Workspace Name</Label>
            <Input
              id="workspaceName"
              name="workspaceName"
              type="text"
              required
              placeholder="My Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              onChange={() => setPasswordErrors([])}
            />
            {passwordErrors.length > 0 && (
              <ul className="text-sm text-red-600 list-disc list-inside">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 7. `/apps/core/src/middleware.ts`
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/api/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === "/"
  );

  // Redirect unauthenticated users to login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 8. `/apps/core/src/app/api/auth/register/route.ts`
```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, workspaces, workspaceMembers } from "@/lib/db/schema/core";
import { hashPassword } from "@/lib/auth/password";
import { generateWorkspaceId } from "@/lib/utils/workspace";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { name, email, password, workspaceName } = await request.json();

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
    }).returning();

    // Create initial workspace
    const workspaceId = generateWorkspaceId();
    const [newWorkspace] = await db.insert(workspaces).values({
      id: workspaceId,
      name: workspaceName,
      description: `Default workspace for ${name}`,
      createdBy: newUser.id,
    }).returning();

    // Add user as owner of workspace
    await db.insert(workspaceMembers).values({
      workspaceId: newWorkspace.id,
      userId: newUser.id,
      role: "owner",
    });

    return NextResponse.json({
      message: "User registered successfully",
      userId: newUser.id,
      workspaceId: newWorkspace.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Files to Update

### 1. `/apps/core/src/components/dashboard/headers/WorkspaceDropdown.tsx`
Update to fetch real workspaces from the database based on user membership.

### 2. `/apps/core/src/app/api/auth/[...nextauth]/route.ts`
```typescript
export { handlers } from "@/lib/auth";
```

### 3. Update `/apps/core/package.json`
Add dependencies:
```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.3",
    "@auth/drizzle-adapter": "^0.8.1",
    "bcryptjs": "^2.4.3"
  }
}
```

## Validation Checklist
- [ ] User can register with email/password
- [ ] User can login with correct credentials
- [ ] Invalid credentials show error message
- [ ] Password validation works (min 8 chars, etc.)
- [ ] Workspace is created on registration
- [ ] User is automatically added as owner of workspace
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Authenticated users can't access login/register pages
- [ ] Workspace switching maintains session

## Testing Workflow
1. Register a new user
2. Verify default workspace is created
3. Login with new credentials
4. Check session persistence
5. Try accessing protected routes while logged out
6. Test workspace switching functionality

## Common Issues and Solutions
1. **Session Not Persisting**: Check BETTER_AUTH_SECRET environment variable from core env
2. **Database Adapter Errors**: Ensure schema matches better-auth expectations
3. **Redirect Loops**: Verify middleware configuration
4. **Password Hash Failures**: Check bcrypt implementation
5. **Environment Variable Access**: Import env from `@/env` in auth configuration

## Next Steps
After authentication is working:
1. Implement workspace context provider (Unit 2.2)
2. Create dynamic routing system
3. Build the registry system for package management