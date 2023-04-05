import { task } from 'hardhat/config'

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Task
task('keys', 'Generates address - private key pairs from mnemonic seed phrase').setAction(
    async (taskArgs, hre) => {
        console.log(`\n\n- Mnemonic Derived Accounts with Private Keys Initialized -\n\n`)

        const rl = readline.createInterface({ input, output })

        let nAccounts = 0
        let valid = false

        while (!valid) {
            const n = await rl.question(
                '- Introduce The Number of Accounts to Generate (Positive Integer): ',
            )
            nAccounts = Number(n)
            if (nAccounts > 0 && Math.floor(nAccounts) === nAccounts) valid = true
        }

        let mnemonic = ''
        valid = false

        console.log(
            `\nNote that one blank space must be left between the mnemonic seed phrase words`,
        )

        while (!valid) {
            mnemonic = await rl.question('\n- Introduce Mnemonic Seed Phrase: ')
            if (mnemonic.length > 0) valid = true
        }

        console.log(`\nNumber of Accounts: ${nAccounts}`)
        console.log(`Mnemonic: ${mnemonic}\n`)

        for (let i = 0; i < nAccounts; i++) {
            const wallet = hre.ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
            console.log(`Account ${i + 1}`)
            console.log(`    Address: ${wallet.address}`)
            console.log(`    Private Key: ${wallet.privateKey}\n`)
        }

        console.log(`\n\n- Mnemonic Derived Accounts with Private Keys Finalized -\n\n`)
    },
)
