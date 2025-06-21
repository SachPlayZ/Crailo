import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "@/app/abi";
import { parseEther } from "viem";

export const useListing = () => {
  const { writeContractAsync } = useWriteContract();

  const createListing = async (
    description: string,
    imageHash: string,
    price: string
  ) => {
    try {
      console.log(description, imageHash, price);
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "createListing",
        args: [
          "iPhone 13 Pro Max, 256GB, Excellent condition",
          "QmXyZ123AbC456DeF789",
          parseEther("0.001"),
        ],
        value: parseEther("0.0001"),
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

  return { createListing };
};
