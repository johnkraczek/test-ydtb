# Unit 1.2: Database Setup and Core Schema

## Folder: `02-database-setup`

## Purpose
Establish the core database schema with multi-tenancy support using Drizzle ORM. This creates the foundation for workspace isolation that all packages will build upon.

## Context
- Drizzle ORM is already configured but `schema.ts` is missing
- Need core tables: workspaces, workspace_members (users and sessions will be handled by better-auth in Unit 2.1)
- All package tables will reference `workspaces.id` for data isolation
- Workspace IDs will be 10-20 alphanumeric characters for URL-friendly identifiers
- Database connection should use singleton pattern for efficiency
- Better-auth will handle user and session management with its own schema

## Definition of Done
- [ ] Core database schema created (workspaces, workspace_members)
- [ ] Database connection singleton established
- [ ] Drizzle configuration updated for monorepo structure
- [ ] Initial migration generated and can run successfully
- [ ] Workspace ID validation implemented (10-20 alphanumeric)
- [ ] Database utilities created for workspace filtering
- [ ] Type safety ensured with TypeScript types generated
- [ ] Better-auth compatibility considered (no conflicts with auth schemas)

## Steps

### 1. Create Core Database Schema
Create the fundamental tables required for multi-tenancy (auth tables handled by better-auth):

**workspaces table**:
- id: string (10-20 alphanumeric, primary key)
- name: string
- description: string (optional)
- created_at: timestamp
- updated_at: timestamp

**workspace_members table**:
- id: uuid (primary key)
- workspace_id: string (foreign key to workspaces.id)
- user_id: string (foreign key to better-auth users table)
- role: enum ('owner', 'admin', 'member')
- joined_at: timestamp

Note: Users and sessions will be managed by better-auth with its own schema structure. The workspace_members.user_id will reference the user ID from better-auth's user table.

### 2. Create Environment Configuration
Environment validation is handled in `apps/core/src/env.ts` using the build-time environment collection system (Unit 1.2). The database connection will use the validated `DATABASE_URL` from the core environment.

### 3. Implement Database Connection Singleton
Create a cached database connection following the ydtb pattern:
- Use postgres-js for the connection
- Cache the connection in development using globalThis
- Use Drizzle ORM with the connection

### 4. Update Drizzle Configuration
Configure Drizzle Kit following ydtb pattern:
- Set schema path to point to core schema
- Use tablesFilter with prefix (e.g., "crm_*")
- Configure for PostgreSQL with database URL from env

### 5. Create Database Setup Script
Create a `start-database.sh` script following the ydtb pattern:
- Supports both Docker and Podman
- Reads DATABASE_URL from .env.local
- Automatically starts database daemon if not running
- Generates random password if using default

### 6. Generate Initial Migration
Create and run the first migration to set up core tables.

### 7. Create Workspace Utilities
Implement helper functions for:
- Validating workspace ID format
- Filtering queries by workspace
- Checking user workspace membership

### 8. Set Up Type Generation
Configure Drizzle to generate TypeScript types from the schema.

## Files to Update

### 1. `/apps/core/src/lib/db/index.ts`
Import the environment from core:
```typescript
import { env } from "@/env";
import { envRegistry } from "@/registry/env";
```

### 2. `/apps/core/src/lib/db/schema/core.ts`
```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Note: Users and Sessions tables will be created by better-auth
// These schemas are defined here only for reference - actual creation happens in Unit 2.1

// Workspaces table
export const workspaces = pgTable("ydtb_workspaces", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workspace members table
export const workspaceMembers = pgTable("ydtb_workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: varchar("workspace_id", { length: 20 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(), // References better-auth user ID
  role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member'] }).notNull().default('member'),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// Type schemas
export const insertWorkspaceSchema = createInsertSchema(workspaces);
export const selectWorkspaceSchema = createSelectSchema(workspaces);
export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers);
export const selectWorkspaceMemberSchema = createSelectSchema(workspaceMembers);
```

### 3. `/apps/core/src/lib/db/index.ts`
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";
import * as schema from "./schema/core";

/**
 * Cache the database connection in development.
 * Following the ydtb pattern to avoid creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export { schema };
```

### 4. `/apps/core/drizzle.config.ts`
```typescript
import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load environment variables from .env.local
config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

export default {
  schema: "./src/lib/db/schema/core.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["ydtb_*"],
} satisfies Config;
```

### 5. `/scripts/start-database.sh`
Create a shell script following the ydtb pattern for local development database setup. (See ydtb project for reference implementation)
```bash
#!/usr/bin/env bash
# Use this script to start a docker container for a local development database
# Following the pattern from ydtb project

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux)
# 2. Install Docker Desktop or Podman Desktop
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

# import env variables from .env.local
set -a
source .env.local

# Parse database URL and generate container configuration
# [Implementation details matching ydtb pattern]

# Check for Docker/Podman availability and start daemon if needed
# [Implementation details matching ydtb pattern]

# Check port availability
# [Implementation details matching ydtb pattern]

# Handle existing containers
# [Implementation details matching ydtb pattern]

# Generate random password for default
# [Implementation details matching ydtb pattern]

# Run PostgreSQL container
# [Implementation details matching ydtb pattern]
```

### 3. `/apps/core/src/lib/utils/workspace.ts`
```typescript
import { z } from "zod";

// Workspace ID validation schema
export const workspaceIdSchema = z.string()
  .min(10)
  .max(20)
  .regex(/^[a-zA-Z0-9]+$/, "Workspace ID must be alphanumeric");

// Generate a random workspace ID
export function generateWorkspaceId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate workspace ID format
export function isValidWorkspaceId(id: string): boolean {
  return workspaceIdSchema.safeParse(id).success;
}

// Create a workspace-scoped query filter
export function withWorkspace(workspaceId: string) {
  return {
    workspaceId
  };
}
```

## Files to Update

### 1. `/apps/core/package.json`
Add dependencies following ydtb pattern:
```json
{
  "dependencies": {
    "@t3-oss/env-nextjs": "^0.7.1",
    "drizzle-orm": "^0.29.3",
    "postgres": "^3.4.3",
    "drizzle-zod": "^0.5.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/postgres": "^3.4.6",
    "drizzle-kit": "^0.20.14"
  },
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 2. Update `/apps/core/tsconfig.json`
Add path for environment file:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@ydtb/*": ["../../packages/*"],
      "~/*": ["./src/*"]
    }
  }
}
```

### 3. Update `.env.example`
```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_toolkit"
```

## Validation Checklist
- [ ] Drizzle schema compiles without errors
- [ ] Migration files generated successfully
- [ ] Database connection singleton works
- [ ] Workspace ID validation functions correctly
- [ ] TypeScript types generated from schema
- [ ] All tables created in database after migration
- [ ] Foreign key relationships established
- [ ] Indexes created for performance

## Testing Commands
```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# View schema
npm run db:studio
```

## Common Issues and Solutions
1. **Connection Issues**: Verify DATABASE_URL is correctly set
2. **Migration Failures**: Check if database exists and user has permissions
3. **Type Errors**: Run `npm run db:generate` to update types
4. **Singleton Issues**: Ensure Database class is properly implemented

## Next Steps
After completing this unit:
1. The core database schema will be in place
2. Workspace isolation foundation established
3. Ready to implement authentication system (Unit 2.1)
4. Packages can reference `workspaces.id` for multi-tenancy