// Types
type Network = {
    symbol: string
    decimals: number
    blockchainExplorer: string
}

type NetworkParameters = {
    [key: string]: Network
}

export const networkParameters: NetworkParameters = {
    hardhat: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: '',
    },
    mainnet: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://etherscan.io/',
    },
    goerli: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://goerli.etherscan.io/',
    },
    sepolia: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://sepolia.etherscan.io/',
    },
    polygon: {
        symbol: 'MATIC',
        decimals: 18,
        blockchainExplorer: 'https://polygonscan.com/',
    },
    polygonMumbai: {
        symbol: 'MATIC',
        decimals: 18,
        blockchainExplorer: 'https://mumbai.polygonscan.com/',
    },
    polygonZKEVMTestnet: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://testnet-zkevm.polygonscan.com/',
    },
    arbitrumOne: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://arbiscan.io/',
    },
    arbitrumGoerli: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://goerli.arbiscan.io/',
    },
    optimisticEthereum: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://optimistic.etherscan.io/',
    },
    optimisticGoerli: {
        symbol: 'ETH',
        decimals: 18,
        blockchainExplorer: 'https://goerli-optimism.etherscan.io/',
    },
    avalanche: {
        symbol: 'AVAX',
        decimals: 18,
        blockchainExplorer: 'https://avascan.info/',
    },
    avalancheFujiTestnet: {
        symbol: 'AVAX',
        decimals: 18,
        blockchainExplorer: 'https://testnet.avascan.info/',
    },
    gnosis: {
        symbol: 'xDAI',
        decimals: 18,
        blockchainExplorer: 'https://gnosisscan.io/',
    },
    chiado: {
        symbol: 'xDAI',
        decimals: 18,
        blockchainExplorer: 'https://blockscout.chiadochain.net/',
    },
    moonbeam: {
        symbol: 'GLMR',
        decimals: 18,
        blockchainExplorer: 'https://moonbeam.moonscan.io/',
    },
    moonriver: {
        symbol: 'MOVR',
        decimals: 18,
        blockchainExplorer: 'https://blockscout.moonriver.moonbeam.network/',
    },
    moonbaseAlpha: {
        symbol: 'DEV',
        decimals: 18,
        blockchainExplorer: 'https://moonbase.moonscan.io/',
    },
    bsc: {
        symbol: 'BNB',
        decimals: 18,
        blockchainExplorer: 'https://bscscan.com/',
    },
    bscTestnet: {
        symbol: 'tBNB',
        decimals: 18,
        blockchainExplorer: 'https://testnet.bscscan.com/',
    },
    cronos: {
        symbol: 'CRO',
        decimals: 18,
        blockchainExplorer: 'https://cronoscan.com/',
    },
    cronosTestnet: {
        symbol: 'TCRO',
        decimals: 18,
        blockchainExplorer: 'https://testnet.cronoscan.com/',
    },
}
