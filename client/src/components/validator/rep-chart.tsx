"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function RepChart() {
  return (
    <Card className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          REP Score Trend
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">2,847</div>
        <p className="text-xs text-muted-foreground">+156 from last month</p>
        <div className="mt-4 h-[200px] bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Chart placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}
