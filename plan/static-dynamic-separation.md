# Static/Dynamic Component Separation Plan

## Current State Analysis
- SidebarContext and useActiveTool hook are already implemented
- DashboardClient still contains both static and dynamic parts
- IconRail and ToolSidebar are already using context
- Build is working correctly

## What is Static vs Dynamic?

### Static Components (Server Components)
- **No user interaction** (no onClick, useState, useEffect)
- **No client-side only imports** (no useRouter, usePathname, etc.)
- **Purely presentational** (just rendering JSX)
- **Can be server-rendered** for better performance

### Dynamic Components (Client Components)
- **Need interactivity** (onClick, state changes, etc.)
- **Use client-side hooks** (useRouter, useState, useEffect, etc.)
- **Need browser APIs** (window, localStorage, etc.)
- **Must be client components** ("use client")

## Current Component Breakdown

### DashboardClient.tsx (MIXED - needs separation)
**Static parts (should move to DashboardShell)**:
- Background decoration divs
- Main layout structure (div wrappers)
- DashboardFooter
- ToolHeader (but make title/description dynamic based on route)
- Main content area wrapper

**Dynamic parts (stay in DashboardClient)**:
- useSidebar() hook usage
- Conditional class names based on isToolSidebarOpen state
- The main container div that needs to react to state changes

## Separation Plan

### Step 1: Move static content from DashboardClient to dashboard/layout.tsx
**Target file**: `src/app/dashboard/layout.tsx` (Server Component)
**Source file**: `src/components/dashboard/DashboardClient.tsx`

**What it will contain**:
```tsx
// Static background decorations
<div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
  <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-70" />
  <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-rose-50/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-70" />
</div>

// IconRail (already client component)
<IconRail />

// Main content area structure
<div className="flex flex-1 flex-col overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
  // ToolHeader (make it a client component for dynamic titles)
  <ToolHeader />

  // Content area
  <div className="flex-1 overflow-auto p-8">
    {children}
  </div>

  // Footer
  <DashboardFooter />
</div>
```

### Step 2: Refactor DashboardClient → DashboardClient (Dynamic Wrapper)
**What it will contain**:
- Only the minimal wrapper that needs to react to state
- The gap between IconRail and main content
- Pass dynamic state to children as needed

```tsx
export function DashboardClient({ children }: DashboardClientProps) {
  const { isOpen: isToolSidebarOpen } = useSidebar();

  return (
    <div className={`flex flex-1 overflow-hidden p-2 ${isToolSidebarOpen ? "gap-2" : ""}`}>
      <ToolSidebar toolId={useActiveTool()} />
      <DashboardShell>
        {children}
      </DashboardShell>
    </div>
  );
}
```

### Step 3: Make ToolHeader Dynamic
**Problem**: ToolHeader needs different titles/descriptions based on the current route
**Solution**: Create a client component that uses useActiveTool to determine content

### Step 4: Update Layout Structure
**Current**:
```tsx
<SidebarProvider>
  <DashboardClient>
    {children}
  </DashboardClient>
</SidebarProvider>
```

**New**:
```tsx
<SidebarProvider>
  <DashboardLayout>
    {children}
  </DashboardLayout>
</SidebarProvider>
```

## Detailed Implementation Steps

### Step 1: Create DashboardShell
1. Create `src/components/dashboard/DashboardShell.tsx`
2. Copy static parts from DashboardClient
3. Ensure NO client-side imports
4. Make it a server component (no "use client")

### Step 2: Extract ToolHeader Content
1. Create `src/components/dashboard/ToolContent.tsx` (client component)
2. Move the conditional title/description logic from DashboardClient
3. Use useActiveTool hook to determine content

### Step 3: Simplify DashboardClient
1. Remove all static JSX (move to DashboardShell)
2. Keep only the dynamic wrapper
3. Ensure it only manages what needs to be dynamic

### Step 4: Update Layout
1. Create `DashboardLayout` component that orchestrates everything
2. Move the main div structure with h-screen and flex
3. Keep MainHeader outside the dynamic part

### Step 5: Test Thoroughly
1. Run `bun run build` after each step
2. Test navigation still works
3. Test sidebar toggle
4. Verify all tools show correct headers

## Important Considerations

1. **Don't break existing functionality** - The user wants this done carefully
2. **Maintain the exact same UI** - This is just an architectural refactor
3. **Keep all context providers** - They're already working well
4. **Test the route-based activeTool** - Make sure it still works after separation
5. **Server components can't use client hooks** - Be very careful about imports

## Benefits After Completion

1. **Better SEO** - Static content server-rendered
2. **Smaller JS bundle** - Less client-side code
3. **Better performance** - Server-rendered content loads faster
4. **Cleaner architecture** - Clear separation of concerns
5. **Easier to maintain** - Static and dynamic parts are separate

## Risk Mitigation

1. **Take small steps** - One file at a time
2. **Test after each step** - Run build and check functionality
3. **Keep a backup** - Git commits after each successful step
4. **Rollback ready** - If something breaks, revert to previous commit