#!/usr/bin/env bun

import { db } from "../src/server/db";
import { sql } from "drizzle-orm";
import { user, account, session, workspaces, workspaceMembers, invitation } from "../src/server/db/schema";
import fs from "fs/promises";
import path from "path";

async function createBackup() {
  console.log("📋 Creating database backup...");

  const backup: any = {
    timestamp: new Date().toISOString(),
    tables: {}
  };

  try {
    // Get all users
    const users = await db.select().from(user);
    backup.tables.users = users;
    console.log(`✓ Backed up ${users.length} users`);

    // Get all accounts
    const accounts = await db.select().from(account);
    backup.tables.accounts = accounts;
    console.log(`✓ Backed up ${accounts.length} accounts`);

    // Get all sessions
    const sessions = await db.select().from(session);
    backup.tables.sessions = sessions;
    console.log(`✓ Backed up ${sessions.length} sessions`);

    // Get all workspaces
    const workspaces_data = await db.select().from(workspaces);
    backup.tables.workspaces = workspaces_data;
    console.log(`✓ Backed up ${workspaces_data.length} workspaces`);

    // Get all workspace members
    const members = await db.select().from(workspaceMembers);
    backup.tables.workspaceMembers = members;
    console.log(`✓ Backed up ${members.length} workspace members`);

    // Get all invitations
    const invitations = await db.select().from(invitation);
    backup.tables.invitations = invitations;
    console.log(`✓ Backed up ${invitations.length} invitations`);

    // Write backup to JSON file
    const backupDir = path.join(process.cwd(), "scripts", "backup");

    // Ensure the backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    const backupPath = path.join(backupDir, "database-backup.json");
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2), "utf-8");

    console.log("\n✅ Database backup created successfully!");
    console.log(`📍 Location: ${backupPath}`);

    // Show file size
    const stats = await fs.stat(backupPath);
    console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Also create an SQL restore script
    const sqlScript = createRestoreScript(backup);
    const sqlPath = path.join(backupDir, "database-restore.sql");
    await fs.writeFile(sqlPath, sqlScript, "utf-8");

    console.log(`📍 SQL restore script: ${sqlPath}`);

    // Create the reset.sql file for the reset script to use
    const resetScript = createResetScript(backup);
    const resetPath = path.join(backupDir, "reset.sql");
    await fs.writeFile(resetPath, resetScript, "utf-8");

    console.log(`📍 Reset SQL script: ${resetPath}`);

  } catch (error) {
    console.error("\n❌ Error creating backup:", error);
    process.exit(1);
  }
}

function createRestoreScript(backup: any): string {
  let sql = "-- Database restore script created at " + new Date().toISOString() + "\n";
  sql += "-- This script restores the database from the backup\n\n";

  sql += "BEGIN;\n\n";

  // Clear existing data
  sql += "-- Clear existing data\n";
  sql += "DELETE FROM ydtb_invitations;\n";
  sql += "DELETE FROM ydtb_workspace_members;\n";
  sql += "DELETE FROM ydtb_sessions;\n";
  sql += "DELETE FROM ydtb_accounts;\n";
  sql += "DELETE FROM ydtb_workspaces;\n";
  sql += "DELETE FROM ydtb_users;\n\n";

  // Restore users
  if (backup.tables.users && backup.tables.users.length > 0) {
    sql += "-- Restore users\n";
    backup.tables.users.forEach((user: any) => {
      const values = [
        `'${user.id}'`,
        `'${user.name?.replace(/'/g, "''") || ''}'`,
        `'${user.email}'`,
        user.emailVerified ? `'${new Date(user.emailVerified).toISOString()}'` : 'NULL',
        `'${user.image || ''}'`,
        `'${JSON.stringify(user).replace(/'/g, "''")}'`,
        `'${user.createdAt.toISOString()}'`,
        `'${user.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_users (id, name, email, emailVerified, image, metadata, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore workspaces
  if (backup.tables.workspaces && backup.tables.workspaces.length > 0) {
    sql += "-- Restore workspaces\n";
    backup.tables.workspaces.forEach((ws: any) => {
      const values = [
        `'${ws.id}'`,
        `'${ws.name.replace(/'/g, "''")}'`,
        `'${ws.slug || ''}'`,
        `'${JSON.stringify(ws.metadata || {}).replace(/'/g, "''")}'`,
        `'${ws.createdAt.toISOString()}'`,
        `'${ws.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_workspaces (id, name, slug, metadata, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore accounts
  if (backup.tables.accounts && backup.tables.accounts.length > 0) {
    sql += "-- Restore accounts\n";
    backup.tables.accounts.forEach((acc: any) => {
      const values = [
        `'${acc.id}'`,
        `'${acc.userId}'`,
        `'${acc.providerId}'`,
        `'${acc.accountId}'`,
        acc.accessToken ? `'${acc.accessToken.replace(/'/g, "''")}'` : 'NULL',
        acc.refreshToken ? `'${acc.refreshToken.replace(/'/g, "''")}'` : 'NULL',
        acc.idToken ? `'${acc.idToken.replace(/'/g, "''")}'` : 'NULL',
        acc.accessTokenExpiresAt ? `'${new Date(acc.accessTokenExpiresAt).toISOString()}'` : 'NULL',
        acc.refreshTokenExpiresAt ? `'${new Date(acc.refreshTokenExpiresAt).toISOString()}'` : 'NULL',
        acc.scope ? `'${acc.scope.replace(/'/g, "''")}'` : 'NULL',
        acc.password ? `'${acc.password.replace(/'/g, "''")}'` : 'NULL',
        `'${acc.createdAt.toISOString()}'`,
        `'${acc.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_accounts (id, userId, providerId, accountId, accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore sessions
  if (backup.tables.sessions && backup.tables.sessions.length > 0) {
    sql += "-- Restore sessions\n";
    backup.tables.sessions.forEach((sess: any) => {
      const values = [
        `'${sess.id}'`,
        `'${sess.userId}'`,
        `'${sess.token || ''}'`,
        `'${sess.expiresAt.toISOString()}'`,
        sess.user ? `'${JSON.stringify(sess.user).replace(/'/g, "''")}'` : 'NULL',
        sess.ipAddress ? `'${sess.ipAddress}'` : 'NULL',
        sess.userAgent ? `'${sess.userAgent.replace(/'/g, "''")}'` : 'NULL',
        sess.activeOrganizationId ? `'${sess.activeOrganizationId}'` : 'NULL',
        `'${sess.createdAt.toISOString()}'`,
        `'${sess.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_sessions (id, userId, token, expiresAt, user, ipAddress, userAgent, activeOrganizationId, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore workspace members
  if (backup.tables.workspaceMembers && backup.tables.workspaceMembers.length > 0) {
    sql += "-- Restore workspace members\n";
    backup.tables.workspaceMembers.forEach((member: any) => {
      const values = [
        `'${member.id}'`,
        `'${member.organizationId}'`,
        `'${member.userId}'`,
        `'${member.role}'`,
        `'${member.createdAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_workspace_members (id, organizationId, userId, role, createdAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore invitations
  if (backup.tables.invitations && backup.tables.invitations.length > 0) {
    sql += "-- Restore invitations\n";
    backup.tables.invitations.forEach((inv: any) => {
      const values = [
        `'${inv.id}'`,
        `'${inv.email}'`,
        `'${inv.organizationId}'`,
        `'${inv.role}'`,
        `'${inv.status}'`,
        `'${inv.expiresAt.toISOString()}'`,
        inv.token ? `'${inv.token}'` : 'NULL',
        `'${inv.inviterId}'`,
        `'${inv.createdAt.toISOString()}'`,
        `'${new Date().toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_invitations (id, email, organizationId, role, status, expiresAt, token, inviterId, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
  }

  sql += "\nCOMMIT;\n";

  return sql;
}

function createResetScript(backup: any): string {
  let sql = "-- Database reset/seed script created at " + new Date().toISOString() + "\n";
  sql += "-- This script contains the initial seed data for the database\n\n";

  // Restore users
  if (backup.tables.users && backup.tables.users.length > 0) {
    sql += "-- Seed users\n";
    backup.tables.users.forEach((user: any) => {
      const values = [
        `'${user.id}'`,
        `'${user.name?.replace(/'/g, "''") || ''}'`,
        `'${user.email}'`,
        user.emailVerified ? `'${new Date(user.emailVerified).toISOString()}'` : 'NULL',
        `'${user.image || ''}'`,
        `'${JSON.stringify(user).replace(/'/g, "''")}'`,
        `'${user.createdAt.toISOString()}'`,
        `'${user.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_users (id, name, email, emailVerified, image, metadata, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore workspaces
  if (backup.tables.workspaces && backup.tables.workspaces.length > 0) {
    sql += "-- Seed workspaces\n";
    backup.tables.workspaces.forEach((ws: any) => {
      const values = [
        `'${ws.id}'`,
        `'${ws.name.replace(/'/g, "''")}'`,
        `'${ws.slug || ''}'`,
        `'${JSON.stringify(ws.metadata || {}).replace(/'/g, "''")}'`,
        `'${ws.createdAt.toISOString()}'`,
        `'${ws.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_workspaces (id, name, slug, metadata, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore accounts
  if (backup.tables.accounts && backup.tables.accounts.length > 0) {
    sql += "-- Seed accounts\n";
    backup.tables.accounts.forEach((acc: any) => {
      const values = [
        `'${acc.id}'`,
        `'${acc.userId}'`,
        `'${acc.providerId}'`,
        `'${acc.accountId}'`,
        acc.accessToken ? `'${acc.accessToken.replace(/'/g, "''")}'` : 'NULL',
        acc.refreshToken ? `'${acc.refreshToken.replace(/'/g, "''")}'` : 'NULL',
        acc.idToken ? `'${acc.idToken.replace(/'/g, "''")}'` : 'NULL',
        acc.accessTokenExpiresAt ? `'${new Date(acc.accessTokenExpiresAt).toISOString()}'` : 'NULL',
        acc.refreshTokenExpiresAt ? `'${new Date(acc.refreshTokenExpiresAt).toISOString()}'` : 'NULL',
        acc.scope ? `'${acc.scope.replace(/'/g, "''")}'` : 'NULL',
        acc.password ? `'${acc.password.replace(/'/g, "''")}'` : 'NULL',
        `'${acc.createdAt.toISOString()}'`,
        `'${acc.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_accounts (id, userId, providerId, accountId, accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore sessions
  if (backup.tables.sessions && backup.tables.sessions.length > 0) {
    sql += "-- Seed sessions\n";
    backup.tables.sessions.forEach((sess: any) => {
      const values = [
        `'${sess.id}'`,
        `'${sess.userId}'`,
        `'${sess.token || ''}'`,
        `'${sess.expiresAt.toISOString()}'`,
        sess.user ? `'${JSON.stringify(sess.user).replace(/'/g, "''")}'` : 'NULL',
        sess.ipAddress ? `'${sess.ipAddress}'` : 'NULL',
        sess.userAgent ? `'${sess.userAgent.replace(/'/g, "''")}'` : 'NULL',
        sess.activeOrganizationId ? `'${sess.activeOrganizationId}'` : 'NULL',
        `'${sess.createdAt.toISOString()}'`,
        `'${sess.updatedAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_sessions (id, userId, token, expiresAt, user, ipAddress, userAgent, activeOrganizationId, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore workspace members
  if (backup.tables.workspaceMembers && backup.tables.workspaceMembers.length > 0) {
    sql += "-- Seed workspace members\n";
    backup.tables.workspaceMembers.forEach((member: any) => {
      const values = [
        `'${member.id}'`,
        `'${member.organizationId}'`,
        `'${member.userId}'`,
        `'${member.role}'`,
        `'${member.createdAt.toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_workspace_members (id, organizationId, userId, role, createdAt) VALUES (${values.join(", ")});\n`;
    });
    sql += "\n";
  }

  // Restore invitations
  if (backup.tables.invitations && backup.tables.invitations.length > 0) {
    sql += "-- Seed invitations\n";
    backup.tables.invitations.forEach((inv: any) => {
      const values = [
        `'${inv.id}'`,
        `'${inv.email}'`,
        `'${inv.organizationId}'`,
        `'${inv.role}'`,
        `'${inv.status}'`,
        `'${inv.expiresAt.toISOString()}'`,
        inv.token ? `'${inv.token}'` : 'NULL',
        `'${inv.inviterId}'`,
        `'${inv.createdAt.toISOString()}'`,
        `'${new Date().toISOString()}'`
      ];
      sql += `INSERT INTO ydtb_invitations (id, email, organizationId, role, status, expiresAt, token, inviterId, createdAt, updatedAt) VALUES (${values.join(", ")});\n`;
    });
  }

  return sql;
}

// Run backup
createBackup().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Backup failed:", error);
  process.exit(1);
});