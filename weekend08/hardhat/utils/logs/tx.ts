import hre from 'hardhat'
import { ethers } from 'hardhat'

// Types
import { type Interface } from '@ethersproject/abi'
import { type TransactionReceipt } from '@ethersproject/abstract-provider'

// Project Tools
import { capitalize } from '../tools/format'
import { sleep } from '../tools/time'

// Project Networks
import { networkParameters } from '../networks'

// Project Constants
import { logTimeout } from '../constants'

// Transaction Receipt Information
export const logTxReceipt = async (
    txName: string,
    txReceipt: TransactionReceipt,
    contractInterface: Interface,
): Promise<void> => {
    const txTotalCost = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)

    const symbol = networkParameters[hre.network.name].symbol
    const decimals = networkParameters[hre.network.name].decimals

    console.log(`\n- ${capitalize(txName)} Transaction Receipt -\n`)
    console.log(`Block Number: ${txReceipt.blockNumber}`)
    console.log(`Type: ${txReceipt.type}`)
    console.log(`Gas Used: ${txReceipt.gasUsed}`)
    console.log(`Cumulative Gas Used: ${txReceipt.cumulativeGasUsed}`)
    console.log(`Effective Gas Price: ${txReceipt.effectiveGasPrice}`)
    console.log(
        `Total Transaction Cost: ${ethers.utils.formatUnits(txTotalCost, decimals)} ${symbol}`,
    )
    console.log(`Transaction Hash: ${txReceipt.transactionHash}`)
    console.log(`Transaction Sender: ${txReceipt.from}`)
    console.log(`Transaction Receiver: ${txReceipt.to}`)
    console.log(`Logs:`)

    const logs = txReceipt.logs

    for (let i = 0; i < logs.length; i++) {
        for (const abiEvent of Object.values(contractInterface.events)) {
            const eventSignature = contractInterface.getEventTopic(abiEvent)
            if (eventSignature === logs[i].topics[0]) {
                const eventDecoded = contractInterface.decodeEventLog(
                    abiEvent,
                    logs[i].data,
                    logs[i].topics,
                )
                console.log(`    ${i + 1} - ${abiEvent.name}`)
                for (const [key, value] of Object.entries(eventDecoded)) {
                    if (isNaN(Number(key))) console.log(`        ${key}: ${value}`)
                }
                break
            }
        }
    }

    console.log(`\n---------------`)
    await sleep(logTimeout)
}

// Transaction Return Value Information
export const logTxReturnValue = async (txName: string, returnValue: any[]): Promise<void> => {
    console.log(`\n- ${capitalize(txName)} Transaction Return Value -\n`)
    console.log(`Return Value:`)

    for (let i = 0; i < returnValue.length; i++) {
        const value = returnValue[i]
        const type = typeof value
        let output = `    ${i + 1} - ${type} = `
        if (type === 'object' && value !== null) {
            const entries = Object.entries(value)
            const mappedEntries = entries.map(([key, value]) => `${key}: ${value}`)
            output += `{ ${mappedEntries.join(', ')} }`
        } else {
            output += value.toString()
        }
        console.log(output)
    }

    console.log(`\n---------------`)
    await sleep(logTimeout)
}

// Transaction Error Information
export const logTxError = async (txName: string, error: any): Promise<void> => {
    console.log(`\n- ${capitalize(txName)} Transaction Error -\n`)
    console.log(`Reason: ${error.reason}`)
    console.log(`Code: ${error.code}`)
    console.log(`Function: ${error.method}`)
    console.log(`Error Name: ${error.errorName}`)
    console.log(`Error Signature: ${error.errorSignature}`)
    console.log(`Error Arguments: ${error.errorArgs}`)
    if (error.transaction) {
        console.log(`Transaction:`)
        console.log(`    Data: ${error.transaction.data}`)
        console.log(`    To: ${error.transaction.to}`)
        console.log(`    From: ${error.transaction.from}`)
        console.log(`    Gas Limit: ${error.transaction.gasLimit} Wei`)
    }

    console.log(`\n---------------`)

    await sleep(logTimeout)
}
