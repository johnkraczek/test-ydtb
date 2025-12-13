# Dashboard Update Plan

## Executive Summary

This plan outlines the comprehensive update of the current dashboard from a placeholder state to a fully functional, data-driven interface that leverages our solid authentication foundation and modern Next.js 16 architecture.

## Current State Analysis

### ✅ What's Complete
- **Authentication System**: Better Auth with email/password and passkey support
- **UI Foundation**: shadcn/ui components with Tailwind CSS v4
- **Dashboard Layout**: Basic responsive layout with sidebar navigation
- **Database Schema**: User authentication tables with Drizzle ORM
- **Development Workflow**: Git flow, code quality tools, and testing setup

### ❌ What's Missing
- **Real Dashboard Content**: Current dashboard has only placeholder divs
- **User Data Integration**: No user-specific data or personalization
- **Workspace Management**: Database schema and UI for workspace functionality
- **Server Actions**: No data fetching or mutation logic in `src/actions/`
- **Protected Routes**: No layout-based authentication patterns
- **Dynamic Navigation**: Sidebar uses hardcoded sample data

## Implementation Strategy

### Phase 1: Foundation & Data Architecture (Week 1)
**Goal**: Establish the data layer and basic functionality

#### 1.1 Database Schema Extensions
```
ydtb_workspaces/
├── id (text, primary key)
├── name (text, not null)
├── slug (text, unique, not null)
├── description (text)
├── created_by (text, references user.id)
├── created_at (timestamp)
├── updated_at (timestamp)

ydtb_workspace_members/
├── id (text, primary key)
├── workspace_id (text, references ydtb_workspaces.id)
├── user_id (text, references user.id)
├── role (enum: owner, admin, editor, viewer)
├── joined_at (timestamp)
└── unique(workspace_id, user_id)
```

#### 1.2 Server Actions Implementation
Create comprehensive server actions for data operations:

```
src/actions/
├── workspaces/
│   ├── types.ts          # TypeScript interfaces
│   ├── queries.ts        # Data fetching (getWorkspaces, getWorkspaceById)
│   └── mutations.ts      # Data operations (createWorkspace, updateWorkspace)
├── users/
│   ├── types.ts          # User-related types
│   ├── queries.ts        # User data fetching
│   └── mutations.ts      # User profile operations
└── dashboard/
    ├── types.ts          # Dashboard-specific types
    └── queries.ts        # Dashboard data aggregation
```

#### 1.3 Authentication Integration
- Implement server-side session checking in layouts and pages
- Create layout-based route protection patterns
- Add workspace context provider for client components (only where needed)
- Use server components for session-based data fetching (primary pattern)

### Phase 2: Dashboard Content & UI (Week 2)
**Goal**: Replace placeholder content with real, user-specific data

#### 2.1 Dashboard Page Redesign
Transform `src/app/dashboard/page.tsx` from placeholder to functional:

```typescript
// Before: Placeholder divs
<div className="aspect-video rounded-xl bg-muted/50" />

// After: Real dashboard widgets
<DashboardHeader user={user} workspace={activeWorkspace} />
<DashboardStats workspaceId={activeWorkspace.id} />
<RecentActivity workspaceId={activeWorkspace.id} />
<QuickActions />
```

#### 2.2 Dynamic Sidebar Navigation
Update `src/components/nav/app-sidebar.tsx` to use real data:

- Replace hardcoded user data with session user
- Replace sample teams with user's workspaces
- Make navigation items dynamic based on user roles
- Add workspace switching functionality

#### 2.3 Dashboard Components Development
Create new dashboard-specific components:

```
src/components/dashboard/
├── DashboardHeader.tsx        # User info, workspace switcher
├── DashboardStats.tsx         # Key metrics cards
├── RecentActivity.tsx         # Activity feed
├── QuickActions.tsx           # Quick action buttons
├── WorkspaceSwitcher.tsx      # Workspace dropdown
└── layouts/
    └── DashboardLayout.tsx    # Dashboard page wrapper
```

### Phase 3: Workspace Management (Week 3)
**Goal**: Full workspace creation and management functionality

#### 3.1 Workspace Management UI
- Create workspace creation modal/form
- Build workspace settings pages
- Implement team member management
- Add invite team member functionality

#### 3.2 Role-Based Access Control
- Implement permission checking logic
- Create role-based UI components
- Add workspace membership management
- Build team collaboration features

#### 3.3 Enhanced User Experience
- Add workspace onboarding flow
- Create empty state designs
- Implement loading states and error handling
- Add success notifications and feedback

### Phase 4: Performance & Polish (Week 4)
**Goal**: Optimize performance and add professional polish

#### 4.1 Performance Optimization
- Implement Next.js 16 partial prerendering
- Add strategic caching with `unstable_cache`
- Optimize database queries with proper indexing
- Implement lazy loading for heavy components

#### 4.2 Mobile Responsiveness
- Perfect mobile dashboard experience
- Add mobile-specific navigation patterns
- Implement touch-friendly interactions
- Optimize for different screen sizes

#### 4.3 Professional Polish
- Add micro-animations and transitions
- Implement dark mode support
- Add accessibility enhancements
- Create comprehensive error handling

## Technical Implementation Details

### Server Actions Pattern
Following the established architecture principles:

```typescript
// src/actions/workspaces/queries.ts
"use server";

import { db } from "~/server/db";
import { workspaces, workspaceMembers } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserWorkspaces(userId: string) {
  return await db
    .select({
      workspace: workspaces,
      role: workspaceMembers.role,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, userId));
}

export async function getWorkspaceById(workspaceId: string, userId: string) {
  return await db
    .select()
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.id, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    )
    .limit(1);
}
```

### Dashboard Component Architecture
Using the established component hierarchy:

```typescript
// src/app/dashboard/page.tsx
import { auth } from "~/server/better-auth";
import { getUserWorkspaces } from "~/actions/workspaces/queries";
import { DashboardLayout } from "~/components/dashboard/layouts/DashboardLayout";
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { DashboardStats } from "~/components/dashboard/DashboardStats";
import { RecentActivity } from "~/components/dashboard/RecentActivity";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userWorkspaces = await getUserWorkspaces(session.user.id);
  const activeWorkspace = userWorkspaces[0]?.workspace;

  if (!activeWorkspace) {
    redirect("/workspace/create");
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        user={session.user}
        workspace={activeWorkspace}
        workspaces={userWorkspaces}
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DashboardStats workspaceId={activeWorkspace.id} />
        <RecentActivity workspaceId={activeWorkspace.id} />
        {/* Additional dashboard widgets */}
      </div>
    </DashboardLayout>
  );
}
```

### Database Migration Strategy
```sql
-- Migration: Create workspaces table
CREATE TABLE ydtb_workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL REFERENCES "user"(id),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Migration: Create workspace members table
CREATE TABLE ydtb_workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES ydtb_workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_workspace_members_workspace_id ON ydtb_workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON ydtb_workspace_members(user_id);
```

## File Structure Impact

### New Files to Create
```
src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout wrapper
│   │   └── loading.tsx          # Loading state
│   ├── workspace/
│   │   ├── create/
│   │   │   └── page.tsx         # Workspace creation
│   │   └── [id]/
│   │       └── settings/
│   │           └── page.tsx     # Workspace settings
├── actions/
│   ├── workspaces/
│   │   ├── types.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── users/
│   │   ├── types.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   └── dashboard/
│       ├── types.ts
│       └── queries.ts
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── QuickActions.tsx
│   │   ├── WorkspaceSwitcher.tsx
│   │   └── layouts/
│   │       └── DashboardLayout.tsx
│   ├── forms/
│   │   ├── WorkspaceForm.tsx
│   │   └── InviteMemberForm.tsx
│   └── nav/
│       └── app-sidebar.tsx      # Updated with real data
└── server/
    └── db/
        └── schema.ts            # Updated with new tables
```

### Files to Modify
- `src/app/dashboard/page.tsx` - Main dashboard content
- `src/components/nav/app-sidebar.tsx` - Dynamic data integration
- `src/server/db/schema.ts` - Add workspace tables
- `package.json` - Add any new dependencies

## Success Criteria

### Functional Requirements
- ✅ Dashboard displays real user-specific data
- ✅ Users can create and manage workspaces
- ✅ Workspace switching functionality works seamlessly
- ✅ Role-based access control is properly implemented
- ✅ Mobile experience is fully functional

### Technical Requirements
- ✅ All server actions follow established patterns
- ✅ Type safety is maintained throughout
- ✅ Performance is optimized with proper caching
- ✅ Code follows project quality standards
- ✅ Accessibility standards are met

### User Experience Requirements
- ✅ Intuitive navigation and user interface
- ✅ Responsive design across all devices
- ✅ Proper loading states and error handling
- ✅ Smooth animations and transitions
- ✅ Clear feedback for user actions

## Implementation Timeline

### Week 1: Foundation
- Day 1-2: Database schema and migrations
- Day 3-4: Server actions implementation
- Day 5: Authentication integration and middleware

### Week 2: Dashboard Content
- Day 1-2: Dashboard page redesign
- Day 3-4: Dynamic sidebar navigation
- Day 5: Dashboard components development

### Week 3: Workspace Management
- Day 1-2: Workspace management UI
- Day 3-4: Role-based access control
- Day 5: Enhanced user experience

### Week 4: Performance & Polish
- Day 1-2: Performance optimization
- Day 3-4: Mobile responsiveness
- Day 5: Professional polish and testing

## Risk Mitigation

### Technical Risks
- **Database Migration Issues**: Test migrations thoroughly in development
- **Performance Bottlenecks**: Implement caching strategies early
- **Authentication Edge Cases**: Comprehensive testing of auth flows

### UX Risks
- **Complex Navigation**: User testing for navigation patterns
- **Empty States**: Design thoughtful empty state experiences
- **Mobile Experience**: Regular mobile testing throughout development

## Dependencies

### External Dependencies
- None planned - leveraging existing tech stack

### Internal Dependencies
- Database must be accessible for migrations
- Better Auth configuration must be complete
- Existing authentication flow must be functional

## Testing Strategy

### Unit Tests
- Server action logic validation
- Component behavior testing
- Utility function testing

### Integration Tests
- Database operation testing
- Authentication flow testing
- API endpoint testing

### E2E Tests
- Critical user journeys
- Mobile responsiveness
- Cross-browser compatibility

## Next Steps

1. **Immediate**: Begin with Phase 1 database schema extensions
2. **Priority**: Focus on getting basic dashboard functionality working
3. **Parallel**: Develop UI components alongside backend functionality
4. **Continuous**: Regular testing and code reviews throughout implementation

This plan transforms our current placeholder dashboard into a fully functional, user-centric interface that leverages our strong technical foundation and follows established architectural patterns.