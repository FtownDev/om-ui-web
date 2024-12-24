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
}
/*
public Guid Id 
public DateTime Created 
public DateTime Updated 
public DateTime EventDate 
public Guid EventTypeId
public Guid BilledToCustomerId
public Guid BilledToAddressId 
public Guid ShippedToAddressId 
public decimal Amount 
public decimal BalanceDue 
public decimal TaxRate 
public List<List<DateTime>> DeliveryWindow 
public List<List<DateTime>> PickupWindow 
public string DeliveryPickupNotes 
public decimal Deposit 
public decimal Discount 
public OrderStatus CurrentStatus 
public PaymentTerms PaymentTerms 
 */
