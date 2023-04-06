import { ethers } from 'hardhat'
import { expect } from 'chai'

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

import { PANIC_CODES } from '@nomicfoundation/hardhat-chai-matchers/panic'

import { mineUpTo } from '@nomicfoundation/hardhat-network-helpers'

// Types
import { type Contract, type ContractFactory } from 'ethers'
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Script
describe('ERC20Lock', () => {
    const deployFixture = async () => {
        const [deployer]: SignerWithAddress[] = await ethers.getSigners()

        const contractFactory: ContractFactory = await ethers.getContractFactory('ERC20Lock')
        const contract: Contract = await contractFactory.connect(deployer).deploy('ERC20Lock', 'LTK')

        await contract.deployed()

        return { contract, deployer }
    }

    const deployAndMintFixture = async () => {
        const [deployer, account1]: SignerWithAddress[] = await ethers.getSigners()

        const contractFactory: ContractFactory = await ethers.getContractFactory('ERC20Lock')
        const contract: Contract = await contractFactory.connect(deployer).deploy('ERC20Lock', 'LTK')

        await contract.deployed()

        await contract.connect(deployer).mint(deployer.address, 100)
        await contract.connect(deployer).mint(account1.address, 100)

        return { contract, deployer, account1 }
    }

    describe('Lock Protection Tests', () => {
        describe('Lock Balances Check', () => {
            it('Should lock correct amount of tokens', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)

                await contract.connect(deployer).lockAmount(10, 100)

                expect(
                    Number(await contract.connect(deployer).getLockedAmount(deployer.address)),
                ).to.be.equal(10)

                expect(
                    Number(await contract.connect(account1).getLockedAmount(account1.address)),
                ).to.be.equal(0)
            })

            it('Should unlock correct amount of tokens', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)

                await contract.connect(deployer).lockAmount(10, 100)

                expect(
                    Number(await contract.connect(deployer).getUnlockedAmount(deployer.address)),
                ).to.be.equal(90)

                expect(
                    Number(await contract.connect(account1).getUnlockedAmount(account1.address)),
                ).to.be.equal(100)
            })
        })

        describe('Lock Balances Check With Block Mining', () => {
            it('Should lock correct amount of tokens', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)

                await contract.connect(deployer).lockAmount(10, 100)

                await mineUpTo(99)

                expect(
                    Number(await contract.connect(deployer).getLockedAmount(deployer.address)),
                ).to.be.equal(10)

                expect(
                    Number(await contract.connect(account1).getLockedAmount(account1.address)),
                ).to.be.equal(0)

                await mineUpTo(101)

                expect(
                    Number(await contract.connect(deployer).getLockedAmount(deployer.address)),
                ).to.be.equal(0)

                expect(
                    Number(await contract.connect(account1).getLockedAmount(account1.address)),
                ).to.be.equal(0)
            })

            it('Should unlock correct amount of tokens', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)

                await contract.connect(deployer).lockAmount(10, 100)

                await mineUpTo(99)

                expect(
                    Number(await contract.connect(deployer).getUnlockedAmount(deployer.address)),
                ).to.be.equal(90)

                expect(
                    Number(await contract.connect(account1).getUnlockedAmount(account1.address)),
                ).to.be.equal(100)

                await mineUpTo(101)

                expect(
                    Number(await contract.connect(deployer).getUnlockedAmount(deployer.address)),
                ).to.be.equal(100)

                expect(
                    Number(await contract.connect(account1).getUnlockedAmount(account1.address)),
                ).to.be.equal(100)
            })
        })
    })
})
