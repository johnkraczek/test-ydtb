# Unit 3.6: Post-Signup Workspace Onboarding Wizard

## Purpose
Implement mandatory workspace creation for all verified users who are not part of any workspace. Users must create or join a workspace to access the application.

## Context
- After email verification (Unit 3.5), users without a workspace are redirected to `/welcome`
- Workspace creation is mandatory - no "skip" option available
- Users cannot access the main dashboard without being in a workspace
- Uses better-auth's organization plugin for workspace management
- Integrates with existing authentication flow from units 3.1-3.5

## Prerequisites
- Unit 3.5 (Email Verification) must be completed first
- User must have verified email address
- User is logged in but not associated with any workspace

## User Flow

### Scenario 1: New User Creating Workspace
1. User completes email verification (Unit 3.5)
2. User is redirected to `/welcome`
3. Welcome page explains what workspaces are
4. User clicks "Create New Workspace"
5. User goes through 5-step creation wizard
6. Upon completion, user is redirected to dashboard

### Scenario 2: User Joining Workspace
1. User completes email verification (Unit 3.5)
2. User is redirected to `/welcome`
3. Welcome page explains what workspaces are
4. User clicks "Join Existing Workspace"
5. User enters invitation code/link
6. User is added to workspace and redirected to dashboard

### Scenario 3: User with Invitation
1. User signs up with invitation token
2. User completes email verification (Unit 3.5)
3. After verification, automatically added to invited workspace
4. Redirected directly to dashboard (bypasses welcome page)

## Definition of Done
- [ ] Welcome page created at `/welcome` route
- [ ] Welcome page explains what workspaces are
- [ ] Workspace creation wizard with 5-step form implemented
- [ ] "Create Workspace" server action implemented
- [ ] "Join Workspace" with invitation code support
- [ ] Mandatory workspace requirement enforced
- [ ] Proper redirects based on user's workspace status
- [ ] Invitation token handling for invited users
- [ ] Error handling and validation throughout the flow
- [ ] Mobile-responsive design
- [ ] Smooth animations with framer-motion

## Implementation Steps

### 1. Create Workspace Detection Helper
Create server-side utility to check user's workspace status:

**File**: `/apps/core/src/server/auth/workspace-check.ts`
- `checkUserHasWorkspaces(userId)` - Query workspace_members table
- `requireWorkspace()` - Combined check for auth, email verification, and workspace
- Return values for different states:
  - `needsAuth: true` - Redirect to login
  - `needsVerification: true` - Redirect to verify-email (Unit 3.5)
  - `needsWorkspace: true` - Redirect to welcome

### 2. Create Welcome Page
Create the mandatory workspace selection page:

**Route**: `/apps/core/src/app/(auth)/welcome/page.tsx`
- Server component that checks user status
- Redirects based on verification/workspace status
- Renders WelcomePage component if needed

**Component**: `/apps/core/src/components/auth/welcome-page.tsx`
- Welcome message with user's first name
- Educational section explaining what workspaces are:
  - Collaborative environments
  - Secure and isolated
  - Organized project management
- Two prominent options:
  - Create New Workspace
  - Join Existing Workspace
- NO "Skip for now" option

### 3. Create Workspace Creation Wizard
Multi-step form for creating a new workspace:

**Route**: `/apps/core/src/app/(auth)/welcome/create-workspace/page.tsx`

**Component**: 5-step wizard (see UI Developer Brief below)
- Visual progress indicator
- Previous/Next navigation
- Create button with loading state
- Save progress option

### 4. Create Join Workspace Flow
**Route**: `/apps/core/src/app/(auth)/welcome/join-workspace/page.tsx`

**Component**: Invitation code form with:
- Input field for invitation code/link
- Option to paste full invitation URL
- Validate and process invitation
- Auto-add user to workspace on success
- Redirect to dashboard

### 5. Update Authenticated Routes
Add workspace status checks to protected routes:

**File**: `/apps/core/src/app/(dashboard)/page.tsx`
- Use `requireWorkspace()` helper
- Redirect logic:
  - No auth → `/login`
  - Email not verified → `/verify-email` (Unit 3.5)
  - No workspace → `/welcome`
- Only render dashboard if all checks pass

### 6. Create Server Actions
**File**: `/apps/core/src/server/actions/workspace.ts`
- `createWorkspace(data)` - Uses better-auth organization plugin
  - Create organization
  - Auto-set as active organization
  - Handle duplicate names/slugs
- `joinWorkspace(invitationCode)` - Process invitation tokens
- Add proper error handling and validation

## Files to Create

1. `/apps/core/src/server/auth/workspace-check.ts` - Workspace status utilities
2. `/apps/core/src/app/(auth)/welcome/page.tsx` - Welcome route
3. `/apps/core/src/components/auth/welcome-page.tsx` - Welcome component
4. `/apps/core/src/app/(auth)/welcome/create-workspace/page.tsx` - Create workspace route
5. `/apps/core/src/components/auth/create-workspace-wizard.tsx` - Creation wizard
6. `/apps/core/src/app/(auth)/welcome/join-workspace/page.tsx` - Join workspace route
7. `/apps/core/src/components/auth/join-workspace-form.tsx` - Join form

## UI Reference File

The following UI component is available for reference:
- Workspace creation wizard: `/Users/john/projects/ydtb/plan/03-authentication/onboarding/onboarding.tsx`

## Files to Update

1. `/apps/core/src/app/(dashboard)/page.tsx` - Add workspace check
2. `/apps/core/src/server/actions/workspace.ts` - Add workspace actions

## Database Schema Requirements

Better-auth organization plugin will manage:
- `workspaces` table with slug field
- `workspace_members` table with status field
- Session table updated with `activeOrganizationId`

## Validation Checklist

- [ ] Users without workspace always redirect to `/welcome`
- [ ] Welcome page clearly explains workspace concept
- [ ] Workspace creation wizard validates all inputs
- [ ] Slugs are unique and auto-generated
- [ ] Error handling for all failure scenarios
- [ ] Mobile responsive design
- [ ] Smooth animations and transitions
- [ ] Loading states during async operations
- [ ] Proper success/error feedback

## Integration Points

- **Unit 3.5**: Email verification must be completed before workspace creation
- **Database Schema**: Existing workspace and member tables
- **Units 3.1-3.4**: Existing auth configuration and session management

## UI Developer Brief: Workspace Creation Wizard

### Wizard Steps Overview

**Step 1: Workspace Identity**
- **Workspace Name**: Text input field
  - Real-time validation for uniqueness
  - Show error message if duplicate detected
- **Workspace Type/Category**: Dropdown selection
  - Options: Company, Team, Project, Personal, Location, Other
  - "Other" option with custom text input
- **Location**: Text input for workspace location
- **URL Slug**: Auto-generated from name
  - Format: `https://workspace-slug.ydtb.app`
  - only the workspace-slug is editable, the `https://` and `.ydtb.app` are fixed.
  - Show full URL preview
  - Allow manual editing with validation
  - show state where slug has already been taken (require valid slug to move forward)

- **Workspace Icon**:
  - Option to upload image OR
  - Select from predefined icons OR
  - Generate initials from workspace name (default)
  - uploaded image should open crop to scale/move image dialog and crop to the circle

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
  - Workspace name, type, location
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

1. **Progress Indicator**: Visual step indicator showing current step
2. **Real-time Validation**:
   - Check workspace name availability as user types
   - Show clear error messages for duplicates
   - URL slug validation with real-time feedback
3. **Mobile Responsive**: Wizard must work on mobile devices
4. **Error Handling**: Clear messaging for all error states
5. **Animations**: Smooth transitions between steps using framer-motion

### Error Messages to Implement

- "URL slug is already taken"
- "Please enter a workspace name"
- "Invitation failed - please check email addresses"

## References

Better Auth Documentation:
- **Organization Plugin**: https://www.better-auth.com/docs/plugins/organization
- **Admin Plugin**: https://www.better-auth.com/docs/plugins/admin
- **Main Documentation**: https://www.better-auth.com/docs

## Related Units

- **Unit 3.5**: Email Verification (must be completed first)
- **Units 3.1-3.4**: Core authentication implementation