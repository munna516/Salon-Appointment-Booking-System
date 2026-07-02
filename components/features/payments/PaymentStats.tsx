import { PaymentStats as PaymentStatsType } from "@/types/payment";
import { DollarSign, Activity, Clock, CheckCircle2, XCircle, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStatsProps {
  stats: PaymentStatsType;
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "All-time successful payments",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todaysRevenue),
      description: "Successful payments today",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Pending Payments",
      value: stats.pendingCount.toString(),
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Successful",
      value: stats.successfulCount.toString(),
      description: "Completed transactions",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Failed",
      value: stats.failedCount.toString(),
      description: "Declined or error",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="flex flex-col p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", card.bg, card.color)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {card.value}
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {card.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
