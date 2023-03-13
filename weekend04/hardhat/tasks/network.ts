import { task } from 'hardhat/config'

// Project Tools
import { sleep } from '../utils/tools/time'

// Project Constants
import { requestTimeout } from '../utils/constants'

// Task
task('network', 'provides selected network state information').setAction(async (taskArgs, hre) => {
    const provider = hre.ethers.provider
    const network = await provider.getNetwork()

    console.log(`\n- Network Task Initialized -\n`)

    console.log(`Name: ${hre.network.name}`)
    console.log(`ID: ${network.chainId}`)
    console.log(`ENS Address: ${network.ensAddress}`)
    console.log(`Provider: ${provider}\n`)

    const feeData = await provider.getFeeData()
    await sleep(requestTimeout)

    console.log(`Block: ${await provider.getBlockNumber()}`)
    console.log(`Gas Price: ${feeData.gasPrice}`)
    console.log(`Last Base Fee per Gas: ${feeData.lastBaseFeePerGas}`)
    console.log(`Max Fee per Gas: ${feeData.maxFeePerGas}`)
    console.log(`Max Priority Fee per Gas: ${feeData.maxPriorityFeePerGas}`)

    console.log(`\n- Network Task Finalized -\n`)
})
