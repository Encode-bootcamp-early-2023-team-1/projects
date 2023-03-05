import { task } from 'hardhat/config'

import { sleep } from '../utils/tools/time'

task('info', 'provides information from selected address')
    .addParam('address', 'target address')
    .setAction(async (taskArgs, hre) => {
        const { address } = taskArgs

        const provider = hre.ethers.provider
        const code = await provider.getCode(taskArgs.address)

        sleep(1000)

        const balance = hre.ethers.utils.formatEther(await provider.getBalance(taskArgs.address))
        const txCount = await provider.getTransactionCount(taskArgs.address)

        sleep(1000)

        console.log(`\n- Info Task Initialized -\n`)
        console.log(`Network: ${hre.network.name}`)
        console.log(`Block: ${await provider.getBlockNumber()}`)
        console.log(`Gas Price: ${await provider.getGasPrice()}\n`)

        if (code === '0x') console.log(`Selected Address is an Account\n`)
        if (code !== '0x') console.log(`Selected Address is a Contract\n`)

        console.log(`Address: ${taskArgs.address}`)
        console.log(`Balance: ${balance}`)
        console.log(`Transactions Count: ${txCount}`)

        // MIRAR DE TREURE MÉS MÉTRIQUES
        // EN CAS QUE SIGUI CONTRACTE -> PER EXEMPLE NOM, ESTAT DE LES VARIABLES PÚBLIQUES, NOMBRE D'INTERACCIONS, BALANCE DE TOKENS...
        // S'HAURIA DE CREAR UN OBJECTE CONTRACT DE ETHERS, PERÒ FALTA LA ABI
        console.log(`\n- Info Task Finalized -\n`)
    })
