import { Payment } from "@/types/payment";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge, PaymentMethodBadge } from "./PaymentBadges";
import { Copy, Download, Mail, Phone, Calendar, User, Scissors } from "lucide-react";
import { toast } from "react-hot-toast";

interface PaymentModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ payment, isOpen, onOpenChange }: PaymentModalProps) {
  if (!payment) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: payment.currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto max-h-[85vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
        <DialogHeader className="mb-0">
          <DialogTitle className="text-lg">Payment Details</DialogTitle>
          <DialogDescription className="text-xs">
            View detailed information for this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Amount Hero */}
          <div className="flex flex-col items-center justify-center py-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 mb-1">Total Amount</span>
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              {formatCurrency(payment.amount)}
            </span>
            <PaymentStatusBadge status={payment.status} />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-zinc-950 h-8" onClick={() => copyToClipboard(payment.id, "Transaction ID")}>
              <Copy className="h-3 w-3 mr-2" />
              Copy ID
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-white dark:bg-zinc-950 h-8">
              <Download className="h-3 w-3 mr-2" />
              Receipt
            </Button>
          </div>

          {/* Transaction Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Transaction Info</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500">Transaction ID</span>
                <span className="text-xs font-medium">{payment.transactionId || payment.id}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500">Date & Time</span>
                <span className="text-xs font-medium">{format(new Date(payment.createdAt), "PPp")}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500">Payment Method</span>
                <div><PaymentMethodBadge method={payment.method} details={payment.paymentDetails} /></div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500">Stripe Intent ID</span>
                <span className="text-xs font-medium truncate" title={payment.stripePaymentIntentId || "N/A"}>
                  {payment.stripePaymentIntentId || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

          {/* Customer & Booking Info */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Customer & Booking</h4>
            
            <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3 text-zinc-400" />
                <span className="text-xs font-medium">{payment.booking.contact.firstName} {payment.booking.contact.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-zinc-400" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{payment.booking.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-zinc-400" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{payment.booking.contact.phone}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Scissors className="h-3 w-3 text-zinc-400" />
                <span className="text-xs font-medium">{payment.booking.serviceName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-zinc-400" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Booking ID: {payment.bookingId}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
