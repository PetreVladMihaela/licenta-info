import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { LogInUser } from 'src/app/interfaces/log_in_user';
import { RegisterUser } from 'src/app/interfaces/register_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private authUrl = 'https://localhost:7299/api/authentication';

  public registerNewUser(user: RegisterUser) {
    return this.http.post(this.authUrl + '/registerUser', user);
  }

  public logInUser(loginModel: LogInUser): Observable<{username:string}> {
    return this.http.post<{username:string}>(this.authUrl + '/login', loginModel);
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
    try {
      const expiryDateUtc = new Date(dateFromCookie.replace(/%3A/g, ':'));
      const dateAndTimeNow = new Date(); //needs to be converted to UTC
      const currentDateUtc = new Date(dateAndTimeNow.getTime() + dateAndTimeNow.getTimezoneOffset() * 60000); 
      // console.log(currentDateUtc)
      // console.log(expiryDateUtc)
      return currentDateUtc < expiryDateUtc;
    } catch (_) { return false; }
  }
  
  
  public resendConfirmEmail(email: string): Observable<string> {
    return this.http.get(`${this.authUrl}/resendConfirmationLink/${email}`, { responseType: 'text' });
  }

  public sendResetPasswordEmail(email: string) {
    return this.http.get(`${this.authUrl}/forgotPassword/${email}`);
  }
}
