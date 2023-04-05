// Types
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider'

// Project Tools
import { logTxError, logTxReceipt, logTxReturnValue } from './logs/tx'
import { capitalize } from './format'
import { sleep } from './time'

// Project Constants
import { requestTimeout } from '../constants'

type ContractFunction = (...args: any[]) => Promise<any>

export const handleContractFunction = async (
    contract: Contract,
    functionName: string,
    signer?: SignerWithAddress,
    ...args: any[]
): Promise<any[]> => {
    const fn: ContractFunction = signer
        ? contract.connect(signer)[functionName]
        : contract[functionName]

    if (!fn) throw new Error(`function ${functionName} not found on contract`)

    console.log(`\n- ${capitalize(functionName)} Function Execution -\n`)

    try {
        const tx: TransactionResponse = await fn(...args)

        if (Object.hasOwn(tx, 'wait')) {
            const txReceipt: TransactionReceipt = await tx.wait()

            console.log(`----- ${functionName.toUpperCase()} - FUNCTION EXECUTED -----`)

            await sleep(requestTimeout)
            await logTxReceipt(functionName, txReceipt, contract.interface)
        } else {
            console.log(`----- ${functionName.toUpperCase()} - FUNCTION EXECUTED -----`)
        }

        const outputs = contract.interface.getFunction(functionName).outputs
        const hasReturnValue = outputs !== undefined && outputs.length > 0

        if (hasReturnValue) {
            const returnValue = await contract.functions[functionName](...args)

            await sleep(requestTimeout)
            await logTxReturnValue(functionName, returnValue)

            return returnValue
        }
    } catch (error) {
        console.log(`----- ${functionName.toUpperCase()} - FUNCTION ERROR -----`)

        await sleep(requestTimeout)
        await logTxError(functionName, error)
        // console.log('-----------------------------------')
        // console.log(error)
        // console.log('-----------------------------------')
    }

    return []
}
