import hre from 'hardhat'
import { ethers } from 'hardhat'

import { logTxReceipt } from '../tools/log'
import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

// Script

export const deploy = async (deployer: any, contractName: string, args: any[]) => {
    console.log(`\n-- Contract Deploy Process Initialized --`)

    const signer =
        deployer === undefined || deployer === ''
            ? await hre.run('accounts', {
                  select: 'y',
              })
            : deployer

    console.log(`\n- Contract Deploy Initialized -\n`)

    const address = await signer.getAddress()
    await sleep(requestTimeout)
    const balance = await signer.getBalance()
    await sleep(requestTimeout)

    console.log(`Network: ${hre.network.name}`)
    console.log(`Signer Address: ${address}`)
    console.log(`Signer Balance: ${ethers.utils.formatEther(balance)} ETH`)
    console.log(`Provider: ${ethers.provider}\n`)

    console.log(`Deploy Script Contract Name Argument: ${contractName}`)
    console.log(`Deploy Script Contract Arguments: ${args}\n`)

    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await contractFactory.connect(signer).deploy(...args)

    await contract.deployed()
    const txReceipt = await contract.deployTransaction.wait()
    await sleep(requestTimeout)

    console.log(`--- Contract Deployed\n`)

    logTxReceipt('Deploy', txReceipt)

    console.log(`${contractName} Contract Deployed at ${contract.address}\n`)

    console.log(`- Contract Deploy Finalized -\n`)

    if (hre.network.name !== 'hardhat') {
        console.log(`- Contract Verification Initialized -\n`)

        await sleep(100000)
        try {
            await hre.run('verify:verify', {
                contract: `contracts/${contractName}.sol:${contractName}`,
                address: contract.address,
                constructorArguments: args,
            })
        } catch (error) {
            console.log(error)
        }

        console.log(`\n- Contract Verification Finalized -\n`)
    }
    console.log(`-- Contract Deploy Process Finalized --\n`)

    await sleep(processTimeout)

    return contract
}
