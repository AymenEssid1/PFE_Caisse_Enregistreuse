import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Establishment, Tables } from './establishment.model';
import { KeycloakService } from 'keycloak-angular';
import { catchError } from 'rxjs/operators';

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

  transferData(originalestabId: number, targetEstablishmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${originalestabId}/transfer-data?targetEstablishmentId=${targetEstablishmentId}`;
    return this.http.post<any>(url, null, this.httpOptions).pipe(
      catchError( (error: any) => this.handleError(error))
    );
  }

  createTable(table: Tables): Observable<Tables> {
    return this.http.post<Tables>(`${this.apiUrl}/create-table`, table, this.httpOptions);
  }

  deleteTable(tableId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteTable/${tableId}`, this.httpOptions);
  }

  adjustTableStatus(tableId: number, newStatus: boolean): Observable<Tables> {
    return this.http.put<Tables>(`${this.apiUrl}/adjust-status/${tableId}/?newStatus=${newStatus}`, null, this.httpOptions);
  }

  editTableName(tableId: number, newName: string): Observable<Tables> {
    return this.http.put<Tables>(`${this.apiUrl}/edit-name/${tableId}?newName=${newName}`, null, this.httpOptions);
  }

  getTablesByEstablishmentId(establishmentId: number): Observable<Tables[]> {
    return this.http.get<Tables[]>(`${this.apiUrl}/${establishmentId}/tables`, this.httpOptions);
  }

  


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error || 'Server error';
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  


}



