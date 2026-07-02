import { Switch } from "@/components/ui/switch";
import { TimePicker } from "./TimePicker";
import { BusinessHour } from "@/types/business-hours";

interface BusinessHourCardProps {
  day: BusinessHour;
  onUpdate: (updates: Partial<BusinessHour>) => void;
}

export function BusinessHourCard({ day, onUpdate }: BusinessHourCardProps) {
  // Format day name nicely (e.g., MONDAY -> Monday)
  const formattedDay = day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm gap-4">
      <div className="flex items-center gap-4 w-full sm:w-[150px]">
        <Switch
          checked={day.isOpen}
          onCheckedChange={(checked) => onUpdate({ isOpen: checked })}
          className="data-[state=checked]:bg-emerald-500"
        />
        <span
          className={`font-medium ${
            day.isOpen ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 line-through"
          }`}
        >
          {formattedDay}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-14 sm:ml-0">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">Opening</span>
          <TimePicker
            value={day.openTime}
            onChange={(val) => onUpdate({ openTime: val })}
            disabled={!day.isOpen}
          />
        </div>
        
        <span className="text-zinc-400 self-end mb-2 sm:self-center sm:mb-0">-</span>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 sm:hidden">Closing</span>
          <TimePicker
            value={day.closeTime}
            onChange={(val) => onUpdate({ closeTime: val })}
            disabled={!day.isOpen}
          />
        </div>
      </div>
    </div>
  );
}
