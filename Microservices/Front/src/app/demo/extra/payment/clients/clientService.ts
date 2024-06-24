import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Client, Payment } from "../../Stock/service/models";




@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private baseUrl = 'http://localhost:8085/gateway/PAYMENT/clients';

    private payUrl ='http://localhost:8085/gateway/PAYMENT/payments'

    
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


    private externalPaymentUrl = `${this.payUrl}/externalPayment`;


    externalPayment(paymentRequest: any): Observable<any> {
        
        
        const body = {
          amount: paymentRequest.amount,
          orderNumber: paymentRequest.orderNumber,
          returnUrl: paymentRequest.returnUrl,
          failUrl: paymentRequest.failUrl,
        };
    
        // Make the POST request to the externalPayment endpoint
        return this.http.post<any>(this.externalPaymentUrl, body, this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }

      checkOrderStatus(orderId: string): Observable<any> {
        const body = { orderId: orderId };
        return this.http.post<any>(`${this.payUrl}/clickToPayCheck`, body, this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }


    findClientByEmailOrPhoneNumberAndEstablishmentId(query: string, establishmentId: number): Observable<Client> {
        const url = `${this.baseUrl}/find?query=${query}&establishmentId=${establishmentId}`;
        return this.http.get<Client>(url, this.httpOptions)
           
    }

    getAllClients(establishmentId: number): Observable<Client[]> {
        const url = `${this.baseUrl}/getallBy?id=${establishmentId}`;
        return this.http.get<Client[]>(url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getClientById(id: number): Observable<Client> {
        const url = `${this.baseUrl}/getby/${id}`;
        return this.http.get<Client>(url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    saveClient(client: Client): Observable<Client> {
        const url = `${this.baseUrl}/add`;
        return this.http.post<Client>(url, client, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    deleteClient(id: number): Observable<void> {
        const url = `${this.baseUrl}/delete/${id}`;
        return this.http.delete<void>(url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    updateFidelityPoints(id: number, fidelityPoints: number): Observable<Client> {
        const url = `${this.baseUrl}/updateFP/${id}/fidelity-points`;
        console.log("fp updated");
        return this.http.put<Client>(url, fidelityPoints , this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getAllClientsWithoutEstablishment(): Observable<Client[]> {
        const url = `${this.baseUrl}/getall`;
        return this.http.get<Client[]>(url, this.httpOptions)
            .pipe(catchError(this.handleError));
    }


   

    createPayment(payment: Payment): Observable<Payment> {
        
        const url = `${this.payUrl}/create`;
        return this.http.post<Payment>(url, payment, this.httpOptions).pipe(catchError(this.handleError));
      }



}