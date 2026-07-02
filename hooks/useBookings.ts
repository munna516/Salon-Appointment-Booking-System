import { useState, useMemo } from "react";
import { Booking } from "@/types/booking";
import { MOCK_BOOKINGS } from "@/constants/booking";

export function useBookings() {
  const [data, setData] = useState<Booking[]>(MOCK_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("Payment Statuses");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("Booking Statuses");
  const [sortOption, setSortOption] = useState("Latest");

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.customer.name.toLowerCase().includes(lowerQuery) ||
          booking.customer.phone.includes(lowerQuery) ||
          booking.id.toLowerCase().includes(lowerQuery)
      );
    }



    // Payment status filter
    if (paymentStatusFilter !== "Payment Statuses") {
      result = result.filter((b) => b.paymentStatus === paymentStatusFilter);
    }

    // Booking status filter
    if (bookingStatusFilter !== "Booking Statuses") {
      result = result.filter((b) => b.bookingStatus === bookingStatusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "Latest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "Oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "Date":
          return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
        case "Price":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  }, [data, searchQuery, paymentStatusFilter, bookingStatusFilter, sortOption]);

  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, pageIndex, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const updateBookingStatus = (id: string, newStatus: Booking["bookingStatus"]) => {
    setData((prev) =>
      prev.map((b) => (b.id === id ? { ...b, bookingStatus: newStatus } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setData((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    data: paginatedData,
    totalItems: filteredAndSortedData.length,
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
  };
}
