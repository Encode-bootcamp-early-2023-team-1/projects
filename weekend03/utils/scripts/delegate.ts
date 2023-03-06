import hre from 'hardhat'
import { ethers } from 'hardhat'

import { logTxReceipt } from '../tools/log'
import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

// Script

export const delegate = async (contract: any, signer: any, delegatee: string) => {
    console.log(`\n-- Delegation Process Initialized --\n`)

    const address = await signer.getAddress()
    await sleep(requestTimeout)
    const balance = await signer.getBalance()
    await sleep(requestTimeout)
    const votingPower = await contract.getVotes(signer.address)
    await sleep(requestTimeout)
    const delegateeVotingPower = await contract.getVotes(delegatee)
    await sleep(requestTimeout)

    console.log(`Network: ${hre.network.name}`)
    console.log(`Signer Address: ${address}`)
    console.log(`Signer Balance: ${ethers.utils.formatEther(balance)} ETH`)
    console.log(`Signer Voting Power: ${votingPower}`)
    console.log(`Provider: ${ethers.provider}\n`)

    console.log(`Delegatee Address: ${delegatee}`)
    console.log(`Delegatee Voting Power: ${delegateeVotingPower}\n`)

    const contractName = await contract.name()
    await sleep(requestTimeout)

    console.log(`Contract Name: ${contractName}`)
    console.log(`Contract Address: ${contract.address}`)
    console.log(`Delegate Arguments:`)
    console.log(`   Delegatee: ${delegatee}\n`)

    const tx = await contract.connect(signer).delegate(delegatee)
    const txReceipt = await tx.wait()
    await sleep(requestTimeout)

    console.log(`--- Delegation Executed\n`)

    logTxReceipt('Delegate', txReceipt)

    const newVotingPower = await contract.getVotes(signer.address)
    await sleep(requestTimeout)
    const newDelegateeVotingPower = await contract.getVotes(delegatee)
    await sleep(requestTimeout)

    console.log(`Signer Address: ${address}`)
    console.log(`Signer Voting Power: ${newVotingPower}\n`)

    console.log(`Delegatee Address: ${delegatee}`)
    console.log(`Delegatee Voting Power: ${newDelegateeVotingPower}\n`)

    console.log(`-- Delegation Process Finalized --\n`)

    await sleep(processTimeout)
}
