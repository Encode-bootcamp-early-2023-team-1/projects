import { ethers } from 'hardhat'

import { delegate } from '../utils/scripts/delegate'
import { deploy } from '../utils/scripts/deploy'
import { mint } from '../utils/scripts/mint'

// import { t } from './TokenizedBallot'

// Script

const main = async () => {
    console.log(`\n--- MyERC20Votes Contract Test Script Initialized ---`)

    const [deployer, account1, account2] = await ethers.getSigners()

    const contract = await deploy(deployer, 'MyERC20Votes', [])

    // Deployer Mints 25 Tokens for Account 1
    await mint(contract, deployer, account1.address, 25)

    // Account 1 Self Delegates Voting Power
    await delegate(contract, account1, account1.address)

    // Deployer Mints 100 Tokens for Account 2
    await mint(contract, deployer, account2.address, 100)

    // Account 2 Self Delegates Voting Power
    await delegate(contract, account2, account2.address)

    // Deployer Mints 50 Tokens for Deployer
    await mint(contract, deployer, deployer.address, 50)

    // Deployer Delegates Voting Power to Account 1
    await delegate(contract, deployer, account1.address)

    // // Deployer Mints 100 Tokens for 0x40420440aA51d2C8C34aC7Ba35726a0313E1D824
    // await mint(contract, deployer, '0x40420440aA51d2C8C34aC7Ba35726a0313E1D824', 100)

    // // Deployer Mints 100 Tokens for 0x92EA087221317edE527F6bf1235c663a5E5AbDEd
    // await mint(contract, deployer, '0x92EA087221317edE527F6bf1235c663a5E5AbDEd', 100)

    // // Deployer Mints 100 Tokens for 0x122851EB3915cc769dECBf95a566e7fC8aAc2125
    // await mint(contract, deployer, '0x122851EB3915cc769dECBf95a566e7fC8aAc2125', 100)

    // // Deployer Mints 100 Tokens for 0x80B6b1b58A3f96e34ec8AAfb576791287Eb73C56
    // await mint(contract, deployer, '0x80B6b1b58A3f96e34ec8AAfb576791287Eb73C56', 100)

    // // Deployer Mints 100 Tokens for 0x44F316127f5da846Eb0b06a5EF467F58702599A2
    // await mint(contract, deployer, '0x44F316127f5da846Eb0b06a5EF467F58702599A2', 100)

    // // Deployer Mints 100 Tokens for 0xaD56208FE27EFeCEEa33f3eE7fa5002014454c5f
    // await mint(contract, deployer, '0xaD56208FE27EFeCEEa33f3eE7fa5002014454c5f', 100)

    // // Deployer Mints 100 Tokens for 0xcA7AB2Fb277AAcCC530906b6b035bBA0B7182b2E
    // await mint(contract, deployer, '0xcA7AB2Fb277AAcCC530906b6b035bBA0B7182b2E', 100)

    console.log(`--- MyERC20Votes Contract Test Script Finalized ---\n`)

    // t(contract.address)
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
