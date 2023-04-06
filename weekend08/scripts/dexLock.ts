import hre from 'hardhat'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Scripts
import { deploy } from '../utils/scripts/deploy'

// Project Tools
import { handleContractFunction } from '../utils/tools/contract'
import { selectContract } from '../utils/tools/select'

// Project Logs
import { logAccountsInfo, logNetworkInfo } from '../utils/logs/info'
import { mint } from '../utils/scripts/mint'
import { addresses } from '../utils/constants'

// Script Declarations
const ethers = hre.ethers

// Script
const dexLock = async (): Promise<void> => {
    console.log(`\n\n\n---------------------------------------------------------`)
    console.log(`---------- DEXLock Contract Script Initialized ----------`)
    console.log(`---------------------------------------------------------\n\n`)

    // Script Transaction Signers
    const [deployer, account1] = await ethers.getSigners()

    // Contract Deploy - Contract Load
    const rl = readline.createInterface({ input, output })

    let contract

    while (true) {
        const answer = await rl.question('\n- Deploy Contract (y/n): ')
        if (answer === 'y') {
            contract = await deploy(
                'DEXLock',
                deployer,
                ['ERC20Lock', 'LTK', 1000],
                ['ERC20 Token Name', 'ERC20 Token Symbol', 'DEX Exchange Ratio'],
            )
            break
        } else if (answer === 'n') {
            contract = await selectContract('DEXLock')
            break
        }
    }

    console.log(`\n\n---------------------------------------------------------`)
    console.log(`---------- ERC20Lock Contract Script Finalized ----------`)
    console.log(`---------------------------------------------------------\n\n\n`)
}

dexLock().catch(error => {
    console.error(error)
    process.exitCode = 1
})
