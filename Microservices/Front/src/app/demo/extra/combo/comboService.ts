import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Combo } from "../Stock/service/models";



@Injectable({
    providedIn: 'root',
})
export class ComboService {
    private comboUrl = ' http://localhost:8085/gateway/STOCK/combo';



    constructor(private http: HttpClient) { }


    token = localStorage.getItem("token")



    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        })
    };


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


      getComboByRefAndEstablishmentId(ref: string, establishmentId: number) {
        const url = `${this.comboUrl}/findByRef?ref=${ref}&establishmentId=${establishmentId}`;
        return this.http.get<any>(url, this.httpOptions)
          .pipe(
            catchError(error => {
              console.error('Error getting sold product:', error);
              throw error; // Rethrow the error to handle it in the component
            })
          );
      }
      

    createCombo(combo: any): Observable<Combo> {
        return this.http.post<Combo>(`${this.comboUrl}/add`, combo, this.httpOptions).pipe(
            catchError(
              (error: any) => this.handleError(error)
            )
          );
    }

    updateCombo(id: number, combo: Combo): Observable<Combo> {
        return this.http.put<Combo>(`${this.comboUrl}/update/${id}`, combo, this.httpOptions).pipe(
            catchError(
              (error: any) => this.handleError(error)
            )
          );
    }

    getComboById(id: number): Observable<Combo> {
        return this.http.get<Combo>(`${this.comboUrl}/getBy/${id}`, this.httpOptions);
    }

    getAllCombosByEstablishmentId(establishmentId: number): Observable<Combo[]> {
        return this.http.get<Combo[]>(`${this.comboUrl}/GetALL/${establishmentId}`, this.httpOptions);
    }

    deleteCombo(id: number): Observable<any> {
        return this.http.delete<any>(`${this.comboUrl}/combos/${id}`, this.httpOptions);
    }



    addImageToSp(spId: number, image: File): Observable<Combo> {
        const formData = new FormData();
        formData.append('image', image);
    
        return this.http.post<Combo>(`${this.comboUrl}/addImagetoEstab/${spId}`, formData, {
          headers: this.httpOptions.headers, // Let Angular handle content type
          responseType: 'json' // Ensure response type is set to JSON
        });
      }

}