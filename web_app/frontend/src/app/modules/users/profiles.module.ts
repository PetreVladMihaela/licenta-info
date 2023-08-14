import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../material/material.module';
import { UserProfileComponent } from './user-profiles/user-profile.component';

@NgModule({
  declarations: [ UserProfileComponent ],
  imports: [
    CommonModule, 
    UsersRoutingModule, 
    MaterialModule, 
  ],
  exports: [
    UserProfileComponent,
  ]
})
export class ProfilesModule {}
