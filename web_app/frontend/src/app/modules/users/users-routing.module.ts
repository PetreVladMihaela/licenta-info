import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';

const routes: Routes = [
  {
    path: '', // http://localhost:4200/users
    pathMatch: 'full',
    redirectTo: '/' // http://localhost:4200
  },

  {
    path: 'info/:username',
    component: AccountInfoComponent
  },

  {
    path: 'info',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
