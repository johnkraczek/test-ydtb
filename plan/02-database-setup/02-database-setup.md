# Unit 1.2: Database Setup and Core Schema

## Folder: `02-database-setup`

## Purpose
Establish the core database schema with multi-tenancy support using Drizzle ORM. This creates the foundation for workspace isolation that all packages will build upon.

## Context
- Drizzle ORM is already configured but `schema.ts` is missing
- Need core tables: users, workspaces, sessions, workspace_members
- All package tables will reference `workspaces.id` for data isolation
- Workspace IDs will be 10-20 alphanumeric characters for URL-friendly identifiers
- Database connection should use singleton pattern for efficiency

## Definition of Done
- [ ] Core database schema created (users, workspaces, sessions, workspace_members)
- [ ] Database connection singleton established
- [ ] Drizzle configuration updated for monorepo structure
- [ ] Initial migration generated and can run successfully
- [ ] Workspace ID validation implemented (10-20 alphanumeric)
- [ ] Database utilities created for workspace filtering
- [ ] Type safety ensured with TypeScript types generated

## Steps

### 1. Create Core Database Schema
Create the fundamental tables required for multi-tenancy:

**users table**:
- id: uuid (primary key)
- email: string (unique)
- password_hash: string
- name: string
- created_at: timestamp
- updated_at: timestamp

**workspaces table**:
- id: string (10-20 alphanumeric, primary key)
- name: string
- description: string (optional)
- created_by: uuid (foreign key to users.id)
- created_at: timestamp
- updated_at: timestamp

**workspace_members table**:
- id: uuid (primary key)
- workspace_id: string (foreign key to workspaces.id)
- user_id: uuid (foreign key to users.id)
- role: enum ('owner', 'admin', 'member')
- joined_at: timestamp

**sessions table**:
- id: string (primary key)
- user_id: uuid (foreign key to users.id)
- workspace_id: string (foreign key to workspaces.id)
- expires_at: timestamp
- created_at: timestamp

### 2. Implement Database Connection Singleton
Create a singleton pattern for database connections to ensure efficient connection management.

### 3. Update Drizzle Configuration
Ensure Drizzle works correctly with the new monorepo structure.

### 4. Generate Initial Migration
Create and run the first migration to set up core tables.

### 5. Create Workspace Utilities
Implement helper functions for:
- Validating workspace ID format
- Filtering queries by workspace
- Checking user workspace membership

### 6. Set Up Type Generation
Configure Drizzle to generate TypeScript types from the schema.

## Files to Create

### 1. `/apps/core/src/lib/db/schema/core.ts`
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

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workspaces table
export const workspaces = pgTable("workspaces", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Workspace members table
export const workspaceMembers = pgTable("workspace_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: varchar("workspace_id", { length: 20 }).notNull().references(() => workspaces.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50, enum: ['owner', 'admin', 'member'] }).notNull().default('member'),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  workspaceId: varchar("workspace_id", { length: 20 }).notNull().references(() => workspaces.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Type schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWorkspaceSchema = createInsertSchema(workspaces);
export const selectWorkspaceSchema = createSelectSchema(workspaces);
export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers);
export const selectWorkspaceMemberSchema = createSelectSchema(workspaceMembers);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
```

### 2. `/apps/core/src/lib/db/index.ts`
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/core";

// Singleton pattern for database connection
class Database {
  private static instance: Database;
  private client: postgres.Sql;
  public db: ReturnType<typeof drizzle>;

  private constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    this.client = postgres(connectionString, { max: 1 });
    this.db = drizzle(this.client, { schema });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async close() {
    await this.client.end();
  }
}

export const db = Database.getInstance().db;
export { schema };
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

### 1. `/apps/core/drizzle.config.ts`
```typescript
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default {
  schema: "./src/lib/db/schema/core.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### 2. `/apps/core/package.json`
Add database-related scripts:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
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