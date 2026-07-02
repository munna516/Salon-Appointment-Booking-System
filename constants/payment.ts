import { Payment, PaymentMethod } from "@/types/payment";

export const PAYMENT_STATUSES = [
  { label: "Paid", value: "PAID" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export const PAYMENT_METHODS = [
  { label: "Card", value: "CARD" },
  { label: "Cash", value: "CASH" },
  { label: "Google Pay", value: "GOOGLE_PAY" },
  { label: "Apple Pay", value: "APPLE_PAY" },
  { label: "Cash App", value: "CASH_APP" },
];

// Generate robust mock data
const generateMockPayments = (): Payment[] => {
  const statuses: ("PAID" | "PENDING" | "FAILED" | "REFUNDED")[] = ["PAID", "PAID", "PAID", "PENDING", "FAILED", "REFUNDED"];
  const methods: PaymentMethod[] = ["CASH", "CARD", "GOOGLE_PAY", "APPLE_PAY", "CASH_APP"];
  
  const services = ["Men's Haircut", "Beard Trim", "Women's Haircut", "Hair Coloring", "Facial Treatment"];
  const customers = [
    { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+1 234 567 8900" },
    { firstName: "Sarah", lastName: "Smith", email: "sarah@example.com", phone: "+1 234 567 8901" },
    { firstName: "Mike", lastName: "Johnson", email: "mike@example.com", phone: "+1 234 567 8902" },
    { firstName: "Emma", lastName: "Davis", email: "emma@example.com", phone: "+1 234 567 8903" },
    { firstName: "Alex", lastName: "Wilson", email: "alex@example.com", phone: "+1 234 567 8904" },
  ];

  return Array.from({ length: 50 }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    
    // Distribute dates over the last few months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    let dateString = date.toISOString();

    const isToday = i < 3; // First 3 are today
    if (isToday) {
      const today = new Date();
      dateString = today.toISOString();
    }

    const amount = Math.floor(Math.random() * 150) + 25;

    return {
      id: `pay_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency: "USD",
      status,
      method,
      paymentDetails: null,
      transactionId: status === "PAID" || status === "REFUNDED" ? `txn_${Math.random().toString(36).substr(2, 12)}` : null,
      stripePaymentIntentId: status === "PAID" || status === "REFUNDED" ? `pi_${Math.random().toString(36).substr(2, 12)}` : null,
      
      bookingId: `bkg_${Math.random().toString(36).substr(2, 9)}`,
      booking: {
        id: `bkg_${Math.random().toString(36).substr(2, 9)}`,
        serviceName: services[Math.floor(Math.random() * services.length)],
        contact: {
          id: `con_${Math.random().toString(36).substr(2, 9)}`,
          ...customer,
        }
      },
      
      createdAt: dateString,
      updatedAt: dateString,
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_PAYMENTS = generateMockPayments();

// Mock chart data
export const MOCK_REVENUE_DATA = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];
