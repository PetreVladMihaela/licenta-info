import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { UserProfile } from 'src/app/interfaces/user-profile';

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

}
