"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

const activities = [
    {
        id: 1,
        type: "validation",
        description: "Validated marketplace transaction",
        time: "2 hours ago",
        status: "completed",
        reward: "+12 REP",
    },
    {
        id: 2,
        type: "dispute",
        description: "Dispute resolution pending",
        time: "5 hours ago",
        status: "pending",
        reward: "TBD",
    },
    {
        id: 3,
        type: "validation",
        description: "Validated seller verification",
        time: "1 day ago",
        status: "completed",
        reward: "+8 REP",
    },
    {
        id: 4,
        type: "validation",
        description: "Validated product authenticity",
        time: "2 days ago",
        status: "completed",
        reward: "+15 REP",
    },
]

export function RecentActivity() {
    return (
        <Card className="bg-gray-900 border-gray-800 col-span-full lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {activity.status === "completed" && <CheckCircle className="h-5 w-5 text-green-400" />}
                            {activity.status === "pending" && <Clock className="h-5 w-5 text-yellow-400" />}
                            {activity.status === "failed" && <AlertTriangle className="h-5 w-5 text-red-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <Badge
                                variant="outline"
                                className={`text-xs ${activity.status === "completed"
                                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                                        : activity.status === "pending"
                                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                            : "bg-red-500/10 text-red-400 border-red-500/30"
                                    }`}
                            >
                                {activity.reward}
                            </Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
