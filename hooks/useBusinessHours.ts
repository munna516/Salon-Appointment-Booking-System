import { useState, useEffect } from "react";
import { BusinessHour, BlockedDate } from "@/types/business-hours";
import { BlockedDateFormValues } from "@/constants/business-hours";
import toast from "react-hot-toast";

export function useBusinessHours() {
  const [weeklyHours, setWeeklyHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bhRes, bdRes] = await Promise.all([
          fetch("/api/admin/business-hours"),
          fetch("/api/admin/blocked-dates")
        ]);
        if (bhRes.ok && bdRes.ok) {
          const bhJson = await bhRes.json();
          const bdJson = await bdRes.json();
          setWeeklyHours(bhJson.data);
          setBlockedDates(bdJson.data);
        }
      } catch (err) {
        console.error("Failed to fetch business hours data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Weekly Hours Actions
  const updateDaySchedule = async (dayId: string, updates: Partial<BusinessHour>) => {
    const original = weeklyHours;
    setWeeklyHours((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, ...updates } : day))
    );

    try {
      const dayToUpdate = original.find(d => d.id === dayId);
      if (!dayToUpdate) return;
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dayToUpdate, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Business hours updated");
    } catch (err) {
      setWeeklyHours(original);
      toast.error("Failed to update business hours");
    }
  };

  const applyMondayToAll = async () => {
    const monday = weeklyHours.find((h) => h.dayOfWeek === "MONDAY");
    if (!monday) return;

    const original = weeklyHours;
    const updated = weeklyHours.map((day) => ({
      ...day,
      isOpen: monday.isOpen,
      openTime: monday.openTime,
      closeTime: monday.closeTime,
    }));
    
    setWeeklyHours(updated);

    try {
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to apply to all");
      toast.success("Applied Monday schedule to all days");
    } catch (err) {
      setWeeklyHours(original);
      toast.error("Failed to apply schedule to all");
    }
  };

  const resetSchedule = async () => {
    const original = weeklyHours;
    
    // Default: Mon-Sat Open 09:00-17:00, Sun Closed
    const resetData = weeklyHours.map(day => {
      const isOpen = day.dayOfWeek !== "SUNDAY";
      return {
        ...day,
        isOpen,
        openTime: isOpen ? "09:00" : null,
        closeTime: isOpen ? "17:00" : null,
      };
    });

    setWeeklyHours(resetData);

    try {
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });
      if (!res.ok) throw new Error("Failed to reset");
      toast.success("Business hours reset to defaults");
    } catch (err) {
      setWeeklyHours(original);
      toast.error("Failed to reset schedule");
    }
  };

  // Blocked Dates Actions
  const addBlockedDate = async (values: BlockedDateFormValues) => {
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: values.date.toISOString(), reason: values.reason }),
      });
      if (!res.ok) throw new Error("Failed to add blocked date");
      const json = await res.json();
      setBlockedDates((prev) => [...prev, json.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      toast.success("Blocked date added");
    } catch (err) {
      toast.error("Failed to add blocked date");
    }
  };

  const updateBlockedDate = async (id: string, values: BlockedDateFormValues) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: values.date.toISOString(), reason: values.reason }),
      });
      if (!res.ok) throw new Error("Failed to update blocked date");
      const json = await res.json();
      
      setBlockedDates((prev) =>
        prev
          .map((bd) => (bd.id === id ? json.data : bd))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      toast.success("Blocked date updated");
    } catch (err) {
      toast.error("Failed to update blocked date");
    }
  };

  const deleteBlockedDate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blocked date");
      setBlockedDates((prev) => prev.filter((bd) => bd.id !== id));
      toast.success("Blocked date removed");
    } catch (err) {
      toast.error("Failed to delete blocked date");
    }
  };

  return {
    weeklyHours,
    blockedDates,
    loading,
    updateDaySchedule,
    applyMondayToAll,
    resetSchedule,
    addBlockedDate,
    updateBlockedDate,
    deleteBlockedDate,
  };
}
