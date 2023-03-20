// Types
import { HardhatRuntimeEnvironment } from 'hardhat/types'

// Project Tools
import { sleep } from '../time'

// Project Constants
import { logTimeout, networkParameters, requestTimeout } from '../../constants'

// Network Information
export const logNetworkInfo = async (hre: HardhatRuntimeEnvironment): Promise<void> => {
    const provider = hre.ethers.provider

    const blockNumber = await provider.getBlockNumber()
    await sleep(requestTimeout)
    const feeData = await provider.getFeeData()
    await sleep(requestTimeout)

    console.log(`\n- Network State Information -\n`)
    console.log(`Name: ${hre.network.name}`)
    console.log(`Symbol: ${networkParameters[hre.network.name].symbol}`)
    console.log(`Decimals: ${networkParameters[hre.network.name].decimals}`)
    console.log(`Block Number: ${blockNumber}`)
    console.log(`Gas Price: ${feeData.gasPrice}`)
    console.log(`Provider: ${provider}`)

    // IMPLEMENT PROVIDER CORRECTLY
    // -----------------------------------------------------------------------------------------------
    // console.log(provider)
    // const x = ethers.getDefaultProvider(hre.network.name, [{ alchemy: process.env.alchemyAPIKey }])
    // console.log(x)
    // -----------------------------------------------------------------------------------------------

    console.log(`\n---------------`)
    await sleep(logTimeout)
}

// Accounts Information
export const logAccountsInfo = async (
    accounts: string[],
    names: string[] | undefined,
    hre: HardhatRuntimeEnvironment,
): Promise<void> => {
    const provider = hre.ethers.provider

    const symbol = networkParameters[hre.network.name].symbol
    const decimals = networkParameters[hre.network.name].decimals

    console.log(`\n- Accounts State Information -\n`)

    if (names !== undefined)
        console.log(
            `#  -  Name  -  Type  -  Address  -  ENS  -  Balance [${symbol}]  -  Transactions Count\n`,
        )
    if (names === undefined)
        console.log(
            `#  -  Type  -  Address  -  ENS  -  Balance [${symbol}]  -  Transactions Count\n`,
        )

    for (let i = 0; i < accounts.length; i++) {
        const balance = hre.ethers.utils.formatUnits(
            await provider.getBalance(accounts[i]),
            decimals,
        )
        await sleep(requestTimeout)
        const txCount = await provider.getTransactionCount(accounts[i])
        await sleep(requestTimeout)
        const code = await provider.getCode(accounts[i])
        const type = code === '0x' ? 'EOA' : 'CA'
        await sleep(requestTimeout)
        const ens =
            hre.network.name === 'mainnet' || hre.network.name === 'goerli'
                ? await provider.lookupAddress(accounts[i])
                : 'null'
        await sleep(requestTimeout)

        if (names !== undefined)
            console.log(
                `${i + 1} - ${names[i]} - ${type} - ${
                    accounts[i]
                } - ${ens} - ${balance} ${symbol} - ${txCount}`,
            )

        if (names === undefined)
            console.log(
                `${i + 1} - ${type} - ${accounts[i]} - ${ens} - ${balance} ${symbol} - ${txCount}`,
            )
    }

    console.log(`\n---------------`)
    await sleep(logTimeout)
}
