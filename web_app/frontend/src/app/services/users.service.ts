import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/interfaces/user';
import { AccessToken } from '../interfaces/access-token';
import { RegisterUser } from '../interfaces/register_user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //public url = 'https://localhost:44398/api/users';
  public url = 'https://localhost:7299/api/users';
  public authUrl = 'https://localhost:7299/api/authentication';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public createUser(user: RegisterUser){
    return this.http.post(this.authUrl+'/register', user);
  }

  public login(username:string, password:string): Observable<AccessToken> {
    return this.http.post<AccessToken>(this.authUrl+'/login', {username, password});
  }

  public logout() {
    this.http.get(this.authUrl+'/logout').subscribe(() => {
      localStorage.removeItem("User");
      this.router.navigate(['/auth/login'])
    });
  }

  public refreshToken() {
    return this.http.get(this.authUrl+'/refresh-token');
  }



  public isLoggedIn() {
    const dateFromCookie = document.cookie.split('; ')
      .find((cookie) => cookie.startsWith('Token_Expiry_Date='))?.split('=')[1];

    if (dateFromCookie) {
      const now = new Date();
      const currentDate = formatDate(new Date(now.getTime() + now.getTimezoneOffset() * 60000), 'MMM d, y, h:mm:ss a','en');
      const expiryDate = formatDate(dateFromCookie.replace(/%3A/g,":"),'MMM d, y, h:mm:ss a','en');
      //console.log(currentDate < expiryDate)
      //console.log(currentDate, "-", expiryDate)
      return currentDate < expiryDate;
    }
    else return false
  }



  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  public getUserByName(username: string): Observable<User> {
    return this.http.get<User>(`${this.url+"/getByUsername"}/${username}`);
  }

  public updateUser(user: User) {
    return this.http.put(this.url, user);
  }

  public checkIfUsernameExists(username: string): Observable<{usernameExists:boolean}>{
    return this.http.get<{usernameExists:boolean}>(`${this.url+"/checkUsername"}/${username}`);
  }

}
