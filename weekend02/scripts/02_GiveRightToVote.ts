import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files scripts/02_GiveRightToVote.ts "0x0000..." "0x0000..." "0x0000..."

async function main() {
    const args = process.argv;

    const voters = args.slice(2);

    if (voters.length <= 0) {
        throw new Error("Missing parameter : voters");
    }

    const provider = ethers.provider;
    const pkey = process.env.PRIVATE_KEY;

    if (!pkey || pkey.length <= 0) {
        throw new Error("Missing environment : mnemonic seed");
    }

    const wallet = new ethers.Wallet(pkey);
    // Get your signer from .env (should be chairperson)
    const signer1 = wallet.connect(provider);

    const ballotAddress = process.env.BALLOT_ADDRESS
    if (!ballotAddress || ballotAddress.length <= 0) {
        throw new Error("Missing environment : ballot address");
    }

    // create a contract instance (attach)
    const ballotContractFactory = new Ballot__factory(signer1);
    const ballotContract = ballotContractFactory.attach(ballotAddress);

    for (let index = 0; index < voters.length; index++) {
        console.log(`Giving rifht to vote to ${voters[index]}`)
        await ballotContract.giveRightToVote(voters[index])
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
