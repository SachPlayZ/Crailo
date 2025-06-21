"use client";

import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  // Hide navigation for validator routes
  const isValidatorRoute = pathname?.startsWith("/validator");

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {!isValidatorRoute && (
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <main>{children}</main>
      {!isValidatorRoute && <Footer />}
    </div>
  );
}
