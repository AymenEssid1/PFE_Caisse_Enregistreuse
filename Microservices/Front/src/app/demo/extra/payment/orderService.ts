
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Order } from "../Stock/service/models";




@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private baseUrl = 'http://localhost:8085/gateway/ORDER/order';

    


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

  createOrder(order: Order,sessionId:number): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/add/${sessionId}`, order, this.httpOptions).pipe(
        catchError(
          (error: any) => this.handleError(error)
        )
      );
  }


  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${orderId}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  updateOrderStatus(orderId: number, paymentStatus: boolean): Observable<Order> {
    const url = `${this.baseUrl}/${orderId}/status`;
    return this.http.put<Order>(url,  paymentStatus , this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  getNotPaidOrdersBySessionId(sessionId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/${sessionId}/notPaid`, this.httpOptions)
        .pipe(catchError(this.handleError));
}







}