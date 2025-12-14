# Unit 1.2: Environment Variables for Monorepo
**Folder**: `02-environment-variables`

**Purpose**: Implement type-safe environment variable management using a Hybrid Approach where core defines required variables and packages can register optional ones

**Context**:
- Moving from monolithic to monorepo architecture
- Core app needs environment variables (database URL, auth secrets, etc.)
- Packages need to register their own environment variables (API keys, feature flags)
- Using @t3-oss/env-nextjs for type-safe environment variables
- Must support development, testing, and production environments

**Definition of Done**:
- ✅ Environment registry system implemented
- ✅ Core environment validation with @t3-oss/env-nextjs
- ✅ Package environment schema registration system
- ✅ Type-safe environment variable access for all packages
- ✅ Environment template generation from registry
- ✅ Documentation for package developers

---

## Implementation: Hybrid Approach with Environment Registry

The Hybrid Approach uses an environment registry where:
- Core defines required environment variables (database, auth, app URL)
- Packages register their optional environment variables (API keys, feature flags)
- All schemas are merged at build time with full type safety

### 1. Environment Registry System

#### `packages/env/src/registry.ts`
```typescript
import { z } from "zod";

export interface PackageEnvSchema {
  server?: Record<string, z.ZodType>;
  client?: Record<string, z.ZodType>;
}

class EnvRegistry {
  private schemas = new Map<string, PackageEnvSchema>();

  register(packageName: string, schema: PackageEnvSchema) {
    this.schemas.set(packageName, schema);
  }

  getAll() {
    return Array.from(this.schemas.entries());
  }

  getMergedSchema() {
    const server: Record<string, z.ZodType> = {};
    const client: Record<string, z.ZodType> = {};

    for (const [_, schema] of this.schemas) {
      if (schema.server) {
        Object.assign(server, schema.server);
      }
      if (schema.client) {
        Object.assign(client, schema.client);
      }
    }

    return { server, client };
  }
}

export const envRegistry = new EnvRegistry();
```

### 2. Core Environment Variables with Registry Integration

#### `apps/core/src/env.ts`
```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envRegistry } from "@ydtb/env/registry";

// Import all packages to trigger registration
import "@ydtb/analytics";
import "@ydtb/notifications";
// Add more imports as packages are created

// Get merged schema from registry
const { server: packageServer, client: packageClient } = envRegistry.getMergedSchema();

// Core required environment variables
const coreServerSchema = {
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  // Add other core variables as needed
};

const coreClientSchema = {
  NEXT_PUBLIC_APP_URL: z.string().url(),
};

// Merge core and package schemas
const server = { ...coreServerSchema, ...packageServer };
const client = { ...coreClientSchema, ...packageClient };

// Build runtime env object dynamically
const runtimeEnv: Record<string, string | undefined> = {
  // Core variables
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

// Add all registered package variables
for (const [_, schema] of envRegistry.getAll()) {
  for (const key of Object.keys(schema.server || {})) {
    runtimeEnv[key] = process.env[key];
  }
  for (const key of Object.keys(schema.client || {})) {
    runtimeEnv[key] = process.env[key];
  }
}

export const env = createEnv({
  server,
  client,
  runtimeEnv,
  emptyStringAsUndefined: true,
});
```

### 3. Package Environment Registration Pattern

#### `packages/analytics/src/index.ts`
```typescript
import { envRegistry } from "@ydtb/env/registry";
import { z } from "zod";

// Register environment schema when package is imported
envRegistry.register("analytics", {
  server: {
    ANALYTICS_POSTHOG_API_KEY: z.string().optional(),
    ANALYTICS_GA_MEASUREMENT_ID: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_ANALYTICS_ENABLED: z.coerce.boolean().default(true),
    NEXT_PUBLIC_ANALYTICS_DEBUG: z.coerce.boolean().default(false),
  },
});

// Export package functionality
export const analyticsService = {
  // Package implementation using env variables
  init() {
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
      // Initialize analytics
    }
  },
};
```

### 4. Environment Template Generation

#### `scripts/generate-env-example.js`
```javascript
import { envRegistry } from "@ydtb/env/registry";
import "@ydtb/analytics";
import "@ydtb/notifications";
import fs from "fs";

let example = `# Core Environment Variables
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit
BETTER_AUTH_SECRET=your-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Package Environment Variables
`;

// Add package variables with descriptions
for (const [packageName, schema] of envRegistry.getAll()) {
  example += `\n# ${packageName} Package\n`;

  if (schema.server) {
    for (const [key, zodSchema] of Object.entries(schema.server)) {
      const description = zodSchema._def.description || "Description needed";
      example += `# ${description}\n${key}=\n`;
    }
  }

  if (schema.client) {
    for (const [key, zodSchema] of Object.entries(schema.client)) {
      const description = zodSchema._def.description || "Description needed";
      example += `# ${description}\n${key}=\n`;
    }
  }
}

fs.writeFileSync(".env.example", example);
console.log("✅ .env.example generated from registry");
```

### 5. Usage in Packages

#### `packages/analytics/src/service.ts`
```typescript
// Type-safe access to environment variables
import { env } from "@/env";

export class AnalyticsService {
  constructor() {
    // All environment variables are validated and type-safe
    this.posthogApiKey = env.ANALYTICS_POSTHOG_API_KEY;
    this.enabled = env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  }
}
```

### 6. Validation Script

Add to `package.json` in core:
```json
{
  "scripts": {
    "env:validate": "bun -e \"import('./src/env').then(m => m.env)\"",
    "env:generate": "bun scripts/generate-env-example.js"
  }
}
```

### 7. Documentation for Package Developers

#### Template for package README:
```markdown
## Environment Variables

This package registers its environment variables with the core application.

### Registration
```typescript
// In your package's index.ts
import { envRegistry } from "@ydtb/env/registry";
import { z } from "zod";

envRegistry.register("your-package", {
  server: {
    YOUR_PACKAGE_API_KEY: z.string().describe("API key for external service"),
  },
  client: {
    NEXT_PUBLIC_YOUR_PACKAGE_ENABLED: z.coerce.boolean().default(true)
      .describe("Enable/disable the package"),
  },
});
```

### Available Variables
- `YOUR_PACKAGE_API_KEY` (server): API key for external service
- `NEXT_PUBLIC_YOUR_PACKAGE_ENABLED` (client): Enable/disable the package (default: true)

### Accessing Variables
```typescript
import { env } from "@/env";

const apiKey = env.YOUR_PACKAGE_API_KEY;
const enabled = env.NEXT_PUBLIC_YOUR_PACKAGE_ENABLED;
```
```

---

## Files to Create

1. `packages/env/package.json` - Environment package configuration
2. `packages/env/src/registry.ts` - Environment registry system
3. `apps/core/src/env.ts` - Core environment with registry integration
4. `scripts/generate-env-example.js` - Environment template generator
5. `.env.example` - Generated environment template

---

## Files to Update

1. `apps/core/package.json` - Add @t3-oss/env-nextjs dependency
2. `apps/core/turbo.json` - Add env validation pipeline
3. All packages' `src/index.ts` - Register environment schemas
4. All packages' README.md - Document environment variables
5. Root `package.json` - Add env scripts

---

## Integration with Registry System

The environment registry works seamlessly with the package registry system:

1. **Package Registration**: When a package registers with the tool registry, it also registers its environment schema
2. **Validation**: All registered environment variables are validated at startup
3. **Type Safety**: Full TypeScript support for all environment variables
4. **Documentation**: Auto-generated .env.example from all registered packages

This approach ensures that all packages can safely register their environment requirements while maintaining type safety and centralized configuration.