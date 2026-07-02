import { Badge } from "@/components/ui/badge";
import { PaymentStatus, PaymentMethod } from "@/types/payment";
import { CreditCard, Wallet, Smartphone, Banknote } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const styles = {
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    REFUNDED: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  };

  const labels = {
    PAID: "Paid",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const iconMap = {
    CREDIT_CARD: <CreditCard className="h-3.5 w-3.5 mr-1" />,
    ONLINE: <Smartphone className="h-3.5 w-3.5 mr-1" />,
    CASH: <Banknote className="h-3.5 w-3.5 mr-1" />,
    OTHER: <Wallet className="h-3.5 w-3.5 mr-1" />,
  };

  const labels = {
    CREDIT_CARD: "Credit Card",
    ONLINE: "Online",
    CASH: "Cash",
    OTHER: "Other",
  };

  return (
    <div className="flex items-center text-zinc-700 dark:text-zinc-300 font-medium text-sm">
      {iconMap[method]}
      {labels[method]}
    </div>
  );
}
