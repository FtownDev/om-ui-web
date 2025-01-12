import { OrderItemChangeType } from './OrderItemChangeType';

export interface OrderItemHistory {
  id: string;
  orderId: string;
  itemId: string;
  oldQuantity: number;
  newQuantity: number;
  changedDate: Date;
  changedByUserId: string;
  changedByUserName: string;
  changeType: OrderItemChangeType;
  itemName: string;
  itemCategory: string;
}
