"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, KeyRound, CheckCircle2, Scissors, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { ThemeToggle } from "@/components/theme-toggle";

type FormState = "LOGIN" | "FORGOT_EMAIL" | "FORGOT_OTP" | "FORGOT_NEW_PASS" | "SUCCESS";

export default function AdminLogin() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("LOGIN");
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      toast.success("Logged in successfully! Redirecting...");
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      setFormState("FORGOT_OTP");
      toast.success("OTP sent to your email!");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      
      setFormState("FORGOT_NEW_PASS");
      toast.success("OTP verified!");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      
      setFormState("SUCCESS");
      toast.success("Password reset successfully!");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { opacity: 0, y: 15, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.98 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:via-zinc-950 dark:to-zinc-950 relative overflow-hidden">
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-[480px] z-10 relative flex flex-col items-center">
        
        <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-4 shadow-xl">
            <Scissors className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Salon Admin</h1>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
          {formState === "LOGIN" && (
            <motion.div key="LOGIN" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleLogin}>
                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden">
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base mt-2">Enter your credentials to access the dashboard</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-700 dark:text-zinc-300">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400" />
                        <Input 
                          type="email" 
                          placeholder="admin@example.com" 
                          className="pl-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500 h-14 text-base rounded-xl transition-all" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium leading-none text-zinc-700 dark:text-zinc-300">Password</label>
                        <button type="button" onClick={() => setFormState("FORGOT_EMAIL")} className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-colors group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pl-12 pr-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500 h-14 text-base rounded-xl transition-all" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all h-14 rounded-xl font-medium text-lg" disabled={loading}>
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "FORGOT_EMAIL" && (
            <motion.div key="FORGOT_EMAIL" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-xl shadow-xl">
                <CardHeader className="space-y-3 pb-6">
                  <button 
                    onClick={() => { setErrorMsg(""); setFormState("LOGIN"); }}
                    className="w-fit text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2 flex items-center transition-colors"
                  >
                    ← Back to login
                  </button>
                  <div className="mx-auto bg-purple-100 dark:bg-purple-600/20 p-4 rounded-full border border-purple-200 dark:border-purple-500/30 w-fit">
                    <KeyRound className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-center tracking-tight text-zinc-900 dark:text-zinc-100">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-center text-lg text-zinc-500 dark:text-zinc-400">
                    Enter your admin email to receive an OTP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm">{errorMsg}</div>}
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" />
                        <Input 
                          type="email" 
                          placeholder="Admin Email" 
                          className="pl-11 h-12 text-base bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-white/10 focus-visible:ring-purple-500 text-zinc-900 dark:text-zinc-100"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base rounded-xl font-medium" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Code"} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {formState === "FORGOT_OTP" && (
            <motion.div key="FORGOT_OTP" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleVerifyOtp}>
                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden">
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight">Enter Code</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base mt-2">We've sent a 6-digit code to <span className="text-zinc-900 dark:text-zinc-200 font-medium">{email || "your email"}</span>.</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-700 dark:text-zinc-300">Verification Code</label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        <Input 
                          type="text" 
                          placeholder="000000" 
                          maxLength={6}
                          className="pl-12 text-center tracking-[0.5em] font-mono font-semibold text-2xl bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500 h-16 rounded-xl transition-all"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 rounded-xl font-medium text-lg" disabled={loading || otp.length < 6}>
                      {loading ? "Verifying..." : "Verify Code"}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-14 rounded-xl font-medium text-base" onClick={() => setFormState("FORGOT_EMAIL")}>
                      Change Email
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "FORGOT_NEW_PASS" && (
            <motion.div key="FORGOT_NEW_PASS" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleResetPassword}>
                <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden">
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-900 dark:text-zinc-100 font-semibold tracking-tight">New Password</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 text-base mt-2">Enter your new password below.</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 dark:text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-700 dark:text-zinc-300">New Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className="pl-12 pr-11 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500 h-14 text-base rounded-xl transition-all"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4.5 text-zinc-500">
                          {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-700 dark:text-zinc-300">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500 h-14 text-base rounded-xl transition-all"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 rounded-xl font-medium text-lg" disabled={loading}>
                      {loading ? "Resetting..." : "Save Password"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "SUCCESS" && (
            <motion.div key="SUCCESS" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-xl shadow-xl text-center py-8">
                <CardContent className="space-y-6 pt-6">
                  <div className="mx-auto bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-full border border-emerald-200 dark:border-emerald-500/30 w-fit">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Password Reset</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                      Your password has been successfully updated.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent border-t-0 pt-8 pb-0 px-8">
                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white h-14 rounded-xl font-medium text-lg border border-zinc-300 dark:border-white/5" onClick={() => setFormState("LOGIN")}>
                    Back to Login
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        
        <p className="mt-12 text-base text-zinc-500 dark:text-zinc-600 font-medium">
          &copy; {new Date().getFullYear()} Salon System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
