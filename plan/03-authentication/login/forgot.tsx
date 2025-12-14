
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Hexagon, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password reset request
        console.log("Reset password for", email);
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
                                Reset your password
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Enter your email to receive a reset link.
                            </p>
                        </CardHeader>

                        <CardContent className="pb-8">
                            <div className="grid gap-4">
                                <form onSubmit={handleSubmit} className="grid gap-4">
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
                                            />
                                        </div>
                                    </div>

                                    <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 mt-2" type="submit">
                                        Send Reset Link
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <Link href="/login">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full h-11 mt-2"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Back to Sign In
                                        </Button>
                                    </Link>
                                </form>
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
