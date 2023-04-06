import { ethers } from 'hardhat'
import { expect } from 'chai'

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

import { PANIC_CODES } from '@nomicfoundation/hardhat-chai-matchers/panic'

// Types
import { type Contract, type ContractFactory } from 'ethers'
import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Script
describe('Errors', () => {
    const deployFixture = async () => {
        const [deployer]: SignerWithAddress[] = await ethers.getSigners()

        const contractFactory: ContractFactory = await ethers.getContractFactory('Errors')
        const contract: Contract = await contractFactory.connect(deployer).deploy()

        await contract.deployed()

        return { contract, deployer }
    }

    describe('Read Functions', () => {
        describe('Panic Errors', () => {
            it('Should revert with overflow panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.overflowRead()).to.be.revertedWithPanic(
                    PANIC_CODES.ARITHMETIC_UNDER_OR_OVERFLOW,
                )
            })

            it('Should revert with division by zero panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.divideByZeroRead()).to.be.revertedWithPanic(
                    PANIC_CODES.DIVISION_BY_ZERO,
                )
            })

            it('Should revert with enum conversion out of bounds panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.wrongConvertToEnumRead(3)).to.be.revertedWithPanic(
                    PANIC_CODES.ENUM_CONVERSION_OUT_OF_BOUNDS,
                )
            })

            it('Should revert with too much memory allocated panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(
                    contract.tooMuchMemoryAllocatedRead(BigInt(2) ** BigInt(256) - BigInt(1)),
                ).to.be.revertedWithPanic(PANIC_CODES.TOO_MUCH_MEMORY_ALLOCATED)
            })

            it('Should revert with zero-initialized variable panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.zeroInitializedVariableRead()).to.be.revertedWithPanic(
                    PANIC_CODES.ZERO_INITIALIZED_VARIABLE,
                )
            })

            it('Should revert with assertion panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.assertRead()).to.be.revertedWithPanic(
                    PANIC_CODES.ASSERTION_ERROR,
                )
            })
        })

        describe('Require Errors', () => {
            it('Should revert with requirement', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.requireRead()).to.be.revertedWith('Requirement Not Met')
            })
        })

        describe('Revert Errors', () => {
            it('Should revert with revert messge', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.revertRead()).to.be.revertedWith('This is a revert message')
            })

            it('Should revert with simple custom error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.simpleCustomRead()).to.be.revertedWithCustomError(
                    contract,
                    'SimpleError',
                )
            })

            it('Should revert with complex custom error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.complexCustomRead()).to.be.revertedWithCustomError(
                    contract,
                    'ComplexError',
                )
            })

            // it('Should revert with no reason', async () => {
            //     const { contract } = await loadFixture(deployFixture)

            //     await expect(contract.infiniteLoopRead()).to.be.revertedWithoutReason()
            // })
        })
    })

    describe('Write Functions', () => {
        describe('Panic Errors', () => {
            it('Should revert with overflow panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.overflowWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.ARITHMETIC_UNDER_OR_OVERFLOW,
                )
            })

            it('Should revert with division by zero panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.divideByZeroWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.DIVISION_BY_ZERO,
                )
            })

            it('Should revert with enum conversion out of bounds panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.wrongConvertToEnumWrite(3)).to.be.revertedWithPanic(
                    PANIC_CODES.ENUM_CONVERSION_OUT_OF_BOUNDS,
                )
            })

            it('Should revert with pop on empty array panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.popEmptyArrayWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.POP_ON_EMPTY_ARRAY,
                )
            })

            it('Should revert with out of bounds array access panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.outOfBoundsArrayAccessWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.ARRAY_ACCESS_OUT_OF_BOUNDS,
                )
            })

            it('Should revert with too much memory allocated panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(
                    contract.tooMuchMemoryAllocatedWrite(BigInt(2) ** BigInt(256) - BigInt(1)),
                ).to.be.revertedWithPanic(PANIC_CODES.TOO_MUCH_MEMORY_ALLOCATED)
            })

            it('Should revert with zero-initialized variable panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.zeroInitializedVariableWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.ZERO_INITIALIZED_VARIABLE,
                )
            })

            it('Should revert with assertion panic error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.assertWrite()).to.be.revertedWithPanic(
                    PANIC_CODES.ASSERTION_ERROR,
                )
            })
        })

        describe('Require Errors', () => {
            it('Should revert with requirement', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.requireWrite()).to.be.revertedWithoutReason()
            })
        })

        describe('Revert Errors', () => {
            it('Should revert with revert message', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.revertWrite()).to.be.revertedWith('This is a revert message')
            })

            it('Should revert with simple custom error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.simpleCustomWrite()).to.be.revertedWithCustomError(
                    contract,
                    'SimpleError',
                )
            })

            it('Should revert with complex custom error', async () => {
                const { contract } = await loadFixture(deployFixture)

                await expect(contract.complexCustomWrite()).to.be.revertedWithCustomError(
                    contract,
                    'ComplexError',
                )
            })

            // it('Should revert with no reason', async () => {
            //     const { contract } = await loadFixture(deployFixture)

            //     await expect(contract.infiniteLoopRead()).to.be.revertedWithoutReason()
            // })
        })
    })
})
