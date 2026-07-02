import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Booking } from "@/types/booking";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, FileText, User, Tag } from "lucide-react";
import { format, parseISO } from "date-fns";

interface BookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ booking, isOpen, onClose }: BookingModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Booking Details</DialogTitle>
          <DialogDescription>
            ID: {booking.id} &middot; Created on {format(parseISO(booking.createdAt), "MMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Customer Info */}
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Customer</h3>
              <div className="flex items-start gap-3">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                  <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{booking.customer.name}</p>
                  <p className="text-sm text-zinc-500">{booking.customer.email}</p>
                  <p className="text-sm text-zinc-500">{booking.customer.phone}</p>
                </div>
              </div>
            </section>

            <Separator className="bg-zinc-200 dark:bg-zinc-800" />

            {/* Appointment Info */}
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Appointment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">{format(parseISO(booking.date), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">{booking.time} ({booking.service.duration}m)</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Tag className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium">{booking.service.name}</span>
                </div>
              </div>
              <div className="mt-2">
                <BookingStatusBadge status={booking.bookingStatus} />
              </div>
            </section>
            
            {booking.customerNotes && (
              <>
                <Separator className="bg-zinc-200 dark:bg-zinc-800" />
                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Notes
                  </h3>
                  <p className="text-sm bg-zinc-50 dark:bg-zinc-900 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {booking.customerNotes}
                  </p>
                </section>
              </>
            )}
          </div>

          <div className="space-y-6">
            {/* Payment Info */}
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Payment</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Total Price</span>
                <span className="font-semibold text-lg">${booking.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span className="text-sm">{booking.paymentMethod}</span>
              </div>
              {booking.transactionId && (
                <div className="text-sm text-zinc-500 mt-1">
                  Transaction ID: {booking.transactionId}
                </div>
              )}
              <div className="mt-2">
                <PaymentStatusBadge status={booking.paymentStatus} />
              </div>
            </section>

            <Separator className="bg-zinc-200 dark:bg-zinc-800" />

            {/* Timeline (Mocked) */}
            <section className="space-y-4">
               <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Timeline</h3>
               <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-950"></div>
                    <p className="text-sm font-medium">Booking Created</p>
                    <p className="text-xs text-zinc-500">{format(parseISO(booking.createdAt), "MMM d, h:mm a")}</p>
                  </div>
                  {booking.paymentStatus === "Paid" && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950"></div>
                      <p className="text-sm font-medium">Payment Completed</p>
                      <p className="text-xs text-zinc-500">Transaction verified</p>
                    </div>
                  )}
                  {booking.bookingStatus === "Confirmed" || booking.bookingStatus === "Completed" ? (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950"></div>
                      <p className="text-sm font-medium">Booking Confirmed</p>
                    </div>
                  ) : null}
                  {booking.bookingStatus === "Completed" && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950"></div>
                      <p className="text-sm font-medium">Appointment Completed</p>
                    </div>
                  )}
               </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
