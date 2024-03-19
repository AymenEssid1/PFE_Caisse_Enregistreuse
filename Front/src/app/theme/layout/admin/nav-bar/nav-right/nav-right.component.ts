// angular import
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakRoles } from 'keycloak-js';
import { UserService } from 'src/app/demo/extra/cashiers/userService';
import { LoginService } from 'src/app/demo/pages/authentication/auth-signin/loginService';
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent implements OnInit{

  constructor(private loginService: LoginService) {


  }

  userInfo: { firstName: string, lastName: string, realmRoles:string[]};

  

  ngOnInit(): void {
   this.getUserInfo2();
  }


  firstName: string;
  lastName: string;
  realmRoles: string[];

  getUserInfo2(): void {
    const userInfo = this.getUserInfo();
    if (userInfo) {
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.realmRoles = userInfo.realmRoles.filter(role => 
        role !== 'default-roles-pfe' && 
        role !== 'uma_authorization' && 
        role !== 'offline_access'
      );
    } else {
      // Handle case when user info is not available
    }
  }

  getUserInfo(): { firstName: string, lastName: string, realmRoles: string[] } {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles'));

    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));

      const firstName = tokenPayload.given_name || '';
      const lastName = tokenPayload.family_name || '';
      const realmRoles = roles || [];

      return { firstName, lastName, realmRoles };
    } else {
      // Handle case when token is not present
      return null;
    }
  }
  

  logout() {
    this.loginService.logout();
  }


}
