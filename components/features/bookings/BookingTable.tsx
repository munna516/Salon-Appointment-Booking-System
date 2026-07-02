"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Booking } from "@/types/booking";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { BookingActions } from "./BookingActions";
import { format, parseISO } from "date-fns";

interface BookingTableProps {
  data: Booking[];
  loading?: boolean;
  onView: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: Booking["bookingStatus"]) => void;
  onDelete: (id: string) => void;
}

export function BookingTable({ data, loading = false, onView, onUpdateStatus, onDelete }: BookingTableProps) {
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "Booking ID",
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original.customer;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{customer.name}</span>
            <span className="text-xs text-zinc-500">{customer.phone}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => row.original.service.name,
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ row }) => {
        const date = format(parseISO(row.original.date), "MMM d, yyyy");
        return (
          <div className="flex flex-col">
            <span>{date}</span>
            <span className="text-xs text-zinc-500">{row.original.time}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => <BookingStatusBadge status={row.original.bookingStatus} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => format(parseISO(row.original.createdAt), "MMM d"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <BookingActions
          booking={row.original}
          onView={onView}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        ) : data.length > 0 ? (
          data.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{booking.customer.name}</p>
                  <p className="text-xs text-zinc-500">{booking.id} • {booking.customer.phone}</p>
                </div>
                <BookingActions
                  booking={booking}
                  onView={onView}
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Service</p>
                  <p className="font-medium">{booking.service.name}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Date & Time</p>
                  <p className="font-medium">
                    {format(parseISO(booking.date), "MMM d")} • {booking.time}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Price</p>
                  <p className="font-medium">${booking.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <PaymentStatusBadge status={booking.paymentStatus} />
                  <BookingStatusBadge status={booking.bookingStatus} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full">
                <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No bookings found</p>
            <p className="text-sm mt-1 text-zinc-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium text-zinc-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No bookings found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
