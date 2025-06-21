import { validatorABI, validatorAddress } from "@/app/abi";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

export const useValidatorAdd = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const addValidator = async (userAddress: `0x${string}`) => {
    try {
      console.log(validatorAddress);
      const tx = await writeContractAsync({
        address: validatorAddress,
        abi: validatorABI,
        functionName: "addValidator",
        args: [userAddress],
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

  return { addValidator, isPending };
};

export const useValidatorRemove = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const removeValidator = async (userAddress: `0x${string}`) => {
    try {
      console.log(validatorAddress);
      const tx = await writeContractAsync({
        address: validatorAddress,
        abi: validatorABI,
        functionName: "removeValidator",
        args: [userAddress],
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

  return { removeValidator, isPending };
};

export const useStakeValidator = () => {
  const { writeContractAsync, isPending } = useWriteContract();

  const stakeAsValidator = async () => {
    try {
      const tx = await writeContractAsync({
        address: validatorAddress as `0x${string}`,
        abi: validatorABI,
        functionName: "stakeAsValidator",
        args: [],
        value: parseEther("0.002"),
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

  const unstakeValidator = async () => {
    try {
      const tx = await writeContractAsync({
        address: validatorAddress,
        abi: validatorABI,
        functionName: "unstakeValidator",
        args: [],
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

  return { stakeAsValidator, unstakeValidator, isPending };
};

export const useValidatorGet = (userAddress: string) => {
  const { data: validatorInfo, refetch: refetchValidatorInfo, isLoading } =
    useReadContract({
      address: validatorAddress,
      abi: validatorABI,
      functionName: "getValidatorInfo",
      args: [userAddress],
    });

  return {
    validatorInfo,
    refetchValidatorInfo,
    isLoading,
  };
};
