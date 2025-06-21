"use client"

import { Home, Shield, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
    { name: "Dashboard", href: "/validator/dashboard?tab=dashboard", icon: Home },
    { name: "Disputes", href: "/validator/dashboard?tab=disputes", icon: Shield },
]

export function Sidebar() {
    const pathname = usePathname()
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    const currentTab = searchParams.get('tab') || 'dashboard'

    return (
        <div className="flex h-full w-64 flex-col bg-gray-950 border-r border-gray-800">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-xl font-bold text-white">Crailo</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const tabInUrl = item.href.split('tab=')[1]
                    const isActive = tabInUrl === currentTab
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                            )}
                        >
                            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Exit Position Button */}
            <div className="p-4 border-t border-gray-800">
                <Button
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Exit Position
                </Button>
            </div>
        </div>
    )
}
