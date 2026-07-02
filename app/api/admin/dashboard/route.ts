import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export async function GET() {
  try {
    const admin = await requireAuth();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      todaysAppointments,
      upcomingAppointments,
      totalBookings,
      todaysRevenueData,
      monthlyRevenueData,
      pendingPaymentsData,
      pendingPaymentsCount,
      paymentsLast6Months,
      bookingsLast7Days
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          date: { gte: today, lt: tomorrow },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
        },
      }),
      prisma.booking.count({
        where: {
          date: { gte: tomorrow, lt: nextWeek },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
      }),
      prisma.booking.count(),
      prisma.payment.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow }, status: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { createdAt: { gte: firstDayOfMonth }, status: PaymentStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.PENDING },
        _sum: { amount: true },
      }),
      prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
      prisma.payment.findMany({
        where: { status: PaymentStatus.PAID, createdAt: { gte: sixMonthsAgo } },
        select: { amount: true, createdAt: true }
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true }
      })
    ]);

    const todaysRevenue = todaysRevenueData._sum.amount || 0;
    const monthlyRevenue = monthlyRevenueData._sum.amount || 0;
    const pendingPaymentsAmount = pendingPaymentsData._sum.amount || 0;

    // Process Revenue Chart (Last 6 Months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueChart: { name: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      revenueChart.push({ name: monthNames[d.getMonth()], total: 0 });
    }
    
    paymentsLast6Months.forEach(p => {
      const mName = monthNames[p.createdAt.getMonth()];
      const idx = revenueChart.findIndex(r => r.name === mName);
      if (idx !== -1) {
        revenueChart[idx].total += p.amount;
      }
    });

    // Process Bookings Chart (Last 7 Days)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bookingsChart: { name: string; dateString: string; bookings: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      bookingsChart.push({ name: dayNames[d.getDay()], dateString: d.toISOString().split('T')[0], bookings: 0 });
    }

    bookingsLast7Days.forEach(b => {
      const dateString = b.createdAt.toISOString().split('T')[0];
      const idx = bookingsChart.findIndex(r => r.dateString === dateString);
      if (idx !== -1) {
        bookingsChart[idx].bookings += 1;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        todaysAppointments,
        upcomingAppointments,
        totalBookings,
        todaysRevenue,
        monthlyRevenue,
        pendingPaymentsAmount,
        pendingPaymentsCount,
        revenueChart,
        bookingsChart: bookingsChart.map(b => ({ name: b.name, bookings: b.bookings }))
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
