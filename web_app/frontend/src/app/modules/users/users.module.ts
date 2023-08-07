import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profiles/user-profile.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';

@NgModule({
  declarations: [
    AccountInfoComponent, 
    UserProfileComponent, 
    UserProfileFormComponent
  ],
  imports: [
    CommonModule, 
    UsersRoutingModule, 
    MaterialModule, 
    ReactiveFormsModule
  ]
})
export class UsersModule {}
