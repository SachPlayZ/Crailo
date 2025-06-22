"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/validator/sidebar";
import { Header } from "@/components/validator/header";
import { DisputeFilters } from "@/components/validator/dispute-filters";
import { DisputeCard } from "@/components/validator/dispute-card";

export default function DisputesPanel() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-950 dark:via-background dark:to-emerald-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100/20 dark:bg-green-900/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="flex h-screen relative z-10">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-lg animate-pulse" />
                <div className="grid gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-96 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-950 dark:via-background dark:to-emerald-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100/20 dark:bg-green-900/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />

          {/* Disputes Content */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <DisputeFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            {/* Disputes Card */}
            <div className="grid gap-6">
              <DisputeCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
