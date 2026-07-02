import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BookingSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export function BookingSearch({ searchQuery, setSearchQuery }: BookingSearchProps) {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
        <Search className="w-4 h-4" />
      </div>
      <Input
        type="text"
        placeholder="Search by customer, phone, or ID..."
        className="pl-10 h-10 w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
