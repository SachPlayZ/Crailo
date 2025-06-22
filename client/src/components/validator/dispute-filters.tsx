"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All Disputes" },
  { id: "pending", label: "Pending" },
  { id: "voted", label: "Voted" },
  { id: "resolved", label: "Resolved" },
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
        </Button>
      ))}
    </div>
  );
}
