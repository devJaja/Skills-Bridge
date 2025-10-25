import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    "base-sepolia": {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.ACCOUNT_PRIVATE_KEY
        ? [process.env.ACCOUNT_PRIVATE_KEY]
        : [],
      type: 'http',
    },
  },
};

export default config;