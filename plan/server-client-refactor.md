# Server/Client Component Refactoring Plan

## Goal
Move the dashboard layout to a server component while maintaining all functionality and properly separating concerns between server and client components.

## Current State
- DashboardLayout.tsx (app/dashboard/layout.tsx) - Simple wrapper that just renders Providers and DashboardClient
- DashboardClient.tsx - Contains ALL logic (state, navigation, rendering) in one large client component
- IconRail.tsx - Receives props for state management
- ToolSidebar.tsx - Receives props for state management

## Issues with Current Architecture
1. DashboardClient is a massive component doing too much
2. Mock data is embedded in the component
3. Server-side renderable content is needlessly in a client component
4. Prop drilling for sidebar state

## Proposed Architecture

### 1. Create Server Component: DashboardShell (NEW)
**Location**: `src/components/dashboard/DashboardShell.tsx`
**Purpose**: Static layout structure that can be server-rendered
**Contents**:
- Background decoration elements
- Main layout structure
- ToolHeader (but make title/description dynamic)
- DashboardFooter
- Main content area wrapper

### 2. Refactor DashboardClient → DashboardProvider (REFACTOR)
**Current**: `src/components/dashboard/DashboardClient.tsx`
**New**: `src/components/dashboard/DashboardProvider.tsx`
**Purpose**: Manage only interactive state
**Responsibilities**:
- activeTool state (remove artifact from old router)
- isToolSidebarOpen state
- Navigation handling (but simplify - just use Next.js router directly)
- Pass state to child components via context

### 3. Create SidebarContext (NEW)
**Location**: `src/context/sidebar/use-sidebar.tsx`
**Purpose**: Share sidebar state between IconRail and ToolSidebar
**Contents**:
- SidebarProvider component
- useSidebar hook
- State: { isOpen, toggle, open, close }

### 4. Update IconRail (MODIFY)
**Location**: `src/components/dashboard/sidebars/IconRail.tsx`
**Changes**:
- Remove props: `isToolSidebarOpen`, `onToggleSidebar`, `onToolSelect`
- Add: useSidebar() hook for sidebar state
- Add: useRouter() for direct navigation
- Remove: `activeTool` prop (derive from current route)
- Add route mapping for navigation

### 5. Update ToolSidebar (MODIFY)
**Location**: `src/components/dashboard/sidebars/ToolSidebar.tsx`
**Changes**:
- Remove props: `isOpen`, `onToggle`
- Add: useSidebar() hook for sidebar state
- Keep: `toolId` prop

### 6. Update Dashboard Layout (MODIFY)
**Location**: `src/app/dashboard/layout.tsx`
**Current**:
```tsx
<Providers>
  <DashboardClient>
    {children}
  </DashboardClient>
</Providers>
```

**New**:
```tsx
<Providers>
  <SidebarProvider>
    <DashboardProvider activeTool={getActiveToolFromRoute()}>
      <DashboardShell header={optionalHeader}>
        {children}
      </DashboardShell>
    </DashboardProvider>
  </SidebarProvider>
</Providers>
```

### 7. Extract Mock Data (NEW)
**Location**: `src/lib/dashboard-config.ts`
**Purpose**: Centralize all dashboard configuration
**Contents**:
- Tool definitions (id, label, icon, route)
- Tool descriptions and titles
- Navigation route mapping

## Implementation Steps

### Step 1: Create Configuration File
1. Create `src/lib/dashboard-config.ts`
2. Move tool definitions from IconRail
3. Add tool descriptions/titles
4. Create route mapping

### Step 2: Create SidebarContext
1. Create `src/context/sidebar/use-sidebar.tsx`
2. Implement provider and hook
3. Test with simple example

### Step 3: Update IconRail
1. Remove props that will come from context
2. Add useSidebar() hook usage
3. Add useRouter() and navigation logic
4. Test navigation works

### Step 4: Update ToolSidebar
1. Remove props that will come from context
2. Add useSidebar() hook usage
3. Test toggle works

### Step 5: Create DashboardShell
1. Extract static parts from DashboardClient
2. Create server component
3. Ensure no client-side imports

### Step 6: Refactor DashboardClient → DashboardProvider
1. Remove static JSX (move to DashboardShell)
2. Keep only state management
3. Pass state via context
4. Simplify component

### Step 7: Update Layout
1. Wrap with SidebarProvider
2. Update component structure
3. Test everything works

## Key Considerations

1. **Route Detection**: activeTool should be derived from the current route, not state
2. **Navigation**: Use Next.js router directly, don't manage navigation state
3. **Data Flow**: Props down → Context up
4. **Server Components**: Only client components that need interactivity should be client-side
5. **Mock Data**: Move all hardcoded strings to configuration files

## Testing Strategy
1. After each step, run `bun run build`
2. Test sidebar open/close functionality
3. Test navigation between tools
4. Verify theme switching still works
5. Check responsive behavior

## Benefits
1. Better separation of concerns
2. Server-side renderable content
3. Reduced prop drilling
4. Easier to maintain and test
5. Follows Next.js 13+ best practices