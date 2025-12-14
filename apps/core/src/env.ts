import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { envRegistry } from "./registry/env-registry";

// Import and register all package environment schemas
import { registerEnvironment as registerBasicEnv } from "@ydtb/basic";
registerBasicEnv(envRegistry);

// Get merged schema from registry
const { server: packageServer, client: packageClient } = envRegistry.getMergedSchema();

// Core required environment variables
const coreServerSchema = {
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // Add other core variables as needed
};

const coreClientSchema = {
  NEXT_PUBLIC_APP_URL: z.string().url(),
};

// Merge core and package schemas
const server = { ...coreServerSchema, ...packageServer };
const client = { ...coreClientSchema, ...packageClient };

// Build runtime env object with all variables
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

// Create env with immediate validation
export const env = createEnv({
  server,
  client,
  runtimeEnv,
  emptyStringAsUndefined: true,
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});