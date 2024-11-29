import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { CustomerRetrieveResponse } from '../models/Customer/CustomerRetrieveResponse';
import { CustomerCreateRequest } from '../models/Customer/CustomerCreateRequest';
import { Country } from '../models/Address/Country';
import { Customer } from '../models/Customer/Customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API_URL = environment.API_URL;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

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

  getAllCountries(): Observable<Country[]> {
    let requestUrl = `${this.API_URL}/customers/address/countries/all`;
    return this.httpClient.get<Country[]>(requestUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  createCustomer(data: CustomerCreateRequest) {
    let requestUrl = `${this.API_URL}/customers`;
    let requestBody = JSON.stringify(data);
    return this.httpClient
      .post<Customer>(requestUrl, requestBody, this.httpOptions)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}
