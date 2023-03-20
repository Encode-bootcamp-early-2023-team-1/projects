import hre from 'hardhat'

// Types
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { handleContractFunction } from '../tools/contract'
import { logAccountsInfo } from '../tools/logs/info'
import { logProcessParameters, logProcessReceipt } from '../tools/logs/process'
import { sleep } from '../tools/time'

// Project Constants
import { processTimeout, requestTimeout } from '../constants'

// Script
export const delegate = async (
    contract: Contract,
    signer: SignerWithAddress,
    delegatee: string,
): Promise<void> => {
    console.log(`\n------------------------------------------`)
    console.log(`----- Delegation Process Initialized -----`)
    console.log(`------------------------------------------\n`)

    let contractName: string = 'null'

    if (Object.hasOwn(contract, 'name')) {
        contractName = await contract.name()
        await sleep(requestTimeout)
    }

    await logAccountsInfo(
        [contract.address, signer.address, delegatee],
        [contractName, 'signer', 'delegatee'],
        hre,
    )

    const states = await logProcessParameters(
        contract,
        signer,
        'delegate',
        [delegatee],
        ['delegatee'],
    )

    await handleContractFunction(contract, 'delegate', signer, delegatee)

    await logProcessReceipt(contract, signer, 'delegate', [delegatee], states)

    console.log(`\n-----------------------------------------`)
    console.log(`----- Delegation Process Finalized -----`)
    console.log(`-----------------------------------------\n`)

    await sleep(processTimeout)
}
