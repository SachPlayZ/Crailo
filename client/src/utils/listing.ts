import { useWriteContract, useReadContract } from "wagmi";
import { escrowABI, escrowAddress } from "@/app/abi";
import { parseEther } from "viem";

export const useListing = () => {
  const { writeContractAsync } = useWriteContract();

  const {
    data: listings,
    refetch: refetchListings,
    status,
    isLoading,
    isError,
    error,
  } = useReadContract({
    address: escrowAddress,
    abi: escrowABI,
    functionName: "getListings",
    args: [],
  });

  const createListing = async (
    description: string,
    imageHash: string,
    price: string
  ) => {
    try {
      console.log("Creating a listing with description, imageHash, price: ", {
        description,
        imageHash,
        price,
      });
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "createListing",
        args: [description, imageHash, parseEther(price)],
        value: parseEther(price),
      });

      if (tx) {
        console.log("Successful Transaction", tx);
        return tx;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const cancelListing = async (listingId: number) => {
    try {
      console.log("Seller cancelling listing for propertyId:", listingId);
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "cancelListing",
        args: [listingId],
      });

      if (tx) {
        console.log("Successful Transaction", tx);
        return tx;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const commitToBuy = async (listingId: number) => {
    try {
      console.log("Buyer staking for objectId:", listingId);
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "commitToBuy",
        args: [listingId],
      });

      if (tx) {
        console.log("Successful Transaction", tx);
        return tx;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const confirmDelivery = async (listingId: number) => {
    try {
      console.log("Buyer confirms a deal with Id:", listingId);
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "confirmDelivery",
        args: [listingId],
      });

      if (tx) {
        console.log("Successful Transaction", tx);
        return tx;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  };

  const getListings = async () => {
    try {
      console.log("Getting all listings, current status:", status);

      // Trigger refetch to get latest data
      const result = await refetchListings();

      if (result.data) {
        console.log("Listings fetched successfully:", result.data);
        return result.data;
      }

      return listings || [];
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      throw error;
    }
  };

  return {
    createListing,
    cancelListing,
    commitToBuy,
    confirmDelivery,
    getListings,
    refetchListings,
  };
};
