"use client";

import React, { useEffect } from "react";
import {
  X,
  DollarSign,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { useListing } from "@/utils/listing";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  listing,
  onConfirmDeposit,
}) => {
  const { commitToBuy, isWritePending: isCommitToBuyPending } = useListing();

  const handleDeposit = async () => {
    try {
      await commitToBuy(Number(listing.id), listing.price.toString());
      console.log("depositing");
      console.log("listing", listing);
      onConfirmDeposit();
    } catch (error) {
      console.error("Error committing to buy:", error);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Recently";
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[80vw] max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-green-200 dark:border-green-800 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {listing.title}
            </h2>
            <p className="text-muted-foreground mt-1">
              Review the listing details and confirm your escrow deposit
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Escrow Protection Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-b border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                Escrow Protection Active
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your funds will be held securely in our smart contract until you
                confirm receipt of the item.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row overflow-hidden">
          {/* Left side - Image Carousel */}
          <div className="lg:w-1/2 bg-white dark:bg-zinc-900 flex items-center justify-center p-6">
            <div className="w-4/5">
              <Carousel
                images={listing.images}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Right side - Details */}
          <div className="lg:w-1/2 p-6 overflow-y-auto custom-scrollbar space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Listing Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Listing Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">
                    Listed on: {formatDate(listing.createdAt)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{listing.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">
                    Status: {listing.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 dark:border-green-800"
                  >
                    {listing.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 dark:border-green-800"
                  >
                    {listing.condition}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Seller Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Seller Details
              </h3>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">
                    {listing.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {listing.seller.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="px-6 py-4 border-t border-green-200 dark:border-green-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCommitToBuyPending}
              className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/50 px-6 py-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isCommitToBuyPending}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg shadow-green-500/10 hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCommitToBuyPending && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              {isCommitToBuyPending
                ? "Processing..."
                : `Send Deposit - ${listing.price.toFixed(5)} CORE`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
