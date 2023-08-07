import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { UserProfilesService } from 'src/app/services/users-service/user-profiles.service';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent {
  public formTitle: string;

  public userProfileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(null, [Validators.minLength(10), Validators.maxLength(20)]),
    age: new FormControl(0),
    occupation: new FormControl(),
    canSing: new FormControl(false),
    playedInstrument: new FormControl(),
    preferredMusicGenre: new FormControl(),
    trait1: new FormControl(),
    trait2: new FormControl(),

    username: new FormControl(''),
    email: new FormControl('')
  });

  public traits: string[] = ["Analytical", "Charismatic", "Confident", "Creative", "Friendly", 
    "Hard-working", "Ingenious", "Level-headed", "Observant", "Organized"];

  public addressForm: FormGroup = new FormGroup({
    country: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    street: new FormControl(),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private userData: User,
    private dialogRef: MatDialogRef<UserProfileFormComponent>,
    private profilesService: UserProfilesService
  ) {
    //console.log(userData)
    if (userData.profile) {
      this.formTitle = 'Edit Profile';
      this.userProfileForm.patchValue(userData.profile);
      this.addressForm.patchValue(userData.profile.address!);  
    }
    else this.formTitle = 'Create Profile';
  }

  get firstName(): AbstractControl {
    return this.userProfileForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.userProfileForm.get('lastName')!;
  }

  get phoneNumber(): AbstractControl {
    return this.userProfileForm.get('phoneNumber')!;
  }

  get age(): AbstractControl {
    return this.userProfileForm.get('age')!;
  }

  get occupation(): AbstractControl {
    return this.userProfileForm.get('occupation')!;
  }

  get canSing(): AbstractControl {
    return this.userProfileForm.get('canSing')!;
  }

  get playedInstrument(): AbstractControl {
    return this.userProfileForm.get('playedInstrument')!;
  }

  get preferredMusicGenre(): AbstractControl {
    return this.userProfileForm.get('preferredMusicGenre')!;
  }

  get trait1(): AbstractControl {
    return this.userProfileForm.get('trait1')!;
  }

  get trait2(): AbstractControl {
    return this.userProfileForm.get('trait2')!;
  }

  get country(): AbstractControl {
    return this.addressForm.get('country')!;
  }

  get city(): AbstractControl {
    return this.addressForm.get('city')!;
  }

  get street(): AbstractControl {
    return this.addressForm.get('street')!;
  }

  public closeDialog(): void { // cand apasam close inchidem fereastra
    this.dialogRef.close();
  }

  public saveFormData(): void {
    let userProfile: UserProfile = this.userProfileForm.value;
    userProfile.address = this.addressForm.value;
    if (this.formTitle=='Edit Profile') {
      this.profilesService.editUserProfile(userProfile).subscribe(() => {
        this.dialogRef.close(userProfile);
      });      
    } 
    else {
      userProfile.username = this.userData.username;
      userProfile.email = this.userData.email;
      this.profilesService.createUserProfile(userProfile).subscribe(() => {
        this.dialogRef.close(userProfile);
      });   
    }
  }

}
