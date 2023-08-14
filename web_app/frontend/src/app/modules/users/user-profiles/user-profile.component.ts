import { Component, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { UserProfileFormComponent } from '../user-profile-form/user-profile-form.component';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { BandFormComponent } from '../../musical-bands/band-form/band-form.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() user: User = {
    userId: '',
    username: '',
    email: '',
    userRoles: []
  };

  constructor(private dialog: MatDialog) {}

  public editUserProfile(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.minWidth = '280px';
    dialogConfig.maxWidth = '550px';
    dialogConfig.height = '600px';
    dialogConfig.disableClose = true; // nu se mai inchide dialogul daca dam clic in afara
    dialogConfig.data = this.user;
    const dialogRef = this.dialog.open(UserProfileFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((newValues: UserProfile) => {
      //console.log(newValues);
      if (newValues) this.user.profile = newValues;
    });
  }

  public createBand(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.minWidth = '280px';
    dialogConfig.maxWidth = '550px';
    dialogConfig.maxHeight = '600px';
    dialogConfig.disableClose = true;

    const bandFormData = { username: this.user.username };
    dialogConfig.data = bandFormData;
    const dialogRef = this.dialog.open(BandFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((response: [string, string] | undefined) => {
      if (response) {
        // const newBandId = response[0];
        // const newBandName = response[1];
        // if (this.user.profile) {
        //   this.user.profile.bandId = newBandId;
        //   this.user.profile.bandName = newBandName;
        // }
        window.location.reload(); // updates the invitations too
      }
    });
  }

}
