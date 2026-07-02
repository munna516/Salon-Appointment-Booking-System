import { Card, CardContent } from "@/components/ui/card";
import { Booking } from "@/types/booking";
import { CalendarDays, CheckCircle2, Clock, XCircle, Users } from "lucide-react";
import { isToday, parseISO } from "date-fns";

export function BookingStats({ bookings }: { bookings: Booking[] }) {
  const todayBookings = bookings.filter((b) => isToday(parseISO(`${b.date}T${b.time}`))).length;
  const upcomingBookings = bookings.filter((b) => b.bookingStatus === "Confirmed" || b.bookingStatus === "Pending").length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === "Completed").length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === "Pending").length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === "Cancelled").length;

  const stats = [
    {
      title: "Today's Bookings",
      value: todayBookings,
      icon: Users,
      description: "Appointments for today",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Upcoming",
      value: upcomingBookings,
      icon: CalendarDays,
      description: "Confirmed & pending",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Completed",
      value: completedBookings,
      icon: CheckCircle2,
      description: "Finished appointments",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Pending",
      value: pendingBookings,
      icon: Clock,
      description: "Awaiting confirmation",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Cancelled",
      value: cancelledBookings,
      icon: XCircle,
      description: "Cancelled or no-show",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <Card key={i} className="overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">
                  {stat.title}
                </p>
                <div className="mt-1 flex items-baseline space-x-2">
                  <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stat.value}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
