import { CalendarDays, CalendarX2, DoorOpen } from "lucide-react";

interface BusinessHourStatsProps {
  daysOpen: number;
  daysClosed: number;
  specialClosedDates: number;
}

export function BusinessHourStats({
  daysOpen,
  daysClosed,
  specialClosedDates,
}: BusinessHourStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">Business Days Open</p>
          <DoorOpen className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{daysOpen}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Days open per week</span>
        </div>
      </div>
      
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">Business Days Closed</p>
          <CalendarDays className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{daysClosed}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Days closed per week</span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium tracking-tight text-zinc-500 dark:text-zinc-400">Special Closed Dates</p>
          <CalendarX2 className="h-4 w-4 text-amber-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{specialClosedDates}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Upcoming exceptions</span>
        </div>
      </div>
    </div>
  );
}
