import { Button } from "@/components/ui/button";
import { BusinessHourCard } from "./BusinessHourCard";
import { BusinessHour } from "@/types/business-hours";
import { Copy, RefreshCcw } from "lucide-react";

interface WeeklyScheduleProps {
  weeklyHours: BusinessHour[];
  onUpdateDay: (dayId: string, updates: Partial<BusinessHour>) => void;
  onApplyMondayToAll: () => void;
  onReset: () => void;
}

export function WeeklySchedule({
  weeklyHours,
  onUpdateDay,
  onApplyMondayToAll,
  onReset,
}: WeeklyScheduleProps) {
  // Sort days to ensure they always display Monday to Sunday
  const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const sortedHours = [...weeklyHours].sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Weekly Business Hours</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set your standard opening and closing times for each day.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={onApplyMondayToAll} className="bg-white dark:bg-zinc-950 w-full sm:w-auto">
            <Copy className="h-4 w-4 mr-2 text-zinc-500" />
            Apply Monday to All
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 w-full sm:w-auto">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sortedHours.map((day) => (
          <BusinessHourCard
            key={day.id}
            day={day}
            onUpdate={(updates) => onUpdateDay(day.id, updates)}
          />
        ))}
      </div>
    </div>
  );
}
