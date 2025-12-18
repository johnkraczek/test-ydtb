"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signUp } from "@ydtb/core/lib/auth-client";
import { Button } from "@ydtb/ui/base/button";
import { Input } from "@ydtb/ui/base/input";
import { Label } from "@ydtb/ui/base/label";
import { Card, CardContent, CardFooter, CardHeader } from "@ydtb/ui/base/card";
import { Alert, AlertDescription } from "@ydtb/ui/base/alert";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        callbackURL: "/verify-otp",
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
      } else {
        // Redirect to OTP verification page after successful signup
        router.push(`/verify-otp?email=${encodeURIComponent(email)}&fromSignup=true`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Note: The success state is now handled by redirecting to verify-otp page
  // This conditional is no longer needed
  if (false) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden relative">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-7 w-7 bg-green-600 rounded-sm" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Account created!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your account has been created successfully. You can now sign in.
            </p>
          </CardHeader>

          <CardContent className="pb-4">
            <Link href="/login">
              <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>

          <CardFooter className="pt-2 pb-6 px-6">
            <div className="w-full bg-slate-100/80 p-1 rounded-xl flex relative">
              <Link href="/login" className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-500 hover:text-slate-700 transition-colors duration-200 cursor-pointer">
                Sign In
              </Link>
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] right-1 bg-white rounded-lg shadow-sm"
              />
              <div
                className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-900 cursor-default"
              >
                Sign Up
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden relative">
        <CardHeader className="space-y-1 pb-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <User className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Get started with your free account
          </p>
        </CardHeader>

        <CardContent className="pb-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  autoComplete="name"
                  className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-500">
                Must be 8+ chars with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-2 pb-6 px-6">
          <div className="w-full bg-slate-100/80 p-1 rounded-xl flex relative">
            <Link href="/login" className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-500 hover:text-slate-700 transition-colors duration-200 cursor-pointer">
              Sign In
            </Link>
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] right-1 bg-white rounded-lg shadow-sm"
            />
            <div
              className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-900 cursor-default"
            >
              Sign Up
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center text-xs text-slate-400">
        <p>By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-500">Terms of Service</a> and <a href="#" className="underline hover:text-slate-500">Privacy Policy</a>.</p>
      </div>
    </motion.div>
  );
}