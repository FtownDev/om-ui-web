import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { OrderRetrieveResponse } from '../models/Order/OrderRetrieveResponse';
import { EventType } from '../models/Order/EventType';
import { Order } from '../models/Order/Order';
import { OrderCreateRequest } from '../models/Order/OrderCreateRequest';
import { OrderItem } from '../models/Order/OrderItem';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly API_URL = environment.API_URL;

  private orderContext = new BehaviorSubject<Order | null>(null);
  orderContext$ = this.orderContext.asObservable();

  private eventTypesContext = new BehaviorSubject<EventType[] | null>(null);
  eventTypesContext$ = this.eventTypesContext.asObservable();

  private orderItemsContext = new BehaviorSubject<OrderItem[] | null>(null);
  orderItemsContext$ = this.orderItemsContext.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  setOrderItemsContext(value: OrderItem[]) {
    this.orderItemsContext.next(value);
  }

  getOrderItemContext(): OrderItem[] | null {
    return this.orderItemsContext.getValue();
  }

  setOrderContext(value: Order) {
    this.orderContext.next(value);
  }

  getOrderContext(): Order | null {
    return this.orderContext.getValue();
  }

  setEventsContext(value: EventType[]) {
    this.eventTypesContext.next(value);
  }

  getEventsContext(): EventType[] | null {
    return this.eventTypesContext.getValue();
  }

  createOrder(data: OrderCreateRequest) {
    let requestUrl = `${this.API_URL}/orders`;
    let requestBody = JSON.stringify(data);
    console.log(requestBody);
    return this.httpClient
      .post<Order>(requestUrl, requestBody, this.httpOptions)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getOrderById(id: string): Observable<Order> {
    return this.httpClient.get<Order>(`${this.API_URL}/orders/${id}`).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

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

  getEventTypes(): Observable<EventType[]> {
    return this.httpClient
      .get<EventType[]>(`${this.API_URL}/orders/eventTypes`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getOrderItems(orderId: string | undefined): Observable<OrderItem[]> {
    return this.httpClient
      .get<OrderItem[]>(`${this.API_URL}/orders/${orderId}/items`)
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
