import { z } from "zod";

export interface PackageEnvSchema {
  server?: Record<string, z.ZodType>;
  client?: Record<string, z.ZodType>;
}

class EnvRegistry {
  private schemas = new Map<string, PackageEnvSchema>();

  register(packageName: string, schema: PackageEnvSchema) {
    if (this.schemas.has(packageName)) {
      console.warn(`Environment schema for package "${packageName}" is already registered. Overwriting.`);
    }
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

  clear() {
    this.schemas.clear();
  }

  has(packageName: string) {
    return this.schemas.has(packageName);
  }

  get(packageName: string) {
    return this.schemas.get(packageName);
  }
}

export const envRegistry = new EnvRegistry();