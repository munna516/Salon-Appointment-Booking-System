import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    
    // Check if the date is blocked
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const blocked = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: dateStart,
          lte: dateEnd
        }
      }
    });

    if (blocked) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // Get Day of Week
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayOfWeek = days[date.getDay()];

    // Get Business Hours for this day
    const businessHour = await prisma.businessHour.findUnique({
      where: { dayOfWeek: dayOfWeek as any }
    });

    if (!businessHour || !businessHour.isOpen || !businessHour.openTime || !businessHour.closeTime) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // Generate slots in 1-hour intervals
    const slots: string[] = [];
    const [openHour, openMin] = businessHour.openTime.split(":").map(Number);
    const [closeHour, closeMin] = businessHour.closeTime.split(":").map(Number);
    
    let currentHour = openHour;
    
    while (currentHour < closeHour) {
      const slotTime = `${currentHour.toString().padStart(2, "0")}:00`;
      slots.push(slotTime);
      currentHour++;
    }

    // Get existing bookings for this date to remove booked slots
    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: dateStart,
          lte: dateEnd
        },
        status: {
          in: ["PENDING", "CONFIRMED", "COMPLETED"]
        }
      },
      select: {
        startTime: true
      }
    });

    const bookedSlots = existingBookings.map(b => b.startTime);
    const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    console.error("Availability API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
