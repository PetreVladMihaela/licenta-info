import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { RegisterUser } from 'src/app/interfaces/register_user';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private authUrl = 'https://localhost:7299/api/authentication';

  public registerNewUser(user: RegisterUser) {
    return this.http.post(this.authUrl + '/registerUser', user);
  }

  public logInUser(username: string, password: string) {
    return this.http.post(this.authUrl + '/login', { username, password });
  }

  public logOutUser() {
    this.http.get(this.authUrl + '/logout').subscribe({
      next: () => {
        localStorage.removeItem('User');
        window.location.href = '/auth/login';
      },
      error: () => {
        localStorage.removeItem('User');
        window.location.href = '/auth/login';
        document.cookie = 'Token_Expiry_Date=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    });
  }

  public refreshToken() {
    return this.http.get(this.authUrl+'/refreshToken');
  }

  public checkIfUsernameExists(username: string): Observable<{usernameExists:boolean}>{
    return this.http.get<{usernameExists:boolean}>(`${this.authUrl}/checkUsername/${username}`);
  }


  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn = this.loggedInSubject.asObservable();

  public setLoggedInToTrue() {
    this.loggedInSubject.next(true);
  }

  private nameObserver = new BehaviorSubject<string>('');
  public nameSubscriber = this.nameObserver.asObservable();

  public emitUsername(username: string) {
    this.nameObserver.next(username);
  }


  public checkUserIsLoggedIn(): boolean {
    const dateFromCookie = document.cookie.split('; ') // date is in Coordinated Universal Time(UTC)
      .find((cookie) => cookie.startsWith('Token_Expiry_Date='))?.split('=')[1];

    if (dateFromCookie == undefined) return false
    try {                                                               //medium format is MMM d, y, h:mm:ss a
      const expiryDate = formatDate(dateFromCookie.replace(/%3A/g, ':'), 'medium', 'en');
      const dateAndTimeNow = new Date(); //needs to be converted to UTC
      const utc = new Date(dateAndTimeNow.getTime() + dateAndTimeNow.getTimezoneOffset() * 60000); 
      const currentDate = formatDate(new Date(utc), 'medium', 'en'); 
      //console.log(currentDate, "-", expiryDate)
      return currentDate < expiryDate;
    } catch (_) { return false; }
  }
  
}