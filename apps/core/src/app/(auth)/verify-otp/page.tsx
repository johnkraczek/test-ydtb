"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Hexagon, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleResend = async () => {
        setError("");
        setTimeLeft(30);
        // TODO: Implement resend OTP logic
        console.log("Resending OTP to:", email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (code.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement OTP verification
            // This would typically call an API endpoint to verify the TOTP code
            console.log("Verifying OTP:", code);

            // For now, we'll simulate verification
            await new Promise(resolve => setTimeout(resolve, 1000));

            // On success, redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]" />
                <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-rose-400 opacity-20 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden relative">
                        <CardHeader className="space-y-1 pb-4 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <Hexagon className="h-7 w-7 text-white fill-indigo-600" strokeWidth={2.5} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Enter verification code
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                We sent a 6-digit code to your authenticator app
                            </p>
                            {email && (
                                <p className="text-xs text-slate-400 mt-2">
                                    for {email}
                                </p>
                            )}
                        </CardHeader>

                        <CardContent className="pb-8">
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                                <div className="flex justify-center w-full">
                                    <InputOTP
                                        maxLength={6}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot
                                                index={0}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <InputOTPSlot
                                                index={1}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <InputOTPSlot
                                                index={2}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <InputOTPSlot
                                                index={3}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <InputOTPSlot
                                                index={4}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <InputOTPSlot
                                                index={5}
                                                className="h-12 w-12 rounded-md border border-slate-200 bg-slate-50/50 text-lg shadow-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <Button
                                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                                        type="submit"
                                        disabled={code.length !== 6 || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Verify Code
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center text-sm">
                                        {timeLeft > 0 ? (
                                            <span className="text-slate-500">
                                                Resend code in {timeLeft}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                                            >
                                                Resend code
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Link href="/login">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-11"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Sign In
                                    </Button>
                                </Link>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>© 2024 YDTB. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}