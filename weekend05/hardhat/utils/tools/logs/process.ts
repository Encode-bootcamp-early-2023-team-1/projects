import { ethers } from 'hardhat'

// Types
import { Contract, BigNumber } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

// Project Tools
import { capitalize } from '../format'
import { sleep } from '../time'

// Project Constants
import { logTimeout, requestTimeout } from '../../constants'

// Process Parameters Information
export const logProcessParameters = async (
    contract: Contract | undefined,
    signer: SignerWithAddress,
    processName: string,
    args: any[],
    argsNames: string[],
): Promise<any[]> => {
    const states: any[] = []

    console.log(`\n- ${capitalize(processName)} Process Parameters -\n`)

    switch (processName) {
        case 'burn':
            if (contract === undefined) throw new Error('Contract Undefined')
            const account: string = args[0]

            const bSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const bDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const bTokenBalance: BigNumber = await contract.balanceOf(account)
            await sleep(requestTimeout)

            console.log(
                `Account Balance: ${ethers.utils.formatUnits(
                    bTokenBalance,
                    bDecimals,
                )} ${bSymbol}\n`,
            )

            states.push(bTokenBalance)
            break

        case 'delegate':
            if (contract === undefined) throw new Error('Contract Undefined')
            const delegatee: string = args[0]

            const votingPower: BigNumber = await contract.getVotes(signer.address)
            await sleep(requestTimeout)
            const delegateeVotingPower: BigNumber = await contract.getVotes(delegatee)
            await sleep(requestTimeout)

            console.log(`Signer Voting Power: ${votingPower}`)
            console.log(`Delegatee Voting Power: ${delegateeVotingPower}\n`)

            states.push(votingPower, delegateeVotingPower)
            break

        case 'deploy':
            console.log(`Contract Name: ${args[0]}\n`)
            break

        case 'mint':
            if (contract === undefined) throw new Error('Contract Undefined')
            const to: string = args[0]

            const mSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const mDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const mTokenBalance: BigNumber = await contract.balanceOf(to)
            await sleep(requestTimeout)

            console.log(
                `Recipient Balance: ${ethers.utils.formatUnits(
                    mTokenBalance,
                    mDecimals,
                )} ${mSymbol}\n`,
            )

            states.push(mTokenBalance)
            break

        case 'transfer':
            if (contract === undefined) throw new Error('Contract Undefined')
            const recipient: string = args[0]

            const tSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const tDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const senderTokenBalance: BigNumber = await contract.balanceOf(signer.address)
            await sleep(requestTimeout)
            const recipientTokenBalance: BigNumber = await contract.balanceOf(recipient)
            await sleep(requestTimeout)

            console.log(
                `Sender Balance: ${ethers.utils.formatUnits(
                    senderTokenBalance,
                    tDecimals,
                )} ${tSymbol}`,
            )
            console.log(
                `Recipient Balance: ${ethers.utils.formatUnits(
                    recipientTokenBalance,
                    tDecimals,
                )} ${tSymbol}\n`,
            )

            states.push(senderTokenBalance, recipientTokenBalance)
            break

        case 'vote':
            if (contract === undefined) throw new Error('Contract Undefined')
            const proposalNum = args[0]

            const vp: BigNumber = await contract.votingPower(signer.address)
            await sleep(requestTimeout)
            const vpSpent: BigNumber = await contract.votingPowerSpent(signer.address)
            await sleep(requestTimeout)
            const targetBlockNumber: BigNumber = await contract.targetBlockNumber()
            await sleep(requestTimeout)

            console.log(`Signer Voting Power: ${vp}`)
            console.log(`Signer Voting Power Spent: ${vpSpent}\n`)

            const proposal = await contract.proposals(proposalNum)
            await sleep(requestTimeout)

            console.log(`Target Block Number: ${targetBlockNumber}`)
            console.log(`Voted Proposal`)
            console.log(`    Number: ${proposalNum}`)
            console.log(`    Title: ${ethers.utils.parseBytes32String(proposal.name)}`)
            console.log(`    Vote Count: ${proposal.voteCount}\n`)

            states.push(vp, vpSpent, proposal.voteCount)
            break

        default:
            break
    }

    console.log(`${capitalize(processName)} Function Arguments\n`)
    for (let i = 0; i < args.length; i++) console.log(`    ${i + 1} - ${argsNames[i]}: ${args[i]}`)

    console.log(`\n---------------`)
    await sleep(logTimeout)

    return states
}

// Process Receipt Information - Final State of Involved Variables & State Change from Initial State
export const logProcessReceipt = async (
    contract: Contract | undefined,
    signer: SignerWithAddress,
    processName: string,
    args: any[],
    states: any[],
): Promise<void> => {
    console.log(`\n- ${capitalize(processName)} Process Receipt -\n`)

    let sign = ''

    switch (processName) {
        case 'burn':
            if (contract === undefined) throw new Error('Contract Undefined')
            const account: string = args[0]

            const bSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const bDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const bTokenBalance: BigNumber = await contract.balanceOf(account)
            await sleep(requestTimeout)

            const bTokenBalanceDelta = bTokenBalance.sub(states[0])

            sign = bTokenBalanceDelta.isNegative() ? '-' : '+'
            console.log(
                `Account Balance: ${ethers.utils.formatUnits(
                    bTokenBalance,
                    bDecimals,
                )} ${bSymbol} - state Δ: ${sign} ${ethers.utils.formatUnits(
                    bTokenBalanceDelta.abs(),
                    bDecimals,
                )} ${bSymbol}`,
            )
            break

        case 'delegate':
            if (contract === undefined) throw new Error('Contract Undefined')
            const delegatee: string = args[0]

            const votingPower: BigNumber = await contract.getVotes(signer.address)
            await sleep(requestTimeout)
            const delegateeVotingPower: BigNumber = await contract.getVotes(delegatee)
            await sleep(requestTimeout)

            const votingPowerDelta = votingPower.sub(states[0])
            const delegateeVotingPowerDelta = delegateeVotingPower.sub(states[1])

            sign = votingPowerDelta.isNegative() ? '-' : '+'
            console.log(
                `Signer Voting Power: ${votingPower} - state Δ: ${sign} ${votingPowerDelta.abs()}`,
            )
            sign = delegateeVotingPowerDelta.isNegative() ? '-' : '+'
            console.log(
                `Delegatee Voting Power: ${delegateeVotingPower} - state Δ: ${sign} ${delegateeVotingPowerDelta.abs()}`,
            )
            break

        case 'deploy':
            const contractAddress: string = args[0]
            console.log(`Contract Deployed at ${contractAddress}`)
            break

        case 'mint':
            if (contract === undefined) throw new Error('Contract Undefined')
            const to: string = args[0]

            const mSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const mDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const mTokenBalance: BigNumber = await contract.balanceOf(to)
            await sleep(requestTimeout)

            const mTokenBalanceDelta = mTokenBalance.sub(states[0])

            sign = mTokenBalanceDelta.isNegative() ? '-' : '+'
            console.log(
                `Recipient Balance: ${ethers.utils.formatUnits(
                    mTokenBalance,
                    mDecimals,
                )} ${mSymbol} - state Δ: ${sign} ${ethers.utils.formatUnits(
                    mTokenBalanceDelta.abs(),
                    mDecimals,
                )} ${mSymbol}`,
            )
            break

        case 'transfer':
            if (contract === undefined) throw new Error('Contract Undefined')
            const recipient: string = args[0]

            const tSymbol: string = await contract.symbol()
            await sleep(requestTimeout)
            const tDecimals: number = await contract.decimals()
            await sleep(requestTimeout)
            const senderTokenBalance: BigNumber = await contract.balanceOf(signer.address)
            await sleep(requestTimeout)
            const recipientTokenBalance: BigNumber = await contract.balanceOf(recipient)
            await sleep(requestTimeout)

            const senderTokenBalanceDelta = senderTokenBalance.sub(states[0])
            const recipientTokenBalanceDelta = recipientTokenBalance.sub(states[1])

            sign = senderTokenBalanceDelta.isNegative() ? '-' : '+'
            console.log(
                `Sender Balance: ${ethers.utils.formatUnits(
                    senderTokenBalance,
                    tDecimals,
                )} ${tSymbol} - state Δ: ${sign} ${ethers.utils.formatUnits(
                    senderTokenBalanceDelta.abs(),
                    tDecimals,
                )} ${tSymbol}`,
            )
            sign = recipientTokenBalanceDelta.isNegative() ? '-' : '+'
            console.log(
                `Recipient Balance: ${ethers.utils.formatUnits(
                    recipientTokenBalance,
                    tDecimals,
                )} ${tSymbol} - state Δ: ${sign} ${ethers.utils.formatUnits(
                    recipientTokenBalanceDelta.abs(),
                    tDecimals,
                )} ${tSymbol}`,
            )
            break

        case 'vote':
            if (contract === undefined) throw new Error('Contract Undefined')
            const proposalNum = args[0]

            const vp: BigNumber = await contract.votingPower(signer.address)
            await sleep(requestTimeout)
            const vpSpent: BigNumber = await contract.votingPowerSpent(signer.address)
            await sleep(requestTimeout)
            const targetBlockNumber: BigNumber = await contract.targetBlockNumber()
            await sleep(requestTimeout)

            const vpDelta = vp.sub(states[0])
            const vpSpentDelta = vpSpent.sub(states[1])

            sign = vpDelta.isNegative() ? '-' : '+'
            console.log(`Signer Voting Power: ${vp} - state Δ: ${sign} ${vpDelta.abs()}`)
            sign = vpSpentDelta.isNegative() ? '-' : '+'
            console.log(
                `Signer Voting Power Spent: ${vpSpent} - state Δ: ${sign} ${vpSpentDelta.abs()}\n`,
            )

            const proposal = await contract.proposals(proposalNum)
            await sleep(requestTimeout)

            const voteCountDelta = proposal.voteCount.sub(states[2])

            sign = voteCountDelta.isNegative() ? '-' : '+'
            console.log(`Target Block Number: ${targetBlockNumber}\n`)

            console.log(`Voted Proposal`)
            console.log(`    Number: ${proposalNum}`)
            console.log(`    Title: ${ethers.utils.parseBytes32String(proposal.name)}`)
            console.log(
                `    Vote Count: ${proposal.voteCount} - state Δ: ${sign} ${voteCountDelta.abs()}`,
            )
            break

        default:
            break
    }

    console.log(`\n---------------`)
    await sleep(logTimeout)
}
