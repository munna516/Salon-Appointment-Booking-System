"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { BookingStats } from "@/components/features/bookings/BookingStats";
import { BookingSearch } from "@/components/features/bookings/BookingSearch";
import { BookingFilters } from "@/components/features/bookings/BookingFilters";
import { BookingTable } from "@/components/features/bookings/BookingTable";
import { BookingPagination } from "@/components/features/bookings/BookingPagination";
import { BookingModal } from "@/components/features/bookings/BookingModal";
import { Booking } from "@/types/booking";
import { MOCK_BOOKINGS } from "@/constants/booking";

export default function BookingsPage() {
  const {
    data,
    totalItems,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    bookingStatusFilter,
    setBookingStatusFilter,
    sortOption,
    setSortOption,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    totalPages,
    updateBookingStatus,
    deleteBooking,
  } = useBookings();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    // In a real app, this would re-fetch data
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Bookings</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage customer appointments and bookings.
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2 shrink-0">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <BookingStats bookings={MOCK_BOOKINGS} />

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <BookingSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <BookingFilters
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            bookingStatusFilter={bookingStatusFilter}
            setBookingStatusFilter={setBookingStatusFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>

        {/* Data Table */}
        <BookingTable
          data={data}
          onView={handleView}
          onUpdateStatus={updateBookingStatus}
          onDelete={deleteBooking}
        />

        {/* Pagination */}
        {data.length > 0 && (
          <BookingPagination
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        )}
      </div>

      {/* Modal */}
      <BookingModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
