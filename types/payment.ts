export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CASH" | "CREDIT_CARD" | "ONLINE" | "OTHER";

// Types corresponding to Prisma models (extended for UI needs)
export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  serviceName: string;
  contact: Contact;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId: string | null;
  paymentDetails: string | null;
  stripePaymentIntentId: string | null;
  
  bookingId: string;
  booking: Booking;

  createdAt: string;
  updatedAt: string;
}

// Summary statistics type
export interface PaymentStats {
  totalRevenue: number;
  todaysRevenue: number;
  pendingCount: number;
  successfulCount: number;
  failedCount: number;
  refundedCount: number;
}
