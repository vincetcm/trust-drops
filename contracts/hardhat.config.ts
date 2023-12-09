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
        mnemonic: "test test test test test test test test test test test test",
      },
      live: false,
      saveDeployments: true,
      tags: ["dev"],
    },
    baseGeorli: {
      url: process.env.BASE_GOERLI_RPC,
      live: true,
      saveDeployments: true,
      accounts: [
        process.env.PRIVATE_KEY
      ],
    },
  },
};

export default config;
