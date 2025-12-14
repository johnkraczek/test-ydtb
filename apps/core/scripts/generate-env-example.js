// First, import env.ts which registers all package environment variables
import "../src/env.js";
import { envRegistry } from "../src/registry/env-registry.js";
// Import all modules that register environment schemas
// Note: These will be added as modules are created
// import "../src/modules/analytics";
// import "../src/modules/notifications";
import fs from "fs";
import path from "path";

// Get the current app directory
const appDir = process.cwd();

let example = `# Core Environment Variables
# Database connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit

# Secret key for Better Auth (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-here-at-least-32-characters

# Public application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node environment (development, test, production)
NODE_ENV=development

# Package Environment Variables
# =============================

`;

// Add package variables with descriptions
const registeredPackages = envRegistry.getAll();

if (registeredPackages.length === 0) {
  example += `# No package environment variables registered yet.
# Packages will register their environment variables automatically when imported.
`;
} else {
  for (const [packageName, schema] of registeredPackages) {
    example += `\n# ${packageName.charAt(0).toUpperCase() + packageName.slice(1)} Package\n`;
    example += `# ======================================\n\n`;

    if (schema.server && Object.keys(schema.server).length > 0) {
      example += `# Server-side variables\n`;
      for (const [key, zodSchema] of Object.entries(schema.server)) {
        const description = zodSchema._def.description || "Description needed";
        const isOptional = zodSchema._def.defaultValue !== undefined || zodSchema.isOptional?.();
        example += `# ${description}\n${key}=${isOptional ? "" : "required-value"}\n\n`;
      }
    }

    if (schema.client && Object.keys(schema.client).length > 0) {
      example += `# Client-side variables (public)\n`;
      for (const [key, zodSchema] of Object.entries(schema.client)) {
        const description = zodSchema._def.description || "Description needed";
        const isOptional = zodSchema._def.defaultValue !== undefined || zodSchema.isOptional?.();
        let defaultValue = "";

        // Extract default value if present
        if (zodSchema._def.defaultValue) {
          if (typeof zodSchema._def.defaultValue === "function") {
            defaultValue = ` # default: ${zodSchema._def.defaultValue()}`;
          } else {
            defaultValue = ` # default: ${zodSchema._def.defaultValue}`;
          }
        }

        example += `# ${description}${defaultValue}\n${key}=${isOptional ? "" : "required-value"}\n\n`;
      }
    }
  }
}

// Write the .env.example file to the app directory
const envExamplePath = path.join(appDir, ".env.example");
fs.writeFileSync(envExamplePath, example);

// Also create .env.local if it doesn't exist
const envLocalPath = path.join(appDir, ".env.local");
if (!fs.existsSync(envLocalPath)) {
  fs.writeFileSync(envLocalPath, example.replace(/=.*$/gm, "="));
  console.log("✅ .env.local created (copy from .env.example and fill in your values)");
}

console.log("✅ .env.example generated from registry");
console.log(`📁 Files written to: ${appDir}`);
console.log("\n📝 Next steps:");
console.log("   1. Copy .env.example to .env.local if it doesn't exist");
console.log("   2. Fill in your actual values in .env.local");
console.log("   3. Never commit .env.local to version control");
console.log(`\n📦 Registered packages: ${registeredPackages.length}`);
registeredPackages.forEach(([name]) => {
  console.log(`   - ${name}`);
});