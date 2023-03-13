import { task } from 'hardhat/config'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Project Tools
import { sleep } from '../utils/tools/time'

// Project Constants
import { requestTimeout } from '../utils/constants'

// Task
task('accounts', 'provides accounts information in selected network')
    .addParam('select', 'enables account selection returned by the task (--select y)')
    .setAction(async (taskArgs, hre) => {
        const accounts = await hre.ethers.getSigners()
        const provider = hre.ethers.provider

        console.log(`\n- Network Available Accounts -\n`)

        console.log(`Network: ${hre.network.name}`)
        console.log(`Block: ${await provider.getBlockNumber()}`)
        console.log(`Gas Price: ${await provider.getGasPrice()}`)

        console.log(`\nNumber - Address  -  Balance  -  Transactions Count\n`)

        let i = 1
        for (const account of accounts) {
            const balance = hre.ethers.utils.formatEther(await provider.getBalance(account.address))
            const txCount = await provider.getTransactionCount(account.address)
            await sleep(requestTimeout)

            console.log(`${i} - ${account.address} - ${balance} - ${txCount}`)
            i++
        }

        if (taskArgs.select !== 'y') {
            console.log(`\n- Accounts Task Finalized -\n`)
        } else {
            const rl = readline.createInterface({ input, output })

            let valid = false
            let walletSelected
            while (!valid) {
                walletSelected = await rl.question(
                    '\n- Select Account to Execute Deploy (Enter Account Number): ',
                )
                if (Number(walletSelected) > 0 && Number(walletSelected) <= accounts.length)
                    valid = true
            }

            let k = 1
            let signer
            for (const account of accounts) {
                if (k === Number(walletSelected)) {
                    const balance = hre.ethers.utils.formatEther(
                        await provider.getBalance(account.address),
                    )
                    const txCount = await provider.getTransactionCount(account.address)
                    await sleep(requestTimeout)

                    console.log(`\nSelected Account: ${account.address} - ${balance} - ${txCount}`)
                    signer = account
                    break
                }
                k++
            }

            if (signer === undefined) throw new Error('Undefined Signer')
            return signer
        }
    })
