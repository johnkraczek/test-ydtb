import { z } from "zod";

// Workspace ID validation schema
export const workspaceIdSchema = z.string()
  .min(10)
  .max(20)
  .regex(/^[a-zA-Z0-9]+$/, "Workspace ID must be alphanumeric");

// Generate a random workspace ID (defaulting to 10 characters for efficiency)
export function generateWorkspaceId(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
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