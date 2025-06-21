"use client"

import { TrendingUp, Clock, CheckCircle, Coins } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
    {
        title: "Staked Amount",
        value: "0.5 ETH",
        subValue: "$1,247.50",
        icon: Coins,
        trend: "+2.5%",
        trendUp: true,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
    },
    {
        title: "Last Validation",
        value: "2d 5h ago",
        subValue: "Block #18,234,567",
        icon: Clock,
        trend: "Active",
        trendUp: true,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
    },
    {
        title: "Total Validations",
        value: "1,247",
        subValue: "This month: 89",
        icon: CheckCircle,
        trend: "+12",
        trendUp: true,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
    },
    {
        title: "REP Tokens Earned",
        value: "2,847 REP",
        subValue: "≈ $427.05",
        icon: TrendingUp,
        trend: "+156",
        trendUp: true,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
    },
]

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card
                        key={index}
                        className={`bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/50 ${stat.borderColor} hover:${stat.borderColor.replace("/20", "/40")}`}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">{stat.subValue}</p>
                                <Badge
                                    variant="outline"
                                    className={`${stat.bgColor} ${stat.color} border-transparent text-xs px-2 py-0.5`}
                                >
                                    {stat.trend}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
