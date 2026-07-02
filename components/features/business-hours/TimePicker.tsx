import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  return (
    <Input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className={cn(
        "w-[150px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    />
  );
}
