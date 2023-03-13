// Types
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { handleContractFunction } from '../tools/handler'
import { logAccountsInfo } from '../tools/logs/info'
import { logProcessParameters, logProcessReceipt } from '../tools/logs/process'
import { sleep } from '../tools/time'

// Project Constants
import { processTimeout, requestTimeout } from '../constants'

// Script
export const burn = async (
    contract: Contract,
    signer: SignerWithAddress,
    account: string,
    amount: number,
): Promise<void> => {
    console.log(`\n------------------------------------`)
    console.log(`----- Burn Process Initialized -----`)
    console.log(`------------------------------------\n`)

    let contractName: string = 'null'

    if (Object.hasOwn(contract, 'name')) {
        contractName = await contract.name()
        await sleep(requestTimeout)
    }

    await logAccountsInfo(
        [contract.address, signer.address, account],
        [contractName, 'signer', 'account'],
    )

    const states = await logProcessParameters(
        contract,
        signer,
        'burn',
        [account, amount],
        ['to', 'amount'],
    )

    await handleContractFunction(contract, 'burn', signer, account, amount)

    await logProcessReceipt(contract, signer, 'burn', [account, amount], states)

    console.log(`\n-----------------------------------`)
    console.log(`----- Burn Process Finalized -----`)
    console.log(`-----------------------------------\n`)

    await sleep(processTimeout)
}
