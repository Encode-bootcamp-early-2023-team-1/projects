import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files scripts/03_CastVote.ts <BALLOT_ADDRESS> <PROPOSAL_INDEX>

async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotAddress = args.slice(2, 3)[0];
    const proposalIndex = args.slice(3, 4)[0];

    if (!ballotAddress || ballotAddress.length <= 0) {
        throw new Error("Missing parameter: ballot address");
    }

    if (!proposalIndex) {
        throw new Error("Missing parameter: proposal index");
    }

    // get default provider from hardhat config
    const provider = ethers.provider;
    const pkey = process.env.PRIVATE_KEY;

    if (!pkey || pkey.length <= 0) {
        throw new Error("Missing environment : mnemonic seed");
    }

    const wallet = new ethers.Wallet(pkey);
    // Get your signer from .env (should be a voter)
    const signer1 = wallet.connect(provider);

    // create a contract instance (attach)
    const ballotContractFactory = new Ballot__factory(signer1);
    const ballotContract = ballotContractFactory.attach(ballotAddress);

    console.log(`About to vote for proposal ${proposalIndex}`)
    await ballotContract.vote(proposalIndex)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
