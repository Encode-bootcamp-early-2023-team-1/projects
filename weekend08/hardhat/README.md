<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![GPL-3.0 License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/uri1001/the-hardhat-project">
    <img src="assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Hardhat Environment Template</h3>

  <p align="center">
    Hardhat Environment Template with an Advanced Basic Setup
    <br />
    <br />
    <a href="https://github.com/uri1001/the-hardhat-project"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/uri1001/the-hardhat-project/issues">Report Bug</a>
    ·
    <a href="https://github.com/uri1001/the-hardhat-project/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#1-about-the-project">About The Project</a>
        <ul>
            <li><a href="#11-features">1.1. Features</a></li>
        </ul>
    </li>
    <li>
        <a href="#2-project-initialization">Project Initialization</a>
        <ul>
            <li><a href="#21-prerequisites">2.1. Prerequisites</a></li>
            <li><a href="#22-installation">2.2. Installation</a></li>
        </ul>
    </li>
    <li>
        <a href="#3-documentation">Documentation</a>      
        <ul>
            <li><a href="#31-hardhat-tasks">3.1. Hardhat Tasks</a></li>
            <li><a href="#32-compilation-deployment-&-verification">3.2. Compilation, Deployment & Verification</a></li>
            <li><a href="#33-linting-&-formatting">3.3. Linting & Formatting</a></li>
        </ul>
    </li>
    <li>
        <a href="#4-resources">Resources</a>
        <ul>
            <li><a href="#41-solidity-documentation">4.1. Hardhat Tasks</a></li>
            <li><a href="#42-typescript-documentation">4.2. TypeScript Documentation</a></li>
            <li><a href="#43-ethers-documentation">4.3. Ethers Documentation</a></li>
            <li><a href="#44-hardhat-documentation">4.4. Hardhat Documentation</a></li>
            <ul>
                <li><a href="#441-hardhat-official-plugins">4.4.1. Hardhat Official Plugins</a></li>
                <li><a href="#442-hardhat-community-plugins">4.4.2. Hardhat Community Plugins</a></li>
            </ul>
            <li><a href="#45-openzeppelin-documentation">4.5. Openzeppelin Documentation</a></li>
            <li><a href="#46-lint-tool">4.6. Lint Tool</a></li>
            <li><a href="#47-format-tool">4.7. Format Tool</a></li>
            <li><a href="#48-general-resources">4.8. General Resources</a></li>
        </ul>
    </li>
    <li><a href="#5-contact">Contact</a></li>
    <li><a href="#6-license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 1. About The Project

Hardhat Environment Template with a Professional Basic & Customized Setup

The goal is to create a Hardhat basic enviroment setup that reduces the amount of time needed to create
a new Solidity project. Achieved by implementing complex processes with tasks & scripts.
Includes formatting, linting and source control tools with their respective rules.

### 1.1. Features

-   [ ] Generic Scripts
    -   [ ] Deploy - contract deployment generic script
    -   [ ] Delegate - ERC20Votes standard delegation generic script
    -   [ ] Mint - ERC20 standard mint generic script
    -   [ ] Burn - ERC20 standard burn generic script
    -   [ ] Transfer - ERC20 standard transfer generic script
    -   [ ] Vote - TokenizedBallot contract voting generic script
-   [ ] Generic Tasks
    -   [ ] Accounts - selected network accounts information
    -   [ ] Info - selected address basic information
    -   [ ] Keys - generates addresses & private keys from mnemonic phrase
    -   [ ] Network - selected network information
-   [ ] Reporting
    -   [ ] Contract Gas Report - on compilation a contract gas usage report is generated in reports
    -   [ ] Contract Size Report - on compilation a contract size report is generated in reports
-   [ ] Wide Network Support
    -   [ ] Ethereum - mainnet, goerli & sepolia
    -   [ ] Polygon - polygon, polygonMumbai & polygonZKEVMTestnet
    -   [ ] Arbitrum - arbitrumOne & arbitrumGoerli
    -   [ ] Optimism - optimisticEthereum & optimisticGoerli
    -   [ ] Avalanche - avalanche & avalancheFujiTestnet
    -   [ ] Gnosis - gnosis
    -   [ ] Moonbeam - moonbeam, moonriver & moonbaseAlpha
    -   [ ] BSC - bsc & bscTestnet
    -   [ ] Cronos - cronos & cronosTestnet
-   [ ] Hardhat Official Plugins
    -   [ ] Hardhat Toolbox - commonly used packages and Hardhat plugins
    -   [ ] Hardhat Ethers - wrapped version of ethers.js adapted to Hardhat (installed with Toolbox plugin)
    -   [ ] Hardhat Chai Matchers - EVM specific capabilities for Chai (installed with Toolbox plugin)
    -   [ ] Hardhat Network Helpers - helper functions to interact with Hardhat network (installed with Toolbox plugin)
    -   [ ] Hardhat Etherscan - contract verification service (installed with Toolbox plugin)
-   [ ] Hardhat Community Plugins
    -   [ ] Hardhat Gas Reporter - gas usage related reports (installed with Toolbox plugin)
    -   [ ] Hardhat Solidity Coverage - code coverage (installed with Toolbox plugin)
    -   [ ] Hardhat Typechain - Typescript bindings for contracts (installed with Toolbox plugin)
    -   [ ] Hardhat Contract Sizer - calculate compiled contract size
    -   [ ] Hardhat Storage Layout - generate contract storage layout
-   [ ] Solidity Linting with Solhint
-   [ ] Code Formatting with Prettier
-   [ ] Code Formatting Enforcement with Husky

See the [open issues](https://github.com/uri1001/the-hardhat-project/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT INITIALIZATION -->

## 2. Project Initialization

### 2.1. Prerequisites

Package manager installation (npm)

-   npm
    ```sh
    npm install npm@latest -g
    ```

### 2.2. Installation

1. Clone the repo
    ```sh
    git clone https://github.com/uri1001/the-hardhat-project.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Rename `.env.sample` file to `.env`
    ```sh
    mv ./.env.sample ./.env
    ```
4. Introduce to `.env` the wallet & API keys

    ```js
    projectPrivateKey = 'wallet-private-key'
    masterPrivateKey = 'wallet-private-key'
    backupPrivateKey = 'wallet-private-key'
    xPrivateKey = 'wallet-private-key'
    yPrivateKey = 'wallet-private-key'

    infuraAPIKey = 'API-key'
    alchemyAPIKey = 'API-key'

    .
    .
    .
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DOCUMENTATION -->

## 3. Documentation

### 3.1. Hardhat Tasks

Get Information
`sh
    npx hardhat
    `

Usage: hardhat [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

    GLOBAL OPTIONS:

    --config              A Hardhat config file.
    --emoji               Use emoji in messages.
    --flamegraph          Generate a flamegraph of your Hardhat tasks.
    --help                Shows this message, or a task's help if its name is provided
    --max-memory          The maximum amount of memory that Hardhat can use.
    --network             The network to connect to.
    --show-stack-traces   Show stack traces.
    --tsconfig            A TypeScript config file.
    --typecheck           Enable TypeScript type-checking of your scripts/tests.
    --verbose             Enables Hardhat verbose logging.
    --version             Shows hardhat's version.

    AVAILABLE TASKS:

    accounts              Provides accounts information in selected network
    check                 Check whatever you need
    clean                 Clears the cache and deletes all artifacts
    compile               Compiles the entire project, building all artifacts
    console               Opens a hardhat console
    coverage              Generates a code coverage report for tests
    flatten               Flattens and prints contracts and their dependencies
    gas-reporter:merge
    help                  Prints this message
    info                  Provides information from selected address
    keys                  Generates address - private key pairs from mnemonic seed phrase
    network               Provides selected network state information
    node                  Starts a JSON-RPC server on top of Hardhat Network
    run                   Runs a user-defined script after compiling the project
    size-contracts        Output the size of compiled contracts
    test                  Runs mocha tests
    typechain             Generate Typechain typings for compiled contracts
    verify                Verifies contract on Etherscan

To get help for a specific task run: npx hardhat help <task>

### 3.2. Compilation, Deployment & Verification

Compile Contracts
`sh
    npx hardhat compile
    `

Deploy Contracts
`sh
    npx hardhat run --network <network> scripts/<deploy_script>.ts
    `

Verify Contracts
`sh
    npx hardhat verify --network <network> <contract-address> <constructor-arguments>
    `

Supported Networks by hardhat-etherscan
`sh
    npx hardhat verify --list-networks
    `

### 3.3. Linting & Formatting

Lint All Contracts
`sh
    npm run solhint
    `

Format All Code
`sh
    npm run prettier:solidity
    `

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- RESOURCES -->

## 4. Resources

### 4.1. Solidity Documentation

Official Documentation: [Documentation](https://docs.soliditylang.org/en/latest/)

Official Structure of Contract: [Structure](https://docs.soliditylang.org/en/latest/structure-of-a-contract.html)

Official Language Grammar: [Grammar](https://docs.soliditylang.org/en/latest/grammar.html)

Official Security Considerations: [Security](https://docs.soliditylang.org/en/latest/security-considerations.html)

Official Storage Layout fo State Variables: [Storage](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)

Official NatSpec: [NatSpec](https://docs.soliditylang.org/en/latest/natspec-format.html)

Official Style Guide: [Style](https://docs.soliditylang.org/en/latest/style-guide.html)

### 4.2. TypeScript Documentation

Official Documentation: [Documentation](https://www.typescriptlang.org/docs/)

### 4.3. Ethers Documentation

Official Documentation: [Documentation](https://docs.ethers.org/v5/)

Cheatsheet: [Cheatsheet](https://dev.to/hideckies/ethers-js-cheat-sheet-1h5j)

### 4.4. Hardhat Documentation

Official Documentation: [Documentation](https://hardhat.org/docs)

Contract Testing Framework - Mocha: [Documentation](https://mochajs.org/)

Contract Testing Library - Chai: [Documentation](https://www.chaijs.com/api/)

Hardhat Testing Documentation: [Documentation](https://hardhat.org/tutorial/testing-contracts)

#### 4.4.1. Hardhat Official Plugins

Hardhat Toolbox: [Documentation](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox)

Hardhat Ethers: [Documentation](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers)

Hardhat Chai Matchers: [Documentation](https://hardhat.org/hardhat-chai-matchers/docs/overview)

Hardhat Network Helpers: [Documentation](https://hardhat.org/hardhat-network-helpers/docs/overview)

Hardhat Etherscan: [Documentation](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan)

#### 4.4.2. Hardhat Community Plugins

Hardhat Gas Reporter: [Documentation](https://www.npmjs.com/package/hardhat-gas-reporter)

Hardhat Solidity Coverage: [Documentation](https://www.npmjs.com/package/solidity-coverage)

Hardhat Typechain: [Documentation](https://www.npmjs.com/package/@typechain/hardhat)

Hardhat Contract Sizer: [Documentation](https://www.npmjs.com/package/hardhat-contract-sizer)

Hardhat Storage Layout: [Documentation](https://www.npmjs.com/package/hardhat-storage-layout)

### 4.5. Openzeppelin Documentation

Official Documentation: [Documentation](https://docs.openzeppelin.com/)

Contracts Wizard: [Wizard](https://docs.openzeppelin.com/contracts/4.x/wizard)

### 4.6. Lint Tool

Official Documentation: [Documentation](https://protofire.github.io/solhint/)

Supported Rules: [Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)

### 4.7. Format Tool

Official Documentation: [Documentation](https://prettier.io/docs/en/)

### 4.8. General Resources

Network Parameters & RPC Nodes: [Chainlist](https://chainlist.org/)

Network Wallet Connection Testing: [Chainlist](https://chainlist.wtf/)

Ethereum Testnets Faucet Status: [FaucetLink](https://faucetlink.to/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## 5. Contact

Oriol Rodríguez Setó - uri1001@pm.me

Project Link: [https://github.com/uri1001/the-hardhat-project](https://github.com/uri1001/the-hardhat-project)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 6. License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/uri1001/the-hardhat-project.svg?style=for-the-badge
[contributors-url]: https://github.com/uri1001/the-hardhat-project/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/uri1001/the-hardhat-project.svg?style=for-the-badge
[forks-url]: https://github.com/uri1001/the-hardhat-project/network/members
[issues-shield]: https://img.shields.io/github/issues/uri1001/the-hardhat-project.svg?style=for-the-badge
[issues-url]: https://github.com/uri1001/the-hardhat-project/issues
[license-shield]: https://img.shields.io/github/license/uri1001/the-hardhat-project.svg?style=for-the-badge
[license-url]: https://github.com/uri1001/the-hardhat-project/blob/master/LICENSE
