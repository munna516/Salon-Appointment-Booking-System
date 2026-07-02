"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  const payment_intent_client_secret = searchParams.get("payment_intent_client_secret");
  const redirect_status = searchParams.get("redirect_status");
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (redirect_status === "succeeded") {
      setStatus("success");
    } else if (redirect_status) {
      setStatus("error");
    } else {
      // If directly accessed without stripe params, but has bookingId, assume success or pending verification
      setStatus("success");
    }
  }, [redirect_status]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 text-zinc-500">
            <Loader2 className="w-12 h-12 animate-spin text-zinc-900 dark:text-zinc-50" />
            <p>Verifying your payment...</p>
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 text-center"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              Booking Confirmed!
            </h1>
            
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
              Thank you for your payment. Your appointment has been successfully booked. We've sent a confirmation email with the details.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto rounded-full px-8 py-6 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-all group">
                Return Home
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center"
          >
             <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
             <p className="text-zinc-500 mb-8">Something went wrong with your payment. Please try again.</p>
             <Button onClick={() => window.location.href = '/book'} className="rounded-full px-8 bg-zinc-900 text-white">
                Try Booking Again
             </Button>
          </motion.div>
        )}

      </main>
    </div>
  );
}
