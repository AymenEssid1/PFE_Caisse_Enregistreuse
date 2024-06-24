import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private apiUrl = 'http://localhost:8085/gateway/STOCK/test/validate';

  constructor(private http: HttpClient) { }

  validateToken(token: string): Observable<string> {
    console.log(token



    );
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get<string>(this.apiUrl, { headers });
  }
}
