"use client";

import { Home, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/validator/dashboard?tab=dashboard", icon: Home },
  { name: "Disputes", href: "/validator/dashboard?tab=disputes", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="flex h-full w-64 flex-col bg-card/80 backdrop-blur-sm border-r border-border/50">
      {/* Logo */}
      <Link href="/">
        <div className="flex h-16 items-center px-6 border-b border-border/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-xl"></div>
          <Image src="/logo.png" alt="Crailo" width={100} height={100} className="relative z-10" />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = currentTab === item.name.toLowerCase();
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left h-12 px-4 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-left h-12 px-4 rounded-lg text-muted-foreground hover:text-foreground hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
