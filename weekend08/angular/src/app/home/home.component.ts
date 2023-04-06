import { Component, Input } from '@angular/core';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import { EtherService } from '../ether.service';

declare var window: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  provider: ethers.providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;

  constructor(private etherService : EtherService) {

  }

  ngOnInit(): void {
    this.provider = this.etherService.getProvider();
    this.walletAddress = this.etherService.getWalletAddress();
    this.signer = this.etherService.getSigner();
  }


}
