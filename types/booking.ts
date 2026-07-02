export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "No Show";

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  serviceId: string;
  service: Service;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentMethod: string;
  transactionId?: string;
  customerNotes?: string;
  createdAt: string;
}
