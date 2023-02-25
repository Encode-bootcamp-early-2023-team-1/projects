
import * as dotenv from 'dotenv';
dotenv.config();
import { ethers } from "ethers";
import { Ballot__factory } from '../typechain-types';


async function main() {
  const args = process.argv;
  const contractAddress = args.slice(2)?.[0]; 
  if (contractAddress.length <= 0) throw new Error ("Missing parameters: address");


    // this flow below sets up a provider
    const provider = ethers.getDefaultProvider("goerli");
        // to validate privatKey
        const privateKey = process.env.PRIVATE_KEY
        if (!privateKey || privateKey.length <=0 ) throw new Error ("Missing privateKey: privateKey");
        // to connect using privateKey
        const wallet = new ethers.Wallet(privateKey)
        const signer =wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);

  // attaching the contract to the deployed network
   const ballotContract = await ballotContractFactory.attach(contractAddress);
    const winnerProposed = await ballotContract.winningProposal();
    console.log(` Winner proposal ${winnerProposed} `)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

