import { Component, Input } from '@angular/core';
import { ethers, Wallet, utils, Signer, BigNumber, BigNumberish, Contract } from 'ethers';
import { EtherService } from '../ether.service';
import factoryABI from '../uniswap-factory-abi.json';
import pairABI from '../uniswap-pair-abi.json';
import ERC20ABI from '../erc20-abi.json';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent {

  provider: ethers.providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  signer: Signer | undefined;
  ethPrice: number = 0;
  userEthBalance : number = 0;
  uniswapPrice: number = 0;
  userUniswapBalance : number =0 ;

  constructor(private etherService: EtherService) {

  }

  ngOnInit(): void {
    this.provider = this.etherService.getProvider();
    this.walletAddress = this.etherService.getWalletAddress();
    this.signer = this.etherService.getSigner();

    this.getEthereumValue();
    this.getUniswapValue();
  }

  async getEthereumValue() {
    try {

      const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
      const ethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'; // wrapped ether
      const tokenAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'; // USDC
      // const factoryABI = ['function getPair(address tokenA, address tokenB) external view returns (address pair)']
      // const pairABI = ['function kLast() external view returns (uint)']

      const factory = new ethers.Contract(factoryAddress, factoryABI, this.signer);
      if (factory !== undefined) {
        await factory['getPair'](ethAddress, tokenAddress).then(async (pairAddress: any) => {
          // Transaction successful
          console.log("successful get pair");
        
          let tokenReserve: any = 0;
          let nativeReserve: any = 0;
          
          const pair = new ethers.Contract(pairAddress, pairABI, this.signer);

          await pair['getReserves']().then((value: any) => {
            tokenReserve = value[0];
            nativeReserve = value[1];
            console.log("tokenreserve :" + tokenReserve);
            console.log("nativeReserve :" + nativeReserve);
          });

          // calculate price
          const price = nativeReserve / tokenReserve;
          this.ethPrice = price;

          await this.getEthTokenBalance();

          console.log(`Eth Token price: ${price}`);
          console.log(`Eth Token balance: ${this.userEthBalance}`);
        }).catch((error: { message: any; }) => {
          // Transaction failed
          console.log(error);
        });
      }

    } catch (error) {
      return error
    }
  }

  async getUniswapValue() {
    try {

      const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
      const uniswapAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; // uniswap
      const tokenAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'; // USDC
      // const factoryABI = ['function getPair(address tokenA, address tokenB) external view returns (address pair)']
      // const pairABI = ['function kLast() external view returns (uint)']

      const factory = new ethers.Contract(factoryAddress, factoryABI, this.signer);
      if (factory !== undefined) {
        await factory['getPair'](uniswapAddress, tokenAddress).then(async (pairAddress: any) => {
          // Transaction successful
          console.log("successful get pair");
        
          let tokenReserve: any = 0;
          let nativeReserve: any = 0;
          
          const pair = new ethers.Contract(pairAddress, pairABI, this.signer);

          await pair['getReserves']().then((value: any) => {
            tokenReserve = value[0];
            nativeReserve = value[1];
            console.log("tokenreserve :" + tokenReserve);
            console.log("nativeReserve :" + nativeReserve);
          });

          // calculate price
          let price = nativeReserve / tokenReserve;
          this.uniswapPrice = price;

          let balance = await this.getTokenBalance(uniswapAddress, this.walletAddress? this.walletAddress : '', 18);
          this.userUniswapBalance = parseFloat(balance);
          
          console.log(`Uniswap Token price: ${price}`);
          console.log(`Uniswap Token balance: ${balance}`);
        }).catch((error: { message: any; }) => {
          // Transaction failed
          console.log(error);
        });
      }

    } catch (error) {
      return error
    }
  }

  async getEthTokenBalance() {

    await this.signer?.getBalance().then(balance => {
      let etherBalance = ethers.utils.formatEther(balance);
      this.userEthBalance = parseFloat(etherBalance);
      console.log('Current account eth balance:', etherBalance);
    }).catch(error => {
      console.error(error);
    })
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string, decimals: number): Promise<string> {
  
    // Create a new instance of the ERC20 token contract
    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, this.provider);
  
    // Get the balance of the token for the wallet address
    const tokenBalance = await tokenContract['balanceOf'](walletAddress);

    console.log("tokenBalance : " + tokenBalance);
  
    // Convert the token balance from the smallest unit to the actual token value
    const tokenValue = ethers.utils.formatUnits(tokenBalance, decimals);
    console.log("tokenValue :" + tokenValue);
    return tokenValue;
  }





}
