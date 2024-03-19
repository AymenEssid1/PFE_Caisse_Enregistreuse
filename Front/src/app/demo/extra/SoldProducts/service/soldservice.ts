import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Category, SoldProduct } from "../../Stock/service/models";



@Injectable({
    providedIn: 'root',
})
export class SoldServices {
    private categoryUrl = 'http://localhost:8083/STOCK/categories';

    private soldUrl ='http://localhost:8083/STOCK/sold-products'


    constructor(private http: HttpClient) { }


    token = localStorage.getItem("token")



    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        })
    };

    deleteSoldProduct(soldProductId: number): Observable<void> {
        const url = `${this.soldUrl}/delete-sold-product/${soldProductId}`;
        return this.http.delete<void>(url, this.httpOptions).pipe(
          catchError(error => {
            console.error('Error deleting sold product:', error);
            throw error; // Rethrow the error to handle it in the component
          })
        );
      }
    
      getAllSoldProducts(establishmentId: number): Observable<SoldProduct[]> {
        const url = `${this.soldUrl}/get-all-sold-products/${establishmentId}`;
        return this.http.get<SoldProduct[]>(url, this.httpOptions).pipe(
          catchError(error => {
            console.error('Error fetching sold products:', error);
            throw error; // Rethrow the error to handle it in the component
          })
        );
      }


    addSoldProduct(establishmentId: number, soldProduct: SoldProduct): Observable<SoldProduct> {
        const url = `${this.soldUrl}/add-sold-product/${establishmentId}`;
        const soldProductJson = JSON.stringify(soldProduct, null, 2);
        console.log('Sold Product JSON:', soldProductJson);


        return this.http.post<SoldProduct>(url, soldProduct, this.httpOptions).pipe(
            catchError(error => {
              console.error('Error adding sold product:', error);
              return throwError(error);
            })
          );;
      }


     // Add a new category
  addCategory(establishmentId: number, category: Category): Observable<Category> {
    const url = `${this.categoryUrl}/add-category/${establishmentId}`;
    return this.http.post<Category>(url, category, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error adding category:', error);
        return throwError(error);
      })
    );
  }

  // Update an existing category
  updateCategory(categoryId: number, updatedCategory: Category): Observable<Category> {
    const url = `${this.categoryUrl}/update-category/${categoryId}`;
    return this.http.put<Category>(url, updatedCategory, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error updating category:', error);
        return throwError(error);
      })
    );
  }

  // Delete a category
  deleteCategory(categoryId: number): Observable<void> {
    const url = `${this.categoryUrl}/delete-category/${categoryId}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error deleting category:', error);
        return throwError(error);
      })
    );
  }

  // Get all categories for a specific establishment
  getAllCategories(establishmentId: number): Observable<Category[]> {
    const url = `${this.categoryUrl}/get-all-categories/${establishmentId}`;
    return this.http.get<Category[]>(url, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(error);
      })
    );
  }

}