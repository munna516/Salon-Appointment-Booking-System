import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PAYMENT_STATUS_OPTIONS,
  BOOKING_STATUS_OPTIONS,
} from "@/constants/booking";

interface BookingFiltersProps {
  paymentStatusFilter: string;
  setPaymentStatusFilter: (val: string) => void;
  bookingStatusFilter: string;
  setBookingStatusFilter: (val: string) => void;
  sortOption: string;
  setSortOption: (val: string) => void;
}

export function BookingFilters({
  paymentStatusFilter,
  setPaymentStatusFilter,
  bookingStatusFilter,
  setBookingStatusFilter,
  sortOption,
  setSortOption,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">


      {/* Booking Status Filter */}
      <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
        <SelectTrigger className="w-[160px] h-10 bg-white dark:bg-zinc-950">
          <SelectValue placeholder="Booking Status" />
        </SelectTrigger>
        <SelectContent>
          {BOOKING_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Status Filter */}
      <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
        <SelectTrigger className="w-[160px] h-10 bg-white dark:bg-zinc-950">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Options */}
      <div className="sm:ml-auto">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[160px] h-10 bg-white dark:bg-zinc-950">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Latest">Sort by: Latest</SelectItem>
            <SelectItem value="Oldest">Sort by: Oldest</SelectItem>
            <SelectItem value="Date">Sort by: Date</SelectItem>
            <SelectItem value="Price">Sort by: Price</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
