import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// yarn run ts-node --files scripts/02_GiveRightToVote.ts <BALLOT_ADDRESS> "voterAddress1" "voterAddress2" "voterAddressN"

async function main() {
    const args = process.argv;

    // TODO: do proper check before using it
    const ballotAddress = args.slice(2, 3)[0];
    const voters = args.slice(3);

    if (!ballotAddress || ballotAddress.length <= 0) {
        throw new Error("Missing parameter: ballot address");
    }

    if (voters.length <= 0) {
        throw new Error("Missing parameter: voters");
    }

    // get default provider from hardhat config
    const provider = ethers.provider;
    const pkey = process.env.PRIVATE_KEY;

    if (!pkey || pkey.length <= 0) {
        throw new Error("Missing environment : mnemonic seed");
    }

    const wallet = new ethers.Wallet(pkey);
    // Get your signer from .env (should be chairperson)
    const signer1 = wallet.connect(provider);

    // create a contract instance (attach)
    const ballotContractFactory = new Ballot__factory(signer1);
    const ballotContract = ballotContractFactory.attach(ballotAddress);

    console.log(`Giving rights to vote to ballot with address ${ballotAddress}`)
    for (let index = 0; index < voters.length; index++) {
        console.log(`Giving right to vote to ${voters[index]}`)
        await ballotContract.giveRightToVote(voters[index])
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
