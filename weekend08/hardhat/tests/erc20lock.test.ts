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

            it('Should maintain the same total balance after locking tokens', async () => {
                const { contract, deployer } = await loadFixture(deployAndMintFixture);
    
                const currentBlockNumber = await ethers.provider.getBlockNumber();
                const unlockBlockNumber = currentBlockNumber + 100;
                const lockAmount = 10;
    
                const initialLockedBalance = await contract.connect(deployer).getLockedAmount(deployer.address);
                const initialUnlockedBalance = await contract.connect(deployer).getUnlockedAmount(deployer.address);
                const initialTotalBalance = initialLockedBalance.add(initialUnlockedBalance);
    
                await contract.connect(deployer).lockAmount(lockAmount, unlockBlockNumber);
    
                const finalLockedBalance = await contract.connect(deployer).getLockedAmount(deployer.address);
                const finalUnlockedBalance = await contract.connect(deployer).getUnlockedAmount(deployer.address);
                const finalTotalBalance = finalLockedBalance.add(finalUnlockedBalance);
    
                expect(finalTotalBalance).to.equal(initialTotalBalance);
            });
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

    describe('Lock Function Validation', () => {
        it('should revert when unlock block number is less than or equal to current block number', async () =>{
            const {contract, deployer} = await loadFixture(deployAndMintFixture);

            const currentBlockNumber = await ethers.provider.getBlockNumber();
             expect(contract.connect(deployer).lockAmount(10, currentBlockNumber)).to.be.revertedWith("Invalid Unlock Block Number")
             expect(contract.connect(deployer).lockAmount(10, currentBlockNumber - 1)).to.be.revertedWith("Invalid Unlock Block Number") 
        })

        it("should and allow the user to lock the desired amount if the unlock block number is greater than current block number",async ()=>{
            const {contract, deployer} = await loadFixture(deployAndMintFixture);
            const fundsBeforeCall = await contract.getLocksLength(deployer.address);
            const currentBlockNumber = await ethers.provider.getBlockNumber();
            const unlockBlockNumber = currentBlockNumber + 100
            await contract.connect(deployer).lockAmount(10, unlockBlockNumber);
            const fundsAfterCall = await contract.getLocksLength(deployer.address);
            expect(fundsAfterCall).to.be.gt(fundsBeforeCall);

        })

        it("should emit AmountLocked event when lockAmount is called with valid parameters", async ()=>{
            const {contract, deployer} = await loadFixture(deployAndMintFixture);

            const currentBlockNumber = await ethers.provider.getBlockNumber();
            const unlockBlockNumber = currentBlockNumber + 100;
            await expect(contract.connect(deployer).lockAmount(10, unlockBlockNumber))
            .to.emit(contract, 'AmountLocked')
            .withArgs(deployer.address, 10, unlockBlockNumber)
            
        })

        it('should revert when the user does not have enough unlocked balance to lock', async () => {
            const { contract, deployer } = await loadFixture(deployAndMintFixture);

            const currentBlockNumber = await ethers.provider.getBlockNumber();
            const unlockBlockNumber = currentBlockNumber + 100;
            const lockedAmount = await contract.connect(deployer).getUnlockedAmount(deployer.address) + 1;

            await expect(
                contract.connect(deployer).lockAmount(lockedAmount, unlockBlockNumber)
            ).to.be.revertedWith("Not Enough Unlocked Balance");
        });

        it('should subtract the locked amount from the unlocked balance', async () => {
            const { contract, deployer } = await loadFixture(deployAndMintFixture);

            const currentBlockNumber = await ethers.provider.getBlockNumber();
            const unlockBlockNumber = currentBlockNumber + 100;
            const lockAmount = 10;

            const initialUnlockedBalance = await contract.connect(deployer).getUnlockedAmount(deployer.address);

            await contract.connect(deployer).lockAmount(lockAmount, unlockBlockNumber);

            const finalUnlockedBalance = await contract.connect(deployer).getUnlockedAmount(deployer.address);

            expect(finalUnlockedBalance).to.equal(initialUnlockedBalance - lockAmount);
        });

        it('Should not allow locking tokens when the unlocked balance is insufficient', async () => {
            const { contract, deployer } = await loadFixture(deployAndMintFixture)
        
            await contract.connect(deployer).lockAmount(90, 100)
            await expect(contract.connect(deployer).lockAmount(20, 110)).to.be.revertedWith("Not Enough Unlocked Balance")
        })
    })

    describe("Minting", async () =>{
        it('Should allow the owner to mint tokens and update the recipient balance correctly', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)
        
            await contract.connect(deployer).mint(account1.address, 50)
            expect(Number(await contract.balanceOf(account1.address))).to.be.equal(150)
        })
    })

    describe("Pausing", async () =>{
        it('Should not allow transfers when the contract is paused', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployAndMintFixture)
        
            await contract.connect(deployer).pause()
            await expect(contract.connect(deployer).transfer(account1.address, 10)).to.be.revertedWith("Pausable: paused")
        })
    })
    })
})

