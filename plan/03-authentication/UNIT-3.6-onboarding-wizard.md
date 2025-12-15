# Unit 3.6: Post-Signup Workspace Onboarding Wizard

## Purpose
Implement a mandatory onboarding flow that guides verified users without workspaces through creating or joining a workspace. This unit creates a user-friendly wizard that leverages the existing Better Auth organization system while providing an intuitive experience for new users.

## Context
- The workspace system is fully implemented using Better Auth's organization plugin
- Database schema, server actions, and React context are all in place
- This unit focuses specifically on the UI/UX flow for new users after email verification
- Users must have a workspace to access the main application
- The onboarding wizard should be intuitive, educational, and visually appealing. It has already been developed and can be found in the attached file paths. 
- All backend functionality already exists - this is primarily a frontend implementation unit

### Existing Implementation Status
✅ **Already Implemented:**
- Better Auth organization plugin configuration
- Database schema (workspaces, workspace_members tables)
- Server actions for workspace operations
- React context and hooks for workspace management
- Email verification system (Unit 3.5)
- Authentication middleware

🔧 **Needs Implementation:**
- Onboarding UI components and wizard
- Workspace detection middleware for route protection
- Direct redirect to wizard after email verification
- Invitation token handling in the onboarding context
- Seamless integration with existing backend functionality

## Prerequisites
- Unit 3.5 (Email Verification) must be completed first
- User must have verified email address
- User is logged in but not associated with any workspace

## User Flow

### Scenario 1: New User on Welcome Page
1. User completes email verification (Unit 3.5)
2. User is redirected to `/welcome`
3. Welcome page shows the 5-step workspace creation wizard
4. At the top of the wizard, user can:
   - Continue with creating a new workspace (default)
   - Click "Join Existing Workspace" to accept invitations
5. If user accepts an invitation:
   - Accept invitation automatically
   - Add user to workspace
   - Set as active workspace
   - Redirect to `/` (dashboard)
6. Upon wizard completion:
   - Workspace is created
   - Redirect to `/` (dashboard)

### Scenario 2: User Logging In Without Workspace
1. User logs in successfully
2. System detects user has no workspace
3. User is redirected to `/welcome`
4. Same flow as Scenario 1

### Scenario 3: User with Direct Invitation Token
1. User clicks invitation link in email
2. User signs up/logs in if needed
3. After verification, automatically accepts the invitation
4. Redirected directly to `/` (dashboard) - bypasses welcome page

## Definition of Done
- [ ] Workspace creation wizard with 5-step form implemented
- [ ] Direct redirect to wizard after email verification
- [ ] "Create Workspace" server action implemented
- [ ] "Join Workspace" with invitation code support
- [ ] Mandatory workspace requirement enforced
- [ ] Proper redirects based on user's workspace status
- [ ] Invitation token handling for invited users
- [ ] Error handling and validation throughout the flow
- [ ] Mobile-responsive design
- [ ] Smooth animations with framer-motion

## Implementation Strategy

Since the workspace backend is fully implemented, this unit focuses on creating the onboarding UI and integrating it with existing functionality.

### Internal vs External Communication Patterns

**Important**: Internal communication within the application uses direct function calls (either across RSC boundary or server-side), NOT HTTP requests. HTTP APIs are ONLY for external system integration.

##### Internal Package Communication

**1. RSC Client-Server Boundary**
- **Mechanism**: Direct function calls between client components and server functions
- **Technology**: React Server Components boundary
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Client components fetching data from server
  - Form submissions and mutations
  - Server actions for client interactions

**2. Server-Side Package-to-Package Communication**
- **Mechanism**: Direct function calls between packages on the server
- **Technology**: Internal function imports/calls
- **Performance**: No network overhead, maintains type safety
- **Use Cases**:
  - Package A calling functions from Package B
  - Shared services and utilities
  - Database operations
  - Internal business logic

##### External API Registration (HTTP)
Only for integration with external systems:
- **Mechanism**: HTTP endpoints exposed to outside world
- **Technology**: Next.js API routes
- **Authentication**: Required for all external endpoints
  - API keys for service-to-service communication
  - OAuth/JWT for third-party integrations
  - Signature verification for webhooks
- **Use Cases**:
  - Webhooks from external services (with signature verification)
  - Public APIs for third-party integration (with API keys)
  - Mobile app backends (with OAuth/JWT)
  - Internal package webhooks (with authenticated calls)

### Phase 1: Setup and Route Protection

#### 1. Create Workspace Detection Helper
**Purpose**: Server-side utility to determine if a user needs onboarding

**File**: `/apps/core/src/server/lib/workspace-guard.ts`
- `getUserWorkspaceStatus()` - Returns user's workspace state
- `requireWorkspace()` - Server component wrapper for route protection
- Export constants for different states: `NEEDS_AUTH`, `NEEDS_VERIFICATION`, `NEEDS_WORKSPACE`, `READY`

**Implementation pattern**:
```typescript
export async function getUserWorkspaceStatus() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { status: 'NEEDS_AUTH' };
  if (!session.user.emailVerified) return { status: 'NEEDS_VERIFICATION' };

  // Check if user has any workspaces
  const workspaces = await getUserWorkspaces(session.user.id);
  if (workspaces.length === 0) return { status: 'NEEDS_WORKSPACE' };

  return { status: 'READY', workspaces };
}
```

#### 2. Create Protected Route Component
**File**: `/apps/core/src/components/auth/protected-route.tsx`
- Higher-order component for route protection
- Handles redirects based on user status
- Used in layout.tsx files to protect routes

**Implementation pattern**:
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default async function ProtectedRoute({
  children,
  redirectTo = "/welcome"
}: ProtectedRouteProps) {
  const status = await getUserWorkspaceStatus();

  if (status.status === 'NEEDS_AUTH') {
    redirect('/login');
  }

  if (status.status === 'NEEDS_VERIFICATION') {
    redirect(`/verify-otp?email=${encodeURIComponent(status.session?.user.email || '')}`);
  }

  if (status.status === 'NEEDS_WORKSPACE') {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
```

#### 3. Update Dashboard Layout Protection
**File**: `/apps/core/src/app/(dashboard)/layout.tsx`
- Add workspace check using the new helper
- Redirect to `/welcome` if user has no workspace
- Maintain existing email verification check

**Add after email verification check**:
```typescript
// Check if user has workspaces
const { workspaces } = await getUserWorkspaces();
if (workspaces.length === 0) {
  redirect("/welcome");
}
```

### Phase 2: Workspace Creation Wizard

#### 3. Copy and Adapt Existing Onboarding Component
The wizard UI is already implemented in `/plan/03-authentication/onboarding/onboarding.tsx`.

**Instructions:**
1. **COPY** the entire file to `/apps/core/src/components/auth/create-workspace-wizard.tsx`
2. Adapt the copied component to work with the existing backend

**Key adaptations needed:**
- Replace `setLocation` from wouter with Next.js `useRouter` hook
- Replace mock API calls with direct server action calls from `/apps/core/src/server/actions/workspace.ts`
- Replace `console.log("Creating workspace:", formData)` with actual workspace creation logic using server actions
- Update slug validation to use real database check via server actions (NOT API calls - use direct server action for debounced validation)
- Integrate with workspace context for state management
- Handle file upload for workspace icons properly (crop to 256x256 and store as base64 data URL - recommended approach)
- Update form submission to use server actions and redirect to dashboard on success

#### 4. Create Welcome Page Route
**Route**: `/apps/core/src/app/(auth)/welcome/page.tsx`
- Server component that renders the wizard directly
- Fetch and pass user session data to wizard
- Handle success redirect to dashboard upon completion

**Implementation pattern**:
```typescript
export default async function WelcomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.emailVerified === false) {
    redirect("/login");
  }

  // Check if user already has workspaces
  const workspaces = await getUserWorkspaces(session.user.id);
  if (workspaces.length > 0) {
    redirect("/");
  }

  // Show pending invitations if any
  const invitations = await getPendingInvitations(session.user.email);

  return (
    <CreateWorkspaceWizard
      user={session.user}
      invitations={invitations}
      onSuccess={() => redirect("/")}
    />
  );
}
```

### Phase 3: Join Workspace Flow

#### 5. Handle Invitation Acceptance
**Implementation**: Use direct server actions (NOT API routes)
- Import and use `acceptInvitation()` from `/apps/core/src/server/actions/workspace.ts`
- For invitation tokens in URLs, handle directly in page component
- No HTTP endpoints needed - use direct function calls across RSC boundary

### Phase 4: Integration and Polish

#### 7. Update Dashboard Access
**File**: `/apps/core/src/app/(dashboard)/layout.tsx` or `page.tsx`
- Add workspace check at the top
- Redirect unauthenticated users appropriately
- Ensure workspace context is properly initialized

#### 8. Handle Invitation Tokens in URLs
**Route**: `/apps/core/src/app/(auth)/welcome/invite/[token]/page.tsx`
- Auto-accept invitation when user clicks email link
- Verify user is logged in and verified
- Add to workspace and redirect to dashboard

### Integration Notes

**Leveraging Existing Infrastructure:**
- Use `/apps/core/src/server/actions/workspace.ts` for all workspace operations
- Integrate with `/apps/core/src/context/workspace/workspace-provider.tsx`
- Follow existing patterns from `/apps/core/src/lib/organization-hooks.ts`
- Use existing UI components from `/apps/core/src/components/ui/`

**File Structure to Follow:**
```
apps/core/src/
├── app/(auth)/welcome/
│   ├── page.tsx                 # Welcome page with the wizard
│   ├── join/
│   │   └── page.tsx            # Join with code route
│   └── invite/
│       └── [token]/
│           └── page.tsx        # Invitation handler route
├── components/auth/
│   ├── create-workspace-wizard.tsx  # Adapted wizard (renders in welcome/page.tsx)
│   └── join-workspace-form.tsx      # Join form component
└── server/lib/
    └── workspace-guard.ts      # Route protection utilities
```

## Files to Create

1. `/apps/core/src/server/lib/workspace-guard.ts` - Route protection utilities
2. `/apps/core/src/components/auth/protected-route.tsx` - Reusable route protection component
3. `/apps/core/src/app/(auth)/welcome/page.tsx` - Welcome page with the wizard
4. `/apps/core/src/components/auth/create-workspace-wizard.tsx` - **COPY from** `/plan/03-authentication/onboarding/onboarding.tsx` and adapt
5. `/apps/core/src/app/(auth)/welcome/join/page.tsx` - Join workspace route
6. `/apps/core/src/components/auth/join-workspace-form.tsx` - Join workspace component
7. `/apps/core/src/app/(auth)/welcome/invite/[token]/page.tsx` - Invitation handler route

## Files to Update

1. `/apps/core/src/app/(dashboard)/layout.tsx` - Add workspace check (already has auth check)
2. `/apps/core/src/lib/auth-client.ts` - **CRITICAL**: Add missing organizationClient plugin
3. `/apps/core/src/server/db/schema.ts` - Add workspace invitations table (if not exists)

**Note**: No middleware.ts file is needed as we're using Next.js 16's layout-level protection pattern, which is more suitable for this use case.

## Important Implementation Notes

### Existing Resources to Leverage
- **Server Actions**: Use `/apps/core/src/server/actions/workspace.ts` for all workspace operations
- **Context Provider**: Integrate with `/apps/core/src/context/workspace/workspace-provider.tsx`
- **Organization Hooks**: Use `/apps/core/src/lib/organization-hooks.ts` for data fetching
- **Auth Configuration**: Better Auth is already configured with organization plugin

### Additional Server Actions Needed

The existing `/apps/core/src/server/actions/workspace.ts` file has most functionality but needs these additions:

```typescript
// Add these functions to /apps/core/src/server/actions/workspace.ts

export async function validateSlug(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Check if slug is already taken
  const workspaces = await db.query.workspaces.findMany({
    where: eq(workspaces.slug, slug),
  });

  return workspaces.length === 0;
}

export async function acceptInvitation(token: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  // Use Better Auth's acceptInvitation method
  try {
    const result = await auth.api.acceptInvitation({
      body: { token },
      headers: await headers(),
    });

    revalidatePath("/dashboard");
    return result;
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    throw new Error("Invalid or expired invitation");
  }
}

export async function getPendingInvitations(email: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  // Query pending invitations for this email
  const invitations = await db.query.workspaceInvitations.findMany({
    where: and(
      eq(workspaceInvitations.email, email),
      eq(workspaceInvitations.status, "pending"),
      gt(workspaceInvitations.expiresAt, new Date())
    ),
    with: {
      workspace: {
        columns: { id: true, name: true, slug: true }
      }
    }
  });

  return invitations;
}
```

### Critical Updates Needed Before Implementation

1. **Add Organization Client Plugin** (HIGH PRIORITY)
   - File: `/apps/core/src/lib/auth-client.ts`
   - Missing `organizationClient()` plugin
   - Without this, client-side organization methods won't work

   ```typescript
   import { organizationClient } from "better-auth/plugins";

   export const authClient = createAuthClient({
     baseURL: process.env.NEXT_PUBLIC_APP_URL,
     plugins: [
       passkeyClient(),
       organizationClient(), // Add this!
     ],
   });
   ```

2. **Terminology Consistency**
   - Database uses "workspaces" table (✓ OK)
   - Server actions use "workspace" terminology (✓ Consistent)
   - But Better Auth internally uses "organization" terminology
   - Decision: Keep "workspace" terminology in UI for user-friendliness
   - Map correctly to Better Auth's "organization" in backend

3. **Invitation System**
   - Better Auth provides built-in invitation system
   - Our server actions are already using it correctly
   - Need to ensure invitation handling follows Better Auth patterns

### Reference Implementation
The following UI component provides a complete wizard implementation:
- **Location**: `/Users/john/projects/ydtb/plan/03-authentication/onboarding/onboarding.tsx`
- **Contains**: 5-step wizard with all required UI components
- **Needs**: Adaptation to work with Next.js App Router and Better Auth actions

### Icon Handling Implementation Notes
The existing wizard's `getCroppedImg` function (lines 136-173) returns a blob URL. This needs to be updated to return a base64 data URL for permanent storage in the database.

**Current implementation** (returns blob URL - needs updating):
```typescript
canvas.toBlob((blob) => {
    if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
    }
    const fileUrl = window.URL.createObjectURL(blob);
    resolve(fileUrl);
}, 'image/jpeg');
```

**Required implementation** (convert to base64 for permanent storage):
```typescript
const dataURL = canvas.toDataURL('image/jpeg', 0.8);
resolve(dataURL);
```

**Why base64 is recommended:**
- Provides permanent storage in the database
- No dependency on browser's temporary blob URLs
- Consistent behavior across sessions and browsers
- Images are already optimized (256x256px, JPEG 80% quality)
- Easy to serve via API or embed in JSON responses

## Database Schema Requirements

### Already Supported by Better Auth
The Better Auth organization plugin manages:
- `workspaces` table with:
  - `id` (varchar, 20 chars, URL-friendly)
  - `name` (varchar, 255)
  - `slug` (varchar, 255, unique)
  - `description` (text)
  - `logo` (text - for base64 image data, permanent storage)
  - `metadata` (jsonb - for flexible data storage)
  - `createdAt`, `updatedAt` timestamps
- `workspace_members` table with:
  - `id` (uuid)
  - `workspaceId`, `userId` (foreign keys)
  - `role` (enum: owner, admin, member, guest)
  - `status` (varchar)
  - `joinedAt` (timestamp)
- Session table updated with `activeOrganizationId`

### Data Fields from Wizard

#### Step 1: Workspace Identity
- **name** → `workspaces.name` ✓
- **slug** → `workspaces.slug` ✓
- **type** → `workspaces.metadata.type` (Company, Team, Project, Personal, Location, Other)
- **customType** → `workspaces.metadata.customType` (when type is "Other")
- **icon** → `workspaces.logo` (image URL or base64)
- **iconType** → `workspaces.metadata.branding.iconType` ("image" or "lucide")
- **iconName** → `workspaces.metadata.branding.iconName` (Lucide icon name)
- **iconColor** → `workspaces.metadata.branding.iconColor`
- **backgroundColor** → `workspaces.metadata.branding.backgroundColor`

#### Step 2: Workspace Description
- **description** → `workspaces.description` ✓

#### Step 3: Team Members
- **members[].email** → `ydtb_workspace_invitations.email` (new table needed)
- **members[].role** → `ydtb_workspace_invitations.role` (new table needed)
- **members[].message** → `ydtb_workspace_invitations.message` (new table needed)
- **members[].name** → Not stored, used only for invitation display

#### Step 4: Workspace Tools
- **tools[]** → `workspaces.metadata.enabledTools` (array of tool IDs)
  - Can migrate to dedicated tables later when tools feature is fully implemented

### Schema Additions Needed

#### 1. Workspace Invitations Table
For proper invitation workflow with messages:
```sql
CREATE TABLE ydtb_workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id VARCHAR(20) NOT NULL REFERENCES ydtb_workspaces(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  message TEXT,
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by TEXT NOT NULL REFERENCES user(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending' -- pending, accepted, declined, expired
);
```


### Data Storage Strategy

#### Phase 1: Initial Implementation
1. Store wizard-specific data in `workspaces.metadata`:
   ```json
   {
     "type": "Company",
     "customType": "Consulting Firm",
     "branding": {
       "iconType": "lucide",
       "iconName": "Building2",
       "iconColor": "indigo",
       "backgroundColor": "indigo"
     },
     "enabledTools": ["contacts", "calendar", "inbox"]
   }
   ```

2. Create invitations table for member invitations

#### Phase 2: Future Migration
- Migrate tools configuration to dedicated tables (see Unit 3.4 Package Database Registry documentation)
- Add workspace-specific settings table
- Implement feature flags system

### Integration with Server Actions

When creating a workspace, the server action should:
1. Create the organization using Better Auth
2. Store metadata with all wizard data
3. Create invitation records for each team member
4. Send invitation emails
5. Set the workspace as active for the user

## Implementation Notes for Developer

### Import Requirements

When adding the new server actions to `/apps/core/src/server/actions/workspace.ts`, ensure these imports are included:

```typescript
import { db } from "@/server/db"
import { eq, and, gt } from "drizzle-orm"
import { workspaces, workspaceInvitations } from "@/server/db/schema"
```

### Table Naming Consistency

The plan references `workspaceInvitations` table in server actions, but the schema shows `ydtb_workspace_invitations`. Ensure consistent naming by:
1. Using `ydtb_workspace_invitations` in the database schema (preferred)
2. Updating the server actions to reference the correct table name: `ydtb_workspace_invitations`

### Critical First Step

**Before starting any UI work, update `/apps/core/src/lib/auth-client.ts`** to add the missing `organizationClient()` plugin. This is required for client-side organization methods to work.

## Validation Checklist

- [ ] Add organizationClient plugin to auth-client.ts (FIRST STEP)
- [ ] Users without workspace always redirect to `/welcome`
- [ ] Workspace creation wizard renders directly at `/welcome`
- [ ] Workspace creation wizard validates all inputs
- [ ] Slugs are unique and validated in real-time with debounced checking
- [ ] Error handling for all failure scenarios
- [ ] Mobile responsive design
- [ ] Smooth animations and transitions
- [ ] Loading states during async operations
- [ ] Proper success/error feedback

## Integration Points

### Upstream Dependencies
- **Unit 3.5**: Email verification (must be completed before workspace creation)
- **Units 3.1-3.4**: Core authentication implementation
- **Database Schema**: Existing workspace and member tables
- **Auth Configuration**: Better Auth with organization plugin

### Downstream Dependencies
- **Future**: Workspace dashboard implementation
- **Future**: Tool-specific onboarding flows
- **Future**: Advanced workspace settings

### Related Work
- **Server Actions**: `/apps/core/src/server/actions/workspace.ts` - already has all needed actions
- **Context Provider**: `/apps/core/src/context/workspace/workspace-provider.tsx` - manages workspace state
- **Organization Hooks**: `/apps/core/src/lib/organization-hooks.ts` - data fetching hooks

## Technical Considerations

### State Management
- Use existing workspace context for global state
- Local state for wizard form data
- React Query for server state synchronization
- Session management through Better Auth

### Route Strategy
- All onboarding routes under `(auth)` route group
- Middleware checks for workspace status
- Graceful redirects based on user state
- Support for invitation tokens in URLs

### Performance Considerations
- Lazy load wizard components
- Optimize file uploads for workspace icons
- Debounce slug validation using server actions (direct RSC calls)
- Cache workspace data during onboarding

### Security Notes
- Validate all inputs server-side
- Sanitize file uploads for icons
- Rate limit invitation acceptance
- Secure invitation token handling

## UI Developer Brief: Workspace Creation Wizard

**IMPORTANT**: The complete wizard UI has already been developed and is located at `/Users/john/projects/ydtb/plan/03-authentication/onboarding/onboarding.tsx`. This section provides a textual overview of the wizard steps, but developers should refer to the actual UI implementation for detailed behavior and styling.

### Wizard Steps Overview

**Step 1: Workspace Identity**
- **Workspace Name**: Text input field
  - Real-time validation for uniqueness
  - Show error message if duplicate detected
- **Workspace Type/Category**: Dropdown selection
  - Options: Company, Team, Project, Personal, Location, Other
  - "Other" option with custom text input
- **URL Slug**: Auto-generated from name but fully editable
  - Format: `https://workspace-slug.ydtb.app`
  - Only the workspace-slug is editable, the `https://` and `.ydtb.app` are fixed
  - Show full URL preview in real-time
  - **Real-time validation**: Debounced check (300-500ms) to verify slug uniqueness
  - Must prevent user from proceeding if slug is already taken
  - Show clear error message: "This subdomain is already taken. Please choose another."
  - Include character restrictions (lowercase, numbers, hyphens only)

- **Workspace Icon**:
  - Option to upload image OR
  - Select from predefined icons
  - Uploaded image opens crop dialog (256x256px) and saves as base64 to database

**Step 2: Workspace Description**
- **Description**: Textarea for organization description
  - Rich text editor support
  - Character count indicator

**Step 3: Invite Team Members**
  - Table of currently invited people
  - Name, Email addresses & Role

- **Role Selection for Each Invite**:
  - Admin: Full access
  - Member: Standard access
  - Guest: Read-only access

- **Personal Message**: Optional message to include with invitation

**Step 4: Configure Workspace Tools**
- **Tool Selection**: Button Cards for available tools
  - List of available workspace tools/apps
  - Each tool with brief description in card.
  - Enable/disable as needed will display ring around active tools
  - Show Number of enabled tools / Add All / Search to Filter tools.

  - Contacts, Booking Calendar, Unified Inbox, Dashboards, Team Communication, Media Library, Automations, Website Pages, SOP Library, Check-In tool, Coupon Tool, Analytics & Reporting, Todos.

  - Add one item in the list that is Massage Notes (coming soon) disabled.


**Step 5: Review & Create**
- **Summary Display**:
  - Workspace name, type
  - URL (subdomain format)
  - Selected icon with preview
  - Description preview
  - Number of invited members
  - Enabled tools list
- **Actions**:
  - "Create Workspace" button
  - "Back" button to edit previous steps
  - Loading state during creation

### Important UI Requirements
**Note**: The following requirements are already implemented in the existing UI component. This section serves as contextual documentation for developers adapting the wizard.

1. **Progress Indicator**: Visual step indicator showing current step
2. **Real-time Validation**:
   - Check workspace name availability as user types
   - Show clear error messages for duplicates
   - URL slug validation with real-time feedback
3. **Mobile Responsive**: Wizard must work on mobile devices
4. **Error Handling**: Clear messaging for all error states
5. **Animations**: Smooth transitions between steps using framer-motion

### Error Messages to Implement

Error messages should be defined in a constants file and used throughout the wizard:

**File**: `/apps/core/src/lib/constants/workspace-wizard.ts`
```typescript
export const WORKSPACE_WIZARD_ERRORS = {
  // Validation errors
  SLUG_REQUIRED: "A workspace subdomain is required",
  SLUG_INVALID: "Subdomain can only contain lowercase letters, numbers, and hyphens",
  SLUG_TOO_SHORT: "Subdomain must be at least 3 characters",
  SLUG_TAKEN: "This subdomain is already taken. Please choose another.",
  NAME_REQUIRED: "Please enter a workspace name",
  NAME_TOO_SHORT: "Workspace name must be at least 2 characters",
  NAME_TOO_LONG: "Workspace name cannot exceed 100 characters",

  // General errors
  CREATION_FAILED: "Failed to create workspace. Please try again.",
  INVITATION_FAILED: "Invitation failed - please check email addresses",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",

  // Success messages
  WORKSPACE_CREATED: "Workspace created successfully!",
  INVITATION_SENT: "Invitations sent successfully!",
} as const;
```

These constants should be imported and used in the wizard component for consistent messaging.

## Important URLs

Fetch the following URLs before starting implementation:

- [Better Auth Organization Plugin Documentation](https://www.better-auth.com/docs/plugins/organization) - Review organization management patterns
- [Better Auth Main Documentation](https://www.better-auth.com/docs) - Understand core authentication concepts
- [Next.js App Router Documentation](https://nextjs.org/docs/app) - Review routing patterns for onboarding flow
- [Framer Motion Documentation](https://www.framer.com/motion/) - Understand animation patterns for smooth transitions

**Important**: The Better Auth documentation contains vital information about:
- How to properly create and manage organizations
- Invitation system implementation
- Session management with active organizations
- Best practices for organization-based routing

## References

Better Auth Documentation:
- **Organization Plugin**: https://www.better-auth.com/docs/plugins/organization
- **Admin Plugin**: https://www.better-auth.com/docs/plugins/admin
- **Main Documentation**: https://www.better-auth.com/docs

## Related Units

- **Unit 3.5**: Email Verification (must be completed first)
- **Units 3.1-3.4**: Core authentication implementation