import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { InventoryItem } from '@/src/app/models/Inventory/InventoryItem';
import { EventType } from '@/src/app/models/Order/EventType';
import { Order } from '@/src/app/models/Order/Order';
import { OrderItem } from '@/src/app/models/Order/OrderItem';
import { CustomerService } from '@/src/app/services/customer.service';
import { InventoryService } from '@/src/app/services/inventory.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentTerms } from '@/src/app/models/Order/PaymentTerms';
import { ShippingRates } from '@/src/app/models/Order/ShippingRates';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  imports: [NgIcon, ReactiveFormsModule, CurrencyPipe, DatePipe],
})
export class OrderDetailComponent implements OnInit {
  orderContext: Order | null = null;
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  router = inject(Router);
  customerContext: Customer | null = null;
  eventTypes: EventType[] | null = [];
  customerAddresses: Address[] = [];
  orderItems: OrderItem[] = [];
  shippingRate = ShippingRates;
  paymentTerms: any;
  orderSubTotal: number = 0;

  async ngOnInit(): Promise<void> {
    await this.orderService.orderContext$.subscribe((val) => {
      this.orderContext = val;
      if (val != null) this.getOrderItems();
    });
    await this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      if (value != null) this.getCustomerAddresses();
    });

    if (this.orderContext != null) {
      this.eventTypes = await this.orderService.getEventsContext();
      if (this.eventTypes?.length == 0) {
        this.orderService.getEventTypes().subscribe((res) => {
          this.eventTypes = res;
          this.orderService.setEventsContext(res);
        });
      }
      this.paymentTerms = Object.keys(PaymentTerms)
        .filter((key) => isNaN(Number(key)))
        .map((key) => ({
          value: PaymentTerms[key as keyof typeof PaymentTerms],
          label: key,
        }));
    }
  }

  async navigateToUpdateOrder() {
    await this.orderService.setOrderItemsContext(this.orderItems);
    this.router.navigate(['/orders', this.orderContext?.id, 'update']);
  }

  async navigateToOrderHistory() {
    this.router.navigate(['/orders', this.orderContext?.id, 'history']);
  }

  getCustomerAddresses() {
    this.customerService
      .getAddresses(this.customerContext!.id)
      .subscribe((res) => {
        this.customerAddresses = res;
      });
  }

  getOrderItems() {
    if (this.orderContext != null) {
      this.orderService
        .getOrderItems(this.orderContext!.id)
        .subscribe((res) => {
          this.orderItems = res;
          this.getOrderTotal();
        });
    }
  }

  getOrderTotal() {
    return this.orderContext?.amount;
  }

  getEventName(eventTypeId: string) {
    const eventType = this.eventTypes?.find((e) => e.id == eventTypeId);
    if (eventType) return eventType.name;
    else return null;
  }
  getAddressLine1(id: string) {
    const address = this.customerAddresses?.find((a) => a.id == id);
    if (address) {
      return address.street1 + ' ' + address.street2;
    } else {
      return null;
    }
  }

  getAddressLine2(id: string) {
    const address = this.customerAddresses?.find((a) => a.id == id);
    if (address) {
      return address.locale + ', ' + address.dependentLocality;
    } else {
      return null;
    }
  }

  getAddressLine3(id: string) {
    const address = this.customerAddresses?.find((a) => a.id == id);
    if (address) {
      return address.country + ' - ' + address.postalCode;
    } else {
      return null;
    }
  }
}
