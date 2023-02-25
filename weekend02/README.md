# Weekend 2 project

Using the Ballot contract (https://docs.soliditylang.org/en/latest/solidity-by-example.html#voting) do the following:

1. Deploy the contract to a testnet
2. Give access to voters by running script GiveRightToVote.ts
3. Cast votes by running script CastVote.ts
4. Delegate votes by running script DelegateVote.ts
5. Query results by running script QueryResults.ts

Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed.

# Installation

1. Clone this repo: `git clone git@github.com:Encode-bootcamp-early-2023-team-1/projects.git`
   - NOTE: make sure to add your ssh-key to yout gitgub account first https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
2. `cd weekend02`
3. `yarn`
4. `yarn hardhat compile`
5. `cp .env.example .env`
6. Fill your `.env` file (this file won't be pushed to the repo because it will contain sensitive information)

In your `.env` file include connection details to Goerli network with enough test Ether to run the following scripts.

# Run scripts

**IMPORANT:** make sure you select the right default network in the hardhat config.

## Step 1: Deploy Ballot contract

`yarn run ts-node --files scripts/01_Deployment.ts "Option 1" "Option 2" "Option 3"`

**NOTE:** you will get the ballotAddress to be used in the next script.

## Step 2: give rights to vote

`yarn run ts-node --files scripts/02_GiveRightToVote.ts <BALLOT_ADDRESS> "voterAddress1" "voterAddress2" "voterAddressN"`

**NOTE:** you need to execute this script with the same private key (PK) as the one used to deploy the contract (meaning the chairman)

## Step 3: vote for a proposal

`yarn run ts-node --files scripts/03_CastVote.ts <BALLOT_ADDRESS> <PROPOSAL_INDEX>`

**IMPORTANT:** if you are running this script from the same machine, then you will need to change the PK in the env file to one of the voters PK. Otherwise you will be trying to vote with the chairman PK.

## Step 4: Delegate vote
`yarn run ts-node --files scripts/03_DelegateVote.ts <BALLOT_ADDRESS> <DELEGATE_ADDRESS>`
**IMPORTANT** The delegate must have >=1 voting weight

## Step 5: Query results
`yarn run ts-node --files scripts/03_QueryResults.ts <BALLOT_ADDRESS>`
