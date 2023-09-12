import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { ProfilesModule } from './profiles.module';
import { AdminPageComponent } from './admin/admin-page.component';
import { MusicalBandsModule } from '../musical-bands/musical-bands.module';

@NgModule({
  declarations: [ AccountInfoComponent, UserProfileFormComponent, AdminPageComponent ],
  imports: [
    CommonModule, 
    UsersRoutingModule, 
    MaterialModule, 
    ReactiveFormsModule,
    ProfilesModule,
    MusicalBandsModule
  ]
})
export class UsersModule {}
