import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/can-deactivate.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '', //http://localhost:4200/auth
    pathMatch: 'full', 
    redirectTo: 'login'
  },
  
  {
    path: 'signup',
    component: SignupComponent,
    canDeactivate: [CanDeactivateGuard]
  },

  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  //providers: [CanDeactivateGuard]
})
export class AuthRoutingModule { }
