# Unit 3.5: Post-Signup Email Verification with OTP

## Purpose
Implement mandatory email verification for all new users using a one-time password (OTP) system. Users must verify their email address by entering a 6-digit code sent to their email before they can create or join a workspace.

## Context
- New users must verify their email address using OTP before accessing any platform features
- After email verification, users who are not in a workspace will be redirected to the workspace onboarding wizard (Unit 3.6)
- Uses better-auth's Email OTP plugin for secure code-based verification
- Integrates with existing authentication flow from units 3.1-3.4
- This unit focuses solely on email verification via OTP - workspace creation is handled in Unit 3.6

**IMPORTANT**: DO NOT modify existing login/signup page designs or core functionality. The only changes to existing forms are minimal redirects when email verification is required.

## User Flow

### Scenario 1: New User Signup
1. User completes signup form (email, password, name)
2. User is redirected to OTP verification page
3. User receives 6-digit OTP code via email
4. User enters OTP code on verification page
5. Upon successful verification, user is logged in and redirected based on workspace status:
   - If invited to workspace: redirected to dashboard
   - If no workspace: redirected to `/welcome` (Unit 3.6)

### Scenario 2: User with Invitation
1. User signs up with invitation token
2. User is redirected to OTP verification page
3. User receives 6-digit OTP code via email
4. User enters OTP code on verification page
5. After successful verification, automatically added to invited workspace
6. Redirected directly to dashboard

### Scenario 3: Existing User Unverified
1. User tries to log in but their account is inactive due to unverified email
2. Authentication succeeds but user is redirected to OTP verification page
3. User can request new OTP to be sent to their email
4. User enters OTP code to verify email
5. Upon successful verification, their account becomes active and normal login flow continues

## Definition of Done
- [ ] Email OTP plugin configured with better-auth
- [ ] OTP email sending implemented with email service
- [ ] OTP verification page created with 6-digit input
- [ ] OTP validation handles all states (success, invalid, expired, max attempts)
- [ ] Resend OTP functionality with countdown timer
- [ ] Proper redirects after verification based on workspace status
- [ ] Error handling for invalid/expired OTPs and rate limiting
- [ ] Mobile-responsive OTP input design
- [ ] Smooth animations with framer-motion
- [ ] Auto-focus management between OTP input fields

## Implementation Steps

### 1. Configure Email OTP Plugin in Better Auth
Update the better-auth server configuration to use Email OTP for verification:

**File**: `/apps/core/src/server/auth.ts` (update existing)
- Add `emailOTP` plugin to plugins array
- Configure `emailOTP` with:
  - `sendVerificationOTP` function (implementation using React Email)
  - `otpLength` set to 6 digits
  - `expiresIn` set to 5 minutes (300 seconds)
  - `allowedAttempts` set to 3
  - `storeOTP` set to "hashed" for security
  - `disableSignUp` set to false to allow auto-registration
- Add `emailOTPClient()` to client configuration
- Implement email sending with React Email + generic SMTP transporter

### 2. Set Up Email Infrastructure with React Email
Configure React Email and SMTP transporter for sending OTP emails:

**Files to create**:
1. `/apps/core/src/email/otp-verification-email.tsx` - React Email template for OTP
2. `/apps/core/src/lib/email-transporter.ts` - Generic SMTP configuration
3. `/apps/core/src/server/auth/email-sender.ts` - Email sending service (includes rate limiting)
4. `/apps/core/src/lib/rate-limiter.ts` - Rate limiting utility for email sending

**Email Template**:
- Create React Email component with:
  - Professional branding
  - Clear 6-digit code display
  - Expiration notice (5 minutes)
  - Security disclaimer
  - Responsive design

**SMTP Transporter**:
- Use Node.js `nodemailer` with generic SMTP configuration
- Support for common providers (Gmail, Outlook, SendGrid, etc.)
- Environment variables for SMTP credentials:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`
  - `SMTP_FROM` (default sender email)

### 3. Create OTP Verification Page
Create route and component for OTP-based email verification:

**UI Component Available**:
- OTP input component: `/Users/john/projects/ydtb/plan/03-authentication/login/otp.tsx`

**Routes to create**:
- `/apps/core/src/app/(auth)/verify-otp/page.tsx` - Adapt from otp.tsx

**Component to adapt**:
- Adapt OTPPage component to integrate with better-auth Email OTP:
  - Replace mock verification with `authClient.emailOtp.checkVerificationOtp()`
  - Replace mock resend with `authClient.emailOtp.sendVerificationOtp()`
  - Store email from signup/login in session state or URL params
  - Handle verification result and redirect appropriately
  - Show error states for invalid/expired OTPs
  - Show rate limiting message when max attempts reached

### 4. Update Signup Flow to Trigger OTP Verification
Ensure new users are redirected to OTP verification after signup:

**File**: `/apps/core/src/components/auth/signup-form.tsx` (MINIMAL changes only)
- DO NOT modify the UI or form behavior
- After successful signup completion, add server-side check: if email verification is required, redirect to `/verify-otp`
- No visible changes to the signup form itself

### 5. Update Login Flow to Handle Unverified Users
Ensure unverified users are properly handled during login:

**File**: `/apps/core/src/components/auth/login-form.tsx` (MINIMAL changes only)
- DO NOT modify the UI or form behavior
- After successful authentication, add server-side check: if email not verified, redirect to `/verify-otp`
- Login form remains exactly as is - only the redirect logic is added on the server

### 6. Create Post-Verification Redirect Logic
Create server-side logic to handle redirects after OTP verification:

**File**: `/apps/core/src/server/auth/post-verification-redirect.ts`
- `handlePostVerificationRedirect(userId)` - Check user's workspace status
- Redirect logic:
  - If invited to workspace: redirect to dashboard
  - If no workspace: redirect to `/welcome` (Unit 3.6)
- This will be called from the OTP verification success handler

### 7. Update Authenticated Routes
Add email verification checks to protected routes:

**File**: `/apps/core/src/app/(dashboard)/page.tsx` (update existing)
- Check email verification status
- Redirect logic:
  - No auth → `/login`
  - Email not verified → `/verify-otp`
  - Verified but no workspace → `/welcome` (Unit 3.6)
- Only render dashboard if all checks pass

## Files to Create

1. `/apps/core/src/email/otp-verification-email.tsx` - React Email template for OTP
2. `/apps/core/src/lib/email-transporter.ts` - Generic SMTP configuration
3. `/apps/core/src/server/auth/email-sender.ts` - Email sending service (includes rate limiting)
4. `/apps/core/src/lib/rate-limiter.ts` - Rate limiting utility for email sending
5. `/apps/core/src/server/auth/post-verification-redirect.ts` - Post-verification redirect logic
6. `/apps/core/src/app/(auth)/verify-otp/page.tsx` - OTP verification route (adapt from otp.tsx)
7. `/apps/core/src/components/auth/otp-verification-form.tsx` - OTP verification UI (adapt from otp.tsx)

## UI Reference Files

The following UI components are available for reference:
- OTP input component: `/Users/john/projects/ydtb/plan/03-authentication/login/otp.tsx`

## Files to Update

1. `/apps/core/src/server/auth.ts` - Add Email OTP plugin configuration
2. `/apps/core/src/app/(dashboard)/page.tsx` - Add email verification check (redirect to /verify-otp)
3. `/apps/core/src/components/auth/signup-form.tsx` - Trigger OTP after signup
4. `/apps/core/src/components/auth/login-form.tsx` - Handle unverified users on login
5. `/apps/core/src/lib/auth-client.ts` - Add emailOTPClient() plugin
6. `/apps/core/package.json` - Add React Email and nodemailer dependencies

## Database Schema Requirements

Better-auth Email OTP plugin will manage:
- OTP verification tokens table
- User table updated with email verification status
- Failed attempt tracking for rate limiting

### Account States
- **Email Not Verified**: Account created but inactive. User can authenticate but has limited access.
- **Email Verified**: Account becomes active and user has full access based on workspace membership.

## Rate Limiting & Security Considerations

### Email Rate Limiting
- Maximum of **3 emails per 15 minutes** per email address
- Use Redis or database to track email send counts with timestamp
- Implement sliding window algorithm for rate limiting
- Clear error message when limit reached: "Too many emails sent. Please try again later."

### OTP Attempt Rate Limiting
- Better-auth handles OTP attempt limits (configured to 3 attempts)
- After max attempts, user must request new OTP
- Enforce cooldown period between OTP requests (30 seconds)

### Security Measures
- Validate email format and domain
- Check against common disposable email providers
- Store OTPs hashed in database (configured via `storeOTP: "hashed"`)
- Implement CORS headers for OTP endpoints

## Validation Checklist

### OTP Verification Functionality
- [ ] Users cannot access dashboard without completing OTP verification
- [ ] OTP codes work and expire after 5 minutes
- [ ] Resend OTP functionality with 30-second cooldown
- [ ] Email rate limiting: 3 emails per 15 minutes per address
- [ ] OTP verification handles all states:
  - Success: Automatically logs user in and redirects
  - Invalid code: Shows error message, allows retry
  - Expired code: Shows "code expired" with resend option
  - Max attempts reached: Shows rate limiting message
- [ ] Auto-advance between OTP input fields
- [ ] Paste functionality works for OTP codes
- [ ] Mobile responsive OTP input design
- [ ] Smooth animations and transitions
- [ ] Loading states during async operations
- [ ] Proper success/error feedback
- [ ] OTP codes are case-insensitive if using alphanumeric
- [ ] Keyboard accessibility (tab navigation, enter to submit)

### Existing Forms (No Changes)
- [ ] Login form appearance and behavior unchanged
- [ ] Signup form appearance and behavior unchanged
- [ ] All existing form validations remain intact
- [ ] Only server-side redirect logic added where necessary

### Redirects After Verification
- [ ] Users are redirected correctly after verification:
  - With workspace invitation: redirect to dashboard
  - Without workspace: redirect to `/welcome` (Unit 3.6)
- [ ] Error handling for all failure scenarios

## Email Service Implementation Requirements

### Dependencies
Install required packages:
```bash
bun add @react-email/components nodemailer
bun add -d @types/nodemailer
# For Redis-based rate limiting (optional)
bun add ioredis
bun add -d @types/ioredis
```

### Development Environment
- Always output OTP codes to console for easy testing during development
- Configure SMTP settings in `.env.local` for testing actual email delivery
- Option to bypass email sending with `SKIP_EMAIL_SENDING=true` env var
- Console output format: `[OTP Verification] Email: {email}, Code: {otp}, Expires in: {minutes} minutes`

### Production Environment
- Use generic SMTP transporter with nodemailer
- Environment variables for configuration:
  - `SMTP_HOST` - SMTP server hostname (e.g., smtp.gmail.com)
  - `SMTP_PORT` - SMTP port (typically 587 for TLS, 465 for SSL)
  - `SMTP_SECURE` - Set to true for SSL, false for TLS
  - `SMTP_USER` - SMTP username
  - `SMTP_PASSWORD` - SMTP password or app password
  - `SMTP_FROM` - Default from email address and display name
  - `SKIP_EMAIL_SENDING` - Set to true to disable email sending
  - `REDIS_URL` - Redis URL for rate limiting (optional, falls back to database)

### Rate Limiting Implementation
Create `/apps/core/src/lib/rate-limiter.ts`:
```typescript
interface RateLimitConfig {
  windowMs: number; // 15 minutes in milliseconds
  maxAttempts: number; // 3 emails
}

export class EmailRateLimiter {
  private config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 3,
  };

  async canSendEmail(email: string): Promise<{ allowed: boolean; remaining?: number; resetTime?: Date }> {
    // Implementation using Redis or database
    // Tracks email sends in sliding window
    // Returns whether email can be sent and remaining count
  }

  async recordEmailSent(email: string): Promise<void> {
    // Record the email send with timestamp
  }
}
```

### React Email Template
Create `/apps/core/src/email/otp-verification-email.tsx`:
```tsx
import { Html, Text, Button, Container, Heading, Section } from "@react-email/components";

interface OtpVerificationEmailProps {
  userName?: string;
  otp: string;
  expirationMinutes?: number;
}

export default function OtpVerificationEmail({
  userName,
  otp,
  expirationMinutes = 5
}: OtpVerificationEmailProps) {
  return (
    <Html>
      <Container style={styles.container}>
        <Heading style={styles.heading}>Verify your email for YDTB</Heading>

        {userName && (
          <Text style={styles.text}>Hi {userName},</Text>
        )}

        <Text style={styles.text}>
          Your verification code is:
        </Text>

        <Container style={styles.otpContainer}>
          <Text style={styles.otp}>{otp}</Text>
        </Container>

        <Text style={styles.text}>
          This code will expire in {expirationMinutes} minutes.
        </Text>

        <Text style={styles.text}>
          If you didn't request this code, you can safely ignore this email.
        </Text>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            Thanks,
            <br />
            The YDTB Team
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#4b5563',
    marginBottom: '16px',
  },
  otpContainer: {
    backgroundColor: '#f3f4f6',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '20px 0',
  },
  otp: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#1f2937',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
  },
};
```

## Integration Points

- **Units 3.1-3.4**: Existing auth configuration and session management
- **Unit 3.6**: Workspace onboarding wizard - users without workspace are redirected there after OTP verification
- **React Email**: For email template generation and styling
- **Nodemailer**: For SMTP email delivery
- **SMTP Provider**: Any SMTP-compatible email service (Gmail, Outlook, SendGrid, etc.)

## References

Better Auth Documentation:
- **Email OTP Plugin**: https://www.better-auth.com/docs/plugins/email-otp
- **Main Documentation**: https://www.better-auth.com/docs

React Email Documentation:
- **Getting Started**: https://react.email/docs
- **Components**: https://react.email/docs/components

Nodemailer Documentation:
- **SMTP Transport**: https://nodemailer.com/smtp/
