import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { CustomerRetrieveResponse } from '../models/Customer/CustomerRetrieveResponse';
import { CustomerCreateRequest } from '../models/Customer/CustomerCreateRequest';
import { Country } from '../models/Address/Country';
import { Customer } from '../models/Customer/Customer';
import { Address } from '../models/Address/Address';
import { AddressRetreiveResponse } from '../models/Address/AddressRetrieveResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API_URL = environment.API_URL;

  private customerContext = new BehaviorSubject<Customer | null>(null);
  customerContext$ = this.customerContext.asObservable();

  private addressContext = new BehaviorSubject<Address[] | null>(null);
  addressContext$ = this.addressContext.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  setCustomerContext(value: Customer) {
    this.customerContext.next(value);
    this.getAddresses(value.id).subscribe((res) => {
      console.log('Customer Service setting address context: ', res);
      this.setaddressContext(res);
    });
  }

  getCustomerContext(): Customer | null {
    return this.customerContext.getValue();
  }

  setaddressContext(value: Address[]) {
    this.addressContext.next(value);
  }

  getaddressContext(): Address[] | null {
    return this.addressContext.getValue();
  }

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

  getCustomer(customerId: string): Observable<Customer> {
    let requestUrl = `${this.API_URL}/customers/${customerId}`;
    return this.httpClient.get<Customer>(requestUrl).pipe(
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

  getAddresses(customerId: string): Observable<Address[]> {
    let requestUrl = `${this.API_URL}/customers/${customerId}/address`;
    return this.httpClient.get<AddressRetreiveResponse>(requestUrl).pipe(
      map((response) => response.shippingAddresses),
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
