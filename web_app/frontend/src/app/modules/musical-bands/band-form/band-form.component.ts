import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MusicalBand, BandFormData } from 'src/app/interfaces/musical-band';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';

@Component({
  selector: 'app-band-form',
  templateUrl: './band-form.component.html',
  styleUrls: ['./band-form.component.scss']
})
export class BandFormComponent {
  public formTitle: string;

  public addHQ: boolean = false;
  public buttonText: string = 'Add Band HQ';

  public bandForm: FormGroup = new FormGroup({
    bandId: new FormControl('-'),
    name: new FormControl('', [Validators.required]),
    musicGenre: new FormControl(),
    isComplete: new FormControl(false)
  });

  public headquartersForm: FormGroup = new FormGroup({
    country: new FormControl(''),
    city: new FormControl(''),
    street: new FormControl(),
    squareMeters: new FormControl(null, [Validators.max(1000)])
  });

  private bandData?: MusicalBand;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BandFormData,
    private dialogRef: MatDialogRef<BandFormComponent>,
    private bandsService: MusicalBandsService
  ) {
    if (data.formData) {
      this.formTitle = 'Edit Band';
      this.bandData = data.formData;
      this.bandForm.patchValue(this.bandData);
      if (this.bandData.hq)
        this.headquartersForm.patchValue(this.bandData.hq);
    }
    else this.formTitle = 'Create New Band';
  }

  get name(): AbstractControl {
    return this.bandForm.get('name')!;
  }

  get musicGenre(): AbstractControl {
    return this.bandForm.get('musicGenre')!;
  }

  get isComplete(): AbstractControl {
    return this.bandForm.get('isComplete')!;
  }

  get country(): AbstractControl {
    return this.headquartersForm.get('country')!;
  }

  get city(): AbstractControl {
    return this.headquartersForm.get('city')!;
  }

  get street(): AbstractControl {
    return this.headquartersForm.get('street')!;
  }

  get squareMeters(): AbstractControl {
    return this.headquartersForm.get('squareMeters')!;
  }


  public changeEditForm() {
    if (this.addHQ == true) {
      this.addHQ = false;
      this.buttonText = 'Add Band HQ';
    }
    else {
      this.addHQ = true;
      this.buttonText = 'Remove Band HQ';
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public saveFormData(): void {
    let bandInfo: MusicalBand = this.bandForm.value;
    if (this.addHQ)
      bandInfo.hq = this.headquartersForm.value;

    if(this.bandData == undefined) {
      this.bandsService.createBand(bandInfo, this.data.username).subscribe((response: {newBandId: string}) => {
        this.dialogRef.close([response.newBandId, bandInfo.name]);
      });
    }
    else {
      this.bandsService.updateBand(bandInfo, this.data.username).subscribe(() => {
        this.dialogRef.close(bandInfo.bandId);
      });     
    }
  }

}
