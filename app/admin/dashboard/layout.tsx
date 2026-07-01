"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors,
  Clock,
  CalendarOff,
  CreditCard,
  MessageSquare,
  Settings,
  User,
  LogOut, 
  Menu,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/dashboard/bookings", icon: Calendar },
  { name: "Services", href: "/admin/dashboard/services", icon: Scissors },
  { name: "Business Hours", href: "/admin/dashboard/business-hours", icon: Clock },
  { name: "Blocked Dates", href: "/admin/dashboard/blocked-dates", icon: CalendarOff },
  { name: "Payments", href: "/admin/dashboard/payments", icon: CreditCard },
  { name: "Contact Messages", href: "/admin/dashboard/contact-messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
      }
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 py-4 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/10 relative transition-all duration-300">
      
      <div className={`px-6 py-4 flex items-center gap-3 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="p-2 bg-purple-100 dark:bg-purple-600/20 rounded-xl border border-purple-200 dark:border-purple-500/30 shrink-0">
          <Scissors className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent truncate transition-all">
            SalonAdmin
          </span>
        )}
      </div>
      <nav className={`flex-1 space-y-2 mt-6 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isCollapsed ? link.name : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-medium border border-purple-200 dark:border-purple-500/20 shadow-sm" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-zinc-400 dark:text-zinc-500"}`} />
              {!isCollapsed && <span className="truncate">{link.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className={`pb-4 ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} w-full rounded-xl transition-all duration-200 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent cursor-pointer`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-white/10">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 -ml-2 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Page Title */}
            <h1 className="text-xl font-semibold capitalize tracking-tight hidden sm:block">
              {pathname.split("/").pop() || "Dashboard"}
            </h1>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-zinc-200 dark:border-white/10 p-0 overflow-hidden ring-offset-zinc-50 dark:ring-offset-zinc-950 focus-visible:ring-purple-500 cursor-pointer">
                  <Avatar className="h-full w-full">
                    <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" />
                    <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-200" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-zinc-100 focus:text-zinc-900 dark:focus:bg-white/10 dark:focus:text-white cursor-pointer">
                  <Link href="/admin/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:via-zinc-950 dark:to-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
