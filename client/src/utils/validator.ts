import { validatorABI, validatorAddress } from "@/app/abi";
import { parseEther } from "viem";
import { useReadContract, useWriteContract } from "wagmi";

export const useValidatorAdd = () => {
  const { writeContractAsync } = useWriteContract();

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

  return { addValidator };
};

export const useValidatorRemove = () => {
  const { writeContractAsync } = useWriteContract();

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

  return { removeValidator };
};

export const useStakeValidator = () => {
  const { writeContractAsync } = useWriteContract();

  const stakeAsValidator = async (userAddress: `0x${string}`) => {
    try {
      const tx = await writeContractAsync({
        address: userAddress,
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

  return { stakeAsValidator, unstakeValidator };
};

export const useValidatorGet = async (userAddress: string) => {
  const { data: validatorInfo, refetch: refetchValidatorInfo } =
    useReadContract({
      address: validatorAddress,
      abi: validatorABI,
      functionName: "getValidatorInfo",
      args: [userAddress],
    });

  return {
    validatorInfo,
    refetchValidatorInfo,
  };
};
