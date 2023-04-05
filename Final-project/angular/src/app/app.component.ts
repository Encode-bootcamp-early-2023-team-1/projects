import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import erc20voteJson from './erc20-abi.json'
import lockAbi from './lock-abi.json'
import tokenizedBallotJson from './tokenizedballot-abi.json'
import lotteryAbi from './lottery-abi.json';
import lotteryTokenAbi from './lottery-token-abi.json';

declare var window: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  blockNumber: number | string | undefined;
  // provider : ethers.providers.BaseProvider;
  provider: ethers.providers.Web3Provider | undefined;
  transactions: string[] | undefined;
  userEthBalance: string | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;
  ballotContract: Contract | undefined;
  numProposal: BigNumber | undefined;
  proposalNames: string[] = [];
  proposalCounts: BigNumber[] = [];
  winnerName: string | undefined;
  // Used in voting tokenized ballot
  selectedOption: string | undefined;
  voteNumber: number = 0;
  erc20VoteContract: Contract | undefined;
  // Used in delegate
  voteTokenSymbol: string | undefined;
  voteTokenBalance: BigNumber | undefined;
  voteTokenDelegate: number = 0;

  lotteryTokenSymbol: string | undefined;
  lotteryTokenBalance: BigNumber | undefined;
  allowanceBalance: string = '0';
  lotteryPrizePool: BigNumber | undefined;

  betManyCount : number = 0;
  winAmount : number = 0;

  // lock variable
 availableToken :  string | undefined;
 lockAmount : string | undefined;
 unlockPeriod : string | undefined
 lockTokenContract : Contract | undefined;


  CONST_GOERLIETH_ADDRESS: string = "0x7af963cf6d228e564e2a0aa0ddbf06210b38615d";
  CONST_ERC20VOTE_ADDRESS: string = "0x19cA7135FD75552ACEa1027065DC10AB41b38B34";
  CONST_TOKENIZED_BALLOT_ADDRESS: string = "0x33048359595Def305206558a9a156cc1d97A1C10";
  CONST_LOCALHOST_VOTE: string = "";


  // Weekend 5
  // Goerli
  CONST_LOTTERY_ADDRESS = "0xEDfbA0705478680B0A973c6F2aD17B5feF1853d7";
  CONST_LOTTERY_TOKEN_ADDRESS = "0x2ab0735F9112299c8279D3aB976335ec77987BB8";

  // Mumbai polygon address
  // CONST_LOTTERY_ADDRESS = "0x59F566B70065B4FC56F7425730beb661B57f18b7";
  // CONST_LOTTERY_TOKEN_ADDRESS = "0x28f5EDc1663C65fb02c3e3Fbc3773778E2dc4C51";

  // final project

  CONST_LOCK_TOKEN = "0x2ab0735F9112299c8279D3aB976335ec77987BB8";

  constructor(private http: HttpClient) {

  }

  syncBlock() {
    this.blockNumber = 'loading...';
    this.provider?.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
      this.transactions = block.transactions;
    });
  }

  onOptionChange(event: any) {
    this.selectedOption = event.target.value;
    console.log(`The selected radio is: ${this.selectedOption}`);
  }

  onInputChange(event: any) {
    this.voteNumber = event.target.value;
    console.log(`The input value is: ${this.voteNumber}`);
  }

  onVoteTokenDelegateInputChange(event: any) {
    this.betManyCount = event.target.value;
    console.log(`The input value is: ${this.betManyCount}`);
  }

  getTokenAddess() {
    return this.http.get<{ address: string }>(this.CONST_LOCALHOST_VOTE);
  }

  // example ussage of http pub sub
  tokenContractAddress: string | undefined;
  httpvote() {
    this.getTokenAddess().subscribe((response) => {
      this.tokenContractAddress = response.address;
    })
  }

  clearBlock() {
    this.blockNumber = 0;
  }

  async getVoteTokenSymbol() {
    if (this.erc20VoteContract !== undefined) {
      this.voteTokenSymbol = await this.erc20VoteContract['symbol']();
    }
  }

  async getVoteTokenBalance() {
    if (this.erc20VoteContract !== undefined) {
      console.log("wallet: " + this.walletAddress);
      const balance = await this.erc20VoteContract['balanceOf'](ethers.utils.getAddress(this.walletAddress ?? ""));
      this.voteTokenBalance = balance;
    }
  }


  async delegateVote() {
    const erc20VoteSignContract = new ethers.Contract(this.CONST_ERC20VOTE_ADDRESS, erc20voteJson, this.signer);
    if (erc20VoteSignContract !== undefined) {
      erc20VoteSignContract['delegate'](ethers.utils.getAddress(this.walletAddress ?? "")).then((tx: any) => {
        // Transaction successful
        console.log(tx);
        alert(tx);
      }).catch((error: { message: any; }) => {
        // Transaction failed
        alert(error.message);
        console.log(error.message);
      });
    }
  }


  async getWinnerName() {
    if (this.ballotContract !== undefined) {
      const name = await this.ballotContract['winnerName']();
      const text = ethers.utils.parseBytes32String(name).trim();
      this.winnerName = text;
    }
  }

  async getProposalCount() {
    if (this.ballotContract !== undefined) {
      this.numProposal = await this.ballotContract['numProposals']();
    }
  }

  async vote() {
    const ballotVoteContract = new ethers.Contract(this.CONST_TOKENIZED_BALLOT_ADDRESS, tokenizedBallotJson, this.signer);
    if (ballotVoteContract !== undefined) {
      ballotVoteContract['vote'](BigNumber.from(this.selectedOption), BigNumber.from(this.voteNumber)).then((tx: any) => {
        // Transaction successful
        console.log(tx);
      }).catch((error: { message: any; }) => {
        // Transaction failed
        alert(error.message);
      });

    }
  }

  async getContract() {
    this.ballotContract = new ethers.Contract(this.CONST_TOKENIZED_BALLOT_ADDRESS, tokenizedBallotJson, this.provider);
  }

  async getVoteContract() {
    this.erc20VoteContract = new ethers.Contract(this.CONST_ERC20VOTE_ADDRESS, erc20voteJson, this.provider);
  }

  async getProposalName() {
    if (this.ballotContract !== undefined) {
      if (this.numProposal !== undefined) {
        for (let i = BigNumber.from(0); i.lt(this.numProposal); i = i.add(BigNumber.from(1))) {
          const proposal = await this.ballotContract['proposals'](i);
          const text = ethers.utils.parseBytes32String(proposal.name).trim();
          const count = proposal.voteCount;
          this.proposalNames?.push(text);
          this.proposalCounts?.push(count);
        }
      }
    }
  }

  async connectToMetamask() {
    if (window.ethereum) {
      // Wait for the window.ethereum.enable() method to show the Metamask UI and request user permission
      await window.ethereum.enable();
      console.log('Connected to Metamask!');

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      await this.signer.getAddress().then(address => {
        this.walletAddress = address;
        // console.log('Current account address:', address);
        this.getUserTokenBalance();
        this.setLotteryContract();
        this.setTokenContract();
        this.getAllowance();
        this.getPrizePool();
        this.getLockTokenContract();
        this.getAvailableAmount();

      }).catch(error => {
        console.error(error);
      });

      await this.signer.getBalance().then(balance => {
        this.userEthBalance = ethers.utils.formatEther(balance);
        console.log('Current account eth balance:', balance);
      }).catch(error => {
        console.error(error);
      })

      console.log("goerli address: " + this.CONST_GOERLIETH_ADDRESS);

      // in sequence 
      await this.syncBlock();
      await this.getContract();
      await this.getVoteContract();
      await this.getVoteTokenSymbol();
      await this.getVoteTokenBalance();
      await this.getProposalCount();
      await this.getProposalName();
      await this.getWinnerName();
      
    } else {
      console.error('Metamask not detected');
    }
  }

  // Captures 0x + 4 characters, then the last 4 characters.
  truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  /**
   * Truncates an ethereum address to the format 0x0000…0000
   * @param address Full address to truncate
   * @returns Truncated address
   */
  truncateEthAddress = (address = "0x") => {
    const match = address.match(this.truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };


  async getPrizePool() {
    try {
      let prizepool = await this.lotteryContract!["prizePool"]();
      this.lotteryPrizePool = prizepool;
    } catch (error) {
      console.log(error);
    }

  }

  // lottery codes
  async getUserTokenBalance() {
    const lotteryTokenContract = new ethers.Contract(this.CONST_LOTTERY_TOKEN_ADDRESS, lotteryTokenAbi, this.signer);
    if (!lotteryTokenContract) return
    try {
      const balance = await lotteryTokenContract["balanceOf"](this.walletAddress)
      this.lotteryTokenBalance = balance.toString()
    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    }
    // {

    // erc20VoteSignContract['delegate'](ethers.utils.getAddress(this.walletAddress ?? "")).then((tx: any) => {
    //   // Transaction successful
    //   console.log(tx);
    //   alert(tx);
    // }).catch((error: { message: any; }) => {
    //   // Transaction failed
    //   alert(error.message);
    //   console.log(error.message);
    // });
    // }
  }
  lotteryContract: Contract | undefined;
  tokenContract: Contract | undefined;
  async buyTokens() {
    // contractInstance.testFunction(<any function args>, { value: ethers.utils.parseUnits("1", "ether") });
    try {
      // how to send ether to function
      // https://stackoverflow.com/questions/71422360/how-to-send-eth-to-a-contract-function-with-ethers-js
      await this.lotteryContract!['purchaseTokens']({ value: ethers.utils.parseUnits(this.tokenBuyInput as string, "ether") })
    } catch (error) {
      console.log(error)
    }

  }

  tokenBuyInput: string | undefined;
  async onTokenBuyInputChange(e: any) {
    this.tokenBuyInput = e.target.value;
  }
  async setLotteryContract() {
    const lotteryContract = new ethers.Contract(this.CONST_LOTTERY_ADDRESS, lotteryAbi, this.signer);
    this.lotteryContract = lotteryContract;
  }
  async setTokenContract() {
    const getLotteryToken = new ethers.Contract(this.CONST_LOTTERY_TOKEN_ADDRESS, lotteryTokenAbi, this.signer);
    this.tokenContract = getLotteryToken;
  }

  async getAllowance() {
    try {
      let checkAllowance = await this.tokenContract!["allowance"](this.walletAddress, this.CONST_LOTTERY_ADDRESS);
      this.allowanceBalance = checkAllowance.toString();
    } catch (error) {
      console.error(error);
    }
  }
  async approveTokens() {
    try {
      let approveContract = await this.tokenContract!["approve"](this.CONST_LOTTERY_ADDRESS, ethers.utils.parseUnits((1 * 10 ** 18).toString(), "ether"));
      alert("transaction sent successfully")
      await approveContract.wait();
      alert("transaction confirmed")
      this.getAllowance()
    } catch (error) {
    }
  }

  async bet() {
    try {
      let betting = await this.lotteryContract!["bet"]()
      alert("transaction sent successfully")
      await betting.wait();
      alert("transaction confirmed")
    } catch (error) {

    }
  }

  async betMany() {
    try {
      let betting = await this.lotteryContract!["betMany"](BigNumber.from(this.betManyCount))
      alert("transaction sent successfully")
      await betting.wait();
      alert("transaction confirmed")
    } catch (error) {

    }
  }

  async showWinAmount() {
    try {
      let betting = await this.lotteryContract!["prize"](ethers.utils.getAddress(this.walletAddress ?? ""))
      await betting.wait();
      this.winAmount = betting;
    } catch (error) {

    }
  }


  // lock token Code

  async getLockTokenContract(){
    const lockTokenContract = new ethers.Contract(this.CONST_LOCK_TOKEN, lockAbi, this.signer);
    this.lockTokenContract = lockTokenContract;
  }

  async getAvailableAmount(){
    const availableAmount = await this.lockTokenContract!["getUnlockedAmount"](this.walletAddress);
    this.availableToken  = availableAmount.toString() ?? '0';
}

async handleChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const name = input.name;
  let value = input.value;

  // Use a type assertion to ensure that `this` has an index signature
  if (name === 'unlockPeriod') {
    const currentDate = new Date();
    const targetDate = new Date(value);
    const diffInSeconds = (targetDate.getTime() - currentDate.getTime()) / 1000;
    const newBlockToAdd = Math.ceil(diffInSeconds / 12) + Number(this.blockNumber) as number;
    value = newBlockToAdd.toString()
    // console.log(diffInSeconds, newBlockToAdd, value);
  }
  (this as any)[name] = value;
}

loading = false;
error = false;
success = false;
pending = false

async lockToken (){
  this.loading = true;
  this.error = false;
  try {
    const userLockToken = await this.lockTokenContract!["lock"](this.lockAmount, this.unlockPeriod);
    this.pending= true;
    const response = await userLockToken.wait();
    this.pending = false;
  } catch (error) {
    this.error = true;
  } finally {
    this.loading = false
  }
  
}

}
