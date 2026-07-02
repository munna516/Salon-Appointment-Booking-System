import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia", // Use latest API version or your preferred one
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, startTime, firstName, lastName, email, phone, notes } = body;

    if (!service || !date || !startTime || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const price = Number(service.price) || 0;

    // 1. Create or Update Contact
    const contact = await prisma.contact.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        phone,
      },
      create: {
        firstName,
        lastName,
        email,
        phone,
      }
    });

    // 2. Create Booking and Payment
    const [startH, startM] = startTime.split(":");
    const endH = parseInt(startH) + 1;
    const endTime = `${endH.toString().padStart(2, "0")}:${startM}`;

    const newBooking = await prisma.booking.create({
      data: {
        date: bookingDate,
        startTime,
        endTime,
        status: BookingStatus.PENDING,
        totalPrice: price,
        customerNotes: notes,
        serviceName: service.name,
        contactId: contact.id,
        payment: {
          create: {
            amount: price,
            currency: "USD",
            status: PaymentStatus.PENDING,
            method: PaymentMethod.ONLINE,
          }
        }
      },
      include: {
        payment: true,
      }
    });

    // 3. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Convert to cents
      currency: "usd",
      payment_method_types: ['card', 'cashapp'], // This disables 'link' explicitly
      metadata: {
        bookingId: newBooking.id,
        contactId: contact.id,
      },
    });

    // Update the payment record with the PaymentIntent ID
    if (newBooking.payment) {
      await prisma.payment.update({
        where: { id: newBooking.payment.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: newBooking,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
