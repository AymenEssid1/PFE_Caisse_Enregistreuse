
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Item } from "../Stock/service/models";




@Injectable({
    providedIn: 'root',
})
export class POSService {
    private baseUrl = 'http://localhost:8083/ORDER/Item';


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


    constructor(private http: HttpClient) { }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/add`, item, this.httpOptions).pipe(
        catchError(
          (error: any) => this.handleError(error)
        )
      );
  }

  updateItem(id: number,item: Item): Observable<Item>{
    return this.http.put<Item>(`${this.baseUrl}/update/${id}`, item, this.httpOptions).pipe(
        catchError(
          (error: any) => this.handleError(error)
        )
      );
  }

  deleteItemById(id: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
      catchError(
        (error: any) => this.handleError(error)
      )
    );;
  }

  deleteItemsByIds(itemIds: number[]): Observable<any> {
    const url = `${this.baseUrl}/deleteList`;
  
    // Send itemIds in the request body
    const body = itemIds;
  
    return this.http.delete(url, { ...this.httpOptions, body }).pipe(
      catchError(this.handleError)
    );
  }
  

  



}