#!/usr/bin/env bun

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

async function resetDatabase() {
  // Check for --force flag
  const forceFlag = process.argv.includes('--force');

  if (!forceFlag) {
    console.log("⚠️  WARNING: This will drop all tables and reset the database!");

    // Get confirmation
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question("Are you sure you want to continue? (yes/no): ", resolve);
    });

    rl.close();

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Database reset cancelled.");
      process.exit(0);
    }
  } else {
    console.log("⚠️  FORCE MODE: Dropping all tables and resetting the database...");
  }

  try {
    const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:1FwHvl2Y3wV5bopo@localhost:5432/ydtb";

    // Step 1: Drop all tables
    console.log("\n🗑️  Dropping all tables...");
    const dropTablesSQL = `
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
        END LOOP;
      END $$;
    `;

    // Write SQL to temp file
    const tempFile = path.join(process.cwd(), "scripts", "backup", "temp-drop.sql");
    await fs.writeFile(tempFile, dropTablesSQL, "utf-8");

    // Execute the SQL
    await execAsync(`/opt/homebrew/opt/postgresql@18/bin/psql "${DATABASE_URL}" < "${tempFile}"`);

    // Clean up temp file
    await fs.unlink(tempFile);

    console.log("✅ All tables dropped successfully!");

    // Step 2: Check if reset.sql exists
    const resetPath = path.join(process.cwd(), "scripts", "backup", "reset.sql");

    try {
      await fs.access(resetPath);
    } catch (error) {
      console.error("\n❌ Error: reset.sql file not found!");
      console.error("Please copy one of the database-*.sql files to reset.sql first.");
      console.log("\nAvailable backups:");

      // List available backups
      const backupDir = path.join(process.cwd(), "scripts", "backup");
      const files = await fs.readdir(backupDir);
      const backups = files.filter(f => f.startsWith('database-') && f.endsWith('.sql'));

      if (backups.length === 0) {
        console.log("   No backups found. Run 'bun run db:backup' first.");
      } else {
        backups.forEach(file => console.log(`   - ${file}`));
        console.log("\nExample: cp database-2025-12-15T15-30-00.sql reset.sql");
      }
      process.exit(1);
    }

    // Step 3: Restore from reset.sql
    console.log("\n📂 Restoring database from reset.sql...");
    await execAsync(`/opt/homebrew/opt/postgresql@18/bin/psql "${DATABASE_URL}" < "${resetPath}"`);
    console.log("✅ Database restored successfully!");

    console.log("\n🎉 Database reset and restore complete!");

  } catch (error) {
    console.error("\n❌ Error resetting database:", error);
    process.exit(1);
  }
}

// Export command for drizzle-kit studio
console.log(`
💾 To create a backup: bun run db:backup
🔄 To reset database: bun run db:reset:force

📝 Usage:
  1. Create backup: bun run db:backup
  2. Set restore point: cp database-<timestamp>.sql reset.sql
  3. Reset database: bun run db:reset:force
`);

// Run the reset
resetDatabase()
  .then(() => {
    console.log("\n✅ Reset process completed. Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });