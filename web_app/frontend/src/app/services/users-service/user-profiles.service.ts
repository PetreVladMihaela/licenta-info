import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserProfile } from 'src/app/interfaces/user-profile';
import { BandMembersSurvey, SurveyResult } from 'src/app/interfaces/band-members-survey';
import { Invitation } from 'src/app/interfaces/invitation';
import { BandUserMatch } from 'src/app/interfaces/band-user-match';

@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {

  public url = 'https://localhost:7299/api/Profiles';

  constructor(private http: HttpClient) { }

  public createUserProfile(profile: UserProfile) {
    return this.http.post(this.url, profile)
  }

  public getProfileByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.url}/getByUsername/${username}`);
  }

  public editUserProfile(profile: UserProfile) {
    return this.http.put(this.url, profile);
  }

  // public getAllUserProfiles(): Observable<UserProfile[]> {
  //   return this.http.get<UserProfile[]>(this.url)
  // }

  public getSurveyMatches(survey: BandMembersSurvey): Observable<SurveyResult[]> {
    return this.http.post<SurveyResult[]>(this.url+'/surveyResults', survey)
  }
  
  public getUserInvitations(userId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.url}/${userId}/bandInvitations`);
  }

  public acceptInvitationToJoinBand(invitation: BandUserMatch, username: string){
    return this.http.post(`${this.url}/${username}/acceptInvitation`, invitation);
  }

}
