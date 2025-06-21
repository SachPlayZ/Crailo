"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { VoteConfirmationModal } from "./vote-confirmation-modal";
import { cn } from "@/lib/utils";

interface DisputeCardProps {
  dispute: {
    id: string;
    productName: string;
    productImage: string;
    sellerAddress: string;
    buyerAddress: string;
    originalImages: string[];
    receivedImages: string[];
    descriptionMismatch: string;
    timeAgo: string;
    status: "pending" | "voted" | "resolved";
    userVote?: "valid" | "misleading";
  };
}

export function DisputeCard({ dispute }: DisputeCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<"valid" | "misleading" | null>(null);
  const [userVote, setUserVote] = useState(dispute.userVote);
  const [originalImageIndex, setOriginalImageIndex] = useState(0);
  const [receivedImageIndex, setReceivedImageIndex] = useState(0);

  const handleVoteClick = (voteType: "valid" | "misleading") => {
    setPendingVote(voteType);
    setShowConfirmation(true);
  };

  const handleConfirmVote = () => {
    setUserVote(pendingVote as "valid" | "misleading");
    setShowConfirmation(false);
    setPendingVote(null);
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    setPendingVote(null);
  };

  const nextOriginalImage = () => {
    setOriginalImageIndex((prev) =>
      prev + 1 >= dispute.originalImages.length ? 0 : prev + 1
    );
  };

  const prevOriginalImage = () => {
    setOriginalImageIndex((prev) =>
      prev - 1 < 0 ? dispute.originalImages.length - 1 : prev - 1
    );
  };

  const nextReceivedImage = () => {
    setReceivedImageIndex((prev) =>
      prev + 1 >= dispute.receivedImages.length ? 0 : prev + 1
    );
  };

  const prevReceivedImage = () => {
    setReceivedImageIndex((prev) =>
      prev - 1 < 0 ? dispute.receivedImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={dispute.productImage || "/placeholder.svg"}
                alt={dispute.productName}
                className="w-12 h-12 rounded-lg object-cover border border-green-200 dark:border-green-800"
              />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {dispute.productName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dispute.timeAgo}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-2 py-1",
                  dispute.status === "pending" &&
                  "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
                  dispute.status === "voted" &&
                  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
                  dispute.status === "resolved" &&
                  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                )}
              >
                {dispute.status === "pending" && (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {dispute.status === "voted" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {dispute.status === "resolved" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {dispute.status.charAt(0).toUpperCase() +
                  dispute.status.slice(1)}
              </Badge>
              {userVote && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-1",
                    userVote === "valid"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                  )}
                >
                  Your Vote: {userVote === "valid" ? "Valid" : "Misleading"}
                </Badge>
              )}
            </div>
          </div>

          {/* Wallet Addresses */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Seller</p>
              <p className="text-sm text-foreground font-mono">
                {dispute.sellerAddress}
              </p>
            </div>
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Buyer</p>
              <p className="text-sm text-foreground font-mono">
                {dispute.buyerAddress}
              </p>
            </div>
          </div>

          {/* Image Comparison */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Product Comparison
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Original Listing ({originalImageIndex + 1}/{dispute.originalImages.length})
                </p>
                <div className="relative group">
                  <img
                    src={dispute.originalImages[originalImageIndex] || "/placeholder.svg"}
                    alt={`Original listing ${originalImageIndex + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-green-200 dark:border-green-800"
                  />
                  {dispute.originalImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
                        onClick={prevOriginalImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
                        onClick={nextOriginalImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Received Product ({receivedImageIndex + 1}/{dispute.receivedImages.length})
                </p>
                <div className="relative group">
                  <img
                    src={dispute.receivedImages[receivedImageIndex] || "/placeholder.svg"}
                    alt={`Received product ${receivedImageIndex + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-green-200 dark:border-green-800"
                  />
                  {dispute.receivedImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
                        onClick={prevReceivedImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1"
                        onClick={nextReceivedImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Mismatch */}
          {dispute.descriptionMismatch && (
            <div className="mb-6 bg-red-50/50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <p className="text-xs text-muted-foreground mb-1">
                Description Mismatch
              </p>
              <p className="text-sm text-foreground">
                {dispute.descriptionMismatch}
              </p>
            </div>
          )}

          {/* Voting Buttons */}
          {dispute.status === "pending" && !userVote && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleVoteClick("valid")}
                className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                variant="outline"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Product is Valid
              </Button>
              <Button
                onClick={() => handleVoteClick("misleading")}
                className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                variant="outline"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Product is Misleading
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <VoteConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmVote}
        voteType={pendingVote}
        productName={dispute.productName}
      />
    </>
  );
}
