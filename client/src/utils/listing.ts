import { useWriteContract, useReadContract } from "wagmi";
import { escrowABI, escrowAddress } from "@/app/abi";
import { parseEther } from "viem";
import { useState } from "react";

export const useListing = () => {
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const [list, setList] = useState([]);
  const {
    data: listings,
    refetch: refetchListings,
    status,
    isLoading: isReadLoading,
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
      const toStake = parseFloat(price) * 0.1;
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "createListing",
        args: [description, imageHash, parseEther(price)],
        value: parseEther(toStake.toString()),
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

  const commitToBuy = async (listingId: number, price: string) => {
    try {
      console.log("Buyer staking for objectId:", listingId);
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "commitToBuy",
        args: [listingId],
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
    isWritePending,
    isReadLoading,
    isError,
    error,
  };
};

export const useUserHistory = (userAddress: string) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchUserHistory,
  } = useReadContract({
    address: escrowAddress,
    abi: escrowABI,
    functionName: "getUserHistory",
    args: [userAddress],
  });

  const getUserHistoryData = async () => {
    try {
      console.log("Getting user history for address:", userAddress);
      const result = await refetchUserHistory();
      if (result.data) {
        console.log("User history fetched successfully:", result.data);
        return result.data;
      }
      return data || [];
    } catch (error) {
      console.error("Failed to fetch user history:", error);
      throw error;
    }
  };

  return {
    historyListings: data,
    isLoading,
    refetchUserHistory,
    getUserHistoryData,
  };
};

export const getListingData = (uid: number) => {
  const { data: productData, refetch: refetchProduct } = useReadContract({
    abi: escrowABI,
    address: escrowAddress,
    functionName: "getListing",
    args: [uid],
  });

  return {
    productData,
    refetchProduct,
  };
};
