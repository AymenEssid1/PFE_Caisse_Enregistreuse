import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionSelectionService } from '../session/SessionSelectionService';


@Injectable({
  providedIn: 'root'
})
export class OrderGuard implements CanActivate {

  constructor(
    private sessionSelectionService: SessionSelectionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const order = this.sessionSelectionService.getOrder();
    if (!order) {
      // If no order is available, redirect to the POS component or any other suitable route
      this.router.navigate(['/admin/pos']); // Adjust the route as per your application
      return false;
    }
    return true;
  }
}