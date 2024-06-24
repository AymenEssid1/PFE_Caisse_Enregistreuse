import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/demo/extra/notificationService';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private notificationService:NotificationService,private http: HttpClient, private router: Router, private location: Location, private keycloakService: KeycloakService) { }


  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();


  login(data: any) {
    this.http.post<any>("http://localhost:8085/keycloak/realms/PFE/protocol/openid-connect/token", data,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).subscribe(
      (response) => {
        console.log("request went through");

        // Assuming the response contains a token
        const token = response.access_token;
        const refreshToken = response.refresh_token;

        // Extract roles and establishmentId from the token
        const decodedToken = this.parseJwt(token);
        const roles = decodedToken.realm_access.roles;
        const establishmentId = decodedToken.establishmentId;

        // Store token, refresh token, roles, and establishmentId in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('roles', JSON.stringify(roles));
        localStorage.setItem('establishmentId', establishmentId);



        const isAdmin = roles.includes('ADMIN');
        const isCaissier = roles.includes('Caissier');
        const isGérant = roles.includes('Gérant');
        const isDev = roles.includes('Developper');

        if (isDev) {
          this.router.navigate(['/admin/establishments']);
        }
        else if (isAdmin) {
          this.router.navigate(['/admin/establishments']);
        } else {
          if (isGérant) {
            this.router.navigate(['/admin/stock']);
          } else {
            if (isCaissier) {
              this.router.navigate(['/admin/session']);
            }else{

              this.router.navigate(['/admin/sample-page']);

            }
          }
        }

        //history.pushState(null, '', window.location.href);
      },
      (error) => {
        this.notificationService.showError("","Nom d'utilisateur ou mot de passe incorrect")

      }
    );
  }
  
  

  // Function to parse JWT token
   parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }


  logout() {
    const token = localStorage.getItem('token');

    const refreshToken = localStorage.getItem('refreshToken');
    const body = new HttpParams()
      .set('client_id', 'pfeclient')
     // .set('client_secret', "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG")
     .set('client_secret', "s7KKkT1B08NDOMNROrGXbm5d2Sxb7ksd")
      .set('refresh_token', refreshToken)

    this.http.post('http://localhost:8085/keycloak/realms/PFE/protocol/openid-connect/logout', body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
    }).subscribe(
      (response) => {
        //console.log(response);
        this.isAuthenticatedSubject.next(false);

        this.router.navigateByUrl('sign-in');
        localStorage.clear();
      },
      (error) => {
        console.error('Login failed:', error);
      }
    )
  }

  

  signupUrl = "http://localhost:8085/keycloak/admin/realms/PFE/users/";

  data: { [key: string]: string } = {
    username: 'boss',
    password: 'boss',
    grant_type: 'password',
    client_id: 'pfeclient',
    client_secret: "s7KKkT1B08NDOMNROrGXbm5d2Sxb7ksd"
    //client_secret: "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG"

  };

  body = Object.keys(this.data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key])).join('&');


  adminLogin(data: any): Observable<void> {
    return this.http.post<any>("http://localhost/keycloak/realms/PFE/protocol/openid-connect/token", data,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(
      map((response) => {
        const token = response.access_token;
        const refreshToken = response.refresh_token;

        localStorage.setItem('admin-token', token);
        localStorage.setItem('admin-refresh-token', refreshToken);
      }),
      catchError((error) => {
       // console.error('Login failed:', error);
        return throwError(error);
      })
    );
  }

  adminLogout(): Observable<void> {
    const token = localStorage.getItem('admin-token');
    const refreshToken = localStorage.getItem('admin-refresh-token');

    const body = new HttpParams()
      .set('client_id', 'pfeclient')
      //.set('client_secret', "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG")
      .set('client_secret', "s7KKkT1B08NDOMNROrGXbm5d2Sxb7ksd")
      .set('refresh_token', refreshToken);

    return this.http.post('http://localhost:8085/keycloak/realms/PFE/protocol/openid-connect/logout', body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
    }).pipe(
      map((response) => {
        //console.log('Logout response:', response);
        localStorage.clear();
      }),
      catchError((error) => {
       // console.error('Logout failed:', error);
        return throwError(error);
      })
    );
  }

  register(user: any) {
    //console.log(JSON.stringify(user));
    return this.adminLogin(this.body).pipe(
      switchMap(() => {
       // console.log("Mini login completed, proceeding with registration");

        const token = localStorage.getItem('admin-token');
        const refreshToken = localStorage.getItem('admin-refresh-token');

        const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json');

        return this.http.post(this.signupUrl, user, { headers }).pipe(
          finalize(() => {
            this.adminLogout().subscribe(
              () => {
               // console.log('Logged out from admin account');
                
              },
              (logoutError) => {
              //  console.error('Mini logout failed:', logoutError);
              }
            );
          })
        );
      })
    ).subscribe(
      (registrationResponse) => {
       // console.log('Registration successful:', registrationResponse);
        localStorage.clear();
        this.router.navigate(['sign-in']);
      },
      (registrationError) => {
       // console.error('Registration failed:', registrationError);
        this.notificationService.showError("","Le nom d'utilisateur ou l'adresse mail existe deja")

      }
    );
  }



}


