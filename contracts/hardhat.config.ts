require('dotenv').config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  etherscan: {
   apiKey: {
    baseGoerli: process.env.BLOCKSCOUT_BASE_GOERLI_KEY as string,
    baseMainnet: process.env.BLOCKSCOUT_BASE_MAINNET_KEY as string,
   },
   customChains: [
     {
       network: "baseGoerli" as string,
       chainId: 84531,
       urls: {
        apiURL: "https://base-goerli.blockscout.com/api" as string,
        browserURL: "https://base-goerli.blockscout.com" as string
       }
     },
     {
       network: "baseMainnet" as string,
       chainId: 8453,
       urls: {
        apiURL: "https://base.blockscout.com/api" as string,
        browserURL: "https://base.blockscout.com" as string
       }
     }
   ]
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_GOERLI_API_KEY}`,
      accounts: [process.env.DEV_PRIVATE_KEY as string],
    },
    baseGoerli: {
     url: "https://goerli.base.org" as string,
     accounts: [process.env.DEV_PRIVATE_KEY as string],
     gasPrice: 1000000000,
    },
    baseMainnet: {
      url: "https://mainnet.base.org" as string,
      accounts: [process.env.DEPLOYER_PRIV_KEY as string],
      gasPrice: 1000000000,
    }
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    showTimeSpent: true,
    enabled: true,
    token: "ETH"
  },
};

export default config;
