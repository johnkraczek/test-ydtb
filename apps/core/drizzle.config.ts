import { config } from "dotenv";

import type { Config } from "drizzle-kit";

// Load environment variables from .env.local
config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  tablesFilter: ["ydtb_*"],
} satisfies Config;
