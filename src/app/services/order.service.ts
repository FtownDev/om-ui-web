import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { OrderRetrieveResponse } from '../models/Order/OrderRetrieveResponse';
import { EventType } from '../models/Order/EventType';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly API_URL = environment.API_URL;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  getOrders(
    pageSize = 50,
    currentNumber = 0
  ): Observable<OrderRetrieveResponse> {
    return this.httpClient
      .get<OrderRetrieveResponse>(
        `${this.API_URL}/orders/all?pageSize=${pageSize}&currentNumber=${currentNumber}`
      )
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  //
  getEventTypes(): Observable<EventType[]> {
    return this.httpClient
      .get<EventType[]>(`${this.API_URL}/orders/eventTypes`)
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
