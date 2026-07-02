import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingPaginationProps {
  pageIndex: number;
  setPageIndex: (val: number) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  totalPages: number;
  totalItems: number;
}

export function BookingPagination({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  totalPages,
  totalItems,
}: BookingPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
      <div className="text-sm text-zinc-500 dark:text-zinc-400 text-center sm:text-left w-full sm:w-auto flex-1">
        Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems} entries
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Page {pageIndex + 1} of {totalPages || 1}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
