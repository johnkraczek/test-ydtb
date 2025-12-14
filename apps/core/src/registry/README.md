# Environment Registry

The environment registry system allows modules to register their environment variables for centralized validation and type safety.

## How it works

1. Modules register their environment variables using `envRegistry.register()`
2. The core app merges all registered schemas at runtime
3. All variables are validated and type-safe using `@t3-oss/env-nextjs`
4. The `.env.example` file is generated from all registered schemas

## Registering environment variables

In your module's entry file, register your environment schema:

```typescript
import { envRegistry } from "./registry/env-registry";
import { z } from "zod";

// Register environment schema when module is imported
envRegistry.register("your-module", {
  server: {
    YOUR_MODULE_API_KEY: z.string().describe("API key for external service"),
    YOUR_MODULE_SECRET: z.string().min(32).describe("Secret key for authentication"),
  },
  client: {
    NEXT_PUBLIC_YOUR_MODULE_ENABLED: z.coerce.boolean().default(true)
      .describe("Enable/disable the module"),
    NEXT_PUBLIC_YOUR_MODULE_DEBUG: z.coerce.boolean().default(false)
      .describe("Enable debug mode"),
  },
});
```

## Accessing environment variables

All environment variables are available through the global `env` object:

```typescript
import { env } from "./env";

// Server-side
const apiKey = env.YOUR_MODULE_API_KEY;
const secret = env.YOUR_MODULE_SECRET;

// Client-side (NEXT_PUBLIC_ prefixed only)
const isEnabled = env.NEXT_PUBLIC_YOUR_MODULE_ENABLED;
const isDebug = env.NEXT_PUBLIC_YOUR_MODULE_DEBUG;
```

## Best practices

1. **Use descriptive names**: Prefix with your module name to avoid conflicts
2. **Add descriptions**: Use `.describe()` to document what the variable does
3. **Provide defaults**: Use `.default()` for optional variables
4. **Validate properly**: Use appropriate Zod types (`.string()`, `.boolean()`, `.url()`, etc.)
5. **Client-side only**: Only `NEXT_PUBLIC_` prefixed variables are available on the client

## Generating .env.example

Run the following command to generate the `.env.example` file from all registered modules:

```bash
bun env:generate
```

This will create a comprehensive `.env.example` file in the root directory with all registered environment variables and their descriptions.