import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "hardhat-dependency-compiler";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
        settings: {},
      },
    ],
  },
  dependencyCompiler: {
    paths: ["anon-aadhaar-contracts/contracts/Verifier.sol"],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: "hidden horror advice immense social phone matter world salmon blouse boy tunnel",
      },
      live: false,
      saveDeployments: true,
      tags: ["dev"],
    },
    baseGoerli: {
      url: process.env.BASE_GOERLI_RPC,
      live: true,
      saveDeployments: true,
      accounts: [
        process.env.PRIVATE_KEY
      ],
    },
    mande: {
      url: process.env.MANDE_RPC,
      gasPrice: 50000000000,
      accounts: [
        process.env.PRIVATE_KEY
      ],
    },
    mumbai: {
      url: process.env.MUMBAI_RPC,
      live: true,
      saveDeployments: true,
      accounts: [
        process.env.PRIVATE_KEY
      ],
    },
  },
};

export default config;
