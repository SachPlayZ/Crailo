"use client";

import { Sidebar } from "@/components/validator/sidebar";
import { Header } from "@/components/validator/header";
import { StatsCards } from "@/components/validator/stats-cards";
import { RepChart } from "@/components/validator/rep-chart";
import { RecentActivity } from "@/components/validator/recent-activity";

export default function ValidatorDashboard() {
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

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stats Cards */}
            <StatsCards />

            {/* Charts and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RepChart />
              <RecentActivity />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
