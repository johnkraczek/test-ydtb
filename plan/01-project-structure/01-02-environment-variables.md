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
- ✅ Environment registry system implemented in core
- ✅ Build-time environment variable collection
- ✅ Core environment validation with @t3-oss/env-nextjs
- ✅ Package environment schema registration without circular dependencies
- ✅ Type-safe environment variable access for all packages
- ✅ Environment template generation from registry
- ✅ Documentation for package developers

---

## Implementation: Hybrid Approach with Build-time Environment Collection

The Hybrid Approach uses a build-time environment collection strategy where:
- Core defines required environment variables (database, auth, app URL)
- Packages declare their environment variables in separate files
- All schemas are collected at build time without direct imports
- Full type safety maintained throughout

### 1. Environment Registry System

#### `apps/core/src/registry/env.ts`
```typescript
import { z } from "zod";

export interface PackageEnvSchema {
  server?: Record<string, z.ZodType>;
  client?: Record<string, z.ZodType>;
}

class EnvRegistry {
  private schemas = new Map<string, PackageEnvSchema>();
  private isFinalized = false;

  register(packageName: string, schema: PackageEnvSchema) {
    if (this.isFinalized) {
      throw new Error(`Environment registry is finalized. Cannot register ${packageName}`);
    }

    // Check for conflicts
    for (const [key] of Object.keys(schema.server || {})) {
      if (this.hasKeyConflict(key, packageName)) {
        throw new Error(
          `Environment variable conflict: ${key} already registered by ${this.getPackageForKey(key)}`
        );
      }
    }

    for (const [key] of Object.keys(schema.client || {})) {
      if (this.hasKeyConflict(key, packageName)) {
        throw new Error(
          `Environment variable conflict: ${key} already registered by ${this.getPackageForKey(key)}`
        );
      }
    }

    this.schemas.set(packageName, schema);
  }

  private hasKeyConflict(key: string, excludePackage: string): boolean {
    for (const [pkgName, schema] of this.schemas) {
      if (pkgName === excludePackage) continue;
      if (schema.server?.[key] || schema.client?.[key]) {
        return true;
      }
    }
    return false;
  }

  private getPackageForKey(key: string): string {
    for (const [pkgName, schema] of this.schemas) {
      if (schema.server?.[key] || schema.client?.[key]) {
        return pkgName;
      }
    }
    return "unknown";
  }

  finalize() {
    this.isFinalized = true;
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

### 2. Package Discovery and Build-time Collection

#### `apps/core/src/registry/discover-packages.ts`
```typescript
// This file handles package discovery without importing them directly
import fs from "fs";
import path from "path";

interface PackageInfo {
  name: string;
  path: string;
  envSchemaPath?: string;
}

export function discoverPackages(): PackageInfo[] {
  const packagesDir = path.resolve(__dirname, "../../../packages");
  const packages: PackageInfo[] = [];

  if (!fs.existsSync(packagesDir)) {
    return packages;
  }

  const packageFolders = fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of packageFolders) {
    const packageJsonPath = path.join(packagesDir, folder, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        const envSchemaPath = path.join(packagesDir, folder, "src", "env-schema.ts");

        packages.push({
          name: packageJson.name || folder,
          path: path.join(packagesDir, folder),
          envSchemaPath: fs.existsSync(envSchemaPath) ? envSchemaPath : undefined,
        });
      } catch (error) {
        console.warn(`Failed to read package.json for ${folder}:`, error);
      }
    }
  }

  return packages;
}

// Build-time function to collect all environment schemas
export function collectEnvironmentSchemas() {
  const packages = discoverPackages();
  const schemas: Array<{ packageName: string; schema: any }> = [];

  for (const pkg of packages) {
    if (pkg.envSchemaPath) {
      try {
        // Dynamic import to avoid circular dependencies
        const envModule = require(pkg.envSchemaPath);
        if (envModule.envSchema) {
          schemas.push({
            packageName: pkg.name,
            schema: envModule.envSchema,
          });
        }
      } catch (error) {
        console.warn(`Failed to load env schema for ${pkg.name}:`, error);
      }
    }
  }

  return schemas;
}
```

### 3. Build-time Environment Schema Builder

#### `scripts/build-env-schemas.js`
```javascript
const fs = require('fs');
const path = require('path');

// This script runs at build time to create the consolidated environment schemas
function buildEnvSchemas() {
  const packagesDir = path.resolve(__dirname, '../packages');
  const coreDir = path.resolve(__dirname, '../apps/core/src');

  const schemas = [];

  // Discover packages
  if (fs.existsSync(packagesDir)) {
    const packageFolders = fs.readdirSync(packagesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folder of packageFolders) {
      const envSchemaPath = path.join(packagesDir, folder, 'src', 'env-schema.ts');

      if (fs.existsSync(envSchemaPath)) {
        try {
          // Read the env schema file content
          const content = fs.readFileSync(envSchemaPath, 'utf-8');
          const packageName = require(path.join(packagesDir, folder, 'package.json')).name;

          // Extract the schema export
          const schemaMatch = content.match(/export const envSchema\s*=\s*({[\s\S]*?})\s*;?\s*$/m);
          if (schemaMatch) {
            schemas.push({
              packageName,
              schema: schemaMatch[1]
            });
          }
        } catch (error) {
          console.warn(`Failed to process env schema for ${folder}:`, error);
        }
      }
    }
  }

  // Generate the consolidated schemas file
  const template = `// Auto-generated at build time - do not edit manually
import { envRegistry } from './registry/env';
import { z } from 'zod';

// Register all package environment schemas
${schemas.map(({ packageName, schema }) => {
  return `// ${packageName}\nenvRegistry.register('${packageName.replace(/[^a-zA-Z0-9]/g, '')}', ${schema});`;
}).join('\n\n')}

// Finalize registry to prevent further registrations
envRegistry.finalize();
`;

  fs.writeFileSync(path.join(coreDir, 'registry', 'package-env-schemas.ts'), template);
  console.log(`✅ Generated environment schemas for ${schemas.length} packages`);
}

buildEnvSchemas();
```

### 4. Core Environment Variables with Registry Integration

#### `apps/core/src/env.ts`
```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envRegistry } from "./registry/env";
// Import the generated package schemas (build-time)
import "./registry/package-env-schemas";

// Get merged schema from registry
const { server: packageServer, client: packageClient } = envRegistry.getMergedSchema();

// Core required environment variables
const coreServerSchema = {
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
};

const coreClientSchema = {
  NEXT_PUBLIC_APP_URL: z.string().url(),
};

// Merge core and package schemas
const server = { ...coreServerSchema, ...packageServer };
const client = { ...coreClientSchema, ...packageClient };

// Build runtime env object
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

### 5. Package Environment Declaration Pattern

#### `packages/analytics/src/env-schema.ts`
```typescript
import { z } from "zod";

export const envSchema = {
  server: {
    ANALYTICS_POSTHOG_API_KEY: z.string().optional()
      .describe("PostHog API key for analytics tracking"),
    ANALYTICS_GA_MEASUREMENT_ID: z.string().optional()
      .describe("Google Analytics measurement ID"),
  },
  client: {
    NEXT_PUBLIC_ANALYTICS_ENABLED: z.coerce.boolean().default(true)
      .describe("Enable/disable analytics tracking"),
    NEXT_PUBLIC_ANALYTICS_DEBUG: z.coerce.boolean().default(false)
      .describe("Enable debug mode for analytics"),
  },
};

// Note: No registration happens here - it's done at build time
```

#### `packages/analytics/src/index.ts`
```typescript
// Package index - no environment registration needed
// Environment variables are available through the core env import

export const analyticsService = {
  init() {
    // Will import env from core when needed
  },
};
```

### 6. Usage in Packages

#### `packages/analytics/src/service.ts`
```typescript
// Import environment from core
import { env } from "@/env";

export class AnalyticsService {
  constructor() {
    // Type-safe access to environment variables
    this.posthogApiKey = env.ANALYTICS_POSTHOG_API_KEY;
    this.enabled = env.NEXT_PUBLIC_ANALYTICS_ENABLED;
  }
}
```

### 7. Build Pipeline Integration

#### Add to `turbo.json`:
```json
{
  "pipeline": {
    "env:build": {
      "dependsOn": [],
      "outputs": ["apps/core/src/registry/package-env-schemas.ts"]
    },
    "build": {
      "dependsOn": ["^build", "env:build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    }
  }
}
```

#### Add to root `package.json`:
```json
{
  "scripts": {
    "env:build": "node scripts/build-env-schemas.js",
    "env:generate": "node scripts/generate-env-example.js",
    "env:validate": "bun -e \"import('./apps/core/src/env').then(m => m.env)\""
  }
}
```

### 8. Environment Template Generation

#### `scripts/generate-env-example.js`
```javascript
const fs = require('fs');
const path = require('path');

// Read the generated schemas file to extract environment variables
function generateEnvExample() {
  const schemasFile = path.resolve(__dirname, '../apps/core/src/registry/package-env-schemas.ts');
  const coreEnvFile = path.resolve(__dirname, '../apps/core/src/env.ts');

  if (!fs.existsSync(schemasFile)) {
    console.error('Package environment schemas not found. Run env:build first.');
    process.exit(1);
  }

  let example = `# Core Environment Variables
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit
BETTER_AUTH_SECRET=your-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Package Environment Variables
`;

  // Extract environment variables from schemas
  const content = fs.readFileSync(schemasFile, 'utf-8');
  const registerCalls = content.match(/envRegistry\.register\([^,]+,\s*({[\s\S]*?})\);/g) || [];

  for (const call of registerCalls) {
    const schemaMatch = call.match(/{([\s\S]*?)}/);
    if (schemaMatch) {
      try {
        // Simple parsing to extract variable names and descriptions
        const lines = schemaMatch[1].split('\n');
        let packageName = '';

        for (const line of lines) {
          const match = line.match(/\/\/\s*(.+)$/);
          if (match && !packageName) {
            packageName = match[1].trim() + '\n';
          }

          const varMatch = line.match(/(\w+):\s*z\.\w+/);
          if (varMatch) {
            example += `\n${packageName}${varMatch[1]}=`;
            packageName = ''; // Only show package name once
          }
        }
      } catch (error) {
        console.warn('Failed to parse schema:', error);
      }
    }
  }

  fs.writeFileSync('.env.example', example);
  console.log('✅ .env.example generated');
}

generateEnvExample();
```

---

## Files to Create

1. `apps/core/src/registry/env.ts` - Environment registry system
2. `apps/core/src/registry/discover-packages.ts` - Package discovery utilities
3. `scripts/build-env-schemas.js` - Build-time schema collector
4. `scripts/generate-env-example.js` - Environment template generator
5. `.env.example` - Generated environment template

---

## Files to Update

1. `apps/core/src/env.ts` - Core environment with registry integration
2. All packages' `src/env-schema.ts` - Declare environment schemas
3. `apps/core/turbo.json` - Add env:build pipeline
4. Root `package.json` - Add env scripts
5. All packages' README.md - Document environment variables

---

## Key Advantages of This Approach

1. **No Circular Dependencies**: Packages don't import core, core doesn't import packages
2. **Build-time Resolution**: All environment variables resolved before Next.js starts
3. **Conflict Detection**: Prevents duplicate environment variable names
4. **Type Safety**: Full TypeScript support with @t3-oss/env-nextjs
5. **Automatic Discovery**: New packages automatically included
6. **Clear Separation**: Packages declare, core manages

---

## Integration with Registry System

The environment registry works seamlessly with the package registry system:

1. **No Import Conflicts**: Environment schemas collected without direct imports
2. **Build-time Only**: Environment variables resolved before app startup
3. **Consistent Pattern**: Follows same registry pattern as other systems
4. **Clean Architecture**: Clear separation between declaration and registration