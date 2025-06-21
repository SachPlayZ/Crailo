"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/validator/sidebar";
import { Header } from "@/components/validator/header";
import { DisputeFilters } from "@/components/validator/dispute-filters";
import { DisputeCard } from "@/components/validator/dispute-card";
import { getActiveDisputes, useVoteOnDispute } from "@/utils/Dispute";

// Use the provided mockDisputes
const mockDisputes = [
  {
    id: "1",
    productName: "Vintage Rolex Submariner",
    productImage: "/placeholder.svg?height=48&width=48",
    sellerAddress: "0x1a2b...3c4d",
    buyerAddress: "0x5e6f...7g8h",
    originalImage: "/placeholder.svg?height=128&width=128",
    receivedImage: "/placeholder.svg?height=128&width=128",
    descriptionMismatch:
      "Product received appears to be a replica, not authentic vintage Rolex as described.",
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
    descriptionMismatch:
      "Size mismatch - received US 9 instead of advertised US 10.5.",
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
];

export default function DisputesPanel() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [disputes, setDisputes] = useState(mockDisputes);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: fetchedDisputes,
    isLoading: isFetchingLoading,
    isError,
    error,
  } = getActiveDisputes();
  const { voteOnDispute, isPending } = useVoteOnDispute();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If fetchedDisputes is available and non-empty, merge with mockDisputes
    if (
      !isFetchingLoading &&
      Array.isArray(fetchedDisputes) &&
      fetchedDisputes.length > 0
    ) {
      // Merge mockDisputes and fetchedDisputes, avoiding duplicates by id
      const merged = [
        ...mockDisputes,
        ...fetchedDisputes.filter(
          (fd: any) => !mockDisputes.some((md) => md.id === fd.id)
        ),
      ];
      setDisputes(merged);
    } else if (!isFetchingLoading) {
      setDisputes(mockDisputes);
    }
  }, [isFetchingLoading, fetchedDisputes]);

  const handleVote = async (disputeId: string, productValid: boolean) => {
    try {
      await voteOnDispute({
        disputeId,
        productValid: productValid ? "true" : "false",
      });
      // Optionally refetch disputes here
    } catch (e) {
      alert("Vote failed");
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    if (activeFilter === "all") return true;
    return dispute.status === activeFilter;
  });

  if (isLoading || isFetchingLoading) {
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

  if (isError) {
    return <div>Error loading disputes: {error?.message}</div>;
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
              <div className="text-sm text-muted-foreground">
                Showing {filteredDisputes.length} dispute
                {filteredDisputes.length !== 1 ? "s" : ""}
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
                <div className="text-muted-foreground text-lg mb-2">
                  No disputes found
                </div>
                <div className="text-muted-foreground text-sm">
                  Try adjusting your filters or check back later.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
