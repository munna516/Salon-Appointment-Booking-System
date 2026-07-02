import { useState, useMemo } from "react";
import { Payment, PaymentStats } from "@/types/payment";
import { MOCK_PAYMENTS } from "@/constants/payment";

export function usePayments() {
  const [data, setData] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  // Filtering logic
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.id.toLowerCase().includes(lowerQuery) ||
          payment.transactionId?.toLowerCase().includes(lowerQuery) ||
          payment.bookingId.toLowerCase().includes(lowerQuery) ||
          payment.booking.contact.firstName.toLowerCase().includes(lowerQuery) ||
          payment.booking.contact.lastName.toLowerCase().includes(lowerQuery)
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== "ALL") {
      filtered = filtered.filter((payment) => payment.method === methodFilter);
    }

    return filtered;
  }, [data, searchQuery, statusFilter, methodFilter]);

  // Statistics calculation
  const stats: PaymentStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    
    return data.reduce(
      (acc, payment) => {
        if (payment.status === "PAID") {
          acc.totalRevenue += payment.amount;
          if (payment.createdAt.startsWith(today)) {
            acc.todaysRevenue += payment.amount;
          }
          acc.successfulCount += 1;
        } else if (payment.status === "PENDING") {
          acc.pendingCount += 1;
        } else if (payment.status === "FAILED") {
          acc.failedCount += 1;
        } else if (payment.status === "REFUNDED") {
          acc.refundedCount += 1;
        }
        return acc;
      },
      {
        totalRevenue: 0,
        todaysRevenue: 0,
        pendingCount: 0,
        successfulCount: 0,
        failedCount: 0,
        refundedCount: 0,
      }
    );
  }, [data]);

  return {
    data: filteredData,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
  };
}
