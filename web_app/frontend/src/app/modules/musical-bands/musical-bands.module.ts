import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BandFormComponent } from './band-form/band-form.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BandInfoComponent } from './band-info/band-info.component';
import { BandMembersSurveyComponent } from './band-members-survey/band-members-survey.component';
import { ProfilesModule } from '../users/profiles.module';
//import { MusicalBandsRoutingModule } from './musical-bands-routing.module';

@NgModule({
  declarations: [ BandFormComponent, BandInfoComponent, BandMembersSurveyComponent ],
  imports: [ CommonModule, MaterialModule, ReactiveFormsModule, ProfilesModule ]
})
export class MusicalBandsModule { }
