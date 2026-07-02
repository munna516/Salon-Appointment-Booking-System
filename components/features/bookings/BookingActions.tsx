import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Booking } from "@/types/booking";

interface BookingActionsProps {
  booking: Booking;
  onView: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: Booking["bookingStatus"]) => void;
  onDelete: (id: string) => void;
}

export function BookingActions({ booking, onView, onUpdateStatus, onDelete }: BookingActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(booking)}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {booking.bookingStatus !== "Completed" && (
          <DropdownMenuItem onClick={() => {
            if(confirm("Mark this appointment as completed?")) {
              onUpdateStatus(booking.id, "Completed");
            }
          }}>
            <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Mark Completed
          </DropdownMenuItem>
        )}
        {booking.bookingStatus !== "Cancelled" && (
          <DropdownMenuItem onClick={() => {
            if(confirm("Are you sure you want to cancel this booking?")) {
               onUpdateStatus(booking.id, "Cancelled");
            }
          }}>
            <XCircle className="mr-2 h-4 w-4 text-amber-500" /> Cancel Booking
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            if(confirm("Are you sure you want to delete this booking permanently?")) {
              onDelete(booking.id);
            }
          }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
