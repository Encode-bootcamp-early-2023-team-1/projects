import { task } from 'hardhat/config'

// Project Tools
import { sleep } from '../utils/tools/time'

// Project Constants
import { requestTimeout } from '../utils/constants'

// Task
task('info', 'provides information from selected address')
    .addParam('address', 'target address')
    .setAction(async (taskArgs, hre) => {
        const { address } = taskArgs

        const provider = hre.ethers.provider
        const code = await provider.getCode(taskArgs.address)
        await sleep(requestTimeout)

        const balance = hre.ethers.utils.formatEther(await provider.getBalance(taskArgs.address))
        await sleep(requestTimeout)
        const txCount = await provider.getTransactionCount(taskArgs.address)
        await sleep(requestTimeout)

        console.log(`\n- Info Task Initialized -\n`)

        console.log(`Network: ${hre.network.name}`)
        console.log(`Block: ${await provider.getBlockNumber()}`)
        console.log(`Gas Price: ${await provider.getGasPrice()}\n`)

        if (code === '0x') console.log(`Selected Address is an Account\n`)
        if (code !== '0x') console.log(`Selected Address is a Contract\n`)

        console.log(`Address: ${taskArgs.address}`)
        console.log(`Balance: ${balance}`)
        console.log(`Transactions Count: ${txCount}`)

        console.log(`\n- Info Task Finalized -\n`)
    })
