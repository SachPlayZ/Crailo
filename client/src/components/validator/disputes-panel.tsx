"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/validator/sidebar"
import { Header } from "@/components/validator/header"
import { DisputeFilters } from "@/components/validator/dispute-filters"
import { DisputeCard } from "@/components/validator/dispute-card"

// Mock data
const mockDisputes = [
    {
        id: "1",
        productName: "Vintage Rolex Submariner",
        productImage: "/placeholder.svg?height=48&width=48",
        sellerAddress: "0x1a2b...3c4d",
        buyerAddress: "0x5e6f...7g8h",
        originalImage: "/placeholder.svg?height=128&width=128",
        receivedImage: "/placeholder.svg?height=128&width=128",
        descriptionMismatch: "Product received appears to be a replica, not authentic vintage Rolex as described.",
        timeAgo: "3h ago",
        status: "pending" as const,
    },
    {
        id: "2",
        productName: "Nike Air Jordan 1 Retro",
        productImage: "/placeholder.svg?height=48&width=48",
        sellerAddress: "0x9i0j...1k2l",
        buyerAddress: "0x3m4n...5o6p",
        originalImage: "/placeholder.svg?height=128&width=128",
        receivedImage: "/placeholder.svg?height=128&width=128",
        descriptionMismatch: "Size mismatch - received US 9 instead of advertised US 10.5.",
        timeAgo: "5h ago",
        status: "pending" as const,
    },
    {
        id: "3",
        productName: "MacBook Pro 16-inch M2",
        productImage: "/placeholder.svg?height=48&width=48",
        sellerAddress: "0x7q8r...9s0t",
        buyerAddress: "0x1u2v...3w4x",
        originalImage: "/placeholder.svg?height=128&width=128",
        receivedImage: "/placeholder.svg?height=128&width=128",
        descriptionMismatch: "",
        timeAgo: "1d ago",
        status: "voted" as const,
        userVote: "valid" as const,
    },
    {
        id: "4",
        productName: "Hermès Birkin Bag",
        productImage: "/placeholder.svg?height=48&width=48",
        sellerAddress: "0x5y6z...7a8b",
        buyerAddress: "0x9c0d...1e2f",
        originalImage: "/placeholder.svg?height=128&width=128",
        receivedImage: "/placeholder.svg?height=128&width=128",
        descriptionMismatch:
            "Color significantly different from listing photos - appears to be a different shade entirely.",
        timeAgo: "2d ago",
        status: "resolved" as const,
    },
]

export default function DisputesPanel() {
    const [activeFilter, setActiveFilter] = useState("all")
    const [disputes, setDisputes] = useState(mockDisputes)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const filteredDisputes = disputes.filter((dispute) => {
        if (activeFilter === "all") return true
        return dispute.status === activeFilter
    })

    if (isLoading) {
        return (
            <div className="flex h-screen bg-slate-950">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
                            <div className="grid gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-96 bg-slate-800/50 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-slate-950">
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
                        <DisputeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                        <div className="text-sm text-slate-400">
                            Showing {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? "s" : ""}
                        </div>
                    </div>

                    {/* Disputes Grid */}
                    <div className="grid gap-6">
                        {filteredDisputes.map((dispute, index) => (
                            <div
                                key={dispute.id}
                                className="animate-in slide-in-from-bottom-4 duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <DisputeCard dispute={dispute} />
                            </div>
                        ))}
                    </div>

                    {filteredDisputes.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-slate-400 text-lg mb-2">No disputes found</div>
                            <div className="text-slate-500 text-sm">Try adjusting your filters or check back later.</div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
