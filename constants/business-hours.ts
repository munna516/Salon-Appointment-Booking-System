import { BusinessHour, BlockedDate } from "@/types/business-hours";
import * as z from "zod";

export const MOCK_BUSINESS_HOURS: BusinessHour[] = [
  {
    id: "bh-mon",
    dayOfWeek: "MONDAY",
    isOpen: true,
    openTime: "09:00",
    closeTime: "17:00",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-tue",
    dayOfWeek: "TUESDAY",
    isOpen: true,
    openTime: "09:00",
    closeTime: "17:00",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-wed",
    dayOfWeek: "WEDNESDAY",
    isOpen: true,
    openTime: "09:00",
    closeTime: "17:00",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-thu",
    dayOfWeek: "THURSDAY",
    isOpen: true,
    openTime: "09:00",
    closeTime: "19:00", // Late night
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-fri",
    dayOfWeek: "FRIDAY",
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-sat",
    dayOfWeek: "SATURDAY",
    isOpen: true,
    openTime: "10:00",
    closeTime: "16:00", // Shorter hours
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bh-sun",
    dayOfWeek: "SUNDAY",
    isOpen: false,
    openTime: null,
    closeTime: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const MOCK_BLOCKED_DATES: BlockedDate[] = [
  {
    id: "bd-001",
    date: new Date(new Date().getFullYear(), 11, 25).toISOString(), // Christmas
    reason: "Christmas Day",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bd-002",
    date: new Date(new Date().getFullYear(), 0, 1).toISOString(), // New Year
    reason: "New Year's Day",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const blockedDateSchema = z.object({
  date: z.date({
    message: "A date is required.",
  }),
  reason: z.string().min(2, "Reason must be at least 2 characters."),
});

export type BlockedDateFormValues = z.infer<typeof blockedDateSchema>;

export const REASON_EXAMPLES = [
  "Christmas",
  "Vacation",
  "Maintenance",
  "Public Holiday",
  "Emergency",
];
