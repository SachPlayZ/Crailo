"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, Clock, Edit3, Package, ShoppingBag, Trash2, TruckIcon } from "lucide-react"
import Image from "next/image"
import { useUserHistory } from "@/utils/listing"
import { useAccount } from "wagmi"

// Array of product images
const productImages = [
    "/placeholder.svg?height=80&width=80&text=iPhone",
    "/placeholder.svg?height=80&width=80&text=MacBook",
    "/placeholder.svg?height=80&width=80&text=AirPods",
    "/placeholder.svg?height=80&width=80&text=Samsung",
    "/placeholder.svg?height=80&width=80&text=PlayStation",
    "/placeholder.svg?height=80&width=80&text=Nintendo",
    "/placeholder.svg?height=80&width=80&text=iPad",
    "/placeholder.svg?height=80&width=80&text=Watch",
]

// Mock data for buying history
const buyingHistory = [
    {
        id: 1,
        productName: "iPhone 14 Pro Max",
        sellerName: "TechDealer_99",
        price: 899,
        status: "Awaiting Delivery",
        image: productImages[0],
        orderDate: "2024-01-15",
    },
    {
        id: 2,
        productName: "MacBook Air M2",
        sellerName: "AppleStore_Official",
        price: 1199,
        status: "Delivered",
        image: productImages[1],
        orderDate: "2024-01-10",
    },
    {
        id: 3,
        productName: "AirPods Pro 2nd Gen",
        sellerName: "AudioGear_Pro",
        price: 249,
        status: "Dispute Raised",
        image: productImages[2],
        orderDate: "2024-01-08",
    },
]

// Mock data for user listings
const myListings = [
    {
        id: 1,
        title: "Samsung Galaxy S23 Ultra",
        price: 799,
        status: "Available",
        image: productImages[3],
        listedDate: "2024-01-12",
        views: 45,
    },
    {
        id: 2,
        title: "PlayStation 5 Console",
        price: 499,
        status: "Sold",
        image: productImages[4],
        listedDate: "2024-01-05",
        views: 128,
    },
    {
        id: 3,
        title: "Nintendo Switch OLED",
        price: 299,
        status: "Under Dispute",
        image: productImages[5],
        listedDate: "2024-01-01",
        views: 67,
    },
]

const getStatusBadge = (status: string, type: "buying" | "listing") => {
    const baseClasses = "font-medium backdrop-blur-sm border-0 shadow-lg"

    if (type === "buying") {
        switch (status) {
            case "Delivered":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 shadow-green-500/25`}
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            case "Awaiting Delivery":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 shadow-yellow-500/25`}
                    >
                        <Clock className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            case "Dispute Raised":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 shadow-red-500/25`}
                    >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            default:
                return (
                    <Badge className={`${baseClasses} bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300`}>
                        {status}
                    </Badge>
                )
        }
    } else {
        switch (status) {
            case "Available":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 shadow-green-500/25`}
                    >
                        <Package className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            case "Sold":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 shadow-blue-500/25`}
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            case "Under Dispute":
                return (
                    <Badge
                        className={`${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 shadow-red-500/25`}
                    >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {status}
                    </Badge>
                )
            default:
                return (
                    <Badge className={`${baseClasses} bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300`}>
                        {status}
                    </Badge>
                )
        }
    }
}

export default function CrailoDashboard() {
    const { address } = useAccount()
    const { historyListings, getUserHistoryData } = useUserHistory(address as string)
    
    const [activeTab, setActiveTab] = useState("buying")
    const disputeCount =
        buyingHistory.filter((item) => item.status === "Dispute Raised").length +
        myListings.filter((item) => item.status === "Under Dispute").length

    const handleHistoryClick = async () => {
        try {
            const history = await getUserHistoryData();
            console.log("User history data:", history);
        } catch (error) {
            console.error("Error fetching user history:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
                        My Dashboard
                    </h2>
                    <Button onClick={handleHistoryClick} className="mb-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white">
                        Get History
                    </Button>
                    <p className="text-gray-400 text-lg">Manage your purchases and listings on Crailo</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 backdrop-blur-xl bg-gray-800/50 border border-gray-700/50 shadow-2xl rounded-xl p-1">
                        <TabsTrigger
                            value="buying"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-400/25 font-medium text-gray-300 data-[state=inactive]:hover:text-white transition-all duration-300 rounded-lg"
                        >
                            <TruckIcon className="w-4 h-4 mr-2" />
                            Buying History
                        </TabsTrigger>
                        <TabsTrigger
                            value="listings"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-400/25 font-medium text-gray-300 data-[state=inactive]:hover:text-white transition-all duration-300 rounded-lg"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            My Listings
                        </TabsTrigger>
                    </TabsList>

                    {/* Buying History Tab */}
                    <TabsContent value="buying" className="space-y-6">
                        {buyingHistory.length === 0 ? (
                            <Card className="text-center py-12 backdrop-blur-xl bg-gray-800/30 border border-gray-700/50 shadow-2xl rounded-2xl">
                                <CardContent>
                                    <TruckIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No purchases yet</h3>
                                    <p className="text-gray-400">Start exploring products on Crailo to see your buying history here.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {buyingHistory.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-600/50 hover:border-green-400/50 shadow-2xl hover:shadow-green-400/10 rounded-2xl overflow-hidden"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    <Image
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.productName}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-xl object-cover border border-gray-600/50 relative z-10 group-hover:border-green-400/50 transition-colors duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                                                                {item.productName}
                                                            </h3>
                                                            <p className="text-sm text-gray-400 mb-2">
                                                                Sold by: <span className="font-medium text-gray-300">{item.sellerName}</span>
                                                            </p>
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                                                ${item.price}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            {getStatusBadge(item.status, "buying")}
                                                            <p className="text-xs text-gray-500 mt-2">Ordered: {item.orderDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 mt-4">
                                                        <Button
                                                            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25 rounded-xl"
                                                            disabled={item.status !== "Delivered"}
                                                        >
                                                            Release Escrow
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border border-red-400/50 text-red-400 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                                                            disabled={item.status === "Dispute Raised"}
                                                        >
                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                            Raise Dispute
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* My Listings Tab */}
                    <TabsContent value="listings" className="space-y-6">
                        {myListings.length === 0 ? (
                            <Card className="text-center py-12 backdrop-blur-xl bg-gray-800/30 border border-gray-700/50 shadow-2xl rounded-2xl">
                                <CardContent>
                                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No items listed</h3>
                                    <p className="text-gray-400">Create your first listing to start selling on Crailo.</p>
                                    <Button className="mt-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300 rounded-xl">
                                        Create Listing
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {myListings.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-600/50 hover:border-green-400/50 shadow-2xl hover:shadow-green-400/10 rounded-2xl overflow-hidden"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    <Image
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.title}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-xl object-cover border border-gray-600/50 relative z-10 group-hover:border-green-400/50 transition-colors duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                                                                ${item.price}
                                                            </p>
                                                            <p className="text-sm text-gray-400">{item.views} views</p>
                                                        </div>
                                                        <div className="text-right">
                                                            {getStatusBadge(item.status, "listing")}
                                                            <p className="text-xs text-gray-500 mt-2">Listed: {item.listedDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            className="border border-green-400/50 text-green-400 hover:bg-green-400/10 hover:text-green-300 hover:border-green-400 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                                                            disabled={item.status === "Sold"}
                                                        >
                                                            <Edit3 className="w-4 h-4 mr-2" />
                                                            Update Listing
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border border-red-400/50 text-red-400 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                                                            disabled={item.status === "Sold"}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Remove Listing
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
