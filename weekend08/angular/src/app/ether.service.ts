import { Injectable } from '@angular/core';
import { ethers , Signer} from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class EtherService {

  provider: ethers.providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;

  constructor() { }

  setSigner ( signer : Signer) {
    this.signer = signer;
  }

  getSigner () {
    return this.signer;
  }

  setProvider (provider : ethers.providers.Web3Provider) {
    this.provider = provider;
  }

  getProvider () {
    return this.provider;
  }

  setWalletAddress (walletAddress : string) {
    this.walletAddress = walletAddress;
  }

  getWalletAddress () {
    return this.walletAddress;
  }
}
