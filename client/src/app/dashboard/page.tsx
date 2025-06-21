"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Edit3,
  Package,
  ShoppingBag,
  Trash2,
  TruckIcon,
} from "lucide-react";
import Image from "next/image";
import { useUserHistory } from "@/utils/listing";
import { useAccount } from "wagmi";
import { useListing } from "@/utils/listing";

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
];

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
];

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
];

interface ListingMetadata {
  title: string;
  description: string;
  price: number;
  location: string;
  seller: {
    name: string;
    address: string;
  };
  images: string[];
  category: string;
  condition: string;
  escrowAmount: number;
}

interface Listing {
  active: boolean;
  buyer: string;
  createdAt: bigint;
  description: string;
  id: bigint;
  imageHash: string;
  price: bigint;
  seller: string;
  sellerStake: bigint;
  status: number;
  metadata?: ListingMetadata;
}

const getStatusBadge = (status: string, type: "buying" | "listing") => {
  const baseClasses = "font-medium backdrop-blur-sm border-0 shadow-lg";

  if (type === "buying") {
    switch (status) {
      case "Delivered":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 shadow-green-500/25`}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Awaiting Delivery":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 dark:text-yellow-300 shadow-yellow-500/25`}
          >
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Dispute Raised":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 dark:text-red-300 shadow-red-500/25`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300`}
          >
            {status}
          </Badge>
        );
    }
  } else {
    switch (status) {
      case "Available":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 shadow-green-500/25`}
          >
            <Package className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Sold":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 shadow-blue-500/25`}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "Under Dispute":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 dark:text-red-300 shadow-red-500/25`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300`}
          >
            {status}
          </Badge>
        );
    }
  }
};

const getStatusFromNumber = (status: number) => {
  switch (status) {
    case 0:
      return "Active";
    case 1:
      return "Committed";
    case 2:
      return "Disputed";
    case 3:
      return "Completed";
    case 4:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const formatDate = (timestamp: bigint) => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

const formatPrice = (price: bigint) => {
  return (Number(price) / 1e18).toFixed(2);
};

export default function CrailoDashboard() {
  const { address } = useAccount();
  const { historyListings, getUserHistoryData } = useUserHistory(
    address as string
  );
  const [activeTab, setActiveTab] = useState("buying");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    handleHistoryClick();
  }, []);

  const handleHistoryClick = async () => {
    try {
      const history = await getUserHistoryData();
      if (Array.isArray(history)) {
        // Fetch metadata for each listing
        const listingsWithMetadata = await Promise.all(
          history.map(async (listing: Listing) => {
            try {
              const metadataResponse = await fetch(listing.imageHash);
              const metadata = await metadataResponse.json();
              return { ...listing, metadata };
            } catch (error) {
              console.error("Error fetching metadata for listing:", error);
              return listing;
            }
          })
        );
        setListings(listingsWithMetadata);
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  const buyingHistory = listings.filter(
    (item) => item.buyer.toLowerCase() === (address as string)?.toLowerCase()
  );
  const myListings = listings.filter(
    (item) => item.seller.toLowerCase() === (address as string)?.toLowerCase()
  );

  const disputeCount = listings.filter((item) => item.status === 2).length;

  const { cancelListing } = useListing();

  const removeListing = (id: number) => async () => {
    try {
      await cancelListing(id);
      // Optionally, refetch listings or update state to reflect removal
      console.log(`Listing ${id} removed successfully`);
    } catch (error) {
      console.error("Error removing listing:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-950 dark:via-background dark:to-emerald-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100/20 dark:bg-green-900/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your purchases and listings on Crailo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={handleHistoryClick}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Refresh History
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg rounded-xl p-1">
            <TabsTrigger
              value="buying"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 font-medium text-foreground data-[state=inactive]:hover:text-green-600 dark:data-[state=inactive]:hover:text-green-400 transition-all duration-300 rounded-lg"
            >
              <TruckIcon className="w-4 h-4 mr-2" />
              Buying History
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 font-medium text-foreground data-[state=inactive]:hover:text-green-600 dark:data-[state=inactive]:hover:text-green-400 transition-all duration-300 rounded-lg"
            >
              <Package className="w-4 h-4 mr-2" />
              My Listings
            </TabsTrigger>
          </TabsList>

          {/* Buying History Tab */}
          <TabsContent value="buying" className="space-y-6">
            {buyingHistory.length === 0 ? (
              <Card className="text-center py-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg rounded-2xl">
                <CardContent>
                  <TruckIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No purchases yet
                  </h3>
                  <p className="text-muted-foreground">
                    Start exploring products on Crailo to see your buying
                    history here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {buyingHistory.map((item) => (
                  <Card
                    key={Number(item.id)}
                    className="group hover:scale-[1.02] transition-all duration-500 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 shadow-lg hover:shadow-green-500/10 rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <Image
                            src={
                              item.metadata?.images?.[0] || "/placeholder.svg"
                            }
                            alt={item.metadata?.title || "Product Image"}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover border border-green-200 dark:border-green-800 relative z-10 group-hover:border-green-300 dark:group-hover:border-green-700 transition-colors duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {item.metadata?.title || "Untitled Product"}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                Sold by:{" "}
                                <span className="font-medium text-foreground">
                                  {item.metadata?.seller?.name ||
                                    "Unknown Seller"}
                                </span>
                              </p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ${formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(
                                getStatusFromNumber(item.status),
                                "buying"
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Ordered: {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3 mt-4">
                            <Button
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 rounded-xl"
                              disabled={item.status !== 1}
                            >
                              Release Escrow
                            </Button>
                            <Button
                              variant="outline"
                              className="border border-red-400/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 hover:border-red-500 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                              disabled={item.status === 2}
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
              <Card className="text-center py-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 shadow-lg rounded-2xl">
                <CardContent>
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No items listed
                  </h3>
                  <p className="text-muted-foreground">
                    Create your first listing to start selling on Crailo.
                  </p>
                  <Button className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 rounded-xl">
                    Create Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myListings.map((item) => (
                  <Card
                    key={Number(item.id)}
                    className="group hover:scale-[1.02] transition-all duration-500 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 shadow-lg hover:shadow-green-500/10 rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <Image
                            src={
                              item.metadata?.images?.[0] || "/placeholder.svg"
                            }
                            alt={item.metadata?.title || "Product Image"}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover border border-green-200 dark:border-green-800 relative z-10 group-hover:border-green-300 dark:group-hover:border-green-700 transition-colors duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {item.metadata?.title || "Untitled Product"}
                              </h3>
                              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                ${formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(
                                getStatusFromNumber(item.status),
                                "listing"
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Listed: {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-3 mt-4">
                            <Button
                              variant="outline"
                              className="border border-red-400/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 hover:border-red-500 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                              disabled={item.status >= 1}
                              onClick={removeListing(Number(item.id))}
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
      </div>
    </div>
  );
}
