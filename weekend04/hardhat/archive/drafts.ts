// SECTION BELOW FUNCTIONS SHOULD BE MORE GENERIC (COMPLICATED TO IMPLEMENT)
// Proposals State Information - Only Works With TokenizedBallot Contract
export const logProposalState = async (contract: any) => {
    console.log(`\n- Tokenized Ballot Proposals State -\n`)

    const targetBlockNumber = await contract.targetBlockNumber()
    await sleep(requestTimeout)
    const numProposals = await contract.numProposals()
    await sleep(requestTimeout)

    // Contract Information
    console.log(`Contract Address: ${contract.address}`)
    console.log(`Target Block Number: ${targetBlockNumber}`)
    console.log(`Number of Proposals: ${numProposals}\n`)

    for (let i = 0; i < numProposals; i++) {
        const proposal = await contract.proposals(i)
        await sleep(requestTimeout)
        console.log(`Proposal ${i}`)
        console.log(`   Title: ${ethers.utils.parseBytes32String(proposal.name)}`)
        console.log(`   Vote Count: ${proposal.voteCount}\n`)
    }

    console.log(`---------------\n`)
    await sleep(logTimeout)
}

// Accounts State Information - Only Works With TokenizedBallot Contract
export const logAccountState = async (contract: any, addresses: string[]) => {
    console.log(`\n- Tokenized Ballot Accounts State -\n`)

    const targetBlockNumber = await contract.targetBlockNumber()
    await sleep(requestTimeout)
    const numProposals = await contract.numProposals()
    await sleep(requestTimeout)

    // Contract Information
    console.log(`Contract Address: ${contract.address}`)
    console.log(`Target Block Number: ${targetBlockNumber}`)
    console.log(`Number of Proposals: ${numProposals}\n`)

    console.log(`Number of Accounts: ${addresses.length}\n`)

    for (let i = 0; i < addresses.length; i++) {
        const balance = await ethers.provider.getBalance(addresses[i])
        await sleep(requestTimeout)
        const votingPower = await contract.votingPower(addresses[i])
        await sleep(requestTimeout)
        const votingPowerSpent = await contract.votingPowerSpent(addresses[i])
        await sleep(requestTimeout)
        console.log(`Account ${i}`)
        console.log(`   Address: ${addresses[i]}`)
        console.log(`   Balance: ${ethers.utils.formatEther(balance)} ETH`)
        console.log(`   Voting Power: ${votingPower}`)
        console.log(`   Voting Power Spent: ${votingPowerSpent}\n`)
    }

    console.log(`---------------\n`)
    await sleep(logTimeout)
}
