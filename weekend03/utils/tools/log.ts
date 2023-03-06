import { ethers } from 'hardhat'

export const logTxReceipt = (txName: string, txReceipt: any) => {
    const txTotalCost = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)

    console.log(`- ${txName} Transaction Receipt -`)
    console.log(`Block Number: ${txReceipt.blockNumber}`)
    console.log(`Gas Used: ${txReceipt.gasUsed}`)
    console.log(`Cumulative Gas Used: ${txReceipt.cumulativeGasUsed}`)
    console.log(`Effective Gas Price: ${txReceipt.effectiveGasPrice}`)
    console.log(`Total Transaction Cost: ${txTotalCost} Wei`)
    console.log(`Total Transaction Cost: ${ethers.utils.formatEther(txTotalCost)} ETH`)
    console.log(`Transaction Hash: ${txReceipt.transactionHash}`)
    console.log(`Transaction Sender: ${txReceipt.from}`)
    console.log(`Transaction Receiver: ${txReceipt.to}`)
    console.log(`Logs: ${txReceipt.logs}\n`)
}
