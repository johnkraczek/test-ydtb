
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Hexagon, CheckCircle2, XCircle, ArrowRight, RefreshCw, ArrowLeft } from "lucide-react";
import { useLocation, useSearch } from "wouter";

export default function VerificationResultPage() {
    const [, setLocation] = useLocation();
    const search = useSearch();
    const [timeLeft, setTimeLeft] = useState(0);

    // Parse query params to determine status
    // In a real app, this would probably make an API call to verify a token
    const searchParams = new URLSearchParams(search);
    const status = searchParams.get("status") || "success"; // Default to success for preview

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleResend = () => {
        setTimeLeft(60);
        // Mock resend logic
        console.log("Resending verification email...");
    };

    const handleNextStep = () => {
        // Redirect to dashboard or onboarding
        setLocation("/");
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
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    {status === "success" ? (
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <div className="h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200 z-10">
                                                <CheckCircle2 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                            <div className="h-12 w-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 z-10">
                                                <XCircle className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                        <Hexagon className={`h-5 w-5 ${status === "success" ? "text-green-600 fill-green-600" : "text-red-600 fill-red-600"}`} />
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                {status === "success" ? "Email verified" : "Verification failed"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                {status === "success"
                                    ? "Your email has been successfully verified."
                                    : "The verification link is invalid or has expired."}
                            </p>
                        </CardHeader>

                        <CardContent className="pb-8">
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex flex-col gap-3 w-full">
                                    {status === "success" ? (
                                        <Button
                                            className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                                            onClick={handleNextStep}
                                        >
                                            Next Step
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                                                onClick={handleResend}
                                                disabled={timeLeft > 0}
                                            >
                                                {timeLeft > 0 ? (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                        Resend in {timeLeft}s
                                                    </>
                                                ) : (
                                                    "Resend verification email"
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full h-11"
                                                onClick={() => setLocation("/login")}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Sign In
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    <p>© 2024 AgencyOS. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
