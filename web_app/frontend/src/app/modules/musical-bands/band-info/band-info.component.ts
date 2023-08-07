import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MusicalBand } from 'src/app/interfaces/musical-band';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';
import { BandFormComponent } from '../../musical-bands/band-form/band-form.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { UserProfilesService } from 'src/app/services/users-service/user-profiles.service';

@Component({
  selector: 'app-band-info',
  templateUrl: './band-info.component.html',
  styleUrls: ['./band-info.component.scss']
})
export class BandInfoComponent implements OnInit, OnDestroy {
  public musicalBand?: MusicalBand;
  public canEdit: boolean = false;
  public errorMessage: string = '';
  public shownProfile?: UserProfile;

  private subscription: Subscription = new Subscription();
  private nameSub: Subscription = new Subscription();
  private username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private bandsService: MusicalBandsService,
    private authService: AuthService,
    private profilesService: UserProfilesService
  ) {}

  
  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params) => {
      this.getMusicalBand(params['bandId']);

      this.nameSub = this.authService.nameSubscriber.subscribe((username) => {
        this.username = username;
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.nameSub.unsubscribe();
  }

  public getMusicalBand(id: string): void {
    this.bandsService.getBandById(id).subscribe({
      next: (band: MusicalBand) => {
        this.musicalBand = band;
        for (const member of band.members)
          if (member.username == this.username) {
            this.canEdit = true;
            break;
          }
      },
      error: (err) => (this.errorMessage = 'Error: ' + err.message)
    });
  }


  public editBand(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.minWidth = '280px';
    dialogConfig.maxWidth = '550px';
    dialogConfig.maxHeight = '650px';
    dialogConfig.disableClose = true;

    const bandFormData = {
      username: this.username,
      formData: this.musicalBand
    };
    dialogConfig.data = bandFormData;
    const dialogRef = this.dialog.open(BandFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((bandId: string | undefined) => {
      if (bandId) this.getMusicalBand(bandId);
    });
  }


  public seeMemberProfile(memberUsername: string) {
    if (memberUsername == this.username)
      this.router.navigate(['/users/account/'+memberUsername]);
    else {
      if (this.shownProfile?.username == memberUsername) 
        this.shownProfile = undefined;
      else
        this.profilesService.getProfileByUsername(memberUsername).subscribe((profile: UserProfile) => {
          this.shownProfile = profile;
        })
    }
  }
  
}
