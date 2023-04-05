import hre from 'hardhat'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Scripts
import { deploy } from '../utils/scripts/deploy'
import { vote } from '../utils/scripts/vote'

// Project Tools
import { selectContract } from '../utils/tools/select'
import { handleContractFunction } from '../utils/tools/contract'
import { logAccountsInfo, logNetworkInfo } from '../utils/tools/logs/info'
import { convertStringArrayToBytes32Array } from '../utils/tools/format'

// Script Declarations
const ethers = hre.ethers

// Script
const tokenizedBallot = async (): Promise<void> => {
    console.log(`\n\n\n-----------------------------------------------------------------`)
    console.log(`---------- TokenizedBallot Contract Script Initialized ----------`)
    console.log(`-----------------------------------------------------------------\n\n`)

    // SAVE STORAGE LAYOUT IN REPORTS & NOTIFY VIA CONSOLE.LOG
    //---------------------------------------------------------------------
    // await hre.storageLayout.export()
    //---------------------------------------------------------------------

    // Script Transaction Signers
    const [deployer, account1, account2] = await ethers.getSigners()

    await logNetworkInfo(hre)
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
        hre,
    )

    // Contract Constructor Arguments
    const proposals = [
        'Increase Taxes by 5%',
        'Invest 1 ETH in Compound',
        'Raise Royalties to 10%',
        'Invest in 2 New Devs',
        'Burn Inactive Tokens',
    ]
    const encodedProposals = convertStringArrayToBytes32Array(proposals)
    const tokenAddress = '0x19cA7135FD75552ACEa1027065DC10AB41b38B34'
    const targetBlock = await ethers.provider.getBlockNumber()

    // Contract Deploy - Contract Load
    const rl = readline.createInterface({ input, output })

    let contract

    while (true) {
        const answer = await rl.question('\n- Deploy Contract (y/n): ')
        if (answer === 'y') {
            contract = await deploy(
                'TokenizedBallot',
                deployer,
                [encodedProposals, tokenAddress, targetBlock],
                ['encodedProposals', 'tokenAddress', 'targetBlock'],
            )
            break
        } else if (answer === 'n') {
            contract = await selectContract('TokenizedBallot')
            break
        }
    }

    // Check Voting Power of Deployer
    const vpd = await handleContractFunction(contract, 'votingPower', deployer, deployer.address)

    // Deployer Votes Proposal 1 with All of it's Voting Power
    await vote(contract, deployer, 1, vpd[0].toNumber())

    // Check Voting Power of Account 1
    const vp1 = await handleContractFunction(contract, 'votingPower', account1, account1.address)

    // Account 1 Votes Proposal 1 with All of it's Voting Power
    await vote(contract, account1, 1, vp1[0].toNumber())

    // Check Voting Power of Account 2
    const vp2 = await handleContractFunction(contract, 'votingPower', account2, account2.address)

    // Account 2 Votes Proposal 3 with All of it's Voting Power
    await vote(contract, account2, 3, vp2[0].toNumber())

    // Check Number of Winning Proposal
    const winningProposal = await handleContractFunction(contract, 'winningProposal', deployer)

    console.log(`\nWinning Proposal Number: ${winningProposal[0]}\n`)

    // Check Winning Proposal Name
    const winningProposalName = await handleContractFunction(contract, 'winnerName', deployer)

    const wpn = ethers.utils.parseBytes32String(winningProposalName[0])

    console.log(`\nWinning Proposal Name: ${wpn}\n`)

    await logNetworkInfo(hre)
    await logAccountsInfo(
        [deployer.address, account1.address, account2.address],
        ['deployer', 'account1', 'account2'],
        hre,
    )

    console.log(`\n\n\n---------------------------------------------------------------`)
    console.log(`---------- TokenizedBallot Contract Script Finalized ----------`)
    console.log(`---------------------------------------------------------------\n\n`)
}

tokenizedBallot().catch(error => {
    console.error(error)
    process.exitCode = 1
})
