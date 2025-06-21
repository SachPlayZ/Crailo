"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage on mount
    const savedTheme = localStorage.getItem("crailo-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme !== null) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(prefersDark);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Update document class and localStorage when theme changes
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("crailo-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("crailo-theme", "light");
      }
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
