import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {routes} from './app-routing.module'
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc'
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:8888/realms/PFE',
  tokenEndpoint: 'http://localhost:8888/realms/PFE/protocol/openid-connect/token',
  redirectUri: window.location.origin,
  clientId: 'pfeclient',
  responseType: 'code',
  scope: 'openid profile',
  showDebugInformation: true,
};

function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin()
      .then(() => resolve());
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideOAuthClient(),
    provideAnimationsAsync(), // Add this line

    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initializeOAuth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService
      ]
    }, provideAnimationsAsync()
  ]
};
