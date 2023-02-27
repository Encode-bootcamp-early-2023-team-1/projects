import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
  const args = process.argv;
  const contractAddress = args.slice(2)?.[0];
  const delegateVote = args.slice(2)?.[1];
  if (delegateVote.length <= 0) throw new Error("Missing address: address");

  // this flow below sets up a provider
  const provider = ethers.provider;
  // to validate privatKey
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey || privateKey.length <= 0) throw new Error("Missing privateKey: privateKey");
  // to connect using privateKey
  const wallet = new ethers.Wallet(privateKey)
  const signer = wallet.connect(provider);

  const ballotContractFactory = new Ballot__factory(signer);

  // attaching the contract to the deployed network
  const ballotContract = ballotContractFactory.attach(contractAddress);
  const txId = await (await ballotContract.delegate(delegateVote)).wait();
  console.log(`Vote has been delegated to ${delegateVote} in txid ${txId}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

