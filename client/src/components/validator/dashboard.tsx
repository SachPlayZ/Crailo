"use client"

import { Sidebar } from "@/components/validator/sidebar"
import { Header } from "@/components/validator/header"
import { StatsCards } from "@/components/validator/stats-cards"
import { RepChart } from "@/components/validator/rep-chart"
import { RecentActivity } from "@/components/validator/recent-activity"

export default function ValidatorDashboard() {
    return (
        <div className="flex h-screen bg-gray-950">
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
    )
}
