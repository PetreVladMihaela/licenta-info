import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SurveyResult } from 'src/app/interfaces/band-members-survey';
import { BandUserMatch } from 'src/app/interfaces/band-user-match';
import { MusicalBand } from 'src/app/interfaces/musical-band';

@Injectable({
  providedIn: 'root'
})
export class MusicalBandsService {

  public url = 'https://localhost:7299/api/Bands';

  constructor(private http: HttpClient) { }

  public getAllBands(): Observable<MusicalBand[]> {
    return this.http.get<MusicalBand[]>(this.url+'/getAllBands');
  }

  public createBand(band: MusicalBand, username: string): Observable<{newBandId: string}> {
    return this.http.post<{newBandId: string}>(`${this.url}/${username}`, band)
  }

  public getBandById(bandId: string): Observable<MusicalBand> {
    return this.http.get<MusicalBand>(`${this.url}/${bandId}/bandInfo`);
  }

  public updateBand(band: MusicalBand, username: string): Observable<any> {
    return this.http.put(`${this.url}/${username}`, band);
  }


  public saveBandUserMatches(matches: BandUserMatch[], username: string) {
    return this.http.post(`${this.url}/${username}/createBandMatches`, matches)
  }

  public getMatchedUserProfiles(bandId: string): Observable<SurveyResult[]> {
    return this.http.get<SurveyResult[]>(`${this.url}/${bandId}/getMatchedUsers`);
  }

  public updateBandUserMatch(match: BandUserMatch, username: string) {
    return this.http.put(`${this.url}/${username}/updateBandUserMatch`, match)
  }

  public deleteBandMatches(bandId: string, username: string) {
    return this.http.delete(`${this.url}/${bandId}/deleteBandMatches/${username}`)
  }

  public leaveBand(username: string) {
    return this.http.get(`${this.url}/${username}/leaveBand`)
  }

  public getBandsToDelete(): Observable<MusicalBand[]> {
    return this.http.get<MusicalBand[]>(this.url+'/bandsToDelete');
  }

  public deleteBand(bandId: string) {
    return this.http.delete(`${this.url}/${bandId}`)
  }

}
