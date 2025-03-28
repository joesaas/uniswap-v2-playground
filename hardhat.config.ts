import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28", // 
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.5.16", // UniswapV2Factory 的版本
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.6.6", // UniswapV2Router02 的版本
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.4.18", // WETH9 的版本
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  }
};

export default config;
