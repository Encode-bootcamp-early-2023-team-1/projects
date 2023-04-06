import { Component } from '@angular/core';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import { EtherService } from '../ether.service';
import lockAbi from '../lock-abi.json';
import dexAbi from '../dex-abi.json';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent {
  provider: ethers.providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;
  CONST_LOCK_TOKEN_ADDR = "0x62e95BBfb41fb50Ae6a2289E06450E7ae89fED48";
  CONST_DEX_TOKEN_ADDIR = "0x53d9CA0B2370dDfD39aef1d6D6d3cCC869a23BAf";
  lockTokenContract: Contract | undefined;
  dexTokenContract: Contract | undefined;
  blockNumber: number | string | undefined;
  availableToken: string | undefined;
  lockAmount: string | undefined;
  buyAmount : number | undefined;
  sellAmount : number | undefined;
  mintAmount : number | undefined;
  mintAddress : string | undefined;
  unlockPeriod: string | undefined;
  lockedToken: string | undefined;
  lockedTokenList: { lockedAmount: any, unlockBlockNumber: any, estimateDate: any }[] = [];

  constructor(private etherService: EtherService) {

  }

  async ngOnInit(): Promise<void> {
    this.provider = this.etherService.getProvider();
    this.walletAddress = this.etherService.getWalletAddress();
    this.signer = this.etherService.getSigner();
    await this.syncBlock();
    await this.getLockTokenContract();
    await this.getDexContract();
    await this.getAvailableAmount();
    await this.getLockedAmount();
    await this.getLockHistory();
  }

  async syncBlock() {
    this.blockNumber = 'loading...';
    this.provider?.getBlock('latest').then((block) => {
      this.blockNumber = block.number;
    });
  }


  async getLockTokenContract() {
    const lockTokenContract = new ethers.Contract(this.CONST_LOCK_TOKEN_ADDR, lockAbi, this.signer);
    this.lockTokenContract = lockTokenContract;
  }

  async getDexContract() {
    const dexTokenContract = new ethers.Contract(this.CONST_DEX_TOKEN_ADDIR, dexAbi, this.signer);
    this.dexTokenContract = dexTokenContract;
  }

  async getAvailableAmount() {
    const availableAmount = await this.lockTokenContract!["getUnlockedAmount"](this.walletAddress);
    this.availableToken = ethers.utils.formatUnits(availableAmount, 18);
  }

  async getLockedAmount() {
    const lockedAmount = await this.lockTokenContract!["getLockedAmount"](this.walletAddress);
    this.lockedToken = ethers.utils.formatUnits(lockedAmount, 18);
  }

  async handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const name = input.name;
    let value: any = input.value;

    // Use a type assertion to ensure that `this` has an index signature
    if (name === 'unlockPeriod') {
      const currentDate = new Date();
      const targetDate = new Date(value);
      const diffInSeconds = (targetDate.getTime() - currentDate.getTime()) / 1000;
      console.log(this.blockNumber);
      const newBlockToAdd = Math.ceil(diffInSeconds / 12) + Number(this.blockNumber) as number;
      value = newBlockToAdd.toString()
      console.log(diffInSeconds, newBlockToAdd, value);
    } else if (name === 'lockAmount') {

      value = ethers.utils.parseUnits(value, 18);
    } else if (name === 'sellAmount') {
      value = ethers.utils.parseUnits(value, 18);
    } else if (name === 'mintAmount') {
      value = ethers.utils.parseUnits(value, 18);
    } 
    (this as any)[name] = value;
  }

  loading = false;
  error = false;
  success = false;
  pending = false

  async lockToken() {
    this.loading = true;
    this.error = false;
    try {
      console.log(this.lockAmount);
      console.log(this.unlockPeriod);
      const userLockToken = await this.lockTokenContract!["lockAmount"](this.lockAmount, this.unlockPeriod);
      console.log(userLockToken);
      this.pending = true;
      const response = await userLockToken.wait();
      await this.getAvailableAmount();
      this.pending = false;
    } catch (error) {
      this.error = true;
      alert(error);
    } finally {
      this.loading = false
    }

  }

  async mintToken() {
    this.loading = true;
    this.error = false;
    try {
      console.log(this.mintAmount);
      console.log(this.mintAddress);
      const mintToken = await this.lockTokenContract!["mint"](ethers.utils.getAddress(this.mintAddress + ""),this.mintAmount);
      console.log(mintToken);
      this.pending = true;
      const response = await mintToken.wait();
      await this.getAvailableAmount();
      this.pending = false;
    } catch (error) {
      this.error = true;
      alert(error);
    } finally {
      this.loading = false
    }

  }

  async buyToken() {
    this.loading = true;
    this.error = false;
    try {
      console.log(this.buyAmount);
      const buyToken = await this.dexTokenContract!["buy"]({value: ethers.utils.parseEther(this.buyAmount + "")});
      console.log(buyToken);
      this.pending = true;
      const response = await buyToken.wait();
      await this.getAvailableAmount();
      this.pending = false;
    } catch (error) {
      this.error = true;
      alert(error);
    } finally {
      this.loading = false
    }

  }

  async sellToken() {
    this.loading = true;
    this.error = false;
    try {
      console.log(this.sellAmount);
      console.log('approving');
      var tk = this.sellAmount ? BigNumber.from(this.sellAmount).add(this.sellAmount) : 0
      console.log("tk:" + tk);
      const approve = await this.lockTokenContract!["approve"](ethers.utils.getAddress(this.CONST_DEX_TOKEN_ADDIR),tk);
      await approve.wait();

      const sellToken = await this.dexTokenContract!["sell"](this.sellAmount);
      await sellToken.wait(); 
      
      this.pending = true;
      await this.getAvailableAmount();
      this.pending = false;
    } catch (error) {
      this.error = true;
      alert(error);
    } finally {
      this.loading = false
    }

  }

  async getLockHistory() {
    for (let i = 0; ; i++) {
      try {
        // Code that may throw an error goes here
        const lockedAmount = await this.lockTokenContract!["lockedAmounts"](this.walletAddress, i);
        var diff = Number(this.blockNumber) - parseInt(lockedAmount.unlockBlockNumber);
        var diffTime = diff * 12; // 12 seconds per block on polygon mumbai
        console.log("difftime " + diffTime);
        let currentDate = new Date(); // get current date and time
        let secondsToAdd =  Math.abs(diffTime); // add 60 seconds to current date

        let futureDate = new Date(currentDate.setSeconds(currentDate.getSeconds() + secondsToAdd)); // set future date by adding seconds to current date
        console.log(futureDate); // output: e.g. Wed Apr 06 2023 19:09:20 GMT-0700 (Pacific Daylight Time)

        var obj = {'lockedAmount' : lockedAmount.lockedAmount, 'unlockBlockNumber' : lockedAmount.unlockBlockNumber , 'estimateDate' : futureDate};
        this.lockedTokenList.push(obj);
      } catch (err) {
        console.error(err); // Log the error to the console
        break; // Exit the loop
      }
    }

    
  }


}
