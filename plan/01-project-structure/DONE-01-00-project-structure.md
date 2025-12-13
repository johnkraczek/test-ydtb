# Unit 1.1: Project Structure Migration

## Folder: `01-project-structure`

## Purpose
Reorganize the existing application into a monorepo structure with `apps/core/` and `packages/` directories to support the package-based architecture.

## Context
The current application is a monolithic Next.js app located in `/src`. To implement the package-based architecture described in the main plan, we need to:
- Move the existing application to `apps/core/src/`
- Create a root level `packages/` directory for future packages
- Set up workspace configuration for a monorepo structure using Bun
- Update all imports to use the new alias path conventions (@/, @ydtb/, ~/)
- Ensure the application continues to build and run successfully using Bun after migration

## Definition of Done
- [ ] Existing application moved to `apps/core/src/`
- [ ] Root level `packages/` directory created
- [ ] Workspace configuration in root `package.json`
- [ ] All imports updated to use alias paths (@/, @ydtb/, ~/)
- [ ] Application builds and runs successfully
- [ ] No broken imports or missing files
- [ ] TypeScript paths configuration updated
- [ ] Relative imports converted to absolute where appropriate

## Steps

### 1. Create New Directory Structure
```bash
# Create the monorepo structure
mkdir -p apps/core
mkdir -p packages
```

### 2. Move Source Code
```bash
# Move existing src directory to apps/core/
mv src apps/core/
```

### 3. Update Root Package.json
Add workspace configuration to the root package.json using Bun workspaces:
```json
{
  "name": "crm-toolkit",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "install:all": "bun install"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

### 4. Update Core Application Package.json
Modify `apps/core/package.json`:
- Update name to `@ydtb/core`
- Ensure all dependencies are properly listed
- Add private: true flag

### 5. Update TypeScript Configuration
Update `apps/core/tsconfig.json` with new paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@ydtb/*": ["../../packages/*"],
      "~/*": ["./src/*"]
    }
  }
}
```

### 6. Update All Imports
Search and replace imports throughout the codebase:
- Local imports: `./component` → `~/component`
- Core imports: Keep as `@/` (resolves to core)
- Future package imports: Will use `@ydtb/package-name`

### 7. Update Environment Variables
Move `.env` and `.env.example` to appropriate locations if needed.

### 8. Update Build Scripts
Ensure all scripts in `apps/core/package.json` work with the new structure.

### 9. Test Application
```bash
# Install dependencies using Bun
bun install

# Run development server
bun run dev

# Build the application
bun run build
```

## Files to Create/Modify

### New Files:
- `/apps/core/` - entire existing src moved here
- `/packages/` - empty directory for future packages
- `/turbo.json` - Turborepo configuration

### Modified Files:
1. **`/package.json`** - Add workspace configuration
   ```json
   {
     "workspaces": ["apps/*", "packages/*"]
   }
   ```

2. **`/apps/core/package.json`** - Update name and paths
   ```json
   {
     "name": "@ydtb/core",
     "private": true
   }
   ```

3. **`/apps/core/tsconfig.json`** - Update path mappings
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"],
         "@ydtb/*": ["../../packages/*"],
         "~/*": ["./src/*"]
       }
     }
   }
   ```

4. **`/apps/core/next.config.js`** - Update any paths if needed

### Files to Search for Import Updates:
- All `.ts`, `.tsx`, `.js`, `.jsx` files in `apps/core/src/`
- Look for patterns:
  - `from "./` → `from "~/`
  - `from "../` → `from "~/` (for files within src)
  - Keep absolute imports from external packages as-is

## Validation Checklist
- [ ] Application starts with `bun run dev`
- [ ] Build completes successfully with `bun run build`
- [ ] No TypeScript errors
- [ ] All pages load correctly
- [ ] No 404 errors for missing imports
- [ ] Console shows no module resolution errors
- [ ] Hot reload still works in development
- [ ] Bun workspaces are properly configured and dependencies are shared correctly

## Troubleshooting
1. **Import Errors**: Check that TypeScript paths are correctly configured
2. **Build Failures**: Verify all relative imports have been updated
3. **Module Not Found**: Ensure workspace configuration is correct
4. **Path Resolution**: Clear Next.js cache with `rm -rf .next`

## Next Steps
Please let me know that you are finished so that we can test your work manually. let me know what should be tested. 


