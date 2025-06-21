import { useWriteContract, useReadContract } from "wagmi";
import { escrowABI, escrowAddress } from "@/app/abi";
import { Address } from "viem";

export function useCreateDispute() {
    const { writeContractAsync, isPending, isSuccess, isError, error, data } =
        useWriteContract();

    const createDispute = async ({
        listingId,
        buyer,
        seller,
        reason,
    }: {
        listingId: string; // or string if you prefer and convert it to BigInt
        buyer: string;
        seller: string;
        reason: string;
    }) => {
        return writeContractAsync({
            address: escrowAddress,
            abi: escrowABI,
            functionName: "createDispute",
            args: [listingId, buyer, seller, reason],
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
            address: escrowAddress,
            abi: escrowABI,
            functionName: "voteOnDispute",
            args: [disputeId, productValid],
        });
    };

    return { voteOnDispute, isPending, isSuccess, isError, error, data };
}

export function getActiveDisputes() {
    const { data, isLoading, isSuccess, isError, error } = useReadContract({
        address: escrowAddress,
        abi: escrowABI,
        functionName: "getActiveDisputes",
        args: [],
    });

    return { data, isLoading, isSuccess, isError, error };
}

// Hook returns functions for reading dispute data and checking validator vote
export function useDisputeDetails() {
    const getDispute = async (disputeId: string) => {
        return await useReadContract({
            address: escrowAddress,
            abi: escrowABI,
            functionName: "getDispute",
            args: [disputeId],
        }).data;
    };

    const hasValidatorVoted = async (disputeId: string, validator: string) => {
        return await useReadContract({
            address: escrowAddress,
            abi: escrowABI,
            functionName: "hasValidatorVoted",
            args: [disputeId, validator],
        }).data;
    };

    return { getDispute, hasValidatorVoted };
}
