"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="sticky top-1 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 group">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-bold">Crailo</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-green-600 transition-colors relative group"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </a>
          <a
            href="#why-crailo"
            className="text-sm font-medium hover:text-green-600 transition-colors relative group"
          >
            Why Crailo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </a>
          <a
            href="#validators"
            className="text-sm font-medium hover:text-green-600 transition-colors relative group"
          >
            Validators
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </a>
          <a
            href="#community"
            className="text-sm font-medium hover:text-green-600 transition-colors relative group"
          >
            Community
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 hover:scale-110 transition-transform"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="hidden sm:inline-flex hover:scale-105 transition-transform"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
}
