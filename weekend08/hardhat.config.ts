import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-contract-sizer'
import 'hardhat-storage-layout'

import './tasks/accounts'
import './tasks/info'
import './tasks/keys'
import './tasks/network'

import 'tsconfig-paths/register'

import * as dotenv from 'dotenv'
dotenv.config()

if (!process.env.projectPrivateKey || process.env.projectPrivateKey.length < 1)
    throw new Error('Missing Project Private Key')

if (!process.env.masterPrivateKey || process.env.masterPrivateKey.length < 1)
    throw new Error('Missing Master Private Key')

if (!process.env.backupPrivateKey || process.env.backupPrivateKey.length < 1)
    throw new Error('Missing Backup Private Key')

if (!process.env.xPrivateKey || process.env.xPrivateKey.length < 1)
    throw new Error('Missing X Private Key')

if (!process.env.yPrivateKey || process.env.yPrivateKey.length < 1)
    throw new Error('Missing Y Private Key')

if (!process.env.ethereumAPIKey || process.env.ethereumAPIKey.length < 1)
    throw new Error('Missing Ethereum API Key')

if (!process.env.polygonAPIKey || process.env.polygonAPIKey.length < 1)
    throw new Error('Missing Polygon API Key')

if (!process.env.optimismAPIKey || process.env.optimismAPIKey.length < 1)
    throw new Error('Missing Optimism API Key')

if (!process.env.bscAPIKey || process.env.bscAPIKey.length < 1)
    throw new Error('Missing BSC API Key')

if (!process.env.cronosAPIKey || process.env.cronosAPIKey.length < 1)
    throw new Error('Missing Cronos API Key')

const standardAccounts = [
    process.env.projectPrivateKey,
    process.env.masterPrivateKey,
    process.env.backupPrivateKey,
    process.env.xPrivateKey,
    process.env.yPrivateKey,
]

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
            accounts: standardAccounts,
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 5,
            accounts: standardAccounts,
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 11155111,
            accounts: standardAccounts,
        },
        polygon: {
            url: `https://polygon-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 137,
            accounts: standardAccounts,
        },
        polygonMumbai: {
            url: `https://polygon-testnet.public.blastapi.io/`,
            chainId: 80001,
            accounts: standardAccounts,
        },
        polygonZKEVMTestnet: {
            url: `https://rpc.public.zkevm-test.net/`,
            chainId: 1442,
            accounts: standardAccounts,
        },
        arbitrumOne: {
            url: `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 42161,
            accounts: standardAccounts,
        },
        arbitrumGoerli: {
            url: `https://arbitrum-goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 421613,
            accounts: standardAccounts,
        },
        optimisticEthereum: {
            url: `https://optimism-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 10,
            accounts: standardAccounts,
        },
        optimisticGoerli: {
            url: `https://optimism-goerli.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 420,
            accounts: standardAccounts,
        },
        avalanche: {
            url: `https://avalanche-mainnet.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 43114,
            accounts: standardAccounts,
        },
        avalancheFujiTestnet: {
            url: `https://avalanche-fuji.infura.io/v3/${process.env.infuraProjectID}`,
            chainId: 43113,
            accounts: standardAccounts,
        },
        gnosis: {
            url: `https://rpc.gnosischain.com`,
            chainId: 100,
            accounts: standardAccounts,
        },
        chiado: {
            url: `https://rpc.chiadochain.net`,
            chainId: 10200,
            accounts: standardAccounts,
        },
        moonbeam: {
            url: `https://1rpc.io/glmr`,
            chainId: 1284,
            accounts: standardAccounts,
        },
        moonriver: {
            url: `https://moonriver.public.blastapi.io`,
            chainId: 1285,
            accounts: standardAccounts,
        },
        moonbaseAlpha: {
            url: `https://rpc.api.moonbase.moonbeam.network`,
            chainId: 1287,
            accounts: standardAccounts,
        },
        bsc: {
            url: 'https://bsc-dataseed1.binance.org/',
            chainId: 56,
            accounts: standardAccounts,
        },
        bscTestnet: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            chainId: 97,
            accounts: standardAccounts,
        },
        cronos: {
            url: 'https://cronos-evm.publicnode.com',
            chainId: 25,
            accounts: standardAccounts,
        },
        cronosTestnet: {
            url: 'https://evm-t3.cronos.org/',
            chainId: 338,
            accounts: standardAccounts,
        },
    },

    etherscan: {
        apiKey: {
            mainnet: process.env.ethereumAPIKey,
            goerli: process.env.ethereumAPIKey,
            polygon: process.env.polygonAPIKey,
            polygonMumbai: process.env.polygonAPIKey,
            optimisticEthereum: process.env.optimismAPIKey,
            optimisticGoerli: process.env.optimismAPIKey,
            bsc: process.env.bscAPIKey,
            bscTestnet: process.env.bscAPIKey,
            cronos: process.env.cronosAPIKey,
            cronosTestnet: process.env.cronosAPIKey,
        },
        customChains: [
            {
                network: 'polygonZKEVMTestnet',
                chainId: 1442,
                urls: {
                    apiURL: 'https://explorer.public.zkevm-test.net/api',
                    browserURL: 'https://explorer.public.zkevm-test.net/',
                },
            },
            {
                network: 'chiado',
                chainId: 1442,
                urls: {
                    apiURL: 'https://blockscout.com/gnosis/chiado/api',
                    browserURL: 'https://blockscout.com/gnosis/chiado/',
                },
            },
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
        enabled: true,
        currency: 'USD',
        token: 'ETH',
        gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
        outputFile: 'reports/contract-gas-reporter.txt',
        noColors: true,
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
