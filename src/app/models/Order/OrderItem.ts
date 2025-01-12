export interface OrderItem {
  id?: string;
  orderId?: string;
  itemId: string;
  qty: number;
  itemName: string;
  itemCategory: string;
  price: number;
}
