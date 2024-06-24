import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { Discount } from "../Stock/service/models";

@Injectable({
    providedIn: 'root',
})
export class DiscountService {
    private discountUrl = ' http://localhost:8085/gateway/STOCK/discount';



    constructor(private http: HttpClient) { }


    token = localStorage.getItem("token")



    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        })
    };

  

    getDiscountById(discountId: number): Observable<Discount> {
        const url = `${this.discountUrl}/getBy/${discountId}`;
        return this.http.get<Discount>(url, this.httpOptions)
            .pipe(
                catchError(error => {this.handleError; throw error;})
            );
    }

    createDiscount(discount: Discount): Observable<Discount> {
        return this.http.post<Discount>(`${this.discountUrl}/add`, discount, this.httpOptions)
            .pipe(
                catchError(error => {this.handleError; throw error;})            );
    }

    updateDiscount(discountId: number, discount: Discount): Observable<Discount> {
        return this.http.put<Discount>(`${this.discountUrl}/${discountId}`, discount, this.httpOptions)
            .pipe(
                catchError(error => {this.handleError; throw error;})            );
    }

    deleteDiscountById(discountId: number): Observable<void> {
        return this.http.delete<void>(`${this.discountUrl}/deleteByid/${discountId}`, this.httpOptions)
            .pipe(
                catchError(error => {this.handleError; throw error;})            );
    }

    getDiscountsByEstablishmentId(establishmentId: number): Observable<Discount[]> {
        const url = `${this.discountUrl}/by-establishment/${establishmentId}`;
        return this.http.get<Discount[]>(url, this.httpOptions)
            .pipe(
                catchError(error => {this.handleError; throw error;})            );
    }

    private handleError(error: any) {
        console.error('An error occurred:', error);
        throw error;
    }


  




}