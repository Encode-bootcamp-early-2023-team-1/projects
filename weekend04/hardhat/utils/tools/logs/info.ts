// Network Information
import hre from 'hardhat'
import { ethers } from 'hardhat'

// Project Tools
import { sleep } from '../time'

// Project Constants
import { logTimeout, requestTimeout } from '../../constants'

// File Declarations
const provider = ethers.provider

// Network Information
export const logNetworkInfo = async (): Promise<void> => {
    const blockNumber = await provider.getBlockNumber()
    await sleep(requestTimeout)
    const feeData = await provider.getFeeData()
    await sleep(requestTimeout)

    console.log(`\n- Network State Information -\n`)
    console.log(`Name: ${hre.network.name}`)
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
export const logAccountsInfo = async (accounts: string[], names: string[]): Promise<void> => {
    console.log(`\n- Accounts State Information -\n`)
    console.log(`#  -  Name  -  Type  -  Address  -  ENS  -  Balance [ETH]  -  Transactions Count\n`)

    for (let i = 0; i < accounts.length; i++) {
        const balance = ethers.utils.formatEther(await provider.getBalance(accounts[i]))
        await sleep(requestTimeout)
        const txCount = await provider.getTransactionCount(accounts[i])
        await sleep(requestTimeout)
        const code = await provider.getCode(accounts[i])
        const type = code === '0x' ? 'EOA' : 'CA'
        await sleep(requestTimeout)
        const ens =
            hre.network.name === 'hardhat' || hre.network.name === 'polygonMumbai'
                ? 'null'
                : await provider.lookupAddress(accounts[i])
        await sleep(requestTimeout)

        console.log(
            `${i + 1} - ${names[i]} - ${type} - ${
                accounts[i]
            } - ${ens} - ${balance} ETH - ${txCount}`,
        )
    }

    console.log(`\n---------------`)
    await sleep(logTimeout)
}
