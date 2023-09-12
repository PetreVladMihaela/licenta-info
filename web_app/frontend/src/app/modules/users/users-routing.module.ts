import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { BandInfoComponent } from '../musical-bands/band-info/band-info.component';
import { AdminPageComponent } from './admin/admin-page.component';

const routes: Routes = [
  {
    path: '', // http://localhost:4200/users
    pathMatch: 'full',
    redirectTo: '/' // http://localhost:4200
  },

  {
    path: 'account/:username',
    component: AccountInfoComponent
  },

  {
    path: 'account/band/:bandId',
    component: BandInfoComponent
  },

  {
    path: 'account',
    redirectTo: '/auth/login'
  },

  {
    path: 'adminPage',
    component: AdminPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
