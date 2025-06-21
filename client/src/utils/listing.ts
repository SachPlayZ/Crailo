import { useWriteContract } from "wagmi";
import { escrowABI, escrowAddress } from "@/app/abi";
import { parseEther } from "viem";

export const useListing = () => {
  const { writeContractAsync } = useWriteContract();

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
        args: [
          description,
          imageHash,
          parseEther(price),
        ],
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

  return { createListing, cancelListing };
};
