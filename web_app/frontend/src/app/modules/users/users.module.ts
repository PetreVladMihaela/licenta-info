import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { ProfilesModule } from './profiles.module';

@NgModule({
  declarations: [ AccountInfoComponent, UserProfileFormComponent ],
  imports: [
    CommonModule, 
    UsersRoutingModule, 
    MaterialModule, 
    ReactiveFormsModule,
    ProfilesModule,
  ]
})
export class UsersModule {}
