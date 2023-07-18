import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ChangePassword } from 'src/app/interfaces/change_password';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = 'https://localhost:7299/api/users';

  constructor(private http: HttpClient) {}

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  public getUserByName(username: string): Observable<User> {
    return this.http.get<User>(`${this.url}/getByUsername/${username}`);
  }

  public updateUsername(oldUsername: string, newUsername: string) {
    const headers = new HttpHeaders().set('content-type', 'text/json');
    return this.http.put(`${this.url}/changeUsername/${oldUsername}`, `\"${newUsername}\"`, { headers });
  }

  public updateEmail(username: string, newEmail: string) {
    const headers = new HttpHeaders().set('content-type', 'text/json');
    return this.http.put(`${this.url}/changeEmail/${username}`, `\"${newEmail}\"`, { headers });
  }

  public updatePassword(model: ChangePassword) {
    return this.http.put(this.url+'/changePassword', model, { responseType: 'text' });
  }
}
