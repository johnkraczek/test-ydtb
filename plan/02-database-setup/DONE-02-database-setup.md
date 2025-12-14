# Unit 2.1: Database Setup and Core Schema

## Folder: `02-database-setup`

## Purpose
Establish the core database schema with multi-tenancy support using Drizzle ORM, following the ydtb project patterns exactly.

## Context
- Following ydtb project's database setup patterns
- Need core tables: workspaces, workspace_members (users and sessions handled by better-auth in Unit 2.2)
- All package tables will reference `ydtb_workspaces.id` for data isolation
- Using `ydtb_` table prefix for consistency with ydtb project
- Workspace IDs will be 10-20 alphanumeric characters for URL-friendly identifiers
- Database connection using postgres-js driver with development connection caching
- Environment variables handled through the Hybrid Approach from Unit 1.2

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
Create `apps/core/src/server/db/schema.ts` following ydtb pattern:

```typescript
import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgTable,
    pgTableCreator,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Use pgTableCreator for consistent ydtb_ prefix
export const createTable = pgTableCreator((name) => `ydtb_${name}`);

// Workspaces table - core multi-tenancy
export const workspaces = createTable("workspaces", {
    id: varchar("id", { length: 20 }).primaryKey(), // 10-20 alphanumeric for URL-friendly IDs
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
});

// Workspace members table - links users to workspaces
export const workspaceMembers = createTable("workspace_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: varchar("workspace_id", { length: 20 })
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(), // Will reference better-auth user ID
    role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member'] })
        .notNull()
        .default('member'),
    joinedAt: timestamp("joined_at")
        .$defaultFn(() => new Date())
        .notNull(),
}, (table) => ({
    workspaceUserIdx: index("workspace_members_workspace_user_idx").on(table.workspaceId, table.userId),
}));

// Relations
export const workspacesRelations = relations(workspaces, ({ many }) => ({
    members: many(workspaceMembers),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId],
        references: [workspaces.id],
    }),
}));

// Type exports for convenience
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
```

Note: Users and sessions will be managed by better-auth with its own schema. The workspace_members.userId will reference the user ID from better-auth's user table.

### 2. Database Configuration
Follow ydtb monorepo pattern:

#### Root `/drizzle.config.ts`
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
    schema: "./apps/core/src/server/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseUrl,
    },
    tablesFilter: ["ydtb_*"],  // ydtb prefix for all tables
} satisfies Config;
```

#### App-level Environment Variables
The environment variables are handled by the Hybrid Approach from Unit 1.2. The core app will use `@/env` which includes:
- Core variables (DATABASE_URL, NODE_ENV, etc.)
- Package-registered variables (collected at build time)

### 3. Database Connection
Create `apps/core/src/server/db/index.ts` following ydtb pattern:
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";  // From Unit 1.2 environment system
import * as schema from "./schema";

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

### 4. Create Database Setup Script
Copy the exact `start-database.sh` script from ydtb project:
```bash
#!/usr/bin/env bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux)
# 2. Install Docker Desktop or Podman Desktop
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

# import env variables from .env.local
set -a
source .env.local

# Parse DATABASE_URL to extract connection details
# Example: postgresql://postgres:password@localhost:5432/crm_toolkit
if [[ -z "$DATABASE_URL" ]]; then
    echo "Error: DATABASE_URL is not set in .env.local"
    exit 1
fi

# Extract database name from URL
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Rest of the script follows ydtb pattern exactly...
# [Copy the complete implementation from ydtb project]
```

### 6. Generate Initial Migration
Create and run the first migration to set up core tables:
```bash
# From project root
npm run db:generate
```

This will create migration files in `/drizzle/` folder with timestamp prefixes.

### 7. Update Monorepo Configuration
The root package.json scripts have already been set up in Unit 1.1. Ensure these are present:
```json
{
  "scripts": {
    "db:push": "bun ./scripts/db-push.sh",
    "db:generate": "bun ./scripts/db-generate.sh",
    "db:migrate": "bun ./scripts/db-migrate.sh",
    "db:studio": "bun ./scripts/db-studio.sh"
  }
}
```

#### App-level Dependencies
Update `apps/core/package.json` to include database dependencies:
```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.3",
    "postgres": "^3.4.3"
  },
  "devDependencies": {
    "@types/postgres": "^3.4.6",
    "drizzle-kit": "^0.20.14"
  }
}
```

## File Structure to Create

Following the ydtb monorepo pattern:

```
/
├── drizzle.config.ts                    # Root Drizzle configuration
├── drizzle/                            # Root migrations folder
│   ├── 0000_initial.sql               # Will be generated
│   └── meta/
│       └── journal.json               # Migration tracking
├── apps/core/
│   ├── drizzle/                       # App-specific migrations (if needed)
│   └── src/server/db/
│       ├── index.ts                   # Database connection
│       └── schema.ts                  # Database schema (created above)
├── packages/
│   └── [future packages]              # Will add db schemas as needed
└── scripts/
    ├── start-database.sh              # Database startup script (copy from ydtb)
    └── db-*.sh                        # Database utility scripts (from Unit 1.1)
```

### Monorepo Considerations:

1. **Single Database**: All apps and packages share the same PostgreSQL database
2. **Table Prefixing**: All tables use `ydtb_` prefix to avoid conflicts
3. **Workspace Dependencies**: Apps consume packages using `workspace:*` in package.json
4. **Shared Environment**: Environment variables managed through the registry system (Unit 1.2)

### 1. `/drizzle.config.ts`
Already created above in step 2.

### 2. `/apps/core/src/server/db/schema.ts`
Already created above in step 1.

### 3. `/apps/core/src/server/db/index.ts`
Already created above in step 3.

### 4. `/apps/core/src/lib/utils/workspace.ts`
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

### 5. Update TypeScript Configuration
Ensure paths are configured in `apps/core/tsconfig.json`:
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

### 8. Environment Variables
The .env.example is already configured in Unit 1.2. Ensure it includes:
```
# Database (from environment registry)
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit
```

Note: The environment variables are managed through the Hybrid Approach from Unit 1.2, which:
1. Collects core environment variables in apps/core/src/env.ts
2. Allows packages to register their environment variables
3. Validates all variables at build time
4. Provides type-safe access throughout the monorepo

## Validation Checklist

- [ ] Core schema file created at `apps/core/src/server/db/schema.ts`
- [ ] Database connection file created at `apps/core/src/server/db/index.ts`
- [ ] Root drizzle.config.ts created with correct schema path
- [ ] Migration files generated in `/drizzle/` folder
- [ ] Database connection works using environment variables from Unit 1.2
- [ ] TypeScript types are inferred correctly from schema
- [ ] All tables have proper indexes and foreign key constraints
- [ ] start-database.sh script copied from ydtb and working

## Testing Workflow

```bash
# 1. Start local database (if needed)
./start-database.sh

# 2. Generate migration files
bun run db:generate

# 3. Push schema to database (for development)
bun run db:push

# 4. Or run migrations (for production)
bun run db:migrate

# 5. View database schema in browser
bun run db:studio
```

## Integration Points

- **Unit 1.2**: Uses `@/env` for environment variables
- **Unit 2.2**: Better-auth will create user/session tables
- **Unit 6.2**: Package database registry will extend this schema
- **All packages**: Will reference `ydtb_workspaces.id` for multi-tenancy

## Next Steps

After completing this unit:
1. Multi-tenancy foundation is established with `ydtb_workspaces` table
2. Database connection pattern follows ydtb project exactly
3. Ready for better-auth implementation in Unit 2.2
4. Packages can safely register their database schemas with workspace isolation