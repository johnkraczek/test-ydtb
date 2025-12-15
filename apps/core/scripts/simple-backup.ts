#!/usr/bin/env bun

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

async function createBackup() {
  try {
    console.log("📋 Creating database backup...");

    const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:1FwHvl2Y3wV5bopo@localhost:5432/ydtb";
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `database-${timestamp}.sql`;

    // Ensure backup directory exists
    const backupDir = path.join(process.cwd(), "scripts", "backup");
    await fs.mkdir(backupDir, { recursive: true });

    const backupPath = path.join(backupDir, filename);

    // Use pg_dump to create a complete backup
    console.log(`💾 Creating backup: ${filename}`);
    const command = `/opt/homebrew/opt/postgresql@18/bin/pg_dump "${DATABASE_URL}" --no-owner --no-privileges > "${backupPath}"`;

    await execAsync(command);

    // Check file size
    const stats = await fs.stat(backupPath);
    console.log(`✅ Backup created successfully!`);
    console.log(`📍 Location: ${backupPath}`);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);

    console.log("\n💡 To use this backup for reset:");
    console.log(`   1. Copy: cp ${filename} reset.sql`);
    console.log(`   2. Run: bun run db:reset:force`);

  } catch (error) {
    console.error("\n❌ Error creating backup:", error);
    process.exit(1);
  }
}

// Run backup
createBackup().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Backup failed:", error);
  process.exit(1);
});