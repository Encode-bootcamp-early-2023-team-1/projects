import { task } from 'hardhat/config'

// Project Tools
import { sleep } from '../utils/tools/time'

// Project Constants
import { requestTimeout } from '../utils/constants'

// Task
task('info', 'Provides information from selected address')
    .addParam('address', 'target address')
    .setAction(async (taskArgs, hre) => {
        const { address } = taskArgs

        const provider = hre.ethers.provider
        const code = await provider.getCode(address)
        await sleep(requestTimeout)

        const balance = hre.ethers.utils.formatEther(await provider.getBalance(address))
        await sleep(requestTimeout)
        const txCount = await provider.getTransactionCount(address)
        await sleep(requestTimeout)

        console.log(`\n\n- Info Task Initialized -\n\n`)

        console.log(`Network: ${hre.network.name}`)
        console.log(`Block Number: ${await provider.getBlockNumber()}`)
        console.log(`Gas Price: ${await provider.getGasPrice()}\n`)

        if (code === '0x') console.log(`Selected Address is an Externally Owned Account\n`)
        if (code !== '0x') console.log(`Selected Address is a Contract Account\n`)

        console.log(`Address: ${address}`)
        console.log(`Balance: ${balance}`)
        console.log(`Transactions Count: ${txCount}`)

        console.log(`\n\n- Info Task Finalized -\n\n`)
    })
