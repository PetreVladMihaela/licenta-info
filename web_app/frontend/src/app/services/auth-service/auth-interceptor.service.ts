import { formatDate } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, first } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  private isRefreshing = false;
  //refreshTokenSubject tracks the current token, or is null if no token is currently available (e.g. refresh pending)
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<string|null>(null);

  //With this function, we can intercept any HTTP call, modify it, and then let it continue its journey to the Web API.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });

    if (req.url.includes('/authentication/') == false && req.url.includes('/getAllBands') == false
      && req.url.includes('/bandInfo') == false && req.url.includes('Profiles/getByUsername') == false) {
      const tokenExpiryDate = document.cookie.split('; ')
        .find((cookie) => cookie.startsWith('Token_Expiry_Date='))?.split('=')[1];
      if (tokenExpiryDate == undefined) return this.refreshAuthToken(req, next);
    }

    return next.handle(req).pipe(catchError((error) => { console.log(error);
      let errorName = 'Error';
      let errorMessage = 'The cause of the error is unknown.';

      if (error instanceof HttpErrorResponse) {
        errorName = 'HTTP Error with Code ' + error.status;
        if (error.status == 0) errorMessage = 'The website was unable to connect to the server.';
        else if (error.status == 403) errorMessage = 'Access denied.';
        else if (error.error) {
          if (error.error.lockoutEnd) {
            const lockoutEnd = formatDate(error.error.lockoutEnd, 'MMMM d, y, h:mm:ss a', 'en');
            errorMessage = 'The account of ' + req.body.userIdentifier + ' is locked until ' + lockoutEnd + '.';
          }
          else if (error.error.message) errorMessage = error.error.message;
          else if (typeof error.error === 'string') errorMessage = error.error;
          else if (typeof error.error.title.includes('validation error')) errorMessage = 'Validation Error';
        }
      }
      let err = new Error(errorMessage);
      err.name = errorName;

      // We don't want to refresh tokens for some requests like login or refreshing the token itself,
      // so we verify the url and we throw an error if it's the case.
      if (req.url.includes('/refreshToken') || req.url.includes('/login') || req.url.includes('/registerUser')) 
      {
        // We do another check to see if refreshing the token failed.
        // In this case we want to logout the user and redirect them to the login page.
        if (req.url.includes('/refreshToken')) { //this.isRefreshing = false;
          window.alert(err);
          this.authService.logOutUser();
        } else {
          document.body.style.cursor = 'auto';
          return throwError(() => err);
        }
      }

      if (req.url.includes('/users/change'))
        document.body.style.cursor = 'auto';

      // If error status is different than 401 we want to skip refreshing the token, so we check that and throw the error if it's the case.
      if (error.status !== 401) return throwError(() => err);

      return this.refreshAuthToken(req, next);
    }));
  }

  private refreshAuthToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing)
      // If token refreshing is in progress, we wait until refreshTokenSubject has a non-null value
      // – which means the new token is ready and we can retry the request again.
      return this.refreshTokenSubject.pipe(
        first(result => result !== null),
        switchMap(() => next.handle(req))
      );
    else this.isRefreshing = true;

    // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved.
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap(() => {
        //When the call to refreshToken completes we set isRefreshing to false for the next time the token needs to be refreshed.
        this.isRefreshing = false;
        this.refreshTokenSubject.next('refreshing done');

        this.authService.setLoggedInToTrue();

        //window.location.reload();
        return next.handle(req);
      })
    );
  }
  
}
