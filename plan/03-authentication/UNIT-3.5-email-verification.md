# Unit 3.5: Post-Signup Email Verification

## Purpose
Implement mandatory email verification for all new users. Users must verify their email address before they can create or join a workspace.

## Context
- New users must verify their email address before accessing any platform features
- After email verification, users who are not in a workspace will be redirected to the workspace onboarding wizard (Unit 3.6)
- Uses better-auth's email verification plugin
- Integrates with existing authentication flow from units 3.1-3.4
- This unit focuses solely on email verification - workspace creation is handled in Unit 3.6

## User Flow

### Scenario 1: New User Signup
1. User completes signup form (email, password, name)
2. User receives verification email
3. User clicks verification link in email
4. User is logged in and redirected based on workspace status:
   - If invited to workspace: redirected to dashboard
   - If no workspace: redirected to `/welcome` (Unit 3.6)

### Scenario 2: User with Invitation
1. User signs up with invitation token
2. User receives verification email
3. After verification, automatically added to invited workspace
4. Redirected directly to dashboard

### Scenario 3: Existing User Unverified
1. User tries to log in but email is not verified
2. Redirected to verification page to resend verification email

## Definition of Done
- [ ] Email verification configured with better-auth
- [ ] Verification email sending implemented
- [ ] Email verification pages created
- [ ] Verification result page handles all states (success, error, expired)
- [ ] Resend verification email functionality
- [ ] Proper redirects after verification based on workspace status
- [ ] Error handling and validation throughout the flow
- [ ] Mobile-responsive design
- [ ] Smooth animations with framer-motion

## Implementation Steps

### 1. Configure Email Verification in Better Auth
Update the better-auth server configuration to require email verification:

**File**: `/apps/core/src/server/auth.ts` (update existing)
- Enable `requireEmailVerification` in emailAndPassword config
- Add `emailVerification` configuration with:
  - `sendVerificationEmail` function (implementation needed)
  - `expiresIn` set to 24 hours
  - `sendOnSignUp` set to true
- Use console.log for development, implement actual email service later

### 2. Create Email Verification Pages
Create routes and components for email verification flow:

**UI Components Available**:
- Email verification page: `/Users/john/projects/ydtb/plan/03-authentication/login/verify.tsx`
- Verification result page: `/Users/john/projects/ydtb/plan/03-authentication/login/result.tsx`

**Routes to create**:
- `/apps/core/src/app/(auth)/verify/page.tsx` - Use verify.tsx as reference
- `/apps/core/src/app/(auth)/verify/error/page.tsx` - Use result.tsx as reference

**Components to adapt**:
- Adapt `VerifyEmailForm` from verify.tsx - Shows "Check your email" message with resend option
- Adapt `VerifyEmailResult` from result.tsx - Handle different verification states:
  - Success: Show success message with continue button
  - Error (status=error): Show error message with resend verification button
  - Expired/Invalid: Show appropriate error message with resend option

### 3. Create Post-Verification Redirect Logic
Create server-side logic to handle redirects after email verification:

**File**: `/apps/core/src/server/auth/post-verification-redirect.ts`
- `handlePostVerificationRedirect(userId)` - Check user's workspace status
- Redirect logic:
  - If invited to workspace: redirect to dashboard
  - If no workspace: redirect to `/welcome` (Unit 3.6)
- This will be called from the verification success page

### 4. Update Login Flow to Handle Unverified Users
Ensure unverified users are properly handled during login:

**File**: `/apps/core/src/components/auth/login-form.tsx` (if exists)
- Check if user's email is verified
- If not verified, redirect to verification page with appropriate message

### 5. Update Authenticated Routes
Add email verification checks to protected routes:

**File**: `/apps/core/src/app/(dashboard)/page.tsx` (update existing)
- Check email verification status
- Redirect logic:
  - No auth → `/login`
  - Email not verified → `/verify-email`
  - Verified but no workspace → `/welcome` (Unit 3.6)
- Only render dashboard if all checks pass

## Files to Create

1. `/apps/core/src/server/auth/post-verification-redirect.ts` - Post-verification redirect logic
2. `/apps/core/src/app/(auth)/verify/page.tsx` - Email verification route (adapt from verify.tsx)
3. `/apps/core/src/app/(auth)/verify/error/page.tsx` - Verification error handler (adapt from result.tsx)
4. `/apps/core/src/components/auth/verify-email-form.tsx` - Email verification UI (adapt from verify.tsx)
5. `/apps/core/src/components/auth/verify-email-result.tsx` - Verification result UI (adapt from result.tsx)

## UI Reference Files

The following UI components are available for reference:
- Email verification form: `/Users/john/projects/ydtb/plan/03-authentication/login/verify.tsx`
- Verification result page: `/Users/john/projects/ydtb/plan/03-authentication/login/result.tsx`

## Files to Update

1. `/apps/core/src/server/auth.ts` - Add email verification config
2. `/apps/core/src/app/(dashboard)/page.tsx` - Add email verification check
3. `/apps/core/src/components/auth/login-form.tsx` - Handle unverified users on login

## Database Schema Requirements

Better-auth will manage:
- Verification tokens table for email verification
- User table updated with email verification status

## Validation Checklist

- [ ] Users cannot signup without email verification
- [ ] Verification links work and expire after 24 hours
- [ ] Resend verification email functionality
- [ ] Verification callback handles different states:
  - Success: Shows success message with continue button
  - Error (status=error): Shows error message with resend button
  - Expired/Invalid links: Shows appropriate error messages
- [ ] Users are redirected correctly after verification:
  - With workspace invitation: redirect to dashboard
  - Without workspace: redirect to `/welcome` (Unit 3.6)
- [ ] Error handling for all failure scenarios
- [ ] Mobile responsive design
- [ ] Smooth animations and transitions
- [ ] Loading states during async operations
- [ ] Proper success/error feedback

## Integration Points

- **Units 3.1-3.4**: Existing auth configuration and session management
- **Unit 3.6**: Workspace onboarding wizard - users without workspace are redirected there after verification

## References

Better Auth Documentation:
- **Email Verification**: https://www.better-auth.com/docs/concepts/email
- **Main Documentation**: https://www.better-auth.com/docs
