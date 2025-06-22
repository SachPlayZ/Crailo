import { ethers } from "hardhat";

async function main() {
  const Escrow = await ethers.deployContract("MainEscrow");

  console.log("Waiting for deployment confirmation...");

  await Escrow.waitForDeployment();

  const contractAddress = await Escrow.getAddress();
  console.log("Escrow deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
