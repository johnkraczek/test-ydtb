# Project Overview & Technology Stack

## Project Name
**ydtb** - Next.js 16 Application with Modern Tech Stack

## Current State
Early development phase with solid infrastructure foundation.

## Core Technology Stack

### Frontend Framework
- **Next.js 16.0.5** with App Router and Partial Prerendering
- **React 19.2.0** with TypeScript 5.8.2
- **ES Modules** configuration
- **Partial Prerendering**: Using Next.js 16's partial caching for optimal performance

### Authentication & Database
- **Better Auth** - Modern authentication solution
- **Drizzle ORM** with PostgreSQL adapter
- **GitHub OAuth** and email/password providers
- **Database migrations** via Drizzle Kit

### UI & Styling
- **shadcn/ui** component library (New York variant)
- **Tailwind CSS v4.0.15** (latest v4 syntax)
- **Lucide React** for icons
- **Class Variance Authority (CVA)** for component variants
- **tw-animate-css** for animations

### Development Tools
- **Biome** for linting and formatting (ESLint + Prettier replacement)
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Storybook** for component development and documentation
- **TypeScript** with strict configuration

### Key Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript with ES2022 target and path aliases
- `components.json` - shadcn/ui configuration
- `next.config.js` - Next.js configuration
- `biome.jsonc` - Code formatting and linting rules
- `drizzle.config.ts` - Database configuration
- `vitest.config.ts` - Test configuration

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/             # External API integrations only
│   │   ├── stripe/      # Payment processing
│   │   ├── email/       # Email services
│   │   └── webhooks/    # External webhooks
│   └── (pages)/         # Application pages
├── components/          # UI components
│   ├── ui/              # shadcn/ui base components
│   ├── base/            # Extended base components
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── actions/             # Server actions organized by domain
│   ├── users/           # User domain server actions
│   │   ├── types.ts     # Shared type definitions
│   │   ├── queries.ts   # Data fetching server actions
│   │   └── mutations.ts # Data mutation server actions
│   ├── posts/           # Blog post domain server actions
│   │   ├── types.ts     # Shared type definitions
│   │   ├── queries.ts   # Data fetching server actions
│   │   └── mutations.ts # Data mutation server actions
│   └── products/        # Product domain server actions
│       ├── types.ts     # Shared type definitions
│       ├── queries.ts   # Data fetching server actions
│       └── mutations.ts # Data mutation server actions
├── lib/                 # Utility functions and shared code
├── server/              # Server-side code (auth, database)
│   ├── better-auth/     # Authentication configuration
│   └── db/              # Database schema and configuration
├── styles/              # Global styles and Tailwind CSS
└── stories/             # Storybook component stories

public/                  # Static assets
.claude/                 # Claude AI configuration and context
.storybook/              # Storybook configuration
```

**Architecture Notes:**
- **🟡 Server Components**: Live in `src/app/` directory (Next.js pages) - default for all UI
- **🟢 Server Actions**: Live in `src/actions/` directory - for data operations
- **External Integrations**: API routes in `src/app/api/`
- **Authentication**: Better Auth handles its own API, excluded from actions layer
- **Type Safety**: Full TypeScript coverage with strict mode

**How to distinguish:**
- **Folder Location**: `app/` = Server Components, `actions/` = Server Actions
- **Purpose**: `app/` for UI pages, `actions/` for data operations

## Development Scripts

```bash
# Development
npm run dev              # Start development server with Turbo
npm run build            # Build for production
npm run start            # Start production server
npm run typecheck        # TypeScript type checking

# Code Quality
npm run check            # Run Biome linting and formatting
npm run lint             # Alias for check

# Database
npm run db:generate      # Generate database migrations
npm run db:migrate       # Run database migrations
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Drizzle Studio

# Testing
npm run test             # Run Vitest tests
npm run test:ui          # Run tests with UI
npm run test:e2e         # Run Playwright E2E tests

# Documentation
npm run storybook        # Start Storybook development server
```

## Environment Variables

Required environment variables (validated via `@t3-oss/env-nextjs`):

```typescript
// Database
DATABASE_URL=postgresql://...

// Authentication
BETTER_AUTH_GITHUB_CLIENT_ID=github_client_id
BETTER_AUTH_GITHUB_CLIENT_SECRET=github_client_secret
BETTER_AUTH_SECRET=auth_secret

// URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Key Architecture Decisions

### Why Next.js 16 with App Router?
- Server components by default for better performance
- **Partial Prerendering**: Advanced caching and partial rendering capabilities
- Improved streaming and loading states with enhanced caching
- Better SEO and meta tag management
- Modern React patterns and concurrent features
- Enhanced Turbopack performance and developer experience

### Why Better Auth?
- More modern than NextAuth.js
- Better TypeScript support
- Simpler configuration
- Active development and maintenance

### Why Drizzle ORM?
- Type-safe database operations
- Excellent TypeScript support
- Simple and intuitive API
- Good performance characteristics

### Why Biome?
- Faster than ESLint + Prettier
- All-in-one solution (linting, formatting, import sorting)
- Excellent TypeScript support
- Minimal configuration

### Why Tailwind CSS v4?
- Latest version with improved performance
- Better CSS-in-JS integration
- Enhanced theming capabilities
- Future-proof investment

## Development Status

### ✅ Completed
- Next.js 16 setup with App Router and Partial Prerendering
- Better Auth configuration with GitHub OAuth
- Drizzle ORM database schema
- Tailwind CSS v4 configuration
- shadcn/ui component system setup
- Storybook integration
- Biome code quality tools
- Development environment configuration

### 🚧 In Progress
- Component library development
- Authentication UI implementation
- Database migrations
- Testing setup

### ❌ Not Started
- API routes beyond auth
- Error handling middleware
- Production deployment configuration
- Performance optimization
- Security hardening

## Next Priorities
1. Implement core UI components using shadcn/ui
2. Set up authentication flow pages
3. Create database migrations
4. Establish testing patterns
5. Define component documentation standards