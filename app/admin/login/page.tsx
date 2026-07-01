"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, ArrowRight, KeyRound, CheckCircle2, Scissors, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0c] p-6 relative overflow-hidden font-sans text-zinc-100">
      {/* Background gradients / blurs for premium feel */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />

      <div className="mb-12 flex flex-col items-center z-10">
        <div className="h-16 w-16 bg-zinc-900/80 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-6 shadow-[0_0_40px_rgba(147,51,234,0.15)] ring-1 ring-white/5">
          <Scissors className="text-purple-400 w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
          Salon Admin
        </h1>
      </div>

      <div className="w-full max-w-[480px] z-10 relative">
        <AnimatePresence mode="wait">
          {formState === "LOGIN" && (
            <motion.div key="LOGIN" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleLogin}>
                <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-100 font-semibold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">Enter your credentials to access the dashboard</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-300">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="email" 
                          placeholder="admin@example.com" 
                          className="pl-12 bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-14 text-base rounded-xl transition-all shadow-inner" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium leading-none text-zinc-300">Password</label>
                        <button type="button" onClick={() => setFormState("FORGOT_EMAIL")} className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-12 bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-14 text-base rounded-xl transition-all shadow-inner" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] h-14 rounded-xl font-medium text-lg" disabled={loading}>
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "FORGOT_EMAIL" && (
            <motion.div key="FORGOT_EMAIL" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleSendOtp}>
                <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-100 font-semibold tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">Enter your email address to receive a verification code.</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-300">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="email" 
                          placeholder="admin@example.com" 
                          className="pl-12 bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-14 text-base rounded-xl transition-all shadow-inner"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] h-14 rounded-xl font-medium text-lg" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Code"} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-zinc-400 hover:text-zinc-200 h-14 rounded-xl font-medium text-base" onClick={() => setFormState("LOGIN")}>
                      Back to Login
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "FORGOT_OTP" && (
            <motion.div key="FORGOT_OTP" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <form onSubmit={handleVerifyOtp}>
                <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-100 font-semibold tracking-tight">Enter Code</CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">We've sent a 6-digit code to <span className="text-zinc-200 font-medium">{email || "your email"}</span>.</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-300">Verification Code</label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-4.5 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="text" 
                          placeholder="000000" 
                          maxLength={6}
                          className="pl-12 text-center tracking-[0.5em] font-mono font-semibold text-2xl bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-16 rounded-xl transition-all shadow-inner"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] h-14 rounded-xl font-medium text-lg" disabled={loading || otp.length < 6}>
                      {loading ? "Verifying..." : "Verify Code"}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-zinc-400 hover:text-zinc-200 h-14 rounded-xl font-medium text-base" onClick={() => setFormState("FORGOT_EMAIL")}>
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
                <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                  <CardHeader className="pb-8 pt-8 px-8">
                    <CardTitle className="text-3xl text-zinc-100 font-semibold tracking-tight">New Password</CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">Enter your new password below.</CardDescription>
                    {errorMsg && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{errorMsg}</div>}
                  </CardHeader>
                  <CardContent className="space-y-6 px-8">
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-300">New Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-12 bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-14 text-base rounded-xl transition-all shadow-inner"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-base font-medium leading-none text-zinc-300">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-purple-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-12 bg-zinc-950/80 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 h-14 text-base rounded-xl transition-all shadow-inner"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-transparent border-t-0 pt-4 pb-10 px-8">
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] h-14 rounded-xl font-medium text-lg" disabled={loading}>
                      {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </motion.div>
          )}

          {formState === "SUCCESS" && (
            <motion.div key="SUCCESS" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden text-center py-10 px-8">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <CardContent className="flex flex-col items-center justify-center space-y-6 pt-4">
                  <div className="h-24 w-24 bg-purple-500/20 rounded-full flex items-center justify-center ring-4 ring-purple-500/10">
                    <CheckCircle2 className="w-12 h-12 text-purple-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-semibold text-zinc-100 tracking-tight">Password Reset</h3>
                    <p className="text-zinc-400 text-base max-w-[300px] mx-auto">Your password has been successfully reset. You can now login with your new credentials.</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent border-t-0 pt-8 pb-0">
                  <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white h-14 rounded-xl font-medium text-lg border border-white/5" onClick={() => setFormState("LOGIN")}>
                    Back to Login
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <p className="mt-20 text-base text-zinc-600 z-10 font-medium">
        &copy; {new Date().getFullYear()} Salon System. All rights reserved.
      </p>
    </div>
  );
}
