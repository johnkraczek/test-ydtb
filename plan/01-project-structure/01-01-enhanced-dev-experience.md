# Unit 1.1: Enhanced Development Experience Setup
**Folder**: `01-enhanced-dev-experience`

**Purpose**: Implement advanced development tooling and patterns from ydtb project to enhance developer productivity and code quality

**Context**:
- Building on the basic project structure from Unit 1.0
- ydtb project has proven patterns for modern development
- Need to set up tooling before diving into features
- These foundational tools will benefit the entire development lifecycle

**Definition of Done**:
- ✅ Biome code quality tools replacing ESLint/Prettier
- ✅ Enhanced development workflow scripts
- ✅ Database development scripts with Docker/Podman support
- ✅ Changesets for version management
- ✅ ~~MCP integration for AI-assisted development~~ (Already completed)
- ✅ ~~Comprehensive documentation structure~~ (Already completed)
- ✅ Performance optimizations in Next.js config
- ✅ Security headers configured

---

## 1. Enhance Turbo Configuration

### 1.1 Add Additional Pipelines
Enhance existing `turbo.json` with additional pipelines:
```json
{
  "pipeline": {
    // ... existing pipelines
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "db:generate": {
      "cache": false,
      "outputs": []
    },
    "db:migrate": {
      "cache": false,
      "outputs": []
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 1.2 Add Missing Scripts
Add to root `package.json`:
```json
{
  "scripts": {
    // ... existing scripts (stop and restart already implemented)
    "type-check": "turbo run type-check",
    "dev:core": "turbo run dev --filter=core",
    "db:generate": "turbo run db:generate",
    "db:migrate": "turbo run db:migrate",
    "db:studio": "turbo run db:studio",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  }
}

Note: Enhanced stop/restart scripts will be created in section 3.3
```

---

## 2. Code Quality with Biome

### 2.1 Biome Configuration
Create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": "warn"
      },
      "correctness": {
        "noUnusedVariables": "error"
      },
      "style": {
        "noNegationElse": "error",
        "useShorthandArrayType": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  },
  "css": {
    "formatter": {
      "enabled": true
    },
    "linter": {
      "enabled": true
    }
  }
}
```

### 2.2 VSCode Integration
Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[css]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[html]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

---

## 3. Database Development Experience

### 3.1 Enhanced start-database.sh
Update `start-database.sh` with:
- Support for both Docker and Podman
- Automatic password generation
- Port conflict detection
- Cross-platform support (macOS/Linux/Windows WSL)
- Daemon startup assistance

### 3.2 Database Scripts
Create scripts in `scripts/` folder:

#### `scripts/db-utils.sh`
```bash
#!/usr/bin/env bash
# Database utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables
set -a
source "$PROJECT_ROOT/.env.local"
set +a

echo "Database utilities loaded"
```

#### `scripts/db-generate.sh`
```bash
#!/usr/bin/env bash
# Generate database types from schema
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit generate
```

#### `scripts/db-migrate.sh`
```bash
#!/usr/bin/env bash
# Run database migrations
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit migrate
```

#### `scripts/db-push.sh`
```bash
#!/usr/bin/env bash
# Push schema changes to database (dev)
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit push
```

#### `scripts/db-studio.sh`
```bash
#!/usr/bin/env bash
# Open Drizzle Studio
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit studio
```

#### `scripts/db-seed.sh`
```bash
#!/usr/bin/env bash
# Seed database with sample data
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bun run scripts/seed.ts
```

#### `scripts/db-reset.sh`
```bash
#!/usr/bin/env bash
# Reset database to clean state
"$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
echo "⚠️  This will delete all data. Are you sure? (y/N)"
read -r confirmation
if [[ $confirmation == "y" || $confirmation == "Y" ]]; then
  bunx drizzle-kit drop
  bunx drizzle-kit push
  bun run scripts/seed.ts
  echo "Database reset complete"
else
  echo "Cancelled"
fi
```

### 3.3 Enhanced Development Workflow Scripts
Create improved scripts for development workflow:

#### `scripts/stop-dev.sh`
```bash
#!/usr/bin/env bash
# Enhanced stop script with multiple port support
echo "Stopping development servers..."

# Kill processes on common ports
for port in 3000 3001 5173 5328; do
  if lsof -ti:$port > /dev/null 2>&1; then
    echo "Stopping process on port $port"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
  fi
done

echo "All development servers stopped"
```

#### `scripts/restart-dev.sh`
```bash
#!/usr/bin/env bash
# Enhanced restart script
echo "Restarting development environment..."
bun run stop
sleep 2
bun run dev
```

### 3.4 Update package.json Scripts
Update root `package.json` to use the new scripts:
```json
{
  "scripts": {
    "stop": "bun ./scripts/stop-dev.sh",
    "restart": "bun ./scripts/restart-dev.sh",
    "db:generate": "bun ./scripts/db-generate.sh",
    "db:migrate": "bun ./scripts/db-migrate.sh",
    "db:push": "bun ./scripts/db-push.sh",
    "db:studio": "bun ./scripts/db-studio.sh",
    "db:seed": "bun ./scripts/db-seed.sh",
    "db:reset": "bun ./scripts/db-reset.sh"
  }
}
```

### 3.5 Make Scripts Executable
After creating the scripts, make them executable:
```bash
chmod +x scripts/*.sh
```

---

## 4. Version Management with Changesets

### 4.1 Changesets Configuration
Create `.changeset/config.json`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 4.2 Version Management Workflow
1. `bun changeset` - Create changeset for changes
2. `bun version-packages` - Apply changesets and bump versions
3. `bun release` - Build and publish packages

---

## 5. Performance Optimizations

### 5.1 Next.js Configuration Enhancements
Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 2592000, // 30 days
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals = {
      ...config.externals,
      sharp: "commonjs sharp",
    };
    return config;
  },
};

module.exports = nextConfig;
```

### 5.2 Bundle Optimization
- Implement code splitting
- Add tree shaking
- Configure externals for server components
- Set up caching strategies

---

## 6. Security Enhancements

### 6.1 Security Headers
Implement CSP headers for SVG security and other security measures.

---

## Files to Create/Update

### New Files
- `turbo.json` - Turbo monorepo configuration (enhance existing)
- `biome.json` - Biome code quality configuration
- `.changeset/config.json` - Version management
- `scripts/db-utils.sh` - Database utility functions
- `scripts/db-generate.sh` - Generate database types
- `scripts/db-migrate.sh` - Run database migrations
- `scripts/db-push.sh` - Push schema changes (dev)
- `scripts/db-studio.sh` - Open Drizzle Studio
- `scripts/db-seed.sh` - Seed database with data
- `scripts/db-reset.sh` - Reset database
- `scripts/stop-dev.sh` - Enhanced development stop script
- `scripts/restart-dev.sh` - Enhanced development restart script

### Updated Files
- `package.json` (root) - Add Bun, Turbo, and new scripts
- `next.config.js` - Performance and security enhancements
- `.vscode/settings.json` - Biome integration
- `start-database.sh` - Enhance with ydtb patterns

This enhanced development experience setup provides a solid foundation for the entire CRM Toolkit project, ensuring high code quality, excellent developer experience, and modern best practices.