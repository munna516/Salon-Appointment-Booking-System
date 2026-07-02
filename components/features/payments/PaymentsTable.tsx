import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Payment } from "@/types/payment";
import { format } from "date-fns";
import { PaymentStatusBadge, PaymentMethodBadge } from "./PaymentBadges";
import { EmptyState } from "./EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, ArrowUpDown } from "lucide-react";

interface PaymentsTableProps {
  data: Payment[];
  onView: (payment: Payment) => void;
}

export function PaymentsTable({ data, onView }: PaymentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "transactionId",
        header: "Transaction ID",
        cell: ({ row }) => (
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {row.original.transactionId || row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "booking.contact.firstName",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.booking.contact.firstName} {row.original.booking.contact.lastName}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {row.original.booking.contact.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "booking.serviceName",
        header: "Service",
        cell: ({ row }) => (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {row.original.booking.serviceName}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(row.original.amount, row.original.currency)}
          </span>
        ),
      },
      {
        accessorKey: "method",
        header: "Method",
        cell: ({ row }) => <PaymentMethodBadge method={row.original.method} details={row.original.paymentDetails} />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="-ml-4 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {format(new Date(row.original.createdAt), "MMM d, yyyy h:mm a")}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.original)}
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
          >
            <span className="sr-only">View Details</span>
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-zinc-500">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="flex flex-col p-4 gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(row.original.amount, row.original.currency)}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {format(new Date(row.original.createdAt), "MMM d, yyyy h:mm a")}
                  </span>
                </div>
                <PaymentStatusBadge status={row.original.status} />
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {row.original.booking.contact.firstName} {row.original.booking.contact.lastName}
                </span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {row.original.booking.serviceName}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <PaymentMethodBadge method={row.original.method} details={row.original.paymentDetails} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(row.original)}
                  className="bg-white dark:bg-zinc-950"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
            No results.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white dark:bg-zinc-950"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white dark:bg-zinc-950"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
