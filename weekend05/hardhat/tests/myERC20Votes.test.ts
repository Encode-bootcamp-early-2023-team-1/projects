import { ethers } from 'hardhat'
import { expect } from 'chai'

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

// Types
import { BigNumber, Contract, ContractFactory } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Test Constants
const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'))
const burnerRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'))

// Test
describe('MyERC20Votes', async () => {
    const deployFixture = async () => {
        const [deployer, account1]: SignerWithAddress[] = await ethers.getSigners()

        const contractFactory: ContractFactory = await ethers.getContractFactory('MyERC20Votes')
        const contract: Contract = await contractFactory.connect(deployer).deploy()

        await contract.deployed()

        return { contract, deployer, account1 }
    }

    const deployWithMintFixture = async () => {
        const { contract, deployer, account1 } = await loadFixture(deployFixture)

        await contract.connect(deployer).mint(deployer.address, 1)
        await contract.connect(deployer).mint(account1.address, 1)

        return { contract, deployer, account1 }
    }

    describe('Deployment', async () => {
        it('Should have MyERC20Votes as name', async () => {
            const { contract } = await loadFixture(deployFixture)

            expect(await contract.name()).to.equal('MyERC20Votes')
        })

        it('Should have T as symbol', async () => {
            const { contract } = await loadFixture(deployFixture)

            expect(await contract.symbol()).to.equal('T')
        })

        it('Should have a total supply of 0', async () => {
            const { contract } = await loadFixture(deployFixture)

            expect(await contract.totalSupply()).to.equal(0)
        })

        describe('Events', async () => {
            it('Should emit grant role event of DEFAULT_ADMIN_ROLE for deployer', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                await expect(contract.deployTransaction)
                    .to.emit(contract, 'RoleGranted')
                    .withArgs(
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        deployer.address,
                        deployer.address,
                    )
            })

            it('Should emit grant role event of MINTER_ROLE for deployer', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                await expect(contract.deployTransaction)
                    .to.emit(contract, 'RoleGranted')
                    .withArgs(minterRole, deployer.address, deployer.address)
            })

            it('Should emit grant role event of BURNER_ROLE for deployer', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                await expect(contract.deployTransaction)
                    .to.emit(contract, 'RoleGranted')
                    .withArgs(burnerRole, deployer.address, deployer.address)
            })
        })
    })

    describe('Roles', async () => {
        it('Should allow deployer to mint tokens', async () => {
            const { contract, deployer } = await loadFixture(deployFixture)

            await expect(contract.connect(deployer).mint(deployer.address, 1)).to.not.be.reverted
        })

        it('Should allow deployer to burn tokens', async () => {
            const { contract, deployer } = await loadFixture(deployWithMintFixture)

            await expect(contract.connect(deployer).burn(deployer.address, 1)).to.not.be.reverted
        })

        it('Should allow deployer to grant roles', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployFixture)

            await expect(contract.connect(deployer).grantRole(minterRole, account1.address)).to.not
                .be.reverted
        })

        it('Should allow non-deployer accounts with minter role to mint tokens', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployFixture)

            await contract.connect(deployer).grantRole(minterRole, account1.address)

            await expect(contract.connect(account1).mint(account1.address, 1)).to.not.be.reverted
        })

        it('Should allow non-deployer accounts with burner role to burn tokens', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

            await contract.connect(deployer).grantRole(burnerRole, account1.address)

            await expect(contract.connect(account1).burn(account1.address, 1)).to.not.be.reverted
        })

        describe('Events', async () => {
            it('Should emit grant role event with correct sender & recipient on role granted', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployFixture)

                await expect(contract.connect(deployer).grantRole(minterRole, account1.address))
                    .to.emit(contract, 'RoleGranted')
                    .withArgs(minterRole, account1.address, deployer.address)
            })
        })

        describe('Requirements', async () => {
            it('Should not allow non-deployer accounts to grant roles', async () => {
                const { contract, account1 } = await loadFixture(deployFixture)

                await expect(
                    contract.connect(account1).grantRole(minterRole, account1.address),
                ).to.be.revertedWith(/AccessControl: account .* is missing role .*/)
            })
        })
    })

    describe('Delegate', async () => {
        it('Should delegatee should receive delegator voting power after delegation', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

            await contract.connect(deployer).delegate(account1.address)

            expect(Number(await contract.connect(account1).getVotes(account1.address))).to.be.equal(
                1,
            )
        })

        it('Should delegator should have 0 voting power after delegation', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

            await contract.connect(deployer).delegate(account1.address)

            expect(await contract.connect(deployer).getVotes(deployer.address)).to.be.equal(0)
        })

        describe('Events', async () => {
            it('Should emit delegate changed with correct arguments on delegate', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

                await expect(contract.connect(deployer).delegate(account1.address))
                    .to.emit(contract, 'DelegateChanged')
                    .withArgs(
                        deployer.address,
                        '0x0000000000000000000000000000000000000000',
                        account1.address,
                    )
            })

            it('Should emit delegate votes changed with correct arguments on delegate', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

                const vpAccount1: BigNumber = await contract
                    .connect(account1)
                    .getVotes(account1.address)

                await expect(contract.connect(deployer).delegate(account1.address))
                    .to.emit(contract, 'DelegateVotesChanged')
                    .withArgs(account1.address, vpAccount1.toNumber(), 1)
            })
        })
    })

    describe('Tranfer', async () => {
        it('Should increase mint recipient balance by the amount minted on mint', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

            await expect(
                contract.connect(deployer).transfer(account1.address, 1),
            ).to.changeTokenBalances(contract, [deployer.address, account1.address], [-1, 1])
        })

        describe('Events', async () => {
            it('Should emit transfer event with correct sender & recipient on tokens transfer', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

                await expect(contract.connect(deployer).transfer(account1.address, 1))
                    .to.emit(contract, 'Transfer')
                    .withArgs(deployer.address, account1.address, 1)
            })
        })

        describe('Requirements', async () => {
            it('Should not allow transfers to null address', async () => {
                const { contract, deployer } = await loadFixture(deployWithMintFixture)

                await expect(
                    contract
                        .connect(deployer)
                        .transfer('0x0000000000000000000000000000000000000000', 1),
                ).to.be.revertedWith('ERC20: transfer to the zero address')
            })

            it('Should not allow transfers that exceed balance', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

                await expect(
                    contract.connect(deployer).transfer(account1.address, 10),
                ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
            })

            it('Should not allow to increase allowance to null address', async () => {
                const { contract, deployer } = await loadFixture(deployWithMintFixture)

                await expect(
                    contract
                        .connect(deployer)
                        .increaseAllowance('0x0000000000000000000000000000000000000000', 1),
                ).to.be.revertedWith('ERC20: approve to the zero address')
            })

            it('Should not allow to decrease allowance below zero', async () => {
                const { contract, deployer, account1 } = await loadFixture(deployWithMintFixture)

                await expect(
                    contract.connect(deployer).decreaseAllowance(account1.address, 10),
                ).to.be.revertedWith('ERC20: decreased allowance below zero')
            })
        })
    })

    describe('Mint', async () => {
        it('Should increase mint recipient balance by the amount minted on mint', async () => {
            const { contract, deployer } = await loadFixture(deployFixture)

            await expect(contract.connect(deployer).mint(deployer.address, 1)).to.changeTokenBalance(
                contract,
                deployer.address,
                1,
            )
        })

        describe('Events', async () => {
            it('Should emit transfer event with correct sender & recipient on mint', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                await expect(contract.connect(deployer).mint(deployer.address, 1))
                    .to.emit(contract, 'Transfer')
                    .withArgs('0x0000000000000000000000000000000000000000', deployer.address, 1)
            })
        })

        describe('Requirements', async () => {
            it('Should not allow non-deployer accounts to mint tokens', async () => {
                const { contract, account1 } = await loadFixture(deployFixture)

                await expect(
                    contract.connect(account1).mint(account1.address, 1),
                ).to.be.revertedWith(/AccessControl: account .* is missing role .*/)
            })
        })
    })

    describe('Burn', async () => {
        it('Should increase mint recipient balance by the amount minted on mint', async () => {
            const { contract, deployer } = await loadFixture(deployWithMintFixture)

            await expect(contract.connect(deployer).burn(deployer.address, 1)).to.changeTokenBalance(
                contract,
                deployer.address,
                -1,
            )
        })

        describe('Events', async () => {
            it('Should emit transfer event with correct sender & recipient on tokens burn', async () => {
                const { contract, deployer } = await loadFixture(deployWithMintFixture)

                await expect(contract.connect(deployer).burn(deployer.address, 1))
                    .to.emit(contract, 'Transfer')
                    .withArgs(deployer.address, '0x0000000000000000000000000000000000000000', 1)
            })
        })

        describe('Requirements', async () => {
            it('Should not allow non-deployer accounts to burn tokens', async () => {
                const { contract, account1 } = await loadFixture(deployWithMintFixture)

                await expect(
                    contract.connect(account1).burn(account1.address, 1),
                ).to.be.revertedWith(/AccessControl: account .* is missing role .*/)
            })
        })
    })
})
