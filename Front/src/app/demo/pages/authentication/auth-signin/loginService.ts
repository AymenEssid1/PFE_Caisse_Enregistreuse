import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { finalize } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class LoginService {

    constructor(private http: HttpClient,private router :Router,private location:Location,private keycloakService: KeycloakService) { }
    

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable(); 


    login(data: any) {
      this.http.post<any>("http://localhost:8888/realms/PFE/protocol/openid-connect/token", data,
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      ).subscribe(
        (response) => {
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
          this.isAuthenticatedSubject.next(true);
         

          // Redirect to admin dashboard after successful login
          this.router.navigate(['/admin/dashboard']);

          history.pushState(null, '', window.location.href);
        },
        (error) => {
          console.error('Login failed:', error);
          // Handle login error if needed
        }
      );
    }
  
    // Function to parse JWT token
    private parseJwt(token: string): any {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    }
   

  logout() {
    const token = localStorage.getItem('token');

    const refreshToken = localStorage.getItem('refreshToken');
    const body = new HttpParams()
    .set('client_id', 'pfeclient')
    .set('client_secret', "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG")
    .set('refresh_token', refreshToken)

  this.http.post('http://localhost:8888/realms/PFE/protocol/openid-connect/logout', body.toString(), {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${token}`)
  }).subscribe(
    (response) => {
      console.log(response);
      this.isAuthenticatedSubject.next(false);

      this.router.navigateByUrl('sign-in');
      localStorage.clear();
    },
    (error) => {
      console.error('Login failed:', error);
    }
  )
}

isAuthenticated(): boolean {
  return !!localStorage.getItem('token');

}

signupUrl = "http://localhost:8888/admin/realms/PFE/users/";

 data: { [key: string]: string } = {
  username: 'boss',
  password: 'boss',
  grant_type: 'password',
  client_id: 'pfeclient',
  client_secret: "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG"
};

 body = Object.keys(this.data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key])).join('&');


 adminLogin(data: any): Observable<void> {
  return this.http.post<any>("http://localhost:8888/realms/PFE/protocol/openid-connect/token", data,
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
      console.log("All good for the login");
    }),
    catchError((error) => {
      console.error('Login failed:', error);
      return throwError(error);
    })
  );
}

adminLogout(): Observable<void> {
  const token = localStorage.getItem('admin-token');
  const refreshToken = localStorage.getItem('admin-refresh-token');
  
  const body = new HttpParams()
    .set('client_id', 'pfeclient')
    .set('client_secret', "EUgj4cEwcghU2cTnlo4vj8HN6RhZ16CG")
    .set('refresh_token', refreshToken);

  return this.http.post('http://localhost:8888/realms/PFE/protocol/openid-connect/logout', body.toString(), {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${token}`)
  }).pipe(
    map((response) => {
      console.log('Logout response:', response);
      localStorage.clear();
    }),
    catchError((error) => {
      console.error('Logout failed:', error);
      return throwError(error);
    })
  );
}

register(user: any) {
  return this.adminLogin(this.body).pipe(
    switchMap(() => {
      console.log("Mini login completed, proceeding with registration");

      const token = localStorage.getItem('admin-token');
      const refreshToken = localStorage.getItem('admin-refresh-token');

      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json');

      return this.http.post(this.signupUrl, user, { headers }).pipe(
        finalize(() => {
          this.adminLogout().subscribe(
            () => {
              console.log('Logged out from admin account');
              localStorage.clear();
              this.router.navigate(['sign-in']);
            },
            (logoutError) => {
              console.error('Mini logout failed:', logoutError);
            }
          );
        })
      );
    })
  ).subscribe(
    (registrationResponse) => {
      console.log('Registration successful:', registrationResponse);
    },
    (registrationError) => {
      console.error('Registration failed:', registrationError);
    }
  );
}



}