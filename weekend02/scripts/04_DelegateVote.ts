
import * as dotenv from 'dotenv';
dotenv.config();
import { ethers } from "ethers";
import { Ballot__factory } from '../typechain-types';


async function main() {
  const args = process.argv;
  const contractAddress = args.slice(2)?.[0]; 
  const delegateVote = args.slice(2)?.[1];
  if (delegateVote.length <= 0) throw new Error ("Missing address: address");

    // this flow below sets up a provider
    const provider = ethers.getDefaultProvider("goerli");
        // to validate privatKey
        const privateKey = process.env.DELEGATE_KEY
        if (!privateKey || privateKey.length <=0 ) throw new Error ("Missing privateKey: privateKey");
        // to connect using privateKey
        const wallet = new ethers.Wallet(privateKey)
        const signer =wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);

  // attaching the contract to the deployed network
   const ballotContract = await ballotContractFactory.attach(contractAddress);
  //  const voterWeight = await ballotContract.voters("0x4088edFa1ab3792b4Ec3B8fafaC0C20aDd364609")
  //  console.log((voterWeight.weight).toString());
    const txId =  await (await ballotContract.delegate(delegateVote)).wait();
    console.log(txId);
    console.log(`Vote has been delegated to ${delegateVote} `)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

