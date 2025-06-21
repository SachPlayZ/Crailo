"use client";

import { TrendingUp, Clock, CheckCircle, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "wagmi";
import { useValidatorGet } from "@/utils/validator";
import { formatEther } from "viem";

type ValidatorInfo = [bigint, bigint, bigint, bigint, bigint, boolean] | undefined;

interface StatCard {
  title: string;
  value: string;
  subValue: string;
  icon: typeof Coins | typeof Clock | typeof CheckCircle | typeof TrendingUp;
  trend: string;
  trendUp: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function StatsCards() {
  const { address } = useAccount();
  const { validatorInfo } = useValidatorGet(address as string) as { validatorInfo: ValidatorInfo };

  // Helper function to format time ago
  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
  
  // Convert BigInts to numbers and format them
  const initialStake = validatorInfo?.[0] ? Number(formatEther(validatorInfo[0])) : 0;
  const currentStake = validatorInfo?.[1] ? Number(formatEther(validatorInfo[1])) : 0;
  const repEarned = validatorInfo?.[2] ? Number(formatEther(validatorInfo[2])) : 0;
  const validationCount = validatorInfo?.[3] ? Number(validatorInfo[3]) : 0;
  const lastValidatedAt = validatorInfo?.[4] ? new Date(Number(validatorInfo[4]) * 1000) : null;
  const isActive = validatorInfo?.[5] ?? false;

  const stats: StatCard[] = [
    {
      title: "Staked Amount",
      value: `${currentStake.toFixed(4)} ETH`,
      subValue: `Initial: ${initialStake.toFixed(4)} ETH`,
      icon: Coins,
      trend: currentStake > initialStake ? "+🔼" : currentStake < initialStake ? "-🔽" : "=",
      trendUp: currentStake >= initialStake,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Last Validation",
      value: lastValidatedAt ? getTimeAgo(lastValidatedAt) : "Never",
      subValue: isActive ? "Validator Active" : "Validator Inactive",
      icon: Clock,
      trend: isActive ? "Active" : "Inactive",
      trendUp: isActive,
      color: isActive ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400",
      bgColor: isActive ? "bg-blue-500/10" : "bg-red-500/10",
      borderColor: isActive ? "border-blue-500/20" : "border-red-500/20",
    },
    {
      title: "Total Validations",
      value: validationCount.toString(),
      subValue: "All Time",
      icon: CheckCircle,
      trend: validationCount > 0 ? "Active" : "No Activity",
      trendUp: validationCount > 0,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "REP Tokens Earned",
      value: `${repEarned.toFixed(4)} REP`,
      subValue: "Total Earnings",
      icon: TrendingUp,
      trend: repEarned > 0 ? "+🔼" : "No Earnings",
      trendUp: repEarned > 0,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10 ${
              stat.borderColor
            } hover:${stat.borderColor.replace("/20", "/40")}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                <Badge
                  variant="outline"
                  className={`${stat.bgColor} ${stat.color} border-transparent text-xs px-2 py-0.5`}
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
