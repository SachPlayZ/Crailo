"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const filters = [
    { id: "all", label: "All Disputes", count: 24 },
    { id: "pending", label: "Pending", count: 12 },
    { id: "voted", label: "Voted", count: 8 },
    { id: "resolved", label: "Resolved", count: 4 },
]

interface DisputeFiltersProps {
    activeFilter: string
    onFilterChange: (filter: string) => void
}

export function DisputeFilters({ activeFilter, onFilterChange }: DisputeFiltersProps) {
    return (
        <div className="flex items-center space-x-2 p-1 bg-slate-900/50 rounded-lg border border-slate-800">
            {filters.map((filter) => (
                <Button
                    key={filter.id}
                    variant="ghost"
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        activeFilter === filter.id
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                    )}
                >
                    {filter.label}
                    <Badge
                        variant="outline"
                        className={cn(
                            "ml-2 px-1.5 py-0.5 text-xs",
                            activeFilter === filter.id
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700",
                        )}
                    >
                        {filter.count}
                    </Badge>
                </Button>
            ))}
        </div>
    )
}
