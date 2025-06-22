import {
  escrowABI,
  escrowAddress,
  validatorABI,
  validatorAddress,
} from "@/app/abi";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

export const useVote = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const voteYes = async (proposalId: number) => {
    try {
      const tx = await writeContractAsync({
        address: validatorAddress,
        abi: validatorABI,
        functionName: "voteYes",
        args: [proposalId],
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
  const voteNo = async (proposalId: number) => {
    try {
      const tx = await writeContractAsync({
        address: validatorAddress,
        abi: validatorABI,
        functionName: "voteNo",
        args: [proposalId],
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

  return { voteYes, voteNo, isPending };
};

export const useStatus = () => {
  const {
    data: status,
    refetch: refetchStatus,
    isLoading: isStatusLoading,
    isError,
    error,
  } = useReadContract({
    address: validatorAddress,
    abi: validatorABI,
    functionName: "getProductStatus",
    args: [],
  });
  return { status, refetchStatus, isStatusLoading, isError, error };
};

export const useReleaseFunds = () => {
  const { writeContractAsync } = useWriteContract();
  const release = async (listingId: number, productValid: boolean) => {
    try {
      const tx = await writeContractAsync({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "resolveDisputeCallback",
        args: [listingId, productValid],
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
};
