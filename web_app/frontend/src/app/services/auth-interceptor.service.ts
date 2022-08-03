import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { UsersService } from './users.service';
import { catchError, filter, take, switchMap } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  //refreshTokenSubject tracks the current token, or is null if no token is currently available (e.g. refresh pending)
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<string|null>(null);

  constructor(
    private usersService: UsersService
  ) { }

  //With this function, we can intercept any HTTP call, modify it, and then let it continue its journey to the Web API.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //const accessToken = localStorage.getItem("access_token");
    //if (accessToken) {
      //const clonedRequest = req.clone( { headers: req.headers.set("Authorization", "Bearer " + accessToken) } );
      //return next.handle(clonedRequest);
    //}
    //else return next.handle(req);

    req = req.clone( { withCredentials: true } );
    return next.handle(req).pipe(catchError(error => {
      console.log(error)
      let message = error.name + " " + error.status;
      if (error.error)
        if (error.error.message)
          message = error.error.message;

      // We don't want to refresh tokens for some requests like login or refresh token itself, so we verify the url and we throw an error if it's the case.
      if (req.url.includes("refresh-token") || req.url.includes("login") || req.url.includes("register")) {
        // We do another check to see if refreshing the token failed. In this case we want to logout the user and redirect them to the login page.
        if (req.url.includes("refresh-token")) {
          this.isRefreshing = false;
          this.usersService.logout();
        }
        return throwError(() => new Error(message));
      }

      // If error status is different than 401 we want to skip refreshing the token, so we check that and throw the error if it's the case.
      if (error.status !== 401)
        return throwError(() => new Error(message));

      if (this.isRefreshing)
        // If token refreshing is in progress, we wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again.
        return this.refreshTokenSubject.pipe(
          filter(result => result !== null), take(1),
          switchMap(() => next.handle(req)));
      else
        this.isRefreshing = true;

      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved.
      this.refreshTokenSubject.next(null);

      return this.usersService.refreshToken().pipe(
        switchMap(() => {
          //When the call to refreshToken completes we set isRefreshing to false for the next time the token needs to be refreshed.
          this.isRefreshing = false;
          this.refreshTokenSubject.next("refreshing done");
          return next.handle(req);
        })
      );
    }));
  }

}
