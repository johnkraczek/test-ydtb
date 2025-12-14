"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, ArrowRight, Fingerprint, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const emailParam = searchParams.get("email");

    if (verified === "true" && emailParam) {
      setEmail(emailParam);
      setSuccess("Email verified successfully! Please sign in with your password.");
    }
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        // Check if error is about unverified email
        if (result.error.status === 403 && result.error.message?.toLowerCase().includes("email not verified")) {
          setError("Please verify your email address. Check your inbox for a verification code.");
          // Trigger OTP send before redirecting
          try {
            await fetch('/api/auth/send-verification-otp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });
          } catch (err) {
            console.error("Failed to send OTP:", err);
          }
          // Redirect to OTP verification after a delay
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email)}&fromLogin=true`);
          }, 2000);
        } else {
          setError(result.error.message || "Invalid credentials");
        }
      } else {
        // Successful login, redirect to dashboard
        router.push("/");
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
        router.push("/");
      }
    } catch (err) {
      setError("Passkey not available on this device");
    } finally {
      setIsLoading(false);
    }
  };

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
              <Fingerprint className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Log in to YDTB
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back! Please enter your details.
          </p>
        </CardHeader>

        <CardContent className="pb-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <Button
              variant="outline"
              className="w-full h-11 relative overflow-hidden group border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              onClick={handlePasskeyLogin}
              disabled={isLoading}
            >
              <Fingerprint className="mr-2 h-4 w-4 text-indigo-600" />
              {isLoading ? "Authenticating..." : "Login with Passkey"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 backdrop-blur-sm px-2 text-slate-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="grid gap-4">
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
                    autoComplete="current-password"
                    className="pl-9 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 py-1">
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 mt-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6 px-6">
          <div className="w-full bg-slate-100/80 p-1 rounded-xl flex relative">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] left-1 bg-white rounded-lg shadow-sm"
            />
            <div
              className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-900 cursor-default"
            >
              Sign In
            </div>
            <Link href="/signup" className="flex-1 relative z-10 text-sm font-medium py-2 text-center text-slate-500 hover:text-slate-700 transition-colors duration-200 cursor-pointer">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center text-xs text-slate-400">
        <p>By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-500">Terms of Service</a> and <a href="#" className="underline hover:text-slate-500">Privacy Policy</a>.</p>
      </div>
    </motion.div>
  );
}