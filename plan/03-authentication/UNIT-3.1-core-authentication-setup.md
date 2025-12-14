# Unit 2.2: Core Authentication Setup

## Purpose
Configure the foundational authentication infrastructure using better-auth with PostgreSQL adapter, email/password authentication, and API route handling.

## Context
- Must have Unit 1.2 (Environment Variables) completed for auth configuration
- Must have Unit 2.1 (Database Setup) completed for database connection
- This unit provides the core auth infrastructure that other units will build upon

## Definition of Done
- [ ] better-auth configured with drizzle adapter for PostgreSQL
- [ ] Email/password authentication working with secure password hashing
- [ ] Session management with 7-day expiration configured
- [ ] API routes created at `/api/auth/[...all]/route.ts`
- [ ] Server session helpers created for authentication checks
- [ ] Auth client configured for React components
- [ ] better-auth tables auto-generated in database
- [ ] Environment variables properly configured for auth

## Steps

### 1. Install Dependencies
Install better-auth and required dependencies using Bun:
```bash
bun add better-auth @better-auth/passkey @better-auth/organization framer-motion
bun add -d @types/better-auth
```

### 2. Configure better-auth Server
Create `apps/core/src/server/auth.ts`:
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
            slug: "slug",
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

### 6. Create Session Provider
Create `apps/core/src/context/session/session-provider.tsx`:
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

### 7. Update Providers Configuration
Update `/apps/core/src/context/providers.tsx` to include the session provider:
```typescript
"use client";

import { ThemeProvider } from "next-themes";
import { ThemeColorProvider } from "~/context/theme/use-theme-color";
import { ThemePatternProvider } from "~/context/theme/use-theme-pattern";
import { SessionProvider } from "~/context/session/session-provider";
// Note: WorkspaceProvider will be added in Unit 2.4

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
            {children}
          </SessionProvider>
        </ThemePatternProvider>
      </ThemeColorProvider>
    </ThemeProvider>
  );
}
```

### 8. Database Migration
Run the better-auth migration to create authentication tables:
```bash
npx @better-auth/cli generate
# Or push directly to database:
npx @better-auth/cli migrate
```

## Files to Create/Update

### New Files:
1. `/apps/core/src/server/auth.ts` - Main auth configuration
2. `/apps/core/src/lib/auth-client.ts` - Client-side auth configuration
3. `/apps/core/src/app/api/auth/[...all]/route.ts` - API route handler
4. `/apps/core/src/server/auth-session.ts` - Server session helpers
5. `/apps/core/src/context/session/session-provider.tsx` - Session provider

### Files to Update:
1. `/apps/core/src/context/providers.tsx` - Add SessionProvider
2. `/apps/core/package.json` - Add better-auth dependencies
3. `.env.example` - Add auth environment variables:
   ```
   # Authentication
   BETTER_AUTH_SECRET=your-secret-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Validation Checklist

- [ ] Dependencies installed successfully
- [ ] Auth server configuration created without TypeScript errors
- [ ] Auth client configuration created with proper typing
- [ ] API route handler created and accessible
- [ ] Session helpers working on server side
- [ ] Session provider integrated in providers
- [ ] Database tables created by better-auth
- [ ] Environment variables properly configured
- [ ] API endpoints responding correctly at `/api/auth/*`

## Testing

```bash
# 1. Install dependencies
bun add better-auth @better-auth/passkey @better-auth/organization framer-motion
bun add -d @types/better-auth

# 2. Generate/migrate auth tables
npx @better-auth/cli migrate

# 3. Start development server
bun run dev

# 4. Test API endpoints
curl -X GET http://localhost:3000/api/auth/session
# Should return: {"user": null, "session": null} for unauthenticated user

# 5. Check database
# Connect to PostgreSQL and verify better-auth tables exist:
# - user
# - session
# - account
```

## Common Issues and Solutions

1. **Database Adapter Errors**:
   - Ensure database connection is working (test with `db.select().from(workspaces)`)
   - Verify PostgreSQL provider is set in drizzle adapter

2. **Environment Variables**:
   - Import from `@/env` (from Unit 1.2)
   - Verify `BETTER_AUTH_SECRET` is set in .env.local

3. **API Route Not Working**:
   - Check that route file follows Next.js 13+ app router pattern
   - Verify `toNextJsHandler` is properly imported and used

4. **TypeScript Errors**:
   - Ensure all better-auth packages have same version
   - Check that `@types/better-auth` is installed

## Integration Points

- **Unit 1.2**: Environment variables from `@/env`
- **Unit 2.1**: Database schema and connection from `@/server/db`
- **Unit 2.3**: Will use this auth setup for UI pages
- **Unit 2.4**: Will use organization plugin for workspace management
- **Unit 2.5**: Will use session helpers for route protection