import { useState, useMemo, useEffect } from "react";
import { Booking } from "@/types/booking";
import toast from "react-hot-toast";

export function useBookings() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("Payment Statuses");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("Booking Statuses");
  const [sortOption, setSortOption] = useState("Latest");

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/admin/bookings");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

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

  const updateBookingStatus = async (id: string, newStatus: Booking["bookingStatus"]) => {
    try {
      const dbStatus = newStatus.toUpperCase().replace(" ", "_");
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: dbStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setData((prev) =>
        prev.map((b) => (b.id === id ? { ...b, bookingStatus: newStatus } : b))
      );
      toast.success("Booking status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      setData((prev) => prev.filter((b) => b.id !== id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      toast.error("Failed to delete booking");
    }
  };

  return {
    allData: data,
    data: paginatedData,
    loading,
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
