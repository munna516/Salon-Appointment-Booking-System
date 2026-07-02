import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_STATUSES, PAYMENT_METHODS } from "@/constants/payment";

interface PaymentFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  methodFilter: string;
  setMethodFilter: (method: string) => void;
}

export function PaymentFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
}: PaymentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search by ID, Customer Name, or Booking ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
        />
      </div>
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {PAYMENT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Methods</SelectItem>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
