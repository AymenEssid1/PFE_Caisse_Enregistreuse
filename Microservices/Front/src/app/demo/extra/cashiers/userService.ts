// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8085/keycloak/admin/realms/PFE';
  constructor(private http: HttpClient) { }


  token = localStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }


  getRealmRoles(): Observable<any[]> {

    this.token = localStorage.getItem('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    }
    return this.http.get<any[]>(this.apiUrl + '/roles', this.httpOptions);
  }


  


  /*--------------Get All Users From Keycloak--------------*/
  GetAllUsers(): Observable<any[]> {
    this.token = localStorage.getItem('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    }
    return this.http.get<any[]>(this.apiUrl + '/users', this.httpOptions);
  }

  getUserRoles(userId: string): Observable<any[]> {
    this.token = localStorage.getItem('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      })
    }
    const url = `${this.apiUrl}/users/${userId}/role-mappings`;
    return this.http.get<any[]>(url, this.httpOptions);
  }

  

  assignRole(userId: string, role: any): Observable<any> {
    const roleMappingUrl = `${this.apiUrl}/users/${userId}/role-mappings/realm`;


    const roleMapping = [{
      "id": role.id,
      "name": role.name,
      "description": role.description,
      "composite": role.composite,
      "clientRole": role.clientRole,
      "containerId": role.containerId
    }];

    return this.http.post(roleMappingUrl, roleMapping, this.httpOptions);
  }

  deleteRoleMapping(userId: string, role: any): Observable<void> {
    const url = `${this.apiUrl}/users/${userId}/role-mappings/realm`;

    const options = {
      ...this.httpOptions,
      body: [{
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "composite": role.composite,
        "clientRole": role.clientRole,
        "containerId": role.containerId
      }]
    };

    return this.http.request<void>('DELETE', url, options);
  }

  updateEstablishmentId(userId: string, establishmentId: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    const body = {
      attributes: {
        establishmentId: [establishmentId]
      }
    };


    return this.http.put(url, body, this.httpOptions);
  }


  updateCashierId(userId: string, cashierId: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    const body = {
      attributes: {
        cashierId: [cashierId]
      }
    };


    return this.http.put(url, body, this.httpOptions);
  }




}