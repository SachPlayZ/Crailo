import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";

const { RPC_URL_ETH, PRIVATE_KEY, ETHERSCAN_API, RPC_URL_CORE, CORE_API } =
  process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: RPC_URL_ETH || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    core: {
      url: RPC_URL_CORE || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: `${ETHERSCAN_API}`,
      "Core Blockchain Testnet2": `${CORE_API}`,
    },
    customChains: [
      {
        network: "Core Blockchain Testnet2",
        chainId: 1114,
        urls: {
          apiURL: "https://api.test2.btcs.network/api",
          browserURL: "https://scan.test2.btcs.network",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
