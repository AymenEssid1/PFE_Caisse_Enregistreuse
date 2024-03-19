import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Combo } from "../Stock/service/models";



@Injectable({
    providedIn: 'root',
})
export class ComboService {
    private comboUrl = 'http://localhost:8083/STOCK/combo';



    constructor(private http: HttpClient) { }


    token = localStorage.getItem("token")



    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        })
    };


    createCombo(combo: Combo): Observable<Combo> {
        return this.http.post<Combo>(`${this.comboUrl}/add`, combo, this.httpOptions);
    }

    updateCombo(id: number, combo: Combo): Observable<Combo> {
        return this.http.put<Combo>(`${this.comboUrl}/update/${id}`, combo, this.httpOptions);
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




}