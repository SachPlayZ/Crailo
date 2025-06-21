"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Carousel } from "@/components/ui/carousel";
import ListItemDialog from "./ListItemDialog";
import CustomModal from "./CustomModal";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useListing } from "@/utils/listing";

// Helper function to fetch IPFS data
const fetchIPFSData = async (ipfsHash: string) => {
  try {
    const response = await fetch(ipfsHash);
    if (!response.ok) throw new Error('Failed to fetch IPFS data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching IPFS data:', error);
    return null;
  }
};

interface Listing {
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

const ShowListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  const { getListings } = useListing();

  useEffect(() => {
    const fetchListings = async () => {
      const fetchedListings = await getListings() as any[];
      
      // Fetch IPFS data for each listing
      const listingsWithData = await Promise.all(
        (fetchedListings ?? []).map(async (listing: any) => {
          if (listing.imageHash) {
            const ipfsData = await fetchIPFSData(listing.imageHash || listing.ipfsHash);
            if (ipfsData) {
              return {
                ...ipfsData,
                id: listing.id, // Preserve any additional blockchain data
                ipfsHash: listing.ipfsHash
              };
            }
          }
          return listing;
        })
      );

      setListings(listingsWithData as Listing[]);
    };

    fetchListings();
  }, [getListings]);

  console.log("Fetched Listings:", listings);
  const categories = [
    { id: "all", name: "All Items", icon: "📦" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "home", name: "Home & Garden", icon: "🏠" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Books", icon: "📚" },
  ];

  const sampleListings: Listing[] = [
    {
      title: "MacBook Pro 2023 - M2 Chip",
      description:
        "Excellent condition, barely used. Comes with original box and charger.",
      price: 1200,
      location: "San Francisco, CA",
      seller: {
        name: "Alex Chen",
        address: "0x0000...",
      },
      images: [
        "https://ipfs.io/ipfs/bafkreidw724vbzcbq4q3srdgqnfy5badkivgouvqe6b4tbdv2hovcgaodq",
        "https://ipfs.io/ipfs/bafkreigz4zv6szfpv5za4funfzvcl3maw4i6wbcjzc3cmwqbp5itsptsee",
      ],
      category: "electronics",
      condition: "Like New",
      escrowAmount: 120,
    },
    {
      title: "Nike Air Jordan 1 Retro",
      description: "Limited edition, size 10.5. Perfect for collectors.",
      price: 350,
      location: "Not Specified",
      seller: {
        name: "Anonymous",
        address: "0x0000...",
      },
      images: [
        "https://ipfs.io/ipfs/bafkreidw724vbzcbq4q3srdgqnfy5badkivgouvqe6b4tbdv2hovcgaodq",
        "https://ipfs.io/ipfs/bafkreigz4zv6szfpv5za4funfzvcl3maw4i6wbcjzc3cmwqbp5itsptsee",
      ],
      category: "fashion",
      condition: "Not Specified",
      escrowAmount: 35,
    },
    {
      title: "Gaming PC Setup - RTX 4070",
      description: "High-end gaming rig with 32GB RAM, 1TB SSD. Ready to game!",
      price: 1800,
      location: "Not Specified",
      seller: {
        name: "Anonymous",
        address: "0x0000...",
      },
      images: [
        "https://ipfs.io/ipfs/bafkreidw724vbzcbq4q3srdgqnfy5badkivgouvqe6b4tbdv2hovcgaodq",
        "https://ipfs.io/ipfs/bafkreigz4zv6szfpv5za4funfzvcl3maw4i6wbcjzc3cmwqbp5itsptsee",
      ],
      category: "electronics",
      condition: "Not Specified",
      escrowAmount: 180,
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConfirmDeposit = async () => {
    // TODO: Implement the smart contract interaction for escrow deposit
    console.log("Confirming deposit for listing:", selectedListing);
    setIsDetailsModalOpen(false);
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Browse Listings
              </h1>
              <p className="text-muted-foreground">
                Discover verified items from trusted sellers with escrow
                protection
              </p>
            </div>

            {/* List Your Item Button with Dialog */}
            <ListItemDialog>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-3 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                List Your Item
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                {/* Enhanced animated border trail */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  </div>
                </div>
                {/* Enhanced trail effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                {/* Additional glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-300 via-emerald-300 to-green-300 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Button>
            </ListItemDialog>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-200 hover:scale-105 ${selectedCategory === category.id
                    ? "bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg"
                    : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm"
                  }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Search className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No items found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card
                key={listing.title}
                className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-lg hover:shadow-green-500/10 flex flex-col h-full"
              >
                <CardHeader className="pb-4 flex-shrink-0">
                  {listing.images && listing.images.length > 0 && (
                    <Carousel images={listing.images} className="mb-4" />
                  )}

                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                      {listing.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 shadow-sm"
                    >
                      ${listing.price}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Recently Listed</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                  <div className="space-y-3">
                    {/* Seller Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {listing.seller.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {listing.seller.name}
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                              {listing.seller.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs shadow-sm">
                          {listing.condition}
                        </Badge>
                        <Badge variant="outline" className="text-xs shadow-sm">
                          {listing.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <DollarSign className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {listing.escrowAmount} escrow
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => {
                        setSelectedListing(listing);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <CustomModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          listing={selectedListing}
          onConfirmDeposit={handleConfirmDeposit}
        />
      )}
    </div>
  );
};

export default ShowListingsPage;
