import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/modules/main-page/main-page.module').then(m => m.MainPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/users/users.module').then(m => m.UsersModule)
      },
      {
        path: '',
        loadChildren: () => import('src/app/modules/musical-bands/musical-bands.module').then(m => m.MusicalBandsModule)
      }
    ]
    
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
