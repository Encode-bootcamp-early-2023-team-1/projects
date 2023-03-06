import hre from 'hardhat'
import { ethers } from 'hardhat'

import { logTxReceipt } from '../tools/log'
import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

// Script

export const mint = async (contract: any, signer: any, to: string, amount: number) => {
    console.log(`\n-- Mint Process Initialized --\n`)

    const address = await signer.getAddress()
    await sleep(requestTimeout)
    const balance = await signer.getBalance()
    await sleep(requestTimeout)
    const symbol = await contract.symbol()
    await sleep(requestTimeout)
    const decimals = await contract.decimals()
    await sleep(requestTimeout)
    const tokenBalance = await contract.balanceOf(to)
    await sleep(requestTimeout)

    console.log(`Network: ${hre.network.name}`)
    console.log(`Signer Address: ${address}`)
    console.log(`Signer Balance: ${ethers.utils.formatEther(balance)} ETH`)
    console.log(`Provider: ${ethers.provider}\n`)

    console.log(`Recipient Address: ${to}`)
    console.log(`Recipient Balance: ${ethers.utils.formatUnits(tokenBalance, decimals)} ${symbol}\n`)

    const contractName = await contract.name()
    await sleep(requestTimeout)

    console.log(`Contract Name: ${contractName}`)
    console.log(`Contract Address: ${contract.address}`)
    console.log(`Mint Arguments:`)
    console.log(`   To Address: ${to}`)
    console.log(`   Amount: ${amount}\n`)

    const tx = await contract.connect(signer).mint(to, amount)
    const txReceipt = await tx.wait()
    await sleep(requestTimeout)

    console.log(`--- Mint Executed\n`)

    logTxReceipt('Mint', txReceipt)

    const newTokenBalance = await contract.balanceOf(to)

    console.log(`Recipient Address: ${to}`)
    console.log(
        `Recipient Balance: ${ethers.utils.formatUnits(newTokenBalance, decimals)} ${symbol}\n`,
    )

    console.log(`-- Mint Process Finalized --\n`)

    await sleep(processTimeout)
}
