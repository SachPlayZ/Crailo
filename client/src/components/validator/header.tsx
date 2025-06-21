"use client";

import { Bell, ChevronDown, Wifi, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { isConnected } = useAccount();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-foreground">
          Validator Dashboard
        </h1>
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 px-3 py-1"
        >
          <Wifi className="w-3 h-3 mr-1.5" />
          {isConnected ? "Connected to Wallet" : "Not Connected"}
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="h-9 w-9 hover:scale-110 transition-transform hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ConnectButton showBalance={false} chainStatus="icon" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border-border"
          >
            <DropdownMenuItem className="text-foreground hover:text-foreground hover:bg-green-50 dark:hover:bg-green-900/20">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-foreground hover:text-foreground hover:bg-green-50 dark:hover:bg-green-900/20">
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
