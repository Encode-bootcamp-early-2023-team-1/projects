import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import { EtherService } from './ether.service';

declare var window: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: '<app-child [provider]="provider" [walletAddress]="walletAddress" [signer]="signer" [userEthBalance]="userEthBalance"></app-child>'
})
export class AppComponent {

  provider: ethers.providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;

  userEthBalance: string | undefined;

  CONST_GOERLIETH_ADDRESS: string = "0x7af963cf6d228e564e2a0aa0ddbf06210b38615d";

  constructor(private http: HttpClient , private router: Router , private etherService : EtherService) {

  }

  ngOnInit() {

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
      }).catch(error => {
        console.error(error);
      });

      // await this.signer.getBalance().then(balance => {
      //   this.userEthBalance = ethers.utils.formatEther(balance);
      //   console.log('Current account eth balance:', balance);
      // }).catch(error => {
      //   console.error(error);
      // })

      // Pass to ether service object to make available to all pages
      this.etherService.setSigner(this.signer);
      this.etherService.setProvider(this.provider);
      this.etherService.setWalletAddress(this.walletAddress ?? "");

      this.router.navigate(['/lock']);
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

}

