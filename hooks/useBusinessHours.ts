import { useState } from "react";
import { BusinessHour, BlockedDate } from "@/types/business-hours";
import { MOCK_BUSINESS_HOURS, MOCK_BLOCKED_DATES, BlockedDateFormValues } from "@/constants/business-hours";

export function useBusinessHours() {
  const [weeklyHours, setWeeklyHours] = useState<BusinessHour[]>(MOCK_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(MOCK_BLOCKED_DATES);

  // Weekly Hours Actions
  const updateDaySchedule = (dayId: string, updates: Partial<BusinessHour>) => {
    setWeeklyHours((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, ...updates, updatedAt: new Date().toISOString() } : day))
    );
  };

  const applyMondayToAll = () => {
    const monday = weeklyHours.find((h) => h.dayOfWeek === "MONDAY");
    if (!monday) return;

    setWeeklyHours((prev) =>
      prev.map((day) => ({
        ...day,
        isOpen: monday.isOpen,
        openTime: monday.openTime,
        closeTime: monday.closeTime,
        updatedAt: new Date().toISOString(),
      }))
    );
  };

  const resetSchedule = () => {
    setWeeklyHours(MOCK_BUSINESS_HOURS);
  };

  // Blocked Dates Actions
  const addBlockedDate = (values: BlockedDateFormValues) => {
    const newDate: BlockedDate = {
      id: `bd-${Math.random().toString(36).substr(2, 9)}`,
      date: values.date.toISOString(),
      reason: values.reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Keep sorted by date
    setBlockedDates((prev) => [...prev, newDate].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const updateBlockedDate = (id: string, values: BlockedDateFormValues) => {
    setBlockedDates((prev) =>
      prev
        .map((bd) =>
          bd.id === id
            ? { ...bd, date: values.date.toISOString(), reason: values.reason, updatedAt: new Date().toISOString() }
            : bd
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
  };

  const deleteBlockedDate = (id: string) => {
    setBlockedDates((prev) => prev.filter((bd) => bd.id !== id));
  };

  return {
    weeklyHours,
    blockedDates,
    updateDaySchedule,
    applyMondayToAll,
    resetSchedule,
    addBlockedDate,
    updateBlockedDate,
    deleteBlockedDate,
  };
}
