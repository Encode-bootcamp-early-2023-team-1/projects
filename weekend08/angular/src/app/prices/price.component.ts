import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  // Add other relevant properties here
}

@Component({
  selector: 'app-crypto-currency-list',
  templateUrl: './crypto-currency-list.component.html',
  styleUrls: ['./crypto-currency-list.component.css']
})
export class CryptoCurrencyListComponent implements OnInit {
  cryptos: Crypto[] = [];
  selectedCrypto: Crypto | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Fetch the top 100 cryptocurrencies from CoinGecko API
    this.http.get<Crypto[]>('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1')
      .subscribe((data: Crypto[]) => {
        this.cryptos = data;
      }, (error: any) => {
        console.error('Failed to fetch cryptocurrencies', error);
      });
  }

  handleCryptoSelect(event: any): void {
    const selectedId = event.target.value;
    this.selectedCrypto = this.cryptos.find(crypto => crypto.id === selectedId) || null;
  }
}
