import hre from 'hardhat'
import { ethers } from 'hardhat'

import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

// Script

export const state = async (contract: any, addresses: string[]) => {
    console.log(`\n-- State Process Initialized --\n`)

    const blockNumber = await ethers.provider.getBlockNumber()
    await sleep(requestTimeout)
    const targetBlockNumber = await contract.targetBlockNumber()
    await sleep(requestTimeout)
    const numProposals = await contract.numProposals()
    await sleep(requestTimeout)

    console.log(`Network: ${hre.network.name}`)
    console.log(`Block Number: ${blockNumber}`)
    console.log(`Provider: ${ethers.provider}\n`)

    console.log(`Contract Address: ${contract.address}`)
    console.log(`Target Block Number: ${targetBlockNumber}`)
    console.log(`Number of Proposals: ${numProposals}\n`)

    for (let i = 0; i < numProposals; i++) {
        const proposal = await contract.proposals(i)
        await sleep(requestTimeout)
        console.log(`Proposal ${i}`)
        console.log(`Title: ${ethers.utils.parseBytes32String(proposal.name)}`)
        console.log(`Vote Count: ${proposal.voteCount}\n`)
    }

    console.log(`Number of Addresses: ${addresses.length}\n`)

    for (let i = 0; i < addresses.length; i++) {
        const balance = await ethers.provider.getBalance(addresses[i])
        await sleep(requestTimeout)
        const votingPower = await contract.votingPower(addresses[i])
        await sleep(requestTimeout)
        const votingPowerSpent = await contract.votingPowerSpent(addresses[i])
        await sleep(requestTimeout)
        console.log(`Account ${i}`)
        console.log(`Address: ${addresses[i]}`)
        console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`)
        console.log(`Voting Power: ${votingPower}`)
        console.log(`Voting Power Spent: ${votingPowerSpent}\n`)
    }

    console.log(`-- State Process Finalized --\n`)

    await sleep(processTimeout)
}
