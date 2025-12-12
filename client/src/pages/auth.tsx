
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Hexagon, Fingerprint, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just redirect to dashboard
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
          <Card className="border-slate-200 shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <CardHeader className="space-y-1 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Hexagon className="h-7 w-7 text-white fill-indigo-600" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {mode === "signin" ? "Log in to AgencyOS" : "Create an account"}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === "signin" 
                  ? "Welcome back! Please enter your details." 
                  : "Enter your details to get started."}
              </p>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid gap-4">
                <Button variant="outline" className="w-full h-11 relative overflow-hidden group border-slate-200 hover:border-slate-300 hover:bg-slate-50">
                  <Fingerprint className="mr-2 h-4 w-4 text-indigo-600" />
                  {mode === "signin" ? "Login with Passkey" : "Sign up with Passkey"}
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
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {mode === "signin" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-end"
                      >
                        <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                          Forgot your password?
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20" type="submit">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 pb-6 px-6">
              <div className="w-full bg-slate-100/80 p-1 rounded-xl flex relative">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-spring ${
                    mode === "signin" ? "left-1" : "left-[calc(50%+4px)]"
                  }`}
                />
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors duration-200 ${
                    mode === "signin" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 relative z-10 text-sm font-medium py-2 text-center transition-colors duration-200 ${
                    mode === "signup" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>By clicking continue, you agree to our <a href="#" className="underline hover:text-slate-500">Terms of Service</a> and <a href="#" className="underline hover:text-slate-500">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
}
