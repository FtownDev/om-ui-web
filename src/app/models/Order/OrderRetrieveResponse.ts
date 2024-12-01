import { Order } from './Order';
export interface OrderRetrieveResponse {
  pageSize: number;
  totalCount: number;
  orders: Order[];
}
