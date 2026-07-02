import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6">
          Premium Style <br /> Meets Expertise
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
          Experience the ultimate grooming and styling service. Book your appointment today and elevate your look.
        </p>
        <Button asChild size="lg" className="h-12 px-8 rounded-full text-base bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 shadow-sm">
          <Link href="/book">
            Book an Appointment
          </Link>
        </Button>
      </main>
    </div>
  );
}
