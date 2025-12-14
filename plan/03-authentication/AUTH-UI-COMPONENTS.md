# Authentication UI Components Reference

This document contains the reference implementations for the authentication UI components. These are the actual components that should be created, not just examples.

## Component Locations

### 1. Login Page
**File**: `/apps/core/src/app/(auth)/login/page.tsx`
- Email/password login form
- Passkey login button
- Link to forgot password
- Sign In/Sign Up toggle

**Reference Implementation**: [`/Users/john/projects/ydtb/plan/03-authentication/login/login.tsx`](./login/login.tsx)

### 2. Signup Page
**File**: `/apps/core/src/app/(auth)/signup/page.tsx`
- Full name, email, password fields
- Terms of Service agreement
- Sign In/Sign Up toggle

**Reference Implementation**: [`/Users/john/projects/ydtb/plan/03-authentication/login/signup.tsx`](./login/signup.tsx)

### 3. Forgot Password Page
**File**: `/apps/core/src/app/(auth)/forgot-password/page.tsx`
- Email input for reset link
- Success state handling
- Back to login link

**Reference Implementation**: [`/Users/john/projects/ydtb/plan/03-authentication/login/forgot.tsx`](./login/forgot.tsx)

### 4. Reset Password Page
**File**: `/apps/core/src/app/(auth)/reset-password/page.tsx`
- New password and confirm password fields
- Token validation
- Back to login link

**Reference Implementation**: [`/Users/john/projects/ydtb/plan/03-authentication/login/reset.tsx`](./login/reset.tsx)

## Common UI Patterns

All auth pages should follow these patterns:

### Background
```tsx
<div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
  <div className="absolute inset-0 z-0 opacity-40">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]" />
    <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-rose-400 opacity-20 blur-[100px]" />
  </div>
  {/* Content */}
</div>
```

### Card Structure
```tsx
<Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden relative">
  <CardHeader className="space-y-1 pb-4 text-center">
    <div className="flex justify-center mb-4">
      <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
        <Hexagon className="h-7 w-7 text-white fill-indigo-600" strokeWidth={2.5} />
      </div>
    </div>
    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
      {/* Page title */}
    </h2>
    <p className="text-sm text-slate-500 mt-1">
      {/* Page description */}
    </p>
  </CardHeader>
  <CardContent>
    {/* Form content */}
  </CardContent>
</Card>
```

### Form Fields
```tsx
<div className="grid gap-2">
  <Label htmlFor="field">Field Label</Label>
  <div className="relative">
    <Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
    <Input
      id="field"
      type="text"
      placeholder="Placeholder"
      className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
    />
  </div>
</div>
```

### Animation
```tsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  {/* Content */}
</motion.div>
```

## Better-Auth Integration

### Client Methods
```typescript
import { signIn, signUp, forgotPassword, resetPassword } from "@/lib/auth-client";

// Sign in
const result = await signIn.email({
  email,
  password,
  callbackURL: "/dashboard",
});

// Sign up
const result = await signUp.email({
  email,
  password,
  name: fullName,
  callbackURL: "/dashboard",
});

// Forgot password
const result = await forgotPassword({
  email,
  redirectTo: "/auth/reset-password",
});

// Reset password
const result = await resetPassword({
  newPassword: password,
  token,
});
```

### Passkey Login
```typescript
import { signIn } from "@/lib/auth-client";

const result = await signIn.passkey();
```

### Error Handling
```tsx
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### Loading States
```tsx
<Button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

## Navigation

### Next.js Router
```tsx
import { useRouter } from "next/navigation";
import Link from "next/link";

// Programmatic navigation
const router = useRouter();
router.push("/login");

// Link component
<Link href="/signup">Sign Up</Link>
```

## Dependencies Required

- `framer-motion` for animations
- `@/components/ui/*` shadcn/ui components
- `lucide-react` for icons
- `better-auth/react` for auth methods

## Styling Guidelines

1. Use consistent spacing with `gap-4` for form sections
2. All buttons should have `h-11` height
3. Input fields should have icon on the left with `pl-9` padding
4. Cards should use glassmorphism effect with `bg-white/80 backdrop-blur-xl`
5. Motion animations should use `duration: 0.4, ease: "easeOut"`