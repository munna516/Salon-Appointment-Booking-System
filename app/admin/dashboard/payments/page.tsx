"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { PaymentStats } from "@/components/features/payments/PaymentStats";
import { RevenueChart } from "@/components/features/payments/RevenueChart";
import { PaymentMethodChart } from "@/components/features/payments/PaymentMethodChart";
import { PaymentFilters } from "@/components/features/payments/PaymentFilters";
import { PaymentsTable } from "@/components/features/payments/PaymentsTable";
import { PaymentModal } from "@/components/features/payments/PaymentModal";
import { Payment } from "@/types/payment";
import { motion, Variants } from "framer-motion";

export default function PaymentsPage() {
  const {
    data,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
  } = usePayments();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      className="flex-1 space-y-8  md:p-2 pt-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Payments</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Manage all customer payment transactions and refunds.
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-white dark:bg-zinc-950">
          <Download className="mr-2 h-4 w-4" />
          Export Transactions
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <PaymentStats stats={stats} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <PaymentMethodChart />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <PaymentFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          methodFilter={methodFilter}
          setMethodFilter={setMethodFilter}
        />
        <PaymentsTable data={data} onView={handleViewPayment} />
      </motion.div>

      <PaymentModal
        payment={selectedPayment}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </motion.div>
  );
}
