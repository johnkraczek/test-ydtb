import { envRegistry, PackageEnvSchema } from "./env-registry";
import { z } from "zod";

/**
 * Helper function to register a module's environment variables
 *
 * @param moduleName - The name of the module (should be unique)
 * @param schema - The environment schema for the module
 *
 * @example
 * ```typescript
 * import { registerModule } from "./registry/register-module";
 * import { z } from "zod";
 *
 * registerModule("analytics", {
 *   server: {
 *     ANALYTICS_API_KEY: z.string().describe("Analytics API key"),
 *   },
 *   client: {
 *     NEXT_PUBLIC_ANALYTICS_ENABLED: z.coerce.boolean().default(true)
 *       .describe("Enable analytics tracking"),
 *   },
 * });
 * ```
 */
export function registerModule(moduleName: string, schema: PackageEnvSchema) {
  envRegistry.register(moduleName, schema);

  // Log that the module has been registered (only in development)
  if (process.env.NODE_ENV === "development") {
    const serverVars = Object.keys(schema.server || {}).length;
    const clientVars = Object.keys(schema.client || {}).length;
    console.log(
      `📦 Module "${moduleName}" registered with environment variables:`,
      `${serverVars} server-side, ${clientVars} client-side`
    );
  }
}

/**
 * Helper function to create a standard Zod schema for common environment variable patterns
 */
export const createEnvSchema = {
  /**
   * Create a required API key schema
   */
  apiKey: (description: string) =>
    z.string().min(1).describe(description),

  /**
   * Create an optional API key schema
   */
  optionalApiKey: (description: string) =>
    z.string().optional().describe(description),

  /**
   * Create a URL schema
   */
  url: (description: string) =>
    z.string().url().describe(description),

  /**
   * Create an optional URL schema
   */
  optionalUrl: (description: string) =>
    z.string().url().optional().describe(description),

  /**
   * Create a boolean flag schema (client-side)
   */
  flag: (description: string, defaultValue = false) =>
    z.coerce.boolean().default(defaultValue).describe(description),

  /**
   * Create a port number schema
   */
  port: (description: string, defaultValue = 3000) =>
    z.coerce.number().int().min(1).max(65535).default(defaultValue).describe(description),

  /**
   * Create a secret key schema
   */
  secret: (description: string, minLength = 32) =>
    z.string().min(minLength).describe(description),
};