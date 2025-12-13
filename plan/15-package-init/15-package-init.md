# Unit 7.2: Package Initialization

## Folder: `15-package-init`

## Purpose
Initialize packages in the dashboard layout and set up the package loading system that discovers and loads all available packages when the application starts.

## Context
- Core components are updated to use registry (Unit 7.1)
- Package Database Registry is implemented (Unit 3.4)
- Need to load packages dynamically when the app starts
- Should handle package dependencies and load order
- Must validate packages before loading
- Should support hot-reloading in development
- Need to handle package loading errors gracefully
- Must track which packages are loaded

## Definition of Done
- [ ] Packages imported and initialized in layout
- [ ] Registration validation prevents invalid packages
- [ ] Dependencies resolved before loading
- [ ] Package database schemas registered with Database Registry
- [ ] Error handling for package failures
- [ ] Package loading state tracked
- [ ] Support for package-specific configuration
- [ ] Development hot-reloading support
- [ ] Package unload functionality
- [ ] Performance optimized (lazy loading where possible)

## Package Loading Strategy

1. **Discovery**: Scan packages directory for available packages
2. **Validation**: Check package.json and entry points
3. **Dependency Resolution**: Build dependency graph
4. **Loading**: Initialize packages in correct order
5. **Registration**: Register all package components
6. **Error Handling**: Fail gracefully with user feedback

## Files to Create

### 1. `/apps/core/src/lib/packages/index.ts`
```typescript
/**
 * Package loading and management system
 * Handles dynamic loading of CRM Toolkit packages
 */

import { registry } from "@/lib/registry";
import type { Package } from "@/types/registry";
import type { PackageMetadata } from "@/types/registry";

interface LoadedPackage {
  package: Package;
  metadata: PackageMetadata;
  loadedAt: Date;
}

class PackageManager {
  private loadedPackages = new Map<string, LoadedPackage>();
  private loadingPromises = new Map<string, Promise<void>>();
  private packageConfigs = new Map<string, Record<string, any>>();

  /**
   * Load a package by name
   */
  async loadPackage(packageName: string): Promise<void> {
    // Check if already loading
    if (this.loadingPromises.has(packageName)) {
      return this.loadingPromises.get(packageName);
    }

    // Check if already loaded
    if (this.loadedPackages.has(packageName)) {
      return;
    }

    // Create loading promise
    const loadingPromise = this.doLoadPackage(packageName);
    this.loadingPromises.set(packageName, loadingPromise);

    try {
      await loadingPromise;
    } finally {
      this.loadingPromises.delete(packageName);
    }
  }

  /**
   * Actually load the package
   */
  private async doLoadPackage(packageName: string): Promise<void> {
    try {
      console.log(`Loading package: ${packageName}`);

      // Import package metadata
      const packageModule = await import(`../../../../packages/${packageName}/package.json`);
      const metadata: PackageMetadata = {
        name: packageModule.name,
        version: packageModule.version,
        description: packageModule.description,
        author: packageModule.author,
        dependencies: packageModule.dependencies,
        peerDependencies: packageModule.peerDependencies,
        keywords: packageModule.keywords,
        homepage: packageModule.homepage,
        repository: packageModule.repository,
      };

      // Validate package metadata
      this.validatePackageMetadata(metadata);

      // Load dependencies first
      if (metadata.dependencies) {
        for (const dep of Object.keys(metadata.dependencies)) {
          if (dep.startsWith("@ydtb/")) {
            const depName = dep.replace("@ydtb/", "");
            await this.loadPackage(depName);
          }
        }
      }

      // Import and load the package
      const pkg = await import(`../../../../packages/${packageName}/src`);
      const packageExport = pkg.default || pkg;

      if (typeof packageExport !== "object" || !packageExport.init) {
        throw new Error(`Package ${packageName} must export a package object with an init function`);
      }

      const packageDefinition: Package = {
        metadata,
        init: packageDefinition.init,
        cleanup: packageDefinition.cleanup,
        configSchema: packageDefinition.configSchema,
      };

      // Load package configuration if available
      const config = await this.loadPackageConfig(packageName);

      // Initialize package
      await packageDefinition.init(registry);

      // Track loaded package
      this.loadedPackages.set(packageName, {
        package: packageDefinition,
        metadata,
        loadedAt: new Date(),
      });

      console.log(`Successfully loaded package: ${packageName} v${metadata.version}`);
    } catch (error) {
      console.error(`Failed to load package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Unload a package
   */
  async unloadPackage(packageName: string): Promise<void> {
    const loadedPackage = this.loadedPackages.get(packageName);
    if (!loadedPackage) {
      return;
    }

    try {
      console.log(`Unloading package: ${packageName}`);

      // Run cleanup if available
      if (loadedPackage.package.cleanup) {
        await loadedPackage.package.cleanup();
      }

      // Remove from registry (this will be handled by registry.unloadPackage)
      await registry.unloadPackage(packageName);

      // Remove from tracking
      this.loadedPackages.delete(packageName);
      this.packageConfigs.delete(packageName);

      console.log(`Successfully unloaded package: ${packageName}`);
    } catch (error) {
      console.error(`Failed to unload package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Get all loaded packages
   */
  getLoadedPackages(): LoadedPackage[] {
    return Array.from(this.loadedPackages.values());
  }

  /**
   * Check if a package is loaded
   */
  isPackageLoaded(packageName: string): boolean {
    return this.loadedPackages.has(packageName);
  }

  /**
   * Get package metadata
   */
  getPackageMetadata(packageName: string): PackageMetadata | null {
    const loadedPackage = this.loadedPackages.get(packageName);
    return loadedPackage?.metadata || null;
  }

  /**
   * Save package configuration
   */
  async savePackageConfig(packageName: string, config: Record<string, any>): Promise<void> {
    // TODO: Save to user preferences/database
    this.packageConfigs.set(packageName, config);

    // Emit configuration change event
    registry.emit({
      type: "package:config-changed",
      packageId: packageName,
      data: { config },
      timestamp: new Date(),
    } as any);
  }

  /**
   * Load package configuration
   */
  async loadPackageConfig(packageName: string): Promise<Record<string, any>> {
    // TODO: Load from user preferences/database
    return this.packageConfigs.get(packageName) || {};
  }

  /**
   * Validate package metadata
   */
  private validatePackageMetadata(metadata: PackageMetadata): void {
    if (!metadata.name || !metadata.version) {
      throw new Error("Package must have name and version");
    }

    if (!/^[a-z0-9-_]+$/.test(metadata.name)) {
      throw new Error("Package name must be lowercase alphanumeric with dashes and underscores only");
    }
  }

  /**
   * Discover available packages
   */
  async discoverPackages(): Promise<string[]> {
    // TODO: Scan packages directory
    // For now, return known packages
    return ["basic"];
  }

  /**
   * Reload a package (useful for development)
   */
  async reloadPackage(packageName: string): Promise<void> {
    if (this.isPackageLoaded(packageName)) {
      await this.unloadPackage(packageName);
    }
    await this.loadPackage(packageName);
  }

  /**
   * Load all available packages
   */
  async loadAllPackages(): Promise<void> {
    const packages = await this.discoverPackages();
    const results = await Promise.allSettled(
      packages.map(pkg => this.loadPackage(pkg))
    );

    const failed = results.filter(r => r.status === "rejected");
    if (failed.length > 0) {
      console.warn(
        `${failed.length} packages failed to load:`,
        failed.map(f => (f as PromiseRejectedResult).reason)
      );
    }
  }
}

// Export singleton instance
export const packageManager = new PackageManager();
```

### 2. `/apps/core/src/hooks/usePackages.ts`
```typescript
/**
 * Hooks for interacting with packages
 */

import { useEffect, useState } from "react";
import { packageManager } from "@/lib/packages";
import type { PackageMetadata } from "@/types/registry";

export function usePackages() {
  const [packages, setPackages] = useState<PackageMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPackages() {
      try {
        setIsLoading(true);
        setError(null);

        const loadedPackages = packageManager.getLoadedPackages();
        setPackages(loadedPackages.map(p => p.metadata));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
      } finally {
        setIsLoading(false);
      }
    }

    loadPackages();
  }, []);

  return {
    packages,
    isLoading,
    error,
    reloadPackages: async () => {
      await packageManager.loadAllPackages();
      const loadedPackages = packageManager.getLoadedPackages();
      setPackages(loadedPackages.map(p => p.metadata));
    },
  };
}

export function usePackage(packageName: string) {
  const [metadata, setMetadata] = useState<PackageMetadata | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkPackage() {
      setIsLoading(true);
      const loaded = packageManager.isPackageLoaded(packageName);
      setIsLoaded(loaded);
      setMetadata(packageManager.getPackageMetadata(packageName));
      setIsLoading(false);
    }

    checkPackage();
  }, [packageName]);

  return {
    metadata,
    isLoaded,
    isLoading,
    load: () => packageManager.loadPackage(packageName),
    unload: () => packageManager.unloadPackage(packageName),
    reload: () => packageManager.reloadPackage(packageName),
  };
}
```

### 3. `/apps/core/src/app/[workspaceId]/layout.tsx`
```typescript
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { WorkspaceProvider } from "@/context/workspace/WorkspaceProvider";
import { RegistryProvider } from "@/context/RegistryProvider";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PackageInitializer } from "@/components/packages/PackageInitializer";
import { RegistryErrorBoundary } from "@/components/error/RegistryErrorBoundary";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const session = await auth();

  // Redirect unauthenticated users
  if (!session) {
    redirect("/login");
  }

  // Validate workspace ID format
  if (!/^[a-zA-Z0-9]{10,20}$/.test(params.workspaceId)) {
    redirect("/dashboard");
  }

  return (
    <RegistryErrorBoundary>
      <RegistryProvider>
        <WorkspaceProvider>
          <PackageInitializer>
            <Suspense fallback={<div>Loading workspace...</div>}>
              <DashboardLayout>{children}</DashboardLayout>
            </Suspense>
          </PackageInitializer>
        </WorkspaceProvider>
      </RegistryProvider>
    </RegistryErrorBoundary>
  );
}
```

### 4. `/apps/core/src/components/packages/PackageInitializer.tsx`
```typescript
"use client";

import { useEffect, useState } from "react";
import { packageManager } from "@/lib/packages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";

interface PackageInitializerProps {
  children: React.ReactNode;
}

export function PackageInitializer({ children }: PackageInitializerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    async function initializePackages() {
      setIsLoading(true);
      setError(null);

      try {
        await packageManager.loadAllPackages();
      } catch (err) {
        console.error("Failed to initialize packages:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    initializePackages();
  }, [retryKey]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load packages: {error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => setRetryKey(prev => prev + 1)}
            className="w-full"
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

### 5. `/apps/core/src/components/packages/PackageManager.tsx`
```typescript
"use client";

import { useState } from "react";
import { usePackages } from "@/hooks/usePackages";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Package, RefreshCw, Trash2 } from "lucide-react";
import { packageManager } from "@/lib/packages";

export function PackageManager() {
  const { packages, isLoading, error, reloadPackages } = usePackages();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading packages: {error}</p>
        <Button onClick={reloadPackages} className="mt-2" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Installed Packages</h2>
        <Button onClick={reloadPackages} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No packages installed</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{pkg.version}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => packageManager.reloadPackage(pkg.name)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>by {pkg.author || "Unknown"}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`enable-${pkg.name}`}
                      defaultChecked={true}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          packageManager.unloadPackage(pkg.name);
                        } else {
                          packageManager.loadPackage(pkg.name);
                        }
                      }}
                    />
                    <Label htmlFor={`enable-${pkg.name}`}>Enabled</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Files to Update

### 1. `/apps/core/package.json`
Add scripts for package management:
```json
{
  "scripts": {
    "packages:discover": "bun run scripts/discover-packages.ts",
    "packages:validate": "bun run scripts/validate-packages.ts"
  }
}
```

### 2. `/apps/core/src/app/dashboard/settings/packages/page.tsx`
Create a page to manage packages:
```typescript
import { PackageManager } from "@/components/packages/PackageManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PackagesSettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Packages</h1>
          <p className="text-muted-foreground">
            Manage installed CRM Toolkit packages
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Package Management</CardTitle>
            <CardDescription>
              Enable, disable, and reload packages. Changes take effect immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackageManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## Installation Commands

```bash
# No additional dependencies needed
# All functionality uses existing packages
```

## Validation Checklist

- [ ] Packages load automatically on app start
- [ ] Basic package loads successfully
- [ ] Package components register in registry
- [ ] Package manager UI shows loaded packages
- [ ] Can enable/disable packages
- [ ] Can reload packages in development
- [ ] Error handling works for invalid packages
- [ ] Dependencies are loaded first
- [ ] Configuration persists across sessions

## Testing Package Initialization

1. Start the application
2. Navigate to dashboard
3. Verify Basic tool appears in IconRail
4. Click on Basic tool
5. Verify tool loads correctly
6. Go to Settings > Packages
7. Try disabling/enabling the Basic package
8. Test reload functionality

## Development Hot Reloading

For development, you can add this to your Next.js config:

```javascript
// next.config.js
module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [/node_modules/, /\.next/],
      };
    }
    return config;
  },
};
```

## Performance Considerations

1. **Lazy Loading**: Packages load only when needed
2. **Dependency Resolution**: Efficient dependency graph
3. **Error Isolation**: One package failure doesn't affect others
4. **Memory Management**: Proper cleanup on unload

## Next Steps

After implementing package initialization:
1. Create comprehensive tests (Unit 7.1-7.2)
2. Write developer documentation (Unit 8.1)
3. Set up CI/CD for package validation