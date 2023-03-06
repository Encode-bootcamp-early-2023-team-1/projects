
import { sleep } from '../tools/time'

import { processTimeout, requestTimeout } from '../constants'

export const winner = async (contract: any) => {
    console.log(`\n-- Get Winning Proposal Process Initialized --\n`)

    const winnerProposed = await contract.winningProposal()

    console.log(` Winner proposal : ${winnerProposed} \n`)

    console.log(`-- State Process Finalized --\n`)

    await sleep(processTimeout)
}
