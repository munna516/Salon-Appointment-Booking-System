import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

const toTitleCase = (str: string) => {
  return str.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

export async function GET() {
  try {
    const admin = await requireAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        contact: true,
        payment: true,
      },
    });

    const mapped = bookings.map(b => ({
      id: b.id,
      customerId: b.contactId,
      customer: {
        id: b.contactId,
        name: `${b.contact.firstName} ${b.contact.lastName}`,
        email: b.contact.email,
        phone: b.contact.phone,
      },
      serviceId: b.serviceName,
      service: {
        id: b.serviceName,
        name: b.serviceName,
        duration: 60,
        price: b.totalPrice,
      },
      date: b.date.toISOString().split('T')[0],
      time: b.startTime,
      price: b.totalPrice,
      paymentStatus: b.payment ? toTitleCase(b.payment.status) : "Pending",
      bookingStatus: toTitleCase(b.status),
      paymentMethod: b.payment ? toTitleCase(b.payment.method) : "Cash",
      transactionId: b.payment?.transactionId,
      customerNotes: b.customerNotes,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Bookings API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
