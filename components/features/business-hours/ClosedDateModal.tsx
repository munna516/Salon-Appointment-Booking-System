import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { BlockedDate } from "@/types/business-hours";
import { blockedDateSchema, BlockedDateFormValues, REASON_EXAMPLES } from "@/constants/business-hours";

interface ClosedDateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData: BlockedDate | null;
  onSubmit: (data: BlockedDateFormValues) => void;
}

export function ClosedDateModal({
  isOpen,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
}: ClosedDateModalProps) {
  const form = useForm<BlockedDateFormValues>({
    resolver: zodResolver(blockedDateSchema),
    defaultValues: {
      date: new Date(),
      reason: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          date: new Date(initialData.date),
          reason: initialData.reason || "",
        });
      } else {
        form.reset({
          date: new Date(),
          reason: "",
        });
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = (data: BlockedDateFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Closed Date" : "Edit Closed Date"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new special closed date to your schedule."
              : "Make changes to this special closed date."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={format(field.value, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (!isNaN(newDate.getTime())) {
                          field.onChange(newDate);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <div className="flex flex-col gap-3">
                    <Select onValueChange={(val) => field.onChange(val)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Quick select a reason..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REASON_EXAMPLES.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                      <span className="text-xs text-zinc-500 uppercase">or type custom</span>
                      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    </div>

                    <FormControl>
                      <Input placeholder="e.g. Renovation" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
