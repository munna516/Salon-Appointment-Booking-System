import { useState, useMemo, useEffect } from "react";
import { Payment, PaymentStats } from "@/types/payment";
import toast from "react-hot-toast";

export function usePayments() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/admin/payments");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

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

  // Chart calculations
  const charts = useMemo(() => {
    // Revenue Chart (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueChart = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      revenueChart.push({ name: monthNames[d.getMonth()], total: 0 });
    }
    
    // Payment Method Chart
    const methodCounts = {
      CREDIT_CARD: 0,
      ONLINE: 0,
      CASH: 0,
      OTHER: 0
    };

    data.forEach(payment => {
      // Revenue Chart calculation (only PAID)
      if (payment.status === "PAID") {
        const pDate = new Date(payment.createdAt);
        const mName = monthNames[pDate.getMonth()];
        const idx = revenueChart.findIndex(r => r.name === mName);
        if (idx !== -1) {
          revenueChart[idx].total += payment.amount;
        }
      }
      
      // Method Chart calculation (all payments or just PAID? Usually all attempted methods)
      if (payment.method in methodCounts) {
        methodCounts[payment.method as keyof typeof methodCounts]++;
      }
    });

    const methodColors = {
      CREDIT_CARD: "#0ea5e9", // Sky 500
      ONLINE: "#10b981",    // Emerald 500
      CASH: "#f59e0b",      // Amber 500
      OTHER: "#8b5cf6"      // Violet 500
    };

    const methodLabels = {
      CREDIT_CARD: "Credit Card",
      ONLINE: "Online",
      CASH: "Cash",
      OTHER: "Other"
    };

    const paymentMethodChart = Object.entries(methodCounts)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => ({
        name: methodLabels[key as keyof typeof methodLabels],
        value: count,
        color: methodColors[key as keyof typeof methodColors]
      }));

    if (paymentMethodChart.length === 0) {
      paymentMethodChart.push({ name: "No Data", value: 1, color: "#cbd5e1" });
    }

    return {
      revenueChart,
      paymentMethodChart
    };
  }, [data]);

  return {
    data: filteredData,
    loading,
    stats,
    charts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
  };
}
