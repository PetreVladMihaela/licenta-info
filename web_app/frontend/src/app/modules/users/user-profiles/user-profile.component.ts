import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { UserProfileFormComponent } from '../user-profile-form/user-profile-form.component';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { BandFormComponent } from '../../musical-bands/band-form/band-form.component';
import { UserProfilesService } from 'src/app/services/users-service/user-profiles.service';
import { HttpEventType } from '@angular/common/http';

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

  constructor(private dialog: MatDialog, private profilesService: UserProfilesService) { }

  public progress: number = 0;

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


  changeImage = (files: FileList | null) => {
    if (files == null) return;

    const fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    const username = this.user.username;
    
    this.profilesService.changeProfileImage(username, formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total)
            this.progress = Math.round(100 * event.loaded / event.total);
        }
        else if (event.type === HttpEventType.Response) {
          if (this.user.profile)
            this.user.profile.profileImage = event.body.imageBytes;
        }
      },
      error: (err) => alert(err)
    });
  }

}
