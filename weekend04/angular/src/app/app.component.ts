import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import erc20voteJson from './erc20vote-abi.json';
import tokenizedBallotJson from './tokenizedballot-abi.json';

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
  ballotContract : Contract | undefined;
  numProposal : BigNumber | undefined;
  proposalNames : string [] = [];
  proposalCounts : BigNumber [] = [];
  winnerName : string | undefined;
  // Used in voting tokenized ballot
  selectedOption: string | undefined;
  voteNumber: number = 0;
  erc20VoteContract : Contract | undefined;
  // Used in delegate
  voteTokenSymbol : string | undefined;
  voteTokenBalance : BigNumber | undefined;
  voteTokenDelegate: number = 0;


  CONST_GOERLIETH_ADDRESS: string = "0x7af963cf6d228e564e2a0aa0ddbf06210b38615d";
  CONST_ERC20VOTE_ADDRESS: string = "0x19cA7135FD75552ACEa1027065DC10AB41b38B34";
  CONST_TOKENIZED_BALLOT_ADDRESS: string = "0x33048359595Def305206558a9a156cc1d97A1C10";
  CONST_LOCALHOST_VOTE: string = "";

  constructor (private http: HttpClient){
    
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
    this.voteTokenDelegate = event.target.value;
    console.log(`The input value is: ${this.voteTokenDelegate}`);
  }

  getTokenAddess() {
    return this.http.get<{address: string}>(this.CONST_LOCALHOST_VOTE);
  }

  // example ussage of http pub sub
  tokenContractAddress : string | undefined;
  httpvote () {
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
      console.log("wallet: " + this.walletAddress );
      const balance = await this.erc20VoteContract['balanceOf'](ethers.utils.getAddress(this.walletAddress ?? ""));
      this.voteTokenBalance = balance; 
    }
  }

  //userWallet: Wallet | undefined;

  // createWallet() {
  //   this.userWallet = Wallet.createRandom().connect(this.provider);
  //   this.userWallet.getBalance().then((balanceBN) => {
  //     const balanceStr = utils.formatEther(balanceBN);
  //     this.userEthBalance = parseFloat(balanceStr);
  //   })
  // }

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
      ballotVoteContract['vote'](BigNumber.from(this.selectedOption),BigNumber.from(this.voteNumber)).then((tx: any) => {
        // Transaction successful
        console.log(tx);
      }).catch((error: { message: any; }) => {
        // Transaction failed
        alert(error.message);
      });
      
    }
  }

  async getContract () {
    this.ballotContract = new ethers.Contract(this.CONST_TOKENIZED_BALLOT_ADDRESS, tokenizedBallotJson, this.provider);
  }

  async getVoteContract () {
    this.erc20VoteContract = new ethers.Contract(this.CONST_ERC20VOTE_ADDRESS, erc20voteJson, this.provider);
  }

  async getProposalName () {
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
        console.log('Current account address:', address);
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
 truncateEthAddress = (address ="0x") => {
  const match = address.match(this.truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

}

