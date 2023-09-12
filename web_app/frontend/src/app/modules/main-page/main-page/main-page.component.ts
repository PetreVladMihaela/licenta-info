import { Component, OnInit } from '@angular/core';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';
import { MusicalBand } from 'src/app/interfaces/musical-band';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private bandsService: MusicalBandsService) { }

  public allMusicalBands: MusicalBand[] = [];
  public shownMusicalBands?: MusicalBand[];
  
  public criteria: string[] = ['Band Name', 'Music Genre', 'Country', 'City', 'None'];

  public filterForm = new FormGroup({
    criterion: new FormControl('None'),
    bandName: new FormControl(''),
    bandGenre: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl('')
  })

  public get criterion(): AbstractControl {
    return this.filterForm.get('criterion')!;
  }
  public get bandName(): AbstractControl {
    return this.filterForm.get('bandName')!;
  }
  public get bandGenre(): AbstractControl {
    return this.filterForm.get('bandGenre')!;
  }
  public get country(): AbstractControl {
    return this.filterForm.get('country')!;
  }
  public get city(): AbstractControl {
    return this.filterForm.get('city')!;
  }

  ngOnInit(): void {
    this.bandsService.getAllBands().subscribe((bands: MusicalBand[]) => {
      const sortedByDate = bands.sort(
        (band1, band2) => new Date(band2.dateFormed).getTime() - new Date(band1.dateFormed).getTime());
      this.allMusicalBands = sortedByDate;
      this.shownMusicalBands = sortedByDate.slice(0,100);
    })
  }

  applyFilter() {
    if(this.filterForm.get('criterion')!.value == 'Band Name')
    {
      const name = this.filterForm.get('bandName')!.value!.toLowerCase();
      if (name != '') {
        const sortedByName = this.allMusicalBands.filter((band) => band.name.toLowerCase().includes(name));
        this.shownMusicalBands = sortedByName;
      }
    }

    if(this.filterForm.get('criterion')!.value == 'Music Genre')
    {
      const genre = this.filterForm.get('bandGenre')!.value!.toLowerCase();
      if (genre != '') {
        const sortedByGenre = this.allMusicalBands.filter((band) => band.musicGenre?.toLowerCase().includes(genre));
        this.shownMusicalBands = sortedByGenre;
      }
    }

    if(this.filterForm.get('criterion')!.value == 'Country')
    {
      const country = this.filterForm.get('country')!.value;
      if (country != '') {
        const sortedByCountry = this.allMusicalBands.filter((band) => band.hq?.country == country);
        this.shownMusicalBands = sortedByCountry;
      }
    }

    if(this.filterForm.get('criterion')!.value == 'City')
    {
      const city = this.filterForm.get('city')!.value;
      if (city != '') {
        const sortedByCity = this.allMusicalBands.filter((band) => band.hq?.city == city);
        this.shownMusicalBands = sortedByCity;
      }
    }

    if(this.filterForm.get('criterion')!.value == 'None')
    {
      this.shownMusicalBands = this.allMusicalBands.slice(0,100);
    }
  }

}
