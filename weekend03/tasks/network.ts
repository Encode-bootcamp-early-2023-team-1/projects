import { task } from 'hardhat/config'

import { sleep } from '../utils/tools/time'

task('network', 'provides selected network state information').setAction(async (taskArgs, hre) => {
    const provider = hre.ethers.provider
    const network = await provider.getNetwork()

    console.log(`\n- Network Task Initialized -\n`)
    console.log(`Name: ${hre.network.name}`)
    console.log(`ID: ${network.chainId}`)
    console.log(`ENS Address: ${network.ensAddress}\n`)

    sleep(1000)

    const feeData = await provider.getFeeData()

    console.log(`Block: ${await provider.getBlockNumber()}`)
    console.log(`Gas Price: ${feeData.gasPrice}`)
    console.log(`Last Base Fee per Gas: ${feeData.lastBaseFeePerGas}`)
    console.log(`Max Fee per Gas: ${feeData.maxFeePerGas}`)
    console.log(`Max Priority Fee per Gas: ${feeData.maxPriorityFeePerGas}`)
    console.log(`\n- Network Task Finalized -\n`)
})
