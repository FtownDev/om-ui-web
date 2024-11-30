import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '@/src/environments/environment.development';
import { InventoryCategory } from '../models/Inventory/InventoryCategory';
import { InventoryItem } from '../models/Inventory/InventoryItem';
import { InventoryItemCreateRequest } from '../models/Inventory/InventoryItemCreateRequest';
import { InventoryCategoryCreateRequest } from '../models/Inventory/InventoryCategoryCreateRequest';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly API_URL = environment.API_URL;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  getInventoryCategories(): Observable<InventoryCategory[]> {
    return this.httpClient
      .get<InventoryCategory[]>(`${this.API_URL}/inventory/category/all`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  getInventoryItems(): Observable<InventoryItem[]> {
    return this.httpClient
      .get<InventoryItem[]>(`${this.API_URL}/inventory/items/all`)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  createInventoryItem(data: InventoryItemCreateRequest, path: string) {
    let requestUrl = `${this.API_URL}/inventory/items/category/${path}`;
    let requestBody = JSON.stringify(data);
    return this.httpClient
      .post<InventoryItem>(requestUrl, requestBody, this.httpOptions)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  createInventoryCategory(data: InventoryCategoryCreateRequest) {
    let requestUrl = `${this.API_URL}/inventory/category`;
    let requestBody = JSON.stringify(data);
    return this.httpClient
      .post<InventoryCategory>(requestUrl, requestBody, this.httpOptions)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

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
