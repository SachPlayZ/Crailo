import { contractAddress, contractABI } from "@/app/abi";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";

export const useValidatorAdd = () => {
  const { writeContractAsync } = useWriteContract();

  const addValidator = async (validatorAddress: string) => {
    try {
      console.log(validatorAddress);
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "addValidator",
        args: ["0x76b229Dd94DbEACC381Bc1D33a18Db7Bdb019f1e"],
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

  const removeValidator = async (validatorAddress: string) => {
    try {
      console.log(validatorAddress);
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "removeValidator",
        args: ["0x76b229Dd94DbEACC381Bc1D33a18Db7Bdb019f1e"],
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

  const stakeAsValidator = async () => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
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
        address: contractAddress,
        abi: contractABI,
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
