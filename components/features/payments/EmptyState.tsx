import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-t border-zinc-200 dark:border-zinc-800">
      <div className="rounded-full bg-zinc-100 dark:bg-zinc-900 p-4 mb-4">
        <SearchX className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No Payments Found</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
        We couldn't find any payments matching your current filters. Try adjusting your search query or filters.
      </p>
    </div>
  );
}
