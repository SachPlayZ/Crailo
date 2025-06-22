"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { VoteConfirmationModal } from "./vote-confirmation-modal";
import { cn } from "@/lib/utils";
import { getDisputesArr } from "@/utils/Dispute";
import { useReadContract } from "wagmi";
import { escrowABI, escrowAddress } from "@/app/abi";
import useEmblaCarousel from "embla-carousel-react";

// Image Modal Component
const ImageModal = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Product image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageCarousel = ({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-72 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <img
                src={image || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                className="w-full h-72 object-cover rounded-lg border border-green-200 dark:border-green-800 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImageClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

interface DisputeMetadata {
  reason: string;
  images: string[];
  timestamp: string;
}

interface ProductMetadata {
  title: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    address: string;
  };
}

interface TransformedDispute {
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
}

export function DisputeCard() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingVote, setPendingVote] = useState<"valid" | "misleading" | null>(
    null
  );
  const [transformedData, setTransformedData] = useState<TransformedDispute[]>(
    []
  );

  // Image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { activeDisputeDetails } = getDisputesArr();

  // If we have active disputes, get the first listing ID to test
  const firstListingId =
    activeDisputeDetails &&
    Array.isArray(activeDisputeDetails) &&
    activeDisputeDetails[0]
      ? Number(activeDisputeDetails[0].listingId)
      : 0;

  // Use a single hook call for testing
  type ProductDataType = [
    bigint,
    string,
    string,
    string,
    boolean,
    bigint,
    bigint
  ];

  const { data: productData } = useReadContract<
    typeof escrowABI,
    "getListing",
    ProductDataType
  >({
    abi: escrowABI,
    address: escrowAddress,
    functionName: "getListing",
    args: [firstListingId],
    // enabled: firstListingId > 0,
  }) as { data: ProductDataType | undefined };

  useEffect(() => {
    const fetchAndTransformData = async () => {
      if (
        !activeDisputeDetails ||
        !Array.isArray(activeDisputeDetails) ||
        !productData
      ) {
        console.log("No active disputes or product data");
        return;
      }

      try {
        // For now, just transform the first dispute as a test
        const disputeDetails = activeDisputeDetails[0];

        // Fetch dispute metadata from IPFS
        const disputeMetadataResponse = await fetch(disputeDetails.imageHash);
        const disputeMetadata: DisputeMetadata =
          await disputeMetadataResponse.json();

        // Fetch product metadata from IPFS
        const productMetadataResponse = await fetch(productData?.[3] ?? "");
        const productMetadata: ProductMetadata =
          await productMetadataResponse.json();

        const statusMap = {
          0: "pending",
          1: "voted",
          2: "resolved",
        } as const;

        const transformedDispute: TransformedDispute = {
          id: disputeDetails.id.toString(),
          productName: productMetadata.title,
          productImage: productMetadata.images[0],
          sellerAddress: disputeDetails.seller,
          buyerAddress: disputeDetails.buyer,
          originalImages: productMetadata.images,
          receivedImages: disputeMetadata.images,
          descriptionMismatch: disputeDetails.reason,
          timeAgo: disputeMetadata.timestamp,
          status: statusMap[disputeDetails.status as keyof typeof statusMap],
          userVote: undefined,
        };

        setTransformedData([transformedDispute]);
        console.log("Transformed dispute:", transformedDispute);
      } catch (error) {
        console.error("Error transforming dispute data:", error);
      }
    };

    fetchAndTransformData();
  }, [activeDisputeDetails, productData]);

  const handleVoteClick = (voteType: "valid" | "misleading") => {
    setPendingVote(voteType);
    setShowConfirmation(true);
  };

  const handleConfirmVote = () => {
    setShowConfirmation(false);
    setPendingVote(null);
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    setPendingVote(null);
  };

  // Image modal handlers
  const handleImageClick = (images: string[], index: number) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setImageModalOpen(true);
  };

  const handleModalClose = () => {
    setImageModalOpen(false);
    setModalImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  if (transformedData.length === 0) {
    return <div>Loading disputes...</div>;
  }

  return (
    <div className="space-y-4">
      {transformedData.map((dispute) => (
        <Card
          key={dispute.id}
          className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
        >
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
                    {new Date(dispute.timeAgo).toLocaleString()}
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
              </div>
            </div>

            {/* Wallet Addresses */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Seller</p>
                <p className="text-sm text-foreground font-mono">
                  {dispute.sellerAddress.slice(0, 6) +
                    "..." +
                    dispute.sellerAddress.slice(-5)}
                </p>
              </div>
              <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Buyer</p>
                <p className="text-sm text-foreground font-mono">
                  {dispute.buyerAddress.slice(0, 6) +
                    "..." +
                    dispute.buyerAddress.slice(-5)}
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
                    Original Listing
                  </p>
                  <ImageCarousel
                    images={dispute.originalImages}
                    onImageClick={(index) => {
                      handleImageClick(dispute.originalImages, index);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Received Product
                  </p>
                  <ImageCarousel
                    images={dispute.receivedImages}
                    onImageClick={(index) => {
                      handleImageClick(dispute.receivedImages, index);
                    }}
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
            {dispute.status === "pending" && (
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
      ))}

      <VoteConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmVote}
        voteType={pendingVote}
        productName={transformedData[0]?.productName || ""}
        disputeId={transformedData[0]?.id || ""}
      />

      <ImageModal
        isOpen={imageModalOpen}
        onClose={handleModalClose}
        images={modalImages}
        currentIndex={currentImageIndex}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
}
