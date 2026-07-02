export type DayOfWeek = 
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface BusinessHour {
  id: string;
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDate {
  id: string;
  date: string; // ISO date string
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}
