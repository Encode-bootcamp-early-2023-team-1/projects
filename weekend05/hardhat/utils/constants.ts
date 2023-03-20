// Types
type Network = {
    symbol: string
    decimals: number
}

type NetworkParameters = {
    [key: string]: Network
}

export const logTimeout = 5000
export const processTimeout = 5000
export const requestTimeout = 1000
export const verifyTimeout = 100000

export const networkParameters: NetworkParameters = {
    mainnet: {
        symbol: 'ETH',
        decimals: 18,
    },
    goerli: {
        symbol: 'ETH',
        decimals: 18,
    },
    sepolia: {
        symbol: 'ETH',
        decimals: 18,
    },
    polygon: {
        symbol: 'MATIC',
        decimals: 18,
    },
    polygonMumbai: {
        symbol: 'MATIC',
        decimals: 18,
    },
    arbitrumOne: {
        symbol: 'ETH',
        decimals: 18,
    },
    arbitrumGoerli: {
        symbol: 'ETH',
        decimals: 18,
    },
    optimisticEthereum: {
        symbol: 'ETH',
        decimals: 18,
    },
    optimisticGoerli: {
        symbol: 'ETH',
        decimals: 18,
    },
    avalanche: {
        symbol: 'AVAX',
        decimals: 18,
    },
    avalancheFujiTestnet: {
        symbol: 'AVAX',
        decimals: 18,
    },
    gnosis: {
        symbol: 'xDAI',
        decimals: 18,
    },
    moonbeam: {
        symbol: 'GLMR',
        decimals: 18,
    },
    moonriver: {
        symbol: 'MOVR',
        decimals: 18,
    },
    moonbaseAlpha: {
        symbol: 'DEV',
        decimals: 18,
    },
    bsc: {
        symbol: 'BNB',
        decimals: 18,
    },
    bscTestnet: {
        symbol: 'tBNB',
        decimals: 18,
    },
    cronos: {
        symbol: 'CRO',
        decimals: 18,
    },
    cronosTestnet: {
        symbol: 'TCRO',
        decimals: 18,
    },
}

// Goerli Contracts Addresses
const myERC20VotesContractAddr = '0x19cA7135FD75552ACEa1027065DC10AB41b38B34'
const errorsContractAddr = '0xB200C435551D36C0D2E3c54B6a99C383B13bF4EB'

export const addresses = [
    '0x92EA087221317edE527F6bf1235c663a5E5AbDEd',
    '0x122851EB3915cc769dECBf95a566e7fC8aAc2125',
    '0x40420440aA51d2C8C34aC7Ba35726a0313E1D824',
    '0x80B6b1b58A3f96e34ec8AAfb576791287Eb73C56',
    '0x44F316127f5da846Eb0b06a5EF467F58702599A2',
    '0xaD56208FE27EFeCEEa33f3eE7fa5002014454c5f',
    '0xcA7AB2Fb277AAcCC530906b6b035bBA0B7182b2E',
]
