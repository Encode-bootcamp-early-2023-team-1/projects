import { ethers } from 'hardhat'
import { expect } from 'chai'

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

// Types
import { BigNumber, Contract, ContractFactory } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { convertStringArrayToBytes32Array } from '../utils/tools/format'

// Test Constants
const proposals = [
    'Increase Taxes by 5%',
    'Invest 1 ETH in Compound',
    'Raise Royalties to 10%',
    'Invest in 2 New Devs',
    'Burn Inactive Tokens',
]

// Test
describe('TokenizedBallot', async () => {
    const deployFixture = async () => {
        const [deployer, account1]: SignerWithAddress[] = await ethers.getSigners()

        const myERC20VotesFactory: ContractFactory = await ethers.getContractFactory('MyERC20Votes')
        const myERC20Votes: Contract = await myERC20VotesFactory.connect(deployer).deploy()

        await myERC20Votes.deployed()

        await myERC20Votes.connect(deployer).mint(deployer.address, 10)
        await myERC20Votes.connect(deployer).mint(account1.address, 1)

        await myERC20Votes.connect(deployer).delegate(deployer.address)
        await myERC20Votes.connect(account1).delegate(account1.address)

        const encodedProposals = convertStringArrayToBytes32Array(proposals)
        const tokenAddress = myERC20Votes.address
        const targetBlock = await ethers.provider.getBlockNumber()

        const contractFactory: ContractFactory = await ethers.getContractFactory('TokenizedBallot')
        const contract: Contract = await contractFactory
            .connect(deployer)
            .deploy(encodedProposals, tokenAddress, targetBlock)

        await contract.deployed()

        return { contract, deployer, account1 }
    }

    describe('Vote', async () => {
        it('Should increase proposal vote count on vote', async () => {
            const { contract, deployer } = await loadFixture(deployFixture)

            const votingPower: BigNumber = await contract
                .connect(deployer)
                .votingPower(deployer.address)

            await contract.connect(deployer).vote(0, votingPower.toNumber())

            const proposal = await contract.connect(deployer).proposals(0)

            expect(proposal.voteCount.toNumber()).to.be.equal(votingPower.toNumber())
        })

        it('Should increase voter voting power spent on vote', async () => {
            const { contract, deployer } = await loadFixture(deployFixture)

            const votingPower: BigNumber = await contract
                .connect(deployer)
                .votingPower(deployer.address)

            await contract.connect(deployer).vote(0, votingPower.toNumber())

            const votingPowerSpent = await contract
                .connect(deployer)
                .votingPowerSpent(deployer.address)

            expect(votingPowerSpent.toNumber()).to.be.equal(votingPower.toNumber())
        })

        describe('Events', async () => {
            it('Should emit vote casted event with correct arguments on vote', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                const votingPower: BigNumber = await contract
                    .connect(deployer)
                    .votingPower(deployer.address)

                await expect(contract.connect(deployer).vote(0, votingPower.toNumber()))
                    .to.emit(contract, 'VoteCasted')
                    .withArgs(deployer.address, 0, votingPower)
            })
        })

        describe('Requirements', async () => {
            it('Should not allow to vote with and amount of zero or less', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                await expect(contract.connect(deployer).vote(0, 0)).to.be.revertedWith(
                    'Not Valid Voting Power Amount',
                )
            })

            it('Should not allow to vote if amount exceeds voter voting power', async () => {
                const { contract, deployer } = await loadFixture(deployFixture)

                const votingPower: BigNumber = await contract
                    .connect(deployer)
                    .votingPower(deployer.address)

                await expect(
                    contract.connect(deployer).vote(0, votingPower.add(1).toNumber()),
                ).to.be.revertedWith('Not Enough Voting Power')
            })
        })
    })

    describe('Proposals', async () => {
        it('Should return correct winning proposal', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployFixture)

            const vpDeployer: BigNumber = await contract
                .connect(deployer)
                .votingPower(deployer.address)

            const vpAccount1: BigNumber = await contract
                .connect(account1)
                .votingPower(account1.address)

            await contract.connect(deployer).vote(0, vpDeployer.toNumber())
            await contract.connect(account1).vote(1, vpAccount1.toNumber())

            expect(await contract.connect(deployer).winningProposal()).to.be.equal(0)
        })

        it('Should return correct winning proposal name', async () => {
            const { contract, deployer, account1 } = await loadFixture(deployFixture)

            const vpDeployer: BigNumber = await contract
                .connect(deployer)
                .votingPower(deployer.address)

            const vpAccount1: BigNumber = await contract
                .connect(account1)
                .votingPower(account1.address)

            await contract.connect(deployer).vote(0, vpDeployer.toNumber())
            await contract.connect(account1).vote(1, vpAccount1.toNumber())

            const wpn: string = await contract.connect(deployer).winnerName()

            expect(ethers.utils.parseBytes32String(wpn)).to.be.equal(proposals[0])
        })
    })
})
