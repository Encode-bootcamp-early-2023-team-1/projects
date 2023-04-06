import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { HomeComponent } from './home/home.component';
import { BalancesComponent } from './balances/balances.component';
import { LockComponent } from './lock/lock.component';

@NgModule({
  declarations: [
    AppComponent,
    WithdrawComponent,
    HomeComponent,
    BalancesComponent,
    LockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
