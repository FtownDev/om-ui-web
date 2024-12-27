import { OrderItemChangeType } from './OrderItemChangeType';

export interface OrderItemHistory {
  itemId: string;
  qty: number;
  changeType: OrderItemChangeType;
}
