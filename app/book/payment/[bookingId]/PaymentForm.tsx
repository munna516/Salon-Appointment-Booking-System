"use client";

import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentForm({ bookingId, clientSecret }: { bookingId: string, clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Please provide your payment details.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/success?bookingId=${bookingId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast.error(error.message || "An error occurred");
    } else {
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full flex flex-col space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      <Button 
        disabled={isLoading || !stripe || !elements} 
        id="submit" 
        className="cursor-pointer w-full rounded-full bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-50 hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-50 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <span id="button-text">
          {isLoading ? (
             <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
             </div>
          ) : "Pay Now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-sm text-center text-zinc-500 dark:text-zinc-400 mt-4">{message}</div>}
    </form>
  );
}
