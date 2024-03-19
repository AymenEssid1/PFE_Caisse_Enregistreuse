
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../demo/pages/authentication/auth-signin/loginService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.loginService.isAuthenticated()) {

      
    const roles = JSON.parse(localStorage.getItem('roles'));

    // Check if roles include ADMIN
    const isAdmin = roles.includes('ADMIN');
    
    if (!isAdmin) {
      this.router.navigate(['/admin/sample-page']);
      
    } else {
      console.log("ok");
     
    }

      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
