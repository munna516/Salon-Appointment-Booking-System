"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your account security and preferences.</p>
      </div>

      <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm">
        <form onSubmit={handlePasswordChange}>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Security Details</CardTitle>
            </div>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              Update your password to keep your admin account secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300">Current Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                <Input 
                  type={showCurrent ? "text" : "password"} 
                  placeholder="Enter current password" 
                  className="pl-11 pr-11 h-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus-visible:ring-purple-500 transition-all text-base"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3.5 top-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  {showCurrent ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-white/10">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  <Input 
                    type={showNew ? "text" : "password"} 
                    placeholder="Enter new password" 
                    className="pl-11 pr-11 h-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus-visible:ring-purple-500 transition-all text-base"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    {showNew ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  <Input 
                    type="password" 
                    placeholder="Confirm new password" 
                    className="pl-11 h-12 bg-white dark:bg-zinc-950/80 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus-visible:ring-purple-500 transition-all text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 px-6 py-4 rounded-b-xl flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-sm transition-all h-12 px-8 text-base" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {loading ? "Updating..." : "Save Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
