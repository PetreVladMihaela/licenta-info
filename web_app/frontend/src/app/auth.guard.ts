import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    let isAuthorized = false;
    const user = localStorage.getItem('User');
    if (user) isAuthorized = true;
    if (isAuthorized == false) {
      window.alert('You are not authorized!');
      window.location.href = '/auth/login';
    }
    return isAuthorized;
  }
}
