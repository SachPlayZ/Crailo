import { ethers } from "hardhat";

async function main() {
  const crailo = await deployCrailo();
  const validator = await deployValidator(crailo);
  const dispute = await deployDispute(validator);

  const escrow = await deployEscrow(crailo, validator, dispute);
  console.log("Escrow deployed to:", escrow);
}

const deployCrailo = async () => {
  const Crailo = await ethers.deployContract("CrailoToken");

  console.log("Waiting for deployment confirmation...");

  await Crailo.waitForDeployment();

  const crailoContractAddress = await Crailo.getAddress();
  console.log("Crailo deployed to:", crailoContractAddress);

  return crailoContractAddress;
};

const deployValidator = async (address: string) => {
  const Validator = await ethers.deployContract("ValidatorContract", [address]);

  console.log("Waiting for deployment confirmation...");

  await Validator.waitForDeployment();

  const validatorContractAddress = await Validator.getAddress();
  console.log("Validator deployed to:", validatorContractAddress);

  return validatorContractAddress;
};

const deployDispute = async (address: string) => {
  const Dispute = await ethers.deployContract("DisputeContract", [address]);

  console.log("Waiting for deployment confirmation...");

  await Dispute.waitForDeployment();

  const disputeContractAddress = await Dispute.getAddress();
  console.log("Dispute deployed to:", disputeContractAddress);

  return disputeContractAddress;
};

const deployEscrow = async (
  address1: string,
  address2: string,
  address3: string
) => {
  const mainEscrow = await ethers.deployContract("MainEscrow", [
    address1,
    address2,
    address3,
  ]);

  console.log("Waiting for deployment confirmation...");

  await mainEscrow.waitForDeployment();

  const mainEscrowContractAddress = await mainEscrow.getAddress();

  return mainEscrowContractAddress;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
