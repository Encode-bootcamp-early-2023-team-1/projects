import hre from 'hardhat'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Scripts
import { deploy } from '../utils/scripts/deploy'
import { handleContractFunction } from '../utils/tools/contract'

// Project Tools
import { logAccountsInfo, logNetworkInfo } from '../utils/tools/logs/info'
import { selectContract } from '../utils/tools/select'

// Script Declarations
const ethers = hre.ethers

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

    await logNetworkInfo(hre)
    await logAccountsInfo([deployer.address], ['deployer'], hre)

    // Contract Deploy - Contract Load
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

    // Panic Errors - Read Functions
    await handleContractFunction(contract, 'overflowRead')
    await handleContractFunction(contract, 'divideByZeroRead')
    await handleContractFunction(contract, 'wrongConvertToEnumRead', undefined, 3)
    await handleContractFunction(
        contract,
        'tooMuchMemoryAllocatedRead',
        undefined,
        BigInt(2) ** BigInt(256) - BigInt(1),
    )
    await handleContractFunction(contract, 'zeroInitializedVariableRead')

    // Assert Errors - Read Functions
    await handleContractFunction(contract, 'assertRead')

    // Require Errors - Read Funtions
    await handleContractFunction(contract, 'requireRead')

    // Revert Errors - Read Functions
    await handleContractFunction(contract, 'revertRead')
    await handleContractFunction(contract, 'simpleCustomRead')
    await handleContractFunction(contract, 'complexCustomRead')

    // Out of Gas Errors - Read Functions
    await handleContractFunction(contract, 'infiniteLoopRead')

    // Panic Errors - Write Functions
    await handleContractFunction(contract, 'overflowWrite')
    await handleContractFunction(contract, 'divideByZeroWrite')
    await handleContractFunction(contract, 'wrongConvertToEnumWrite', undefined, 3)
    await handleContractFunction(contract, 'popEmptyArrayWrite')
    await handleContractFunction(contract, 'outOfBoundsArrayAccessWrite')
    await handleContractFunction(
        contract,
        'tooMuchMemoryAllocatedWrite',
        undefined,
        BigInt(2) ** BigInt(256) - BigInt(1),
    )
    await handleContractFunction(contract, 'zeroInitializedVariableWrite')

    // Assert Errors - Write Functions
    await handleContractFunction(contract, 'assertWrite')

    // Require Errors - Write Functions
    await handleContractFunction(contract, 'requireWrite')

    // Revert Errors - Write Functions
    await handleContractFunction(contract, 'revertWrite')
    await handleContractFunction(contract, 'simpleCustomWrite')
    await handleContractFunction(contract, 'complexCustomWrite')

    // Out of Gas Errors - Write Function
    await handleContractFunction(contract, 'infiniteLoopWrite')

    console.log(`\n\n------------------------------------------------------`)
    console.log(`---------- Errors Contract Script Finalized ----------`)
    console.log(`------------------------------------------------------\n\n\n`)
}

errors().catch(error => {
    console.error(error)
    process.exitCode = 1
})
