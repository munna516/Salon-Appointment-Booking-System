"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { BusinessHourStats } from "@/components/features/business-hours/BusinessHourStats";
import { WeeklySchedule } from "@/components/features/business-hours/WeeklySchedule";
import { ClosedDateTable } from "@/components/features/business-hours/ClosedDateTable";
import { ClosedDateModal } from "@/components/features/business-hours/ClosedDateModal";
import { DeleteDialog } from "@/components/features/business-hours/DeleteDialog";
import { BlockedDate } from "@/types/business-hours";
import { BlockedDateFormValues } from "@/constants/business-hours";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function BusinessHoursPage() {
  const {
    weeklyHours,
    blockedDates,
    updateDaySchedule,
    applyMondayToAll,
    resetSchedule,
    addBlockedDate,
    updateBlockedDate,
    deleteBlockedDate,
    loading
  } = useBusinessHours();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBlockedDate, setSelectedBlockedDate] = useState<BlockedDate | null>(null);

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<string | null>(null);

  // Handlers
  const handleAddDate = () => {
    setModalMode("create");
    setSelectedBlockedDate(null);
    setIsModalOpen(true);
  };

  const handleEditDate = (date: BlockedDate) => {
    setModalMode("edit");
    setSelectedBlockedDate(date);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setDateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dateToDelete) {
      deleteBlockedDate(dateToDelete);
    }
    setIsDeleteDialogOpen(false);
    setDateToDelete(null);
  };

  const handleModalSubmit = (values: BlockedDateFormValues) => {
    if (modalMode === "create") {
      addBlockedDate(values);
    } else if (modalMode === "edit" && selectedBlockedDate) {
      updateBlockedDate(selectedBlockedDate.id, values);
    }
    setIsModalOpen(false);
  };

  // Derived stats
  const daysOpen = weeklyHours.filter(h => h.isOpen).length;
  const daysClosed = 7 - daysOpen;
  const specialClosedDatesCount = blockedDates.length;

  return (
    <div className="flex-1 space-y-8 md:p-2 pt-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Business Hours</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Manage your weekly opening hours and special closed dates. Changes are saved automatically.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <BusinessHourStats
            daysOpen={daysOpen}
            daysClosed={daysClosed}
            specialClosedDates={specialClosedDatesCount}
          />

          <div className="space-y-12">
            <WeeklySchedule
              weeklyHours={weeklyHours}
              onUpdateDay={updateDaySchedule}
              onApplyMondayToAll={applyMondayToAll}
              onReset={resetSchedule}
            />

            <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />

            <ClosedDateTable
              data={blockedDates}
              onAdd={handleAddDate}
              onEdit={handleEditDate}
              onDelete={handleDeleteRequest}
            />
          </div>
        </>
      )}

      <ClosedDateModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        initialData={selectedBlockedDate}
        onSubmit={handleModalSubmit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Special Closed Date"
        description="Are you sure you want to remove this blocked date? Your business will be open on this day according to your weekly schedule."
      />
    </div>
  );
}
