import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, CalendarDays, TrendingUp, DollarSign, CreditCard, Activity, BarChart2 } from "lucide-react";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { BookingsChart } from "@/components/charts/bookings-chart";

export default function DashboardOverview() {
  const stats = [
    { name: "Today's Appointments", value: "12", change: "+2 from yesterday", changeType: "positive", icon: CalendarCheck, color: "text-blue-500 dark:text-blue-400" },
    { name: "Upcoming Appointments", value: "48", change: "Next 7 days", changeType: "neutral", icon: CalendarDays, color: "text-purple-500 dark:text-purple-400" },
    { name: "Total Bookings", value: "1,284", change: "+14% this month", changeType: "positive", icon: Users, color: "text-indigo-500 dark:text-indigo-400" },
    { name: "Today's Revenue", value: "$420", change: "+12% from yesterday", changeType: "positive", icon: DollarSign, color: "text-emerald-500 dark:text-emerald-400" },
    { name: "Monthly Revenue", value: "$4,520", change: "+22% this month", changeType: "positive", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-500" },
    { name: "Pending Payments", value: "$180", change: "3 unpaid bookings", changeType: "negative", icon: CreditCard, color: "text-orange-500 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        {/* Analytics 1: Revenue Trends */}
        <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Revenue Analytics
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">Monthly revenue breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] p-6 pt-0">
            <RevenueChart />
          </CardContent>
        </Card>
        
        {/* Analytics 2: Bookings Trend */}
        <Card className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-6">
            <div className="space-y-1">
              <CardTitle className="text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-500" />
                Booking Trends
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">Daily bookings for the current week</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] p-6 pt-0">
            <BookingsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
