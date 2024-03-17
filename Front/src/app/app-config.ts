
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {routes} from './app-routing.module'
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc'
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';





export class DattaConfig {
  static layout: string = 'vertical';
  static isCollapseMenu: Boolean = false;
}


