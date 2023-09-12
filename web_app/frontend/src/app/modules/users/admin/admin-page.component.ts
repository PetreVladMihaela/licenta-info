import { Component, OnInit } from '@angular/core';
import { MusicalBand } from 'src/app/interfaces/musical-band';
import { MusicalBandsService } from 'src/app/services/bands-services/musical-bands.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  public musicalBands?: MusicalBand[];

  constructor(private bandsService: MusicalBandsService) { }

  ngOnInit(): void {
    this.bandsService.getBandsToDelete().subscribe((bands: MusicalBand[]) => {
      this.musicalBands = bands;
    })
  }

}
