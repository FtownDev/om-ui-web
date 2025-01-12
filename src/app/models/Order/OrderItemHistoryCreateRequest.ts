import { OrderItemChangeType } from './OrderItemChangeType';

export interface OrderItemHistoryCreateRequest {
  itemId: string;
  qty: number;
  changeType: OrderItemChangeType;
  itemName: string;
  itemCategory: string;
  price: number;
}
