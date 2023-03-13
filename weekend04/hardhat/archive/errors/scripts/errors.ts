import hre from 'hardhat'
import { ethers } from 'hardhat'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Scripts
import { deploy } from '../utils/scripts/deploy'
import { handleContractFunction } from '../utils/tools/handler'

// Project Tools
import { logAccountsInfo, logNetworkInfo } from '../utils/tools/logs/info'
import { selectContract } from '../utils/tools/select'

// Script
const errors = async (): Promise<void> => {
    console.log(`\n\n\n--------------------------------------------------------`)
    console.log(`---------- Errors Contract Script Initialized ----------`)
    console.log(`--------------------------------------------------------\n\n`)

    // SAVE STORAGE LAYOUT IN REPORTS & NOTIFY VIA CONSOLE.LOG
    //---------------------------------------------------------------------
    // await hre.storageLayout.export()
    //---------------------------------------------------------------------

    // Script Transaction Signers
    const [deployer] = await ethers.getSigners()

    await logNetworkInfo()
    await logAccountsInfo([deployer.address], ['deployer'])

    // Contract Deploy / Contract Load
    const rl = readline.createInterface({ input, output })

    let contract

    while (true) {
        const answer = await rl.question('\n- Deploy Contract (y/n): ')
        if (answer === 'y') {
            contract = await deploy('Errors', deployer, [], [])
            break
        } else if (answer === 'n') {
            contract = await selectContract('Errors')
            break
        }
    }

    // Invalid States Errors - Read Functions
    await handleContractFunction(contract, 'overflowRead')
    await handleContractFunction(contract, 'divideByZeroRead')
    await handleContractFunction(contract, 'infiniteLoopRead')

    // Assert Errors - Read Functions
    await handleContractFunction(contract, 'assertRead')

    // Require Errors - Read Funtions
    await handleContractFunction(contract, 'requireRead')

    // Revert Errors - Read Functions
    await handleContractFunction(contract, 'revertRead')
    await handleContractFunction(contract, 'simpleCustomRead')
    await handleContractFunction(contract, 'complexCustomRead')

    // Invalid States Errors - Write Functions
    await handleContractFunction(contract, 'overflowWrite')
    await handleContractFunction(contract, 'divideByZeroWrite')
    await handleContractFunction(contract, 'infiniteLoopWrite')
    await handleContractFunction(contract, 'wrongArrayPositionWrite')
    await handleContractFunction(contract, 'popEmptyArrayWrite')

    // Assert Errors - Write Functions
    await handleContractFunction(contract, 'assertWrite')

    // Require Errors - Write Functions
    await handleContractFunction(contract, 'requireWrite')

    // Revert Errors - Write Functions
    await handleContractFunction(contract, 'revertWrite')
    await handleContractFunction(contract, 'simpleCustomWrite')
    await handleContractFunction(contract, 'complexCustomWrite')

    console.log(`\n\n------------------------------------------------------`)
    console.log(`---------- Errors Contract Script Finalized ----------`)
    console.log(`------------------------------------------------------\n\n\n`)
}

errors().catch(error => {
    console.error(error)
    process.exitCode = 1
})
