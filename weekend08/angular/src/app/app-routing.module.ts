import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalancesComponent } from './balances/balances.component';
import { HomeComponent } from './home/home.component';
import { LockComponent } from './lock/lock.component';
import { WithdrawComponent } from './withdraw/withdraw.component';

const routes: Routes = [
  { path: 'home', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'withdraw', redirectTo: '/withdraw', pathMatch: 'full' },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'lock', redirectTo: '/lock', pathMatch: 'full' },
  { path: 'lock', component: LockComponent },
  { path: 'balances', redirectTo: '/balances', pathMatch: 'full' },
  { path: 'balances', component: BalancesComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
