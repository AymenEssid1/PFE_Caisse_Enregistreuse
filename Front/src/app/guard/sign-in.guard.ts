// sign-in.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../demo/pages/authentication/auth-signin/loginService';


@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/sample-page']); // Redirect to dashboard if already authenticated
      return false;
    } else {
      return true;
    }
  }
}