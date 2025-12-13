# Unit 1.2: Environment Variables for Monorepo
**Folder**: `02-environment-variables`

**Purpose**: Design and implement environment variable management for the monorepo architecture, considering the needs of both core application and packages

**Context**:
- Moving from monolithic to monorepo architecture
- Core app needs environment variables (database URL, auth secrets, etc.)
- Packages may need their own environment variables
- Need to decide on strategy for package-specific environment variables
- ydtb project uses @t3-oss/env-nextjs for type-safe environment variables
- Must support development, testing, and production environments

**Definition of Done**:
- ✅ Environment variable strategy decided (core-only vs package-specific)
- ✅ Core environment validation implemented with @t3-oss/env-nextjs
- ✅ Shared environment package created if needed
- ✅ Documentation for adding new environment variables
- ✅ .env templates for each environment
- ✅ Runtime environment validation working
- ✅ Type safety for all environment variables

---

## Environment Variable Strategy Discussion

### Option A: Core-Only Environment Variables
All environment variables are defined and consumed by the core application only.
- Pros: Simpler, centralized configuration, easier deployment
- Cons: Packages need to pass all configuration through props or context

### Option B: Hybrid Approach (Recommended)
Core defines required environment variables, packages can define optional ones.
- Core variables: Database URL, auth secrets, app URL (required for all)
- Package variables: API keys, feature flags, package-specific settings
- Each package exports its environment schema that gets merged at build time

### Option C: Full Package Environment Variables
Each package can define its own environment variables independently.
- Pros: Maximum flexibility, packages can be self-contained
- Cons: More complex, potential for conflicts, harder deployment

---

## Recommended Implementation: Hybrid Approach

### 1. Core Environment Variables
Create `apps/core/src/env.ts`:
```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables
   * These are available on the server but not exposed to the client
   */
  server: {
    // Database
    DATABASE_URL: z.string().url(),

    // Authentication (better-auth)
    BETTER_AUTH_SECRET: process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),

    // Core application settings
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Security
    CORS_ORIGINS: z.string().optional()
      .transform(val => val?.split(",")),
    API_RATE_LIMIT: z.coerce.number().default(100),

    // Feature flags
    ENABLE_ANALYTICS: z.coerce.boolean().default(false),
    ENABLE_CRASH_REPORTING: z.coerce.boolean().default(false),
  },

  /**
   * Client-side environment variables
   * These are prefixed with NEXT_PUBLIC_ and exposed to the browser
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  },

  /**
   * Runtime environment variables
   * This maps the actual process.env to our validated schema
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    API_RATE_LIMIT: process.env.API_RATE_LIMIT,
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
    ENABLE_CRASH_REPORTING: process.env.ENABLE_CRASH_REPORTING,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Skip validation in certain cases
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  // Treat empty strings as undefined
  emptyStringAsUndefined: true,
});
```

### 2. Shared Environment Package
Create `packages/env/src/index.ts`:
```typescript
import { z } from "zod";

/**
 * Base environment schema that all packages should extend
 */
export const basePackageEnvSchema = {
  // Common package configuration
  DEBUG: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
};

/**
 * Environment variable helpers for packages
 */
export function createPackageEnv<T extends Record<string, any>>(
  packageName: string,
  schema: T
) {
  return {
    // Prefix all env vars with package name
    schema: Object.entries(schema).reduce((acc, [key, value]) => {
      const prefixedKey = `${packageName.toUpperCase()}_${key}`;
      acc[prefixedKey] = value;
      return acc;
    }, {} as Record<string, any>),

    // Helper to get prefixed env var
    getEnvVar: (key: string) => {
      return process.env[`${packageName.toUpperCase()}_${key}`];
    },
  };
}

/**
 * Common environment variables for packages
 */
export const commonPackageSchemas = {
  // API keys (common pattern)
  apiKey: z.string().optional(),

  // External service URLs
  apiUrl: z.string().url().optional(),

  // Feature flags
  enabled: z.coerce.boolean().default(true),

  // Timeouts
  timeout: z.coerce.number().default(30000),

  // Retries
  retries: z.coerce.number().default(3),
};
```

### 3. Package Environment Implementation Example
Example for a hypothetical `analytics` package:
```typescript
// packages/analytics/src/env.ts
import { createPackageEnv, commonPackageSchemas } from "@ydtb/env";
import { z } from "zod";

const { schema, getEnvVar } = createPackageEnv("ANALYTICS", {
  // Google Analytics
  GA_MEASUREMENT_ID: z.string().optional(),

  // PostHog
  POSTHOG_API_KEY: commonPackageSchemas.apiKey,
  POSTHOG_API_HOST: z.string().url().optional(),

  // Configuration
  TRACK_PAGE_VIEWS: commonPackageSchemas.enabled,
  BATCH_SIZE: z.coerce.number().default(10),
  FLUSH_INTERVAL: z.coerce.number().default(5000),
});

// Validate at runtime
export const analyticsEnv = {
  gaMeasurementId: getEnvVar("GA_MEASUREMENT_ID"),
  posthogApiKey: getEnvVar("POSTHOG_API_KEY"),
  posthogApiHost: getEnvVar("POSTHOG_API_HOST") || "https://app.posthog.com",
  trackPageViews: getEnvVar("TRACK_PAGE_VIEWS") === "true",
  batchSize: parseInt(getEnvVar("BATCH_SIZE") || "10"),
  flushInterval: parseInt(getEnvVar("FLUSH_INTERVAL") || "5000"),
};
```

### 4. Environment File Templates

#### `.env.example` (Root level)
```bash
# Core Application
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit
BETTER_AUTH_SECRET=your-secret-key-here
NODE_ENV=development

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# CORS (comma-separated origins)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate Limiting
API_RATE_LIMIT=100

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false

# Monitoring (optional)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

#### `.env.local.example` (For developers)
```bash
# Override values from .env.example
# Copy to .env.local and customize

# Development database
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit_dev

# Development secrets
BETTER_AUTH_SECRET=dev-secret-not-for-production

# Package-specific environment variables
ANALYTICS_POSTHOG_API_KEY=your-dev-posthog-key
ANALYTICS_DEBUG=true

NOTIFICATION_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
NOTIFICATION_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx

MEDIA_S3_BUCKET=your-dev-bucket
MEDIA_S3_REGION=us-east-1
```

### 5. Environment Loading Strategy

#### Core Application
```typescript
// apps/core/src/config/env.ts
import { env } from "./env";

// Core env is loaded at startup
export { env };

// Helper for packages to access their env vars
export function getPackageEnv(packageName: string, key: string) {
  const prefixedKey = `${packageName.toUpperCase()}_${key}`;
  return process.env[prefixedKey];
}
```

#### Package Initialization
```typescript
// In each package's initialization
import { getPackageEnv } from "@/config/env";

export function initializePackage(packageName: string) {
  // Package can read its env vars through core helper
  const apiKey = getPackageEnv(packageName, "API_KEY");
  const enabled = getPackageEnv(packageName, "ENABLED") === "true";

  // Initialize package with configuration
  return {
    apiKey,
    enabled,
    // ... other config
  };
}
```

### 6. Validation at Build Time

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build", "env:validate"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "env:validate": {
      "cache": false,
      "outputs": []
    }
  }
}
```

```bash
# Add to package.json scripts
"env:validate": "bun -e \"import('./src/env').then(m => m.env)\""
```

### 7. Documentation Standards

Each package must document:
1. Required environment variables (if any)
2. Optional environment variables with defaults
3. Example configuration in README.md
4. Environment variable prefix used

Template for package README:
```markdown
## Environment Variables

This package uses the `PREFIX_` prefix for all environment variables.

### Required

- `PREFIX_API_KEY` - API key for external service

### Optional

- `PREFIX_ENABLED` - Enable/disable the package (default: true)
- `PREFIX_TIMEOUT` - Request timeout in ms (default: 30000)
- `PREFIX_DEBUG` - Enable debug logging (default: false)
```

---

## Decision Points

### 1. Should packages have direct access to process.env?
**Recommendation**: No, packages should access through core helper to maintain consistency.

### 2. Should package environment variables be validated at runtime?
**Recommendation**: Yes, but optionally. Core env is validated, packages can opt-in.

### 3. Should we support different env files per package?
**Recommendation**: No, keep it simple. All env vars in root .env files with prefixes.

### 4. Should package env vars be shared across workspaces?
**Recommendation**: No, env vars are workspace-scoped for security and isolation.

---

## Files to Create

1. `apps/core/src/env.ts` - Core environment validation
2. `packages/env/src/index.ts` - Shared environment utilities
3. `packages/env/package.json` - Environment package configuration
4. `.env.example` - Root environment template
5. `.env.local.example` - Development environment template
6. `.env.test.example` - Testing environment template

---

## Files to Update

1. `apps/core/package.json` - Add @t3-oss/env-nextjs dependency
2. `apps/core/src/config/index.ts` - Export env configuration
3. `turbo.json` - Add env validation pipeline
4. Each package's README.md - Document environment variables
5. Each package's initialization code - Use env helpers

This approach provides flexibility for packages while maintaining a clear, type-safe, and documented environment variable system.