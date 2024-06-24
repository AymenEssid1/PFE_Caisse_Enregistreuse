
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Item, Session } from "../Stock/service/models";


////THIS THE ONE

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private baseUrl = 'http://localhost:8085/gateway/ORDER/session';

    token = localStorage.getItem("token");

    constructor(private http: HttpClient) { }




    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        })
    };

   


     // Handle HTTP errors
     private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }


    getSessionsByEstablishmentId(establishmentId: number): Observable<Session[]> {
        return this.http.get<Session[]>(`${this.baseUrl}/establishment/${establishmentId}`, this.httpOptions)
          .pipe(catchError(this.handleError));
      }


      getSessionsByCashier(username: string): Observable<Session[]> {
        return this.http.get<Session[]>(`${this.baseUrl}/cashier/${username}`, this.httpOptions)
          .pipe(catchError(this.handleError));
      }
      // Create session
    createSession(session: any): Observable<Session> {
        return this.http.post<Session>(`${this.baseUrl}/create`, session, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Get session by ID
    getSessionById(id: number): Observable<Session> {
        return this.http.get<Session>(`${this.baseUrl}/getby/${id}` , this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Get all sessions
    getAllSessions(): Observable<Session[]> {
        return this.http.get<Session[]>(`${this.baseUrl}/getAll`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    // Delete session by ID
    deleteSession(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

   

  /*  closeSession(id: number, actualMoney: number): Observable<any> {
        const url = `${this.baseUrl}/close/${id}?actualMoney=${actualMoney}`;
        return this.http.put<any>(url, null, this.httpOptions)
          .pipe(catchError(this.handleError));
      }*/

      closeSession(sessionId: number, actualMoney: number, note: string): Observable<Session> {
        return this.http.put<Session>(`${this.baseUrl}/close/${sessionId}`, { actualMoney, note },this.httpOptions).pipe(catchError(this.handleError));
      }
      


      updateExpectedMoney(sessionId: number, expectedMoney: number): Observable<Session> {
        const url = `${this.baseUrl}/${sessionId}/expected-money`;
        return this.http.put<Session>(url,  expectedMoney , this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }

}