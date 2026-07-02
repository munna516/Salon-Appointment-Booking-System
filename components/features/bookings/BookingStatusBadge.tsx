import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const variantMap: Record<BookingStatus, string> = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "No Show": "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300",
  };

  return (
    <Badge className={`px-2.5 py-0.5 font-medium border-0 ${variantMap[status]}`} variant="outline">
      {status}
    </Badge>
  );
}
