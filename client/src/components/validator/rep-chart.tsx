"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
    { name: "Jan", rep: 1200 },
    { name: "Feb", rep: 1450 },
    { name: "Mar", rep: 1680 },
    { name: "Apr", rep: 1920 },
    { name: "May", rep: 2150 },
    { name: "Jun", rep: 2380 },
    { name: "Jul", rep: 2847 },
]

export function RepChart() {
    return (
        <Card className="bg-gray-900 border-gray-800 col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                    REP Token Growth
                    <span className="text-sm font-normal text-gray-400">Last 7 months</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    border: "1px solid #374151",
                                    borderRadius: "8px",
                                    color: "#F9FAFB",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rep"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
