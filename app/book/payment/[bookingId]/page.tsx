"use client";

import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck } from "lucide-react";
import { use } from "react";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#09090b',
      colorBackground: '#ffffff',
      colorText: '#18181b',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  if (!clientSecret) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <main className="flex-1 container mx-auto flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Invalid Payment Session</h2>
            <p className="text-zinc-500 mt-2">Please go back and try booking again.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Complete Your Payment</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Secure checkout powered by Stripe</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-900 dark:from-zinc-50 dark:via-zinc-400 dark:to-zinc-50"></div>
            
            <div className="flex items-center justify-center mb-8 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-12 h-12" />
            </div>

            {clientSecret && (
              <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <PaymentForm bookingId={resolvedParams.bookingId} clientSecret={clientSecret} />
              </Elements>
            )}
            
            <div className="mt-8 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
               <p>We accept all major credit cards, Apple Pay, and Google Pay.</p>
               <div className="flex gap-2 opacity-50 grayscale">
                  {/* Just some visual indicators */}
                  <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
