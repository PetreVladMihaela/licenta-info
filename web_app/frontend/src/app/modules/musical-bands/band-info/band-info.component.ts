import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MusicalBand } from 'src/app/interfaces/musical-band';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';
import { BandFormComponent } from '../../musical-bands/band-form/band-form.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { UserProfilesService } from 'src/app/services/users-service/user-profiles.service';
import { BandMembersSurveyComponent } from '../band-members-survey/band-members-survey.component';
import { ConfirmationDialogComponent, ConfirmationDialogModel } from '../../material/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-band-info',
  templateUrl: './band-info.component.html',
  styleUrls: ['./band-info.component.scss']
})
export class BandInfoComponent implements OnInit, OnDestroy {
  @Input() musicalBand?: MusicalBand;
  @Input() alignBands: boolean = false;
  @Input() adminDeleteButton: boolean = false;

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
      if (params['bandId'])
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


  public takeSurvey(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.minWidth = '280px';
    dialogConfig.maxWidth = '550px';
    dialogConfig.maxHeight = '600px';

    const surveyFormData = {
      bandId: this.musicalBand!.bandId,
      username: this.username
    };
    dialogConfig.data = surveyFormData;
    dialogConfig.disableClose = true;
    this.dialog.open(BandMembersSurveyComponent, dialogConfig);
  }


  public delete() {
    if (this.musicalBand?.bandId)
      this.bandsService.deleteBand(this.musicalBand.bandId).subscribe(() => {
        window.location.reload();
    })
  }


  public leaveBand() {
    const dialogData = new ConfirmationDialogModel('Warning',
      'Are you sure you want to leave the band \''+this.musicalBand?.name+'\'?'
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: 'fit-content',
      minWidth: '280px',
      position: { top: '30px' },
      disableClose: true,
      data: dialogData
    });
      
    return dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) 
        this.bandsService.leaveBand(this.username).subscribe({
          next: () => this.router.navigate(['/users/account/' + this.username]),
          error: (err) => alert(err)
      })
    });
  }
  
}
