import { useWriteContract, useReadContract } from "wagmi";
import { disputeABI, disputeAddress } from "@/app/abi";

export function useCreateDispute() {
  const { writeContractAsync, isPending, isSuccess, isError, error, data } =
    useWriteContract();

  const createDispute = async ({
    listingId,
    buyer,
    imageHash,
    seller,
    reason,
  }: {
    listingId: string;
    buyer: string;
    imageHash: string;
    seller: string;
    reason: string;
  }) => {
    return writeContractAsync({
      address: disputeAddress,
      abi: disputeABI,
      functionName: "createDispute",
      args: [listingId, buyer, imageHash, seller, reason],
    });
  };

  return { createDispute, isPending, isSuccess, isError, error, data };
}

export function useVoteOnDispute() {
  const { writeContractAsync, isPending, isSuccess, isError, error, data } =
    useWriteContract();

  const voteOnDispute = async ({
    disputeId,
    productValid,
  }: {
    disputeId: string;
    productValid: string;
  }) => {
    return writeContractAsync({
      address: disputeAddress,
      abi: disputeABI,
      functionName: "voteOnDispute",
      args: [disputeId, productValid],
    });
  };

  return { voteOnDispute, isPending, isSuccess, isError, error, data };
}

export function getActiveDisputes() {
  const { data, isLoading, isSuccess, isError, error } = useReadContract({
    address: disputeAddress,
    abi: disputeABI,
    functionName: "getActiveDisputes",
    args: [],
  });

  return { data, isLoading, isSuccess, isError, error };
}

// Hook returns functions for reading dispute data and checking validator vote
export function useDisputeDetails() {
  const getDispute = async (disputeId: string) => {
    return await useReadContract({
      address: disputeAddress,
      abi: disputeABI,
      functionName: "getDispute",
      args: [disputeId],
    }).data;
  };

  const hasValidatorVoted = async (disputeId: string, validator: string) => {
    return await useReadContract({
      address: disputeAddress,
      abi: disputeABI,
      functionName: "hasValidatorVoted",
      args: [disputeId, validator],
    }).data;
  };

  return { getDispute, hasValidatorVoted };
}
