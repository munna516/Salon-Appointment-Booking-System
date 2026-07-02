import { CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 border-dashed">
      <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-3 mb-4">
        <CalendarX2 className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No Closed Dates</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-6">
        You don't have any upcoming special closed dates or holidays configured yet.
      </p>
      <Button onClick={onAdd} variant="outline" className="bg-white dark:bg-zinc-950">
        Add your first blocked date
      </Button>
    </div>
  );
}
