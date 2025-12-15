#!/usr/bin/env bun

import { db } from "../src/server/db";
import { sql } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

async function backupDatabase() {
  console.log("📋 Creating database backup...");

  try {
    // Get all table names
    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tableNames = tables.map((row: any) => row.table_name as string);
    console.log(`Found tables: ${tableNames.join(", ")}`);

    let backupSQL = "-- Database backup created at " + new Date().toISOString() + "\n";
    backupSQL += "-- Database: YDTB (Your Digital Toolbox)\n\n";

    // Disable constraints during restore
    backupSQL += "-- Disable foreign key constraints\n";
    backupSQL += "SET session_replication_role = replica;\n\n";

    // For each table, get the data and generate INSERT statements
    for (const tableName of tableNames) {
      console.log(`📄 Backing up table: ${tableName}`);

      try {
        // Get table structure
        const columns = await db.execute(sql`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = ${tableName}
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `);

        const columnNames = columns.map((col: any) => col.column_name).join(", ");

        // Get all data
        const rows = await db.execute(sql`SELECT * FROM "${tableName}"`);

        if (rows.length > 0) {
          backupSQL += `-- Data for table: ${tableName}\n`;

          for (const row of rows) {
            const values = Object.values(row as any).map(value => {
              if (value === null) return 'NULL';
              if (typeof value === 'string') {
                // Escape single quotes in strings
                const escaped = value.replace(/'/g, "''");
                return `'${escaped}'`;
              }
              if (value instanceof Date) {
                return `'${value.toISOString()}'`;
              }
              if (typeof value === 'object') {
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
              }
              return value;
            });

            backupSQL += `INSERT INTO "${tableName}" (${columnNames}) VALUES (${values.join(", ")});\n`;
          }

          backupSQL += "\n";
        } else {
          backupSQL += `-- Table ${tableName} is empty\n\n`;
        }
      } catch (error) {
        console.warn(`⚠️  Could not backup table ${tableName}:`, error);
      }
    }

    // Re-enable constraints
    backupSQL += "-- Re-enable foreign key constraints\n";
    backupSQL += "SET session_replication_role = DEFAULT;\n\n";

    // Write backup to file
    const backupPath = path.join(process.cwd(), "database-backup.sql");
    await fs.writeFile(backupPath, backupSQL, "utf-8");

    console.log("\n✅ Database backup created successfully!");
    console.log(`📍 Location: ${backupPath}`);

    // Show file size
    const stats = await fs.stat(backupPath);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error("\n❌ Error creating backup:", error);
    process.exit(1);
  }
}

// Run backup
backupDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Backup failed:", error);
  process.exit(1);
});