import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionPDFService {

  private baseUrl = 'http://localhost:8085/gateway/ORDER/api/session-pdfs';

  private baseUrl2 = 'http://localhost:8085/gateway/ORDER/stats';



  private baseUrl3='http://localhost:8085/gateway/STOCK/stats'



  private token: string | null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token");
  }

  getSoldProductsByIds(ids: number[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl3}/sold-products?list=${ids.join(',')}`, httpOptions);
  }

  getCombosByIds(ids: number[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl3}/combos?list=${ids.join(',')}`, httpOptions);
  }

  getCashiersWithMinusSessions(establishmentId: number, year: number, month: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/cashiers/minus?establishmentId=${establishmentId}&year=${year}&month=${month}`, httpOptions);
  }



  ///////////////////////////////////////
  getTop5Combos(year: number, month: number, establishmentId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/top5-combos?year=${year}&month=${month}&establishmentId=${establishmentId}`, httpOptions);
  }
  
  getTop5SoldProducts(year: number, month: number, establishmentId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/top5-sold-products?year=${year}&month=${month}&establishmentId=${establishmentId}`, httpOptions);
  }
  
  getWorst5Combos(year: number, month: number, establishmentId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/worst5-combos?year=${year}&month=${month}&establishmentId=${establishmentId}`, httpOptions);
  }
  
  getWorst5SoldProducts(year: number, month: number, establishmentId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/worst5-sold-products?year=${year}&month=${month}&establishmentId=${establishmentId}`, httpOptions);
  }
  

///////////////////////////////////////////////////
  getPercentageChange(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/percentage-change`, httpOptions);
  }

  getPercentageChange2(establishmentId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any>(`${this.baseUrl2}/percentage-change2?establishmentId=${establishmentId}`, httpOptions);
  }
  



  getOrdersSumByEstablishment(year: number): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any[]>(`${this.baseUrl2}/sum/${year}`, httpOptions);
  }

  
  getAllSessionPDFs(): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.get<any[]>(this.baseUrl, httpOptions);
  }


  deleteAllSessionPDFs(): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.delete<string>(`${this.baseUrl}/all`, httpOptions);
  }

  downloadSessionPDF(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      }),
      responseType: 'blob' as 'json' // Specify responseType as blob
    };
    return this.http.get(`${this.baseUrl}/${id}`, httpOptions);
  }

  deleteSessionPDF(id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    return this.http.delete(`${this.baseUrl}/${id}`, httpOptions);
  }
}
