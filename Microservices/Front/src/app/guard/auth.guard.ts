
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../demo/pages/authentication/auth-signin/loginService';
import { TokenService } from './tokenService';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router,private tokenService:TokenService) {}
  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');
    //console.log(token);

    if (!token) {
      this.router.navigate(['/sign-in']);
      return of(false); // Return Observable of false if token is not available
    }

    console.log("Validation started");
    
    // Call validateToken() method and return its observable
    return this.tokenService.validateToken(token).pipe(
      map(response => {
        console.log(response);
        // If token is valid, return true
        return true;
      }),
      catchError(error => {
        // Handle errors
        if (error.status === 200) {
          console.log("Received unexpected status code 200");
          
          return of(true); // Return Observable of false for status code 200
        } else if (error.status === 401) {
          console.log("Token is invalid or expired");
          this.router.navigate(['/sign-in']);
          return of(false); // Return Observable of false if token is invalid or expired
        } else {
          console.error('Error validating token:', error);
          this.router.navigate(['/sign-in']);
          return of(false); // Return Observable of false for other errors
        }
      })
    );
  }
}



 /*  if (this.loginService.isAuthenticated()) {
    return true;
  } else {
    this.router.navigate(['/sign-in']);
    return false;
  } */

