#!/usr/bin/env bun

import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

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
    console.log("\n🗑️  Dropping all tables...");

    // Drop all tables in correct order (respecting foreign keys)
    const tables = [
      "ydtb_workspace_members",
      "ydtb_workspaces",
      "ydtb_sessions",
      "ydtb_passkeys",
      "ydtb_verifications",
      "ydtb_accounts",
      "ydtb_users"
    ];

    // Disable foreign key constraints temporarily
    await db.execute(sql`SET session_replication_role = replica;`);

    // Drop each table
    for (const table of tables) {
      try {
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`));
        console.log(`✅ Dropped table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Table ${table} may not exist or already dropped`);
      }
    }

    // Re-enable foreign key constraints
    await db.execute(sql`SET session_replication_role = DEFAULT;`);

    console.log("\n✨ All tables dropped successfully!");

    // Run drizzle-kit push
    console.log("\n🔄 Running drizzle-kit push to recreate tables...");
    const { spawn } = await import("child_process");

    await new Promise((resolve, reject) => {
      const pushProcess = spawn("bun", ["run", "drizzle-kit", "push"], {
        stdio: "inherit",
        cwd: process.cwd()
      });

      pushProcess.on("close", (code) => {
        if (code === 0) {
          console.log("✅ Database schema recreated successfully!");
          resolve(null);
        } else {
          reject(new Error(`Drizzle push failed with code ${code}`));
        }
      });
    });

    // Seed with initial data
    console.log("\n🌱 Seeding database with initial data...");
    await seedDatabase();

    console.log("\n🎉 Database reset and seeding complete!");
    console.log("\n📝 Seed data created:");
    console.log("   - 1 user (John Kraczek - john@kraczek.com)");
    console.log("   - Account with original password restored");
    console.log("   - Ready for testing authentication");

  } catch (error) {
    console.error("\n❌ Error resetting database:", error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    console.log("📝 Seeding database with initial data...");

    // Insert user
    await db.execute(sql`
      INSERT INTO ydtb_users (id, name, email, email_verified, two_factor_enabled, created_at, updated_at)
      VALUES (
        'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n',
        'John Kraczek',
        'john@kraczek.com',
        false,
        false,
        '2025-12-14T05:17:23.913Z',
        '2025-12-14T05:17:23.913Z'
      )
    `);
    console.log("   ✅ Inserted user");

    // Insert account with password
    await db.execute(sql`
      INSERT INTO ydtb_accounts (id, user_id, provider_id, account_id, password, created_at, updated_at)
      VALUES (
        'EdftQ5DJ9IGsDvPs2bOqoCrth32ZIaIG',
        'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n',
        'credential',
        'Uh5h6tm4BRmXowwz6T30X3f0gjbeph0n',
        'c45e860a7f6fb2033b51794f8db50b39:dbae3752ef6ef995bbf752993df073c7e5f99a898823b32bfabd1fa79c7822c6874ae9358a5754edb540f92ee97790e05477b7e64ebd91f0f849faf29739ef1d',
        '2025-12-14T05:17:23.927Z',
        '2025-12-14T05:17:23.927Z'
      )
    `);
    console.log("   ✅ Inserted account with password");

    console.log("✅ Database seeded with initial data");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Export command for drizzle-kit studio
console.log(`
📤 To export data from drizzle-kit studio, run:
   1. Open Drizzle Studio: bun run drizzle-kit studio
   2. Go to your database
   3. Select all tables you want to export
   4. Click Export → SQL
   5. Save the SQL file

📋 After exporting, update the seedDatabase() function in this script with the INSERT statements.
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