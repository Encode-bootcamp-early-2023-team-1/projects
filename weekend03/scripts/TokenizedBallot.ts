import { ethers } from 'hardhat'

import { deploy } from '../utils/scripts/deploy'
import { vote } from '../utils/scripts/vote'

import { convertStringArrayToBytes32Array } from '../utils/tools/format'

// Script

const main = async () => {
    console.log(`\n--- TokenizedBallot Contract Test Script Initialized ---`)

    const proposals = ['Increase Taxes by 5%', 'Invest 1 ETH in Compound', 'Raise Royalties to 10%']

    const encodedProposals = convertStringArrayToBytes32Array(proposals)
    const tokenAddress = '0xeceF6C390e6e7C09fCDD96F6C5f7B97Ba2841e9e'
    const targetBlock = await ethers.provider.getBlockNumber()

    const [deployer, account1, account2] = await ethers.getSigners()

    const contract = await deploy(deployer, 'TokenizedBallot', [
        encodedProposals,
        tokenAddress,
        targetBlock,
    ])

    await vote(contract, account1, 1, 75)

    await vote(contract, account2, 2, 50)

    // await winner(contract)

    console.log(`--- TokenizedBallot Contract Test Script Finalized ---\n`)
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
