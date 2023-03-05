import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import './tasks/accounts'
import './tasks/info'
import './tasks/network'

const config: HardhatUserConfig = {
  paths: { tests: "tests" },
  solidity: "0.8.17",
};

export default config;
