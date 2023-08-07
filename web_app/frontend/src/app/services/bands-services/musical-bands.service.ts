import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MusicalBand } from 'src/app/interfaces/musical-band';

@Injectable({
  providedIn: 'root'
})
export class MusicalBandsService {

  public url = 'https://localhost:7299/api/Bands';

  constructor(private http: HttpClient) { }

  public createBand(band: MusicalBand, username: string): Observable<{newBandId: string}> {
    return this.http.post<{newBandId: string}>(`${this.url}/${username}`, band)
  }

  public getBandById(bandId: string): Observable<MusicalBand> {
    return this.http.get<MusicalBand>(`${this.url}/${bandId}`);
  }

  public updateBand(band: MusicalBand, username: string): Observable<any> {
    return this.http.put(`${this.url}/${username}`, band);
  }

}
