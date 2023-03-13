import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-contract-sizer'
import 'hardhat-storage-layout'

import './tasks/accounts'
import './tasks/info'
import './tasks/network'

import * as dotenv from 'dotenv'
dotenv.config()

if (!process.env.projectPrivateKey || process.env.projectPrivateKey.length < 1)
    throw new Error('Missing Project Private Key')

if (!process.env.masterPrivateKey || process.env.masterPrivateKey.length < 1)
    throw new Error('Missing Master Private Key')

if (!process.env.backupPrivateKey || process.env.backupPrivateKey.length < 1)
    throw new Error('Missing Backup Private Key')

if (!process.env.ethereumAPIKey || process.env.ethereumAPIKey.length < 1)
    throw new Error('Missing Ethereum API Key')

if (!process.env.polygonAPIKey || process.env.polygonAPIKey.length < 1)
    throw new Error('Missing Polygon API Key')

if (!process.env.arbitrumAPIKey || process.env.arbitrumAPIKey.length < 1)
    throw new Error('Missing Arbitrum API Key')

if (!process.env.optimismAPIKey || process.env.optimismAPIKey.length < 1)
    throw new Error('Missing Optimism API Key')

if (!process.env.bscAPIKey || process.env.bscAPIKey.length < 1)
    throw new Error('Missing BSC API Key')

if (!process.env.cronosAPIKey || process.env.cronosAPIKey.length < 1)
    throw new Error('Missing Cronos API Key')

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.17',
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },

    paths: { tests: 'tests' },

    networks: {
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 1,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 5,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 137,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        polygonMumbai: {
            url: `https://polygon-mumbai.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 80001,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        arbitrumOne: {
            url: `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 42161,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        arbitrumGoerli: {
            url: `https://arbitrum-goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 421613,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        optimisticEthereum: {
            url: `https://optimism-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 10,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        optimisticGoerli: {
            url: `https://optimism-goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 420,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        bsc: {
            url: 'https://bsc-dataseed1.binance.org/',
            chainId: 56,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        bscTestnet: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            chainId: 97,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        cronos: {
            url: '',
            chainId: 25,
            accounts: [
                process.env.masterPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
        cronosTestnet: {
            url: 'https://evm-t3.cronos.org/',
            chainId: 338,
            accounts: [
                process.env.projectPrivateKey,
                process.env.masterPrivateKey,
                process.env.backupPrivateKey,
            ],
        },
    },

    etherscan: {
        apiKey: {
            mainnet: process.env.ethereumAPIKey,
            goerli: process.env.ethereumAPIKey,
            polygon: process.env.polygonAPIKey,
            polygonMumbai: process.env.polygonAPIKey,
            arbitrumOne: process.env.arbitrumAPIKey,
            arbitrumGoerli: process.env.arbitrumAPIKey,
            optimisticEthereum: process.env.optimismAPIKey,
            optimisticGoerli: process.env.optimismAPIKey,
            bsc: process.env.bscAPIKey,
            bscTestnet: process.env.bscAPIKey,
            cronos: process.env.cronosAPIKey,
            cronosTestnet: process.env.cronosAPIKey,
        },
        customChains: [
            {
                network: 'cronos',
                chainId: 25,
                urls: {
                    apiURL: '',
                    browserURL: '',
                },
            },
            {
                network: 'cronosTestnet',
                chainId: 338,
                urls: {
                    apiURL: 'https://api-testnet.cronoscan.com/api/',
                    browserURL: 'https://testnet.cronoscan.com/',
                },
            },
        ],
    },

    gasReporter: {
        currency: 'USD',
        token: 'ETH',
        gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    },

    contractSizer: {
        alphaSort: false,
        runOnCompile: true,
        disambiguatePaths: false,
        strict: false,
        only: [],
        except: [],
        outputFile: 'reports/contract-sizer.txt',
    },
}

export default config
