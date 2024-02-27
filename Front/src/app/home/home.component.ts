import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  
  
})
export class HomeComponent {
  constructor(private router: Router,private oauthService: OAuthService, private httpClient: HttpClient) {}



  logout() {
    this.oauthService.logOut();
  }

}
