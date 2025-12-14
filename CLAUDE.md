# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YDTB (Your Digital Toolbox) is a monorepo CRM toolkit built with:
- **Framework**: Next.js 16 with React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with passkeys and TOTP support
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: React Context + useState for global state, React Query for server state
- **Package Manager**: Bun
- **Monorepo**: Turborepo with workspace structure

## Architecture

### Monorepo Structure
- `/apps/core` - Main Next.js application
- `/packages/*` - Shared packages (e.g., `@ydtb/basic`)
- `/scripts/*` - Database management scripts

### Key Directories
- `src/app/` - Next.js 16 app router with route groups
- `src/context/` - React context providers (theme, session, workspace)
- `src/server/` - Backend code (auth, database schema, API routes)
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and configuration
- `drizzle/` - Database migrations and metadata

### Authentication & Authorization
- Uses Better Auth with custom workspace/organization support
- Session management includes active organization context
- TOTP (Time-based One-Time Password) two-factor authentication
- Passkey/WebAuthn support

### Database Schema
- All tables prefixed with `ydtb_`
- Better Auth integration for users, sessions, accounts
- Workspace/organization system with role-based access
- PostgreSQL with Drizzle ORM migrations

## Common Development Commands

### Development
```bash
# Start all apps in development mode
bun dev

# Start only core app
bun dev:core

# Install dependencies
bun install:all
```

### Database Operations
```bash
# Push schema changes to database (development)
bun db:push

# Generate migration files from schema
bun db:generate

# Run database migrations
bun db:migrate

# Open Drizzle Studio (database GUI)
bun db:studio

# Reset database (prompts for confirmation)
bun db:reset

# Reset database without confirmation (force mode)
bun db:reset:force

# Seed database
bun db:seed
```

#### Database Reset Policy
**IMPORTANT**: When making database schema changes, you must reset the entire database. The project does not use incremental migrations in development.

- **Why reset?**: The project uses `drizzle-kit push` for direct schema synchronization
- **What happens**: All tables are dropped, schema is recreated, and test data is restored
- **Test data**: Includes a test user (john@kraczek.com) with the original password preserved
- **Force mode**: Use `bun db:reset:force` to skip the confirmation prompt

### Build & Type Checking
```bash
# Build all packages
bun build

# Type check all packages
bun type-check

# Run checks (linting, type checking)
bun check

# Lint all packages
bun lint
```

### Environment Management
```bash
# Validate environment variables
bun env:validate

# Generate environment example file
bun env:generate
```

## Development Guidelines

### Environment Variables
- Core app uses `@t3-oss/env-nextjs` for type-safe environment variables
- Environment registry pattern allows packages to register their own env vars
- Run `bun env:generate` to update `.env.example` when adding new variables
- Environment variables are validated on startup (use `SKIP_ENV_VALIDATION=1` to skip)

### Database Development
- Schema defined in `apps/core/src/server/db/schema.ts`
- In development we can reset the database and reseed with this bun command in the core app db:reset:force.
  - `cd apps/core/ && bun run db:reset:force`
- All database operations require `DATABASE_URL` in `.env.local`

### Authentication Integration
- Better Auth client configured in `src/lib/auth-client.ts`
- Server auth config in `src/server/auth.ts`
- Session provider wraps the app in `src/context/providers.tsx`
- Active workspace context stored in sessions

### Component Development
- UI components use Radix UI primitives with Tailwind styling
- Theme support via `next-themes` with custom pattern/color providers
- Component organization follows feature-based structure
- Use shadcn/ui style for component patterns

### Route Organization
- Route groups: `(auth)` for authentication pages, `(dashboard)` for authenticated areas
- Layout separation: Auth layouts vs dashboard layouts
- API routes follow RESTful patterns under `src/app/api/`

#### Internal vs External Communication Patterns

**Important**: Internal communication within the application uses direct function calls (either across RSC boundary or server-side), NOT HTTP requests. HTTP APIs are ONLY for external system integration.

##### Internal Package Communication

**1. RSC Client-Server Boundary**
- **Mechanism**: Direct function calls between client components and server functions
- **Technology**: React Server Components boundary
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Client components fetching data from server
  - Form submissions and mutations
  - Server actions for client interactions

**2. Server-Side Package-to-Package Communication**
- **Mechanism**: Direct function calls between packages on the server
- **Technology**: Internal function imports/calls
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Package A calling functions from Package B
  - Shared services and utilities
  - Database operations
  - Internal business logic

##### External API Registration (HTTP)
Only for integration with external systems:
- **Mechanism**: HTTP endpoints exposed to outside world
- **Technology**: Next.js API routes
- **Authentication**: Required for all external endpoints
  - API keys for service-to-service communication
  - OAuth/JWT for third-party integrations
  - Signature verification for webhooks
- **Use Cases**:
  - Webhooks from external services (with signature verification)
  - Public APIs for third-party integration (with API keys)
  - Mobile app backends (with OAuth/JWT)
  - Internal package webhooks (with authenticated calls)