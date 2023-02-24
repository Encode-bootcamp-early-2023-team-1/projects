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

# Deploy contract

Once the contract is depoyed to Goerli, include the contract adddress in the `.env` file

`yarn run ts-node --files scripts/01_Deployment.ts "arg1" "arg2" "arg3"`

# Run scripts
