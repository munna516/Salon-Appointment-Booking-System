"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CheckCircle2, Scissors, ArrowLeft, Loader2, Sparkles, Droplets, SprayCan, Wind, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const SERVICES = [
  { id: "1", name: "Premium Haircut", price: 45, icon: Scissors, duration: "60 min", description: "Precision cut tailored to your style with a hot towel finish." },
  { id: "2", name: "Beard Trim & Shape", price: 30, icon: Scissors, duration: "30 min", description: "Detailed beard sculpting and lineup with razor finish." },
  { id: "3", name: "Hair Coloring", price: 85, icon: Droplets, duration: "120 min", description: "Full color treatment using premium organic products." },
  { id: "4", name: "Keratin Treatment", price: 120, icon: Sparkles, duration: "90 min", description: "Smoothing treatment for frizzy hair lasting up to 3 months." },
  { id: "5", name: "Styling & Blowout", price: 55, icon: Wind, duration: "45 min", description: "Professional washing, drying, and elegant styling." },
  { id: "6", name: "Scalp Treatment", price: 65, icon: SprayCan, duration: "60 min", description: "Deep cleansing and massaging treatment for healthy hair growth." },
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    if (step === 2 && selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [step, selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setLoadingSlots(true);
    setSelectedTime(null);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/public/availability?date=${dateStr}`);
      const json = await res.json();
      if (json.success) {
        setAvailableSlots(json.availableSlots);
      }
    } catch (error) {
      console.error("Failed to fetch slots", error);
      toast.error("Failed to fetch available times.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      toast.error("Please select a service first.");
      return;
    }
    if (step === 2 && !selectedTime) {
      toast.error("Please select an available time.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: { name: selectedService.name, price: selectedService.price },
          date: dateStr,
          startTime: selectedTime,
          ...formData
        })
      });

      const json = await res.json();
      if (json.success && json.clientSecret) {
        // Redirect to payment page instead of success step
        router.push(`/book/payment/${json.data.id}?clientSecret=${json.clientSecret}`);
      } else {
        throw new Error(json.error || "Failed to book");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Service" },
    { id: 2, title: "Date & Time" },
    { id: 3, title: "Details" },
    { id: 4, title: "Payment" }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center">
        
        {/* Stepper Progress */}
        <div className="w-full max-w-4xl mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-900 dark:bg-zinc-50 -z-10 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            {steps.map(s => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 shadow-md ${
                  step >= s.id 
                    ? "bg-gradient-to-r from-zinc-900 to-zinc-700 text-white dark:from-zinc-50 dark:to-zinc-300 dark:text-zinc-900 scale-110" 
                    : "bg-white text-zinc-500 border-2 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
                }`}>
                  {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500"}`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-10 overflow-hidden relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: SERVICES */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Select a Service</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-2">Choose from our premium grooming services.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  {SERVICES.map(service => {
                    const Icon = service.icon;
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <div 
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col gap-3 group hover:-translate-y-1 hover:shadow-xl ${
                          isSelected 
                            ? "border-zinc-900 bg-zinc-50/80 dark:border-zinc-50 dark:bg-zinc-800/80 shadow-lg" 
                            : "border-zinc-100 bg-white hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className={`p-3 rounded-xl transition-colors duration-300 ${isSelected ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-bold text-lg px-3 py-1 rounded-full ${isSelected ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>${service.price}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{service.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{service.description}</p>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium text-zinc-500">
                          <span>{service.duration}</span>
                          {isSelected && <span className="text-zinc-900 dark:text-zinc-50 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Selected</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} disabled={!selectedService} className="cursor-pointer rounded-full px-8 py-6 text-base bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-50 hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-50 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 shadow-lg hover:shadow-xl transition-all duration-300">
                    Continue to Date & Time
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE AND TIME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Select Date & Time</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">For {selectedService?.name}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 flex-1">
                  <div className="flex-1">
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-900/50 inline-block">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => { if(date) setSelectedDate(date) }}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-zinc-100">Available Times</h3>
                    {loadingSlots ? (
                      <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map(time => {
                          const isSelected = selectedTime === time;
                          // Convert 24h to 12h format for display
                          const [h, m] = time.split(':');
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const displayHour = hour % 12 || 12;
                          const displayTime = `${displayHour}:${m} ${ampm}`;

                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`cursor-pointer py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                                isSelected 
                                  ? "bg-gradient-to-r from-zinc-900 to-zinc-700 text-white dark:from-zinc-50 dark:to-zinc-300 dark:text-zinc-900 shadow-md ring-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-2 dark:ring-offset-zinc-950" 
                                  : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                              }`}
                            >
                              {displayTime}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                          <XCircle className="w-6 h-6 text-zinc-400" />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">No available slots for this date.</p>
                        <p className="text-sm text-zinc-400 mt-1">Please select another date.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} disabled={!selectedTime} className="cursor-pointer rounded-full px-8 py-6 text-base bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-50 hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-50 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 shadow-lg hover:shadow-xl transition-all duration-300">
                    Continue to Details
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Your Details</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Almost there! We just need a few details.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900/50" />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <Label htmlFor="notes">Special Requests or Notes (Optional)</Label>
                      <Textarea id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="bg-zinc-50 dark:bg-zinc-900/50 resize-none" rows={3} />
                    </div>
                  </div>

                  {/* Booking Summary Box */}
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 mb-8 border border-zinc-200 dark:border-zinc-700">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-sm uppercase tracking-wider">Booking Summary</h3>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400">Service:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-zinc-500 dark:text-zinc-400">Date & Time:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedDate && format(selectedDate, "MMM d, yyyy")} at {selectedTime && (() => {
                          const [h, m] = selectedTime.split(':');
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const displayHour = hour % 12 || 12;
                          return `${displayHour}:${m} ${ampm}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-zinc-200 dark:border-zinc-700 mt-2">
                      <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Total Price:</span>
                      <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">${selectedService?.price}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer rounded-full px-8 py-6 text-base bg-gradient-to-r from-emerald-600 to-emerald-500 text-zinc-50 hover:from-emerald-700 hover:to-emerald-600 dark:from-emerald-500 dark:to-emerald-400 dark:text-zinc-950 dark:hover:from-emerald-400 dark:hover:to-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto font-bold">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
