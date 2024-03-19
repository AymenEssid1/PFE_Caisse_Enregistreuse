import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StockProduct } from "./models";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
  })
export class StockServices {
    private stockProductUrl = 'http://localhost:8083/STOCK/stock-products';

  
    constructor(private http: HttpClient) { }
    
    
    token = localStorage.getItem("token")
  
  
   
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`
        })
      };
  
  
      getStockPById(Id: number): Observable<StockProduct> {
        return this.http.get<StockProduct>(`${this.stockProductUrl}/getstockpById/${Id}`, this.httpOptions);
      }

      getAllStockProducts(establishmentId: number): Observable<StockProduct[]> {
        const url = `${this.stockProductUrl}/get-all-stock-products/${establishmentId}`;
        return this.http.get<StockProduct[]>(url, this.httpOptions).pipe(
          catchError((error) => {
            console.error('Error fetching stock products:', error);
            throw error;
          })
        );
      }
    
      addStockProduct(establishmentId: number, stockProduct: StockProduct): Observable<StockProduct> {
        const url = `${this.stockProductUrl}/add-stock-product/${establishmentId}`;
        return this.http.post<StockProduct>(url, stockProduct, this.httpOptions).pipe(
          catchError((error) => {
            console.error('Error adding stock product:', error);
            throw error;
          })
        );
      }
    
      updateStockProduct(establishmentId: number, id: number, updatedStockProduct: StockProduct): Observable<StockProduct> {
        const url = `${this.stockProductUrl}/update-stock-product/${establishmentId}/${id}`;
        return this.http.put<StockProduct>(url, updatedStockProduct, this.httpOptions).pipe(
          catchError((error) => {
            console.error('Error updating stock product:', error);
            throw error;
          })
        );
      }
    
      deleteStockProduct(id: number): Observable<void> {
        const url = `${this.stockProductUrl}/delete-stock-product/${id}`;
        return this.http.delete<void>(url, this.httpOptions).pipe(
            
          catchError((error) => {
            console.error('Error deleting stock product:', error);
            throw error;
          })
        );
      }
  
  }
  