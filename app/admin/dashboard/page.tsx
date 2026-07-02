"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, CalendarDays, TrendingUp, DollarSign, CreditCard, Activity, BarChart2 } from "lucide-react";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { BookingsChart } from "@/components/charts/bookings-chart";

export default function DashboardOverview() {
  const [data, setData] = useState({
    todaysAppointments: 0,
    upcomingAppointments: 0,
    totalBookings: 0,
    todaysRevenue: 0,
    monthlyRevenue: 0,
    pendingPaymentsAmount: 0,
    pendingPaymentsCount: 0,
    revenueChart: [],
    bookingsChart: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  const stats = [
    { name: "Today's Appointments", value: data.todaysAppointments.toString(), change: "Scheduled for today", changeType: "neutral", icon: CalendarCheck, color: "text-blue-500 dark:text-blue-400" },
    { name: "Upcoming Appointments", value: data.upcomingAppointments.toString(), change: "Next 7 days", changeType: "neutral", icon: CalendarDays, color: "text-purple-500 dark:text-purple-400" },
    { name: "Total Bookings", value: data.totalBookings.toString(), change: "All time bookings", changeType: "positive", icon: Users, color: "text-indigo-500 dark:text-indigo-400" },
    { name: "Today's Revenue", value: `$${data.todaysRevenue.toFixed(2)}`, change: "Earned today", changeType: "positive", icon: DollarSign, color: "text-emerald-500 dark:text-emerald-400" },
    { name: "Monthly Revenue", value: `$${data.monthlyRevenue.toFixed(2)}`, change: "Earned this month", changeType: "positive", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-500" },
    { name: "Pending Payments", value: `$${data.pendingPaymentsAmount.toFixed(2)}`, change: `${data.pendingPaymentsCount} unpaid bookings`, changeType: "negative", icon: CreditCard, color: "text-orange-500 dark:text-orange-400" },
  ];

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full overflow-hidden">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Overview</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Welcome back! Here's what's happening with your salon today.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md overflow-hidden relative shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate pr-2">{stat.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-black/5 dark:bg-white/5 ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
                <p className="text-xs mt-2 flex items-center gap-1">
                  <span className={`font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-500 dark:text-emerald-400' : 
                    stat.changeType === 'negative' ? 'text-orange-500 dark:text-orange-400' : 
                    'text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {stat.change}
                  </span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Revenue Analytics
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">Monthly revenue breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] p-6 pt-0 w-full">
            <RevenueChart data={data.revenueChart} />
          </CardContent>
        </Card>
        
        <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="space-y-1">
              <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-500" />
                Booking Trends
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">Daily bookings for the current week</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] p-6 pt-0 w-full">
            <BookingsChart data={data.bookingsChart} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
