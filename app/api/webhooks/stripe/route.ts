import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmationEmail } from "@/lib/email-service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          // Update Payment status to PAID
          const payment = await prisma.payment.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { 
              status: PaymentStatus.PAID,
              transactionId: paymentIntent.id 
            },
            include: {
              booking: {
                include: {
                  contact: true
                }
              }
            }
          });

          // Update Booking status to CONFIRMED
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CONFIRMED },
          });

          // Send confirmation emails
          const booking = payment.booking;
          const formattedDate = booking.date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          
          await sendBookingConfirmationEmail(
            booking.contact.email,
            `${booking.contact.firstName} ${booking.contact.lastName}`,
            booking.serviceName,
            formattedDate,
            booking.startTime,
            booking.totalPrice
          );
          
          console.log(`Payment succeeded for booking ${bookingId} and emails sent.`);
        }
        break;
      
      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        // Update payment status to FAILED if needed
        await prisma.payment.updateMany({
           where: { stripePaymentIntentId: failedIntent.id },
           data: { status: PaymentStatus.FAILED }
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
