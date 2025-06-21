"use client"

import { Bell, ChevronDown, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export function Header() {
    const { isConnected } = useAccount()

    return (
        <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">Validator Dashboard</h1>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1">
                    <Wifi className="w-3 h-3 mr-1.5" />
                    {isConnected ? "Connected to Wallet" : "Not Connected"}
                </Badge>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                    <Bell className="h-5 w-5" />
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ConnectButton />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                            Copy Address
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-950">
                            Disconnect Wallet
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
