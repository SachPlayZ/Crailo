import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import {
    Clock,
    MapPin,
    Shield,
    DollarSign,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

interface ListingDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    listing: {
        id?: number;
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
        createdAt?: number;
        status?: string;
    };
    onConfirmDeposit: () => void;
}

const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
    isOpen,
    onOpenChange,
    listing,
    onConfirmDeposit,
}) => {
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "Recently";
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-green-200 dark:border-green-800 rounded-lg shadow-xl">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {listing.title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Review the listing details and confirm your escrow deposit
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-6 px-6 pb-6 overflow-hidden flex-1">
                        {/* Left side - Image Carousel */}
                        <div className="md:w-1/2 max-h-[400px] md:max-h-none rounded-lg overflow-hidden border border-green-200 dark:border-green-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Carousel
                                images={listing.images}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* Right side - Details */}
                        <div className="md:w-1/2 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{listing.description}</p>
                            </div>

                            {/* Listing Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Listing Info</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span>Listed on: {formatDate(listing.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        <span>{listing.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                        <span>Status: {listing.status || "Active"}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800">
                                            {listing.category}
                                        </Badge>
                                        <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800">
                                            {listing.condition}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Seller Details</h3>
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-green-600">
                                            {listing.seller.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{listing.seller.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {listing.seller.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Price Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Item Price:</span>
                                        <Badge variant="outline" className="text-lg font-mono">
                                            ${listing.price.toFixed(2)}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                                        <span className="font-medium">Total:</span>
                                        <Badge className="text-lg bg-green-600 hover:bg-green-700 font-mono">
                                            ${(listing.price).toFixed(5)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Escrow Protection */}
                            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <h4 className="font-semibold flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    Escrow Protection
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Your funds will be held securely in our smart contract until you confirm
                                    receipt of the item. This protects both buyers and sellers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-green-200 dark:border-green-800 bg-gray-50 dark:bg-gray-900/50">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-green-200 dark:border-green-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirmDeposit}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 shadow-lg shadow-green-500/10"
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Confirm & Deposit Escrow
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ListingDetailsModal;