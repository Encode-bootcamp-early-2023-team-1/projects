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
export const vote = async (
    contract: Contract,
    signer: SignerWithAddress,
    proposal: number,
    amount: number,
): Promise<void> => {
    console.log(`\n------------------------------------`)
    console.log(`----- Vote Process Initialized -----`)
    console.log(`------------------------------------\n`)

    let contractName: string = 'null'

    if (Object.hasOwn(contract, 'name')) {
        contractName = await contract.name()
        await sleep(requestTimeout)
    }

    await logAccountsInfo([contract.address, signer.address], [contractName, 'signer'], hre)

    const states = await logProcessParameters(
        contract,
        signer,
        'vote',
        [proposal, amount],
        ['proposal', 'amount'],
    )

    await handleContractFunction(contract, 'vote', signer, proposal, amount)

    await logProcessReceipt(contract, signer, 'vote', [proposal, amount], states)

    console.log(`\n-----------------------------------`)
    console.log(`----- Vote Process Finalized -----`)
    console.log(`-----------------------------------\n`)

    await sleep(processTimeout)
}
