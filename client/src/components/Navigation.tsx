"use client";

import { useTheme } from "./ThemeProvider";
import Header from "./Header";
import Footer from "./Footer";

interface NavigationProps {
  children: React.ReactNode;
}

export default function Navigation({ children }: NavigationProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
