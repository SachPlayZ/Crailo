"use client";

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, Clock, Edit3, Package, ShoppingBag, Trash2, TruckIcon, Upload } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUserHistory } from "@/utils/listing"
import { useAccount } from "wagmi"
import { useListing } from "@/utils/listing"
import { useCreateDispute } from "@/utils/Dispute"
import { PinataSDK } from "pinata"

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL!,
});

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

const getStatusFromNumber = (status: number) => {
    switch (status) {
        case 0:
            return "Active";
        case 1:
            return "Committed";
        case 2:
            return "Completed";
        case 3:
            return "Disputed";
        case 4:
            return "Cancelled";
        default:
            return "Unknown";
    }
}

const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
}

const formatPrice = (price: bigint) => {
    return Number(price) / 1e18; // Convert from wei to ETH
}

const disputeFormSchema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters long"),
    images: z.array(z.string()).max(5, "Maximum 5 images allowed"),
})

type DisputeFormValues = z.infer<typeof disputeFormSchema>

export default function CrailoDashboard() {
    const { address } = useAccount()
    const { historyListings, getUserHistoryData } = useUserHistory(address as string)
    const [activeTab, setActiveTab] = useState("buying")
    const [listings, setListings] = useState<Listing[]>([])
    const [disputeDialogOpen, setDisputeDialogOpen] = useState(false)
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
    const [disputeImages, setDisputeImages] = useState<string[]>([])
    const { createDispute } = useCreateDispute()

    const form = useForm<DisputeFormValues>({
        resolver: zodResolver(disputeFormSchema as any),
        defaultValues: {
            reason: "",
            images: [],
        },
    })

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

    const buyingHistory = listings.filter(item => item.buyer.toLowerCase() === (address as string)?.toLowerCase());
    const myListings = listings.filter(item => item.seller.toLowerCase() === (address as string)?.toLowerCase());

    const disputeCount = listings.filter(item => item.status === 2).length;

    const { cancelListing } = useListing()

    const removeListing = (id: number) => async () => {
        try {
            await cancelListing(id);
            // Optionally, refetch listings or update state to reflect removal
            console.log(`Listing ${id} removed successfully`);
        } catch (error) {
            console.error("Error removing listing:", error);
        }
    }

    const openDisputeDialog = (listing: Listing) => {
        setSelectedListing(listing);
        setDisputeDialogOpen(true);
    };

    const closeDisputeDialog = () => {
        setDisputeDialogOpen(false);
        setSelectedListing(null);
        setDisputeImages([]);
        form.reset();
    };

    const handleDisputeClick = (listing: Listing) => {
        setSelectedListing(listing)
        setDisputeDialogOpen(true)
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        const imageUrls: string[] = [];

        // Upload each image to IPFS
        for (const file of Array.from(files)) {
            try {
                const upload = await pinata.upload.public.file(file);
                const response = upload as any;
                const ipfsHash = response.cid || (response.data && response.data.IpfsHash);

                if (ipfsHash) {
                    const ipfsUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;
                    imageUrls.push(ipfsUrl);
                }
            } catch (error) {
                console.error("Error uploading image to IPFS:", error);
            }
        }

        setDisputeImages((prev) => {
            const updated = [...prev, ...imageUrls];
            return updated.slice(0, 5); // Limit to 5 images
        });
    }

    const onDisputeSubmit = async (values: DisputeFormValues) => {
        if (!selectedListing) return

        try {
            // Create dispute evidence JSON
            const disputeEvidence = {
                reason: values.reason,
                images: disputeImages,
                timestamp: new Date().toISOString()
            };

            // Convert to JSON string
            const jsonString = JSON.stringify(disputeEvidence);
            
            // Create a Blob from the JSON string
            const blob = new Blob([jsonString], { type: 'application/json' });
            const file = new File([blob], 'dispute-evidence.json');

            // Upload JSON to IPFS
            const upload = await pinata.upload.public.file(file);
            const response = upload as any;
            const ipfsHash = response.cid || (response.data && response.data.IpfsHash);

            if (!ipfsHash) {
                throw new Error('Failed to upload evidence to IPFS');
            }

            // Create the dispute with the IPFS hash of the JSON
            await createDispute({
                listingId: Number(selectedListing.id),
                buyer: address as string,
                seller: selectedListing.seller,
                reason: values.reason,
                imageHash: `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`
            });

            setDisputeDialogOpen(false);
            setSelectedListing(null);
            setDisputeImages([]);
            form.reset();
            await handleHistoryClick(); // Refresh the listings
        } catch (error) {
            console.error("Error creating dispute:", error);
        }
    }

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
                {/* Dialog for raising dispute */}
                <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-xl border border-gray-700/50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Raise a Dispute
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Please provide details about your dispute. Add up to 5 images as evidence.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onDisputeSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white">Reason for Dispute</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Please explain your reason for raising this dispute..."
                                                    className="bg-gray-800/50 border-gray-700/50 text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-4">
                                    <FormLabel className="text-white">Evidence Images</FormLabel>
                                    <div className="grid grid-cols-5 gap-4">
                                        {disputeImages.map((image, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={image}
                                                    alt={`Evidence ${index + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover border border-gray-700/50"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={() => {
                                                        setDisputeImages((prev) => prev.filter((_, i) => i !== index))
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {disputeImages.length < 5 && (
                                            <label className="cursor-pointer flex items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-gray-700/50 hover:border-green-500/50 transition-colors">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    multiple={true}
                                                />
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {5 - disputeImages.length} image slots remaining
                                    </p>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setDisputeDialogOpen(false)}
                                        className="border border-gray-700/50 text-gray-300 hover:bg-gray-800/50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600"
                                    >
                                        Submit Dispute
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

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
                                        key={Number(item.id)}
                                        className="group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-600/50 hover:border-green-400/50 shadow-2xl hover:shadow-green-400/10 rounded-2xl overflow-hidden"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    <Image
                                                        src={item.metadata?.images[0] || "/placeholder.svg"}
                                                        alt={item.metadata?.title || "Product Image"}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-xl object-cover border border-gray-600/50 relative z-10 group-hover:border-green-400/50 transition-colors duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                                                                {item.metadata?.title || "Untitled Product"}
                                                            </h3>
                                                            <p className="text-sm text-gray-400 mb-2">
                                                                Sold by: <span className="font-medium text-gray-300">{item.metadata?.seller.name || "Unknown Seller"}</span>
                                                            </p>
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                                                ${formatPrice(item.price)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            {getStatusBadge(getStatusFromNumber(item.status), "buying")}
                                                            <p className="text-xs text-gray-500 mt-2">Ordered: {formatDate(item.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 mt-4">
                                                        <Button
                                                            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/25 rounded-xl"
                                                            disabled={item.status !== 1}
                                                        >
                                                            Release Escrow
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            className="border border-red-400/50 text-red-400 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
                                                            disabled={item.status === 2}
                                                            onClick={() => handleDisputeClick(item)}
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
                                        key={Number(item.id)}
                                        className="group hover:scale-[1.02] transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-600/50 hover:border-green-400/50 shadow-2xl hover:shadow-green-400/10 rounded-2xl overflow-hidden"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                    <Image
                                                        src={item.metadata?.images[0] || "/placeholder.svg"}
                                                        alt={item.metadata?.title || "Product Image"}
                                                        width={80}
                                                        height={80}
                                                        className="rounded-xl object-cover border border-gray-600/50 relative z-10 group-hover:border-green-400/50 transition-colors duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                                                                {item.metadata?.title || "Untitled Product"}
                                                            </h3>
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                                                                ${formatPrice(item.price)}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            {getStatusBadge(getStatusFromNumber(item.status), "listing")}
                                                            <p className="text-xs text-gray-500 mt-2">Listed: {formatDate(item.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            className="border border-red-400/50 text-red-400 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400 transition-all duration-300 bg-transparent backdrop-blur-sm rounded-xl hover:scale-105"
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
            </main>
        </div>
    )
}
