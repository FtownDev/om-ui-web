import { Order } from './Order';
import { OrderItem } from './OrderItem';

export interface OrderCreateRequest {
  order: Order;
  orderItems: OrderItem[];
}
