import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';
import { UserProfilesService } from 'src/app/services/users-service/user-profiles.service';
import { BandUserMatch } from 'src/app/interfaces/band-user-match';
import {
  BandMembersSurvey,
  SurveyFormData,
  SurveyResult
} from 'src/app/interfaces/band-members-survey';
import { User } from 'src/app/interfaces/user';
import { UserProfile } from 'src/app/interfaces/user-profile';

@Component({
  selector: 'app-band-members-survey',
  templateUrl: './band-members-survey.component.html',
  styleUrls: ['./band-members-survey.component.scss']
})
export class BandMembersSurveyComponent implements OnInit {
  public matchedUsers?: SurveyResult[];
  public shownUsers: { [username: string]: User } = {};

  public surveyForm: FormGroup = new FormGroup({
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl(null),
    minAge: new FormControl(0),
    maxAge: new FormControl(100),
    occupation: new FormControl(null),
    canSing: new FormControl(false),
    playedInstrument: new FormControl(null),
    preferredMusicGenre: new FormControl(null),
    trait1: new FormControl(null),
    trait2: new FormControl(null)
  });

  public traits: string[] = [
    'Analytical',
    'Charismatic',
    'Confident',
    'Creative',
    'Friendly',
    'Hard-working',
    'Ingenious',
    'Level-headed',
    'Observant',
    'Organized'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: SurveyFormData,
    private dialogRef: MatDialogRef<BandMembersSurveyComponent>,
    private userProfilesService: UserProfilesService,
    private bandsService: MusicalBandsService
  ) {}

  get country(): AbstractControl {
    return this.surveyForm.get('country')!;
  }

  get city(): AbstractControl {
    return this.surveyForm.get('city')!;
  }

  get street(): AbstractControl {
    return this.surveyForm.get('street')!;
  }

  get minAge(): AbstractControl {
    return this.surveyForm.get('minAge')!;
  }

  get maxAge(): AbstractControl {
    return this.surveyForm.get('maxAge')!;
  }

  get occupation(): AbstractControl {
    return this.surveyForm.get('occupation')!;
  }

  get canSing(): AbstractControl {
    return this.surveyForm.get('canSing')!;
  }

  get playedInstrument(): AbstractControl {
    return this.surveyForm.get('playedInstrument')!;
  }

  get preferredMusicGenre(): AbstractControl {
    return this.surveyForm.get('preferredMusicGenre')!;
  }

  get trait1(): AbstractControl {
    return this.surveyForm.get('trait1')!;
  }

  get trait2(): AbstractControl {
    return this.surveyForm.get('trait2')!;
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.bandsService
      .getMatchedUserProfiles(this.data.bandId)
      .subscribe((matchedUsers: SurveyResult[]) => {
        if (matchedUsers.length > 0) this.matchedUsers = matchedUsers;
        //console.log(this.matchedUsers)
      });
  }

  
  public completeSurvey(): void {
    const survey: BandMembersSurvey = this.surveyForm.value;
    this.userProfilesService.getSurveyMatches(survey).subscribe((surveyMatches: SurveyResult[]) => {
      //console.log(surveyMatches)
      this.matchedUsers = surveyMatches;
      let newMatches: BandUserMatch[] = [];
      for (const surveyMatch of surveyMatches) {
        const newMatch: BandUserMatch = {
          bandId: this.data.bandId,
          userId: surveyMatch.matchedUserId,
          matchType: 'survey match'
        };
        newMatches.push(newMatch);
      }
      this.bandsService.saveBandUserMatches(newMatches, this.data.username).subscribe();
    });
  }

  public retakeSurvey(): void {
    this.bandsService.deleteBandMatches(this.data.bandId, this.data.username).subscribe();
    this.matchedUsers = undefined;
  }


  public sendInvitation(surveyMatch: SurveyResult): void {
    const user: string =
      surveyMatch.matchedUserProfile.firstName + ' ' + surveyMatch.matchedUserProfile.lastName;
    if (window.confirm('Send ' + user + ' an invitation to join your band?')) {
      let invitation: BandUserMatch = {
        bandId: this.data.bandId,
        userId: surveyMatch.matchedUserId,
        matchType: 'invitation'
      };
      this.bandsService.updateBandUserMatch(invitation, this.data.username).subscribe(() => {
        surveyMatch.matchType = 'invitation';
      });
    }
  }

  public seeUserProfile(profile: UserProfile): void {
    if (this.shownUsers[profile.username]) delete this.shownUsers[profile.username];
    else {
      const user: User = {
        userId: '',
        username: profile.username,
        email: profile.email,
        userRoles: [],
        profile: profile
      };
      this.shownUsers[profile.username] = user;
    }
  }
}
