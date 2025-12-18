import { pgTableCreator } from "drizzle-orm/pg-core";

// Use pgTableCreator for consistent ydtb_ prefix
export const createTable = pgTableCreator((name) => `ydtb_${name}`);