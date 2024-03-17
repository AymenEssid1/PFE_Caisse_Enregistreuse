import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Establishment } from './establishment.model';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class EstablishmentService {
  private apiUrl = 'http://localhost:8083/STOCK/establishments';

  constructor(private http: HttpClient) { }
  
  
  keycloakInstance = localStorage.getItem("token")


  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.keycloakInstance}`
    })
    }


    httpOptionss = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.keycloakInstance}`
      })
    };

  getAllEstablishments(): Observable<Establishment[]> {
    return this.http.get<Establishment[]>(`${this.apiUrl}/get-all-establishments`,this.httpOptions);
  }

  //Todo gotta fix this 

 addEstablishment(establishment: Establishment): Observable<Object> {
    return this.http.post(`${this.apiUrl}/add-establishment`, establishment,this.httpOptions);
  }

  updateEstablishment(id: number, establishment: Establishment): Observable<Establishment> {
    return this.http.put<Establishment>(`${this.apiUrl}/update-establishment/${id}`, establishment,this.httpOptions);
  }

  deleteEstablishment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-establishment/${id}`,this.httpOptions);
  }

  addImageToEstab(estabId: number, image: File): Observable<Establishment> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<Establishment>(`${this.apiUrl}/addImagetoEstab/${estabId}`, formData, {
      headers: this.httpOptionss.headers, // Let Angular handle content type
      responseType: 'json' // Ensure response type is set to JSON
    });
  }


  updateImage(estabId: number, imageFile: File): Observable<Establishment> {
    const formData = new FormData();
    formData.append('image', imageFile);

    return this.http.put<Establishment>(`${this.apiUrl}/update-image/${estabId}`, formData, {
      headers: this.httpOptionss.headers, // Let Angular handle content type
      responseType: 'json' // Ensure response type is set to JSON
    });
  }

  getEstablishmentById(estabId: number): Observable<Establishment> {
    return this.http.get<Establishment>(`${this.apiUrl}/estab/${estabId}`, this.httpOptions);
  }


}
