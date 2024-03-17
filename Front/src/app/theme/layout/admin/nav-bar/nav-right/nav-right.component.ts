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

  constructor(private keycloakService: KeycloakService,private loginService: LoginService) {


  }

  userInfo: { firstName: string, lastName: string, realmRoles:string[]};

  

  ngOnInit(): void {
    this.userInfo = this.getUserInfo();
  }

  getUserInfo(): { firstName: string, lastName: string, realmRoles: string[] } {
    const token = this.keycloakService.getKeycloakInstance().tokenParsed;
    const firstName = token?.['given_name'] || '';
    const lastName = token?.['family_name']|| '';
    const allRoles = token?.realm_access?.roles || [];
    const excludedRoles = ['offline_access', 'default-roles-pfe', 'uma_authorization'];
    const realmRoles = allRoles.filter(role => !excludedRoles.includes(role));
    return { firstName, lastName, realmRoles };
  }
  

  logout() {
    console.log("hellllllllllllllllllllllllllll");
    this.loginService.logout();
  }


}
