import hre from 'hardhat'
import { ethers } from 'hardhat'

import { logTxReceipt } from '../tools/log'
import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

import { state } from './state'

// Script

export const vote = async (contract: any, signer: any, proposal: number, amount: number) => {
    console.log(`\n-- Vote Process Initialized --\n`)

    const address = await signer.getAddress()
    await sleep(requestTimeout)
    const balance = await signer.getBalance()
    await sleep(requestTimeout)
    const votingPower = await contract.votingPower(signer.address)
    await sleep(requestTimeout)
    const votingPowerSpent = await contract.votingPowerSpent(signer.address)
    await sleep(requestTimeout)
    const targetBlockNumber = await contract.targetBlockNumber()
    await sleep(requestTimeout)

    console.log(`Network: ${hre.network.name}`)
    console.log(`Signer Address: ${address}`)
    console.log(`Signer Balance: ${ethers.utils.formatEther(balance)} ETH`)
    console.log(`Provider: ${ethers.provider}\n`)

    console.log(`Signer Voting Power: ${votingPower}`)
    console.log(`Signer Voting Power Spent: ${votingPowerSpent}`)

    await state(contract, [signer.address])

    console.log(`Vote Arguments:`)
    console.log(`   Proposal: ${proposal}`)
    console.log(`   Amount: ${amount}\n`)

    const tx = await contract.connect(signer).vote(proposal, amount)
    const txReceipt = await tx.wait()
    await sleep(requestTimeout)

    console.log(`--- Vote Executed\n`)

    logTxReceipt('Vote', txReceipt)

    const newVotingPower = await contract.votingPower(signer.address)
    await sleep(requestTimeout)
    const newVotingPowerSpent = await contract.votingPowerSpent(signer.address)
    await sleep(requestTimeout)

    console.log(`Signer Voting Power: ${newVotingPower}`)
    console.log(`Signer Voting Power Spent: ${newVotingPowerSpent}`)
    console.log(`Target Block Number: ${targetBlockNumber}`)
    console.log(`Voted Proposal: ${proposal}\n`)

    await state(contract, [signer.address])

    console.log(`-- Vote Process Finalized --\n`)

    await sleep(processTimeout)
}
