# Unit 3.2: Authentication UI Pages

## Purpose
Create user authentication pages (login, signup, forgot password, reset password) with smooth animations and integration with better-auth methods.

## Context
- Must have Unit 2.2 (Core Authentication Setup) completed
- Will use auth client methods configured in Unit 2.2
- Uses UI components from `/Users/john/projects/ydtb/plan/03-authentication/login/`
- Pages need to be converted from wouter to Next.js router

## Definition of Done
- [ ] Login page created with email/password and passkey support
- [ ] Signup page created with full name, email, and password fields
- [ ] Forgot password page created with email input
- [ ] Reset password page created with new password form
- [ ] All pages animated with framer-motion
- [ ] Proper error handling and loading states
- [ ] Navigation between auth pages with correct routing
- [ ] Form validation working for all inputs
- [ ] Password requirements enforced (min 8 chars, uppercase, lowercase, number, special)

## Steps

### 1. Create Auth Layout
Create `apps/core/src/app/(auth)/layout.tsx`:
```typescript
import { Metadata } from "next";
import { AuthProvider } from "~/context/auth/auth-provider";

export const metadata: Metadata = {
  title: "Authentication | YDTB",
  description: "Sign in or create an account to get started",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}
```

### 2. Create Login Page
Create `apps/core/src/app/(auth)/login/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Key } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.passkey();

      if (result.error) {
        setError(result.error.message || "Passkey authentication failed");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Passkey not available on this device");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-8 rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handlePasskeyLogin}
          disabled={isLoading}
        >
          <Key className="mr-2 h-4 w-4" />
          {isLoading ? "Authenticating..." : "Sign in with Passkey"}
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">
          Don't have an account?{" "}
        </span>
        <Link
          href="/signup"
          className="text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </motion.div>
  );
}
```

### 3. Create Signup Page
Create `apps/core/src/app/(auth)/signup/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signUp } from "@/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-8 rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Get started with your free account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be 8+ chars with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">
          Already have an account?{" "}
        </span>
        <Link
          href="/login"
          className="text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
```

### 4. Create Forgot Password Page
Create `apps/core/src/app/(auth)/forgot-password/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { forgotPassword } from "@/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await forgotPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (result.error) {
        setError(result.error.message || "Failed to send reset email");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-8 rounded-lg shadow-lg text-center"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-muted-foreground mb-6">
          We've sent a password reset link to {email}
        </p>
        <Link href="/login">
          <Button className="w-full">
            Back to Login
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-8 rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}
```

### 5. Create Reset Password Page
Create `apps/core/src/app/(auth)/reset-password/page.tsx`:
```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      router.push("/forgot-password");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card p-8 rounded-lg shadow-lg text-center"
      >
        <Lock className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Password reset successful</h1>
        <p className="text-muted-foreground mb-6">
          Your password has been updated successfully
        </p>
        <Link href="/login">
          <Button className="w-full">
            Sign In
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!token) {
    return (
      <div className="bg-card p-8 rounded-lg shadow-lg text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-8 rounded-lg shadow-lg"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be 8+ chars with uppercase, lowercase, number, and special character
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}
```

### 6. Create Auth Provider (Optional but Recommended)
Create `apps/core/src/context/auth/auth-provider.tsx`:
```typescript
"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthContextType {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: sessionLoading } = useSession();
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        isLoading: sessionLoading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## Files to Create

1. `/apps/core/src/app/(auth)/layout.tsx` - Auth layout wrapper
2. `/apps/core/src/app/(auth)/login/page.tsx` - Login page with email/password and passkey
3. `/apps/core/src/app/(auth)/signup/page.tsx` - Signup page with validation
4. `/apps/core/src/app/(auth)/forgot-password/page.tsx` - Forgot password page
5. `/apps/core/src/app/(auth)/reset-password/page.tsx` - Reset password page
6. `/apps/core/src/context/auth/auth-provider.tsx` - Optional auth provider for error handling

## Files to Update

1. `/apps/core/src/app/(auth)/layout.tsx` - Include auth provider if created
2. `/apps/core/src/middleware.ts` - Add redirects for authenticated users (if using middleware)

## Validation Checklist

- [ ] Login page renders and accepts email/password
- [ ] Login with valid credentials redirects to dashboard
- [ ] Login with invalid credentials shows error
- [ ] Passkey login button visible and functional on supported devices
- [ ] Signup page creates new user successfully
- [ ] Password validation working (8+ chars, uppercase, lowercase, number, special)
- [ ] Password confirmation matching works
- [ ] Forgot password sends reset email
- [ ] Reset password accepts valid token and updates password
- [ ] Reset password rejects invalid token
- [ ] All pages animated with framer-motion
- [ ] Navigation between pages works correctly
- [ ] Forms disabled during loading
- [ ] Error messages displayed clearly

## Testing

```bash
# 1. Start development server
bun run dev

# 2. Test auth pages
# - Visit /login - should render with animations
# - Test login with valid credentials
# - Test login with invalid credentials (check error message)
# - Test passkey login (if available)

# 3. Test signup flow
# - Visit /signup
# - Test password validation
# - Create new account
# - Verify redirect to dashboard

# 4. Test password reset
# - Visit /forgot-password
# - Enter email and submit
# - Check console for reset URL
# - Visit reset URL
# - Set new password
# - Try login with new password
```

## Common Issues and Solutions

1. **Navigation Not Working**:
   - Ensure using Next.js `Link` component from "next/link"
   - Check that router.push() is being used correctly

2. **Form Validation Issues**:
   - Verify password regex matches requirements
   - Check that form submission is properly prevented with e.preventDefault()

3. **Animation Not Working**:
   - Ensure framer-motion is installed
   - Check that motion components are properly imported

4. **Session Not Persisting**:
   - Verify BETTER_AUTH_SECRET is set
   - Check that cookies are being set correctly

## Integration Points

- **Unit 2.2**: Uses auth client methods and session provider
- **Unit 2.5**: Pages will be protected by authentication
- **UI Components**: Uses components from `/Users/john/projects/ydtb/plan/03-authentication/login/`
- **Unit 2.4**: After signup, users will be able to create/join workspaces