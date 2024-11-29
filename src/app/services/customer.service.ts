import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { CustomerRetrieveResponse } from '../models/CustomerRetrieveResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API_URL = environment.API_URL; //localhost:6001/inventory/category/all

  constructor(private httpClient: HttpClient) {}

  getAllCustomers(
    pageSize = 50,
    currentNumber = 0
  ): Observable<CustomerRetrieveResponse> {
    let requestUrl = `${this.API_URL}/customers?pageSize=${pageSize}&currentNumber=${currentNumber}`;
    return this.httpClient.get<CustomerRetrieveResponse>(requestUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  // getInventoryItems(): Observable<any> {
  //   return this.httpClient.get(`${this.API_URL}/inventory/items/all`).pipe(
  //     map((response) => response),
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
