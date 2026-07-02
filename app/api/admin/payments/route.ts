import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const toTitleCase = (str: string) => {
  return str.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

export async function GET() {
  try {
    const admin = await requireAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            contact: true
          }
        },
      },
    });

    const mapped = payments.map(p => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status, // KEEP IN UPPERCASE FOR BACKWARD COMPATIBILITY WITH PaymentStatus IN TYPES
      method: p.method, // KEEP IN UPPERCASE
      transactionId: p.transactionId,
      stripePaymentIntentId: p.stripePaymentIntentId,
      bookingId: p.bookingId,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      booking: {
        id: p.bookingId,
        date: p.booking.date.toISOString().split('T')[0],
        startTime: p.booking.startTime,
        serviceName: p.booking.serviceName,
        contact: {
          id: p.booking.contactId,
          firstName: p.booking.contact.firstName,
          lastName: p.booking.contact.lastName,
          email: p.booking.contact.email,
          phone: p.booking.contact.phone,
        }
      }
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Payments API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
