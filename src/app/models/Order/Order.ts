import { OrderStatus } from './OrderStatus';
import { PaymentTerms } from './PaymentTerms';

export interface Order {
  id?: string;
  created: Date;
  updated?: string;
  eventDate: Date;
  eventTypeId: string;
  billedToCustomerId: string;
  billedToAddressId: string;
  shippedToAddressId: string;
  amount: number;
  balanceDue: number;
  taxRate: number;
  deliveryWindow?: string[][];
  pickupWindow?: string[][];
  deliveryPickupNotes?: string;
  deposit?: number;
  discount?: number;
  currentStatus: OrderStatus;
  paymentTerms: PaymentTerms;
  itemTotalValue: number;
  shippingCost: number;
  taxValue: number;
}
