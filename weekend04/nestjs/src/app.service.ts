import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const CONTRACT = '0xF87E4c0d83f54e51FE5e911FaF4ce9D4D8e05310';

@Injectable()
export class AppService {

  provider:ethers.providers.Provider;
  contract:ethers.Contract

  constructor(){
    this.provider = ethers.getDefaultProvider('goerli');
    this.contract = new ethers.Contract(CONTRACT, tokenJson.abi, this.provider)
  }
  getHello(): string {
    return 'Hello World!';
  }
  getContractAddress(): string {
    return CONTRACT;
  }
  async getTotalSupply(): Promise<number> {
    const totalSupply = this.contract.totalSupply();
    const formattedTotalSupply = ethers.utils.formatEther(totalSupply);
    const totalSupplyNumber = parseFloat(formattedTotalSupply)
    return totalSupplyNumber;
  }

  async getAllowance(from:string, to:string):Promise<number>{
    const allowance = this.contract.allowance(from, to);
    const formattedAllowance = ethers.utils.formatEther(allowance);
    const numberAllowance = parseFloat(formattedAllowance);
    return numberAllowance;
  }

  async getTransactionStatus(hash:string):Promise<string>{
    const tx = await this.provider.getTransaction(hash)
    const txReceipt = await tx.wait();
    return txReceipt.status ? "Completed" : "Reverted"
  }

  async getTransactionReceipt(hash:string):Promise<string>{
    const tx = await this.provider.getTransactionReceipt(hash);
    return tx ? "Worked" : "It did not work";
  }
  
}
