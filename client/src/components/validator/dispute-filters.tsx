"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All Disputes", count: 24 },
  { id: "pending", label: "Pending", count: 12 },
  { id: "voted", label: "Voted", count: 8 },
  { id: "resolved", label: "Resolved", count: 4 },
];

interface DisputeFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function DisputeFilters({
  activeFilter,
  onFilterChange,
}: DisputeFiltersProps) {
  return (
    <div className="flex items-center space-x-2 p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-green-200 dark:border-green-800">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant="ghost"
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
            activeFilter === filter.id
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
              : "text-muted-foreground hover:text-foreground hover:bg-green-50 dark:hover:bg-green-900/20"
          )}
        >
          {filter.label}
          <Badge
            variant="outline"
            className={cn(
              "ml-2 px-1.5 py-0.5 text-xs",
              activeFilter === filter.id
                ? "bg-white/20 text-white border-white/30"
                : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
            )}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
