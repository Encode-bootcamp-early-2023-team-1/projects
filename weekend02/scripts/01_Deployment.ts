import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

// Run script as follow:
// yarn run ts-node --files scripts/Deployment.ts "arg1" "arg2" "arg3"

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    const args = process.argv;
    
    const PROPOSALS = args.slice(2);

    if (PROPOSALS.length <= 0) {
        throw new Error("Missing parameter : proposals");
    }
    
    const pkey=  process.env.PRIVATE_KEY;

    if ( !pkey || pkey.length <= 0) {
        throw new Error("Missing environment : mnemonic seed");
    }

    //Get a provider
    const provider = ethers.getDefaultProvider("goerli");

    //Get your signer from .env ( chairperson)
    const wallet = new ethers.Wallet(pkey);
    const signer1= wallet.connect(provider);

    //create a contract instance (attach)
    const ballotContractFactory = new Ballot__factory(signer1);
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS)
    );

    console.log("Deploying contract ...");
    await ballotContract.deployTransaction.wait();
    console.log(`The contract was deployed at the address ${ballotContract.address}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


