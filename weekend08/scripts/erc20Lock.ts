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
const errors = async (): Promise<void> => {
    console.log(`\n\n\n-----------------------------------------------------------`)
    console.log(`---------- ERC20Lock Contract Script Initialized ----------`)
    console.log(`-----------------------------------------------------------\n\n`)

    // Script Transaction Signers
    const [deployer, account1] = await ethers.getSigners()

    // Contract Deploy - Contract Load
    const rl = readline.createInterface({ input, output })

    let contract

    while (true) {
        const answer = await rl.question('\n- Deploy Contract (y/n): ')
        if (answer === 'y') {
            contract = await deploy('ERC20Lock', deployer, [], [])
            break
        } else if (answer === 'n') {
            contract = await selectContract('ERC20Lock')
            break
        }
    }

    await mint(contract, deployer, deployer.address, 1000)
    await mint(contract, deployer, account1.address, 1000)

    for (let i = 0; i < addresses.length; i++) {
        await mint(contract, deployer, addresses[i], 1000)
    }

    await handleContractFunction(contract, 'lockAmount', deployer, 100, 987654321)
    await handleContractFunction(contract, 'lockAmount', account1, 100, 34014895)

    console.log(`\n\n---------------------------------------------------------`)
    console.log(`---------- ERC20Lock Contract Script Finalized ----------`)
    console.log(`---------------------------------------------------------\n\n\n`)
}

errors().catch(error => {
    console.error(error)
    process.exitCode = 1
})
