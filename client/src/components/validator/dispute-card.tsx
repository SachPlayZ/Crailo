"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { VoteConfirmationModal } from "./vote-confirmation-modal";
import { cn } from "@/lib/utils";
import { useVoteOnDispute } from "@/utils/Dispute";

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
  const [pendingVote, setPendingVote] = useState<"valid" | "misleading" | null>(
    null
  );
  const [userVote, setUserVote] = useState(dispute.userVote);
  const [originalImageIndex, setOriginalImageIndex] = useState(0);
  const [receivedImageIndex, setReceivedImageIndex] = useState(0);

  const { voteOnDispute, isPending: isVotePending } = useVoteOnDispute();

  const handleVoteClick = (voteType: "valid" | "misleading") => {
    setPendingVote(voteType);
    setShowConfirmation(true);
  };

  const handleConfirmVote = async () => {
    try {
      await voteOnDispute({
        disputeId: dispute.id,
        productValid: pendingVote === "valid" ? "true" : "false",
      });
      setUserVote(pendingVote as "valid" | "misleading");
      setShowConfirmation(false);
      setPendingVote(null);
    } catch (error) {
      console.error("Error voting on dispute:", error);
      setShowConfirmation(false);
      setPendingVote(null);
    }
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

  const getStatusBadge = () => {
    switch (dispute.status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "voted":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Voted
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={dispute.productImage}
                  alt={dispute.productName}
                  className="w-12 h-12 rounded-lg object-cover border border-green-200 dark:border-green-800"
                />
                {dispute.status === "voted" && userVote && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border-2 border-green-200 dark:border-green-800 flex items-center justify-center">
                    {userVote === "valid" ? (
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                )}
              </div>
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
              {getStatusBadge()}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Seller</p>
              <p className="text-sm font-mono text-foreground">
                {dispute.sellerAddress}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Buyer</p>
              <p className="text-sm font-mono text-foreground">
                {dispute.buyerAddress}
              </p>
            </div>
          </div>

          {/* Image Comparison */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Original Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  Original Listing
                </h4>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevOriginalImage}
                    disabled={dispute.originalImages.length <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {originalImageIndex + 1} / {dispute.originalImages.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextOriginalImage}
                    disabled={dispute.originalImages.length <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-green-200 dark:border-green-800">
                <img
                  src={dispute.originalImages[originalImageIndex]}
                  alt="Original listing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Received Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">
                  Received Item
                </h4>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevReceivedImage}
                    disabled={dispute.receivedImages.length <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {receivedImageIndex + 1} / {dispute.receivedImages.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextReceivedImage}
                    disabled={dispute.receivedImages.length <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-green-200 dark:border-green-800">
                <img
                  src={dispute.receivedImages[receivedImageIndex]}
                  alt="Received item"
                  className="w-full h-full object-cover"
                />
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
                disabled={isVotePending}
              >
                {isVotePending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                <CheckCircle className="w-4 h-4 mr-2" />
                Product is Valid
              </Button>
              <Button
                onClick={() => handleVoteClick("misleading")}
                className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
                variant="outline"
                disabled={isVotePending}
              >
                {isVotePending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
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
        disputeId={dispute.id}
      />
    </>
  );
}
