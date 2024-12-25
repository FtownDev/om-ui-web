import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { EventType } from '@/src/app/models/Order/EventType';
import { InventoryItem } from '@/src/app/models/Inventory/InventoryItem';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { InventoryService } from '@/src/app/services/inventory.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderHistory } from '@/src/app/models/Order/OrderHistory';

@Component({
  selector: 'app-order-history',
  standalone: false,

  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  // Flags
  error = false;
  isLoading = false;

  // Services
  customerService = inject(CustomerService);
  inventoryService = inject(InventoryService);
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  fb = inject(FormBuilder);

  // Context
  orderId: string | null = null;
  orderContext: Order | null = null;
  addressContext: Address[] | null = null;
  eventTypesContext: EventType[] | null = null;
  customerContext: Customer | null = null;
  orderHistory: OrderHistory[] = [];

  // Inventory
  itemCategories: InventoryCategory[] = [];
  items: InventoryItem[] = [];

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId');
      this.loadHistory();
    });
    await this.orderService.orderContext$.subscribe((val) => {
      this.orderContext = val;
      if (this.orderContext != null) {
        this.getCustomerContext();
      }
    });
    await this.orderService.eventTypesContext$.subscribe((value) => {
      this.eventTypesContext = value;
      if (value == null) {
        this.orderService.getEventTypes().subscribe((res) => {
          this.orderService.setEventsContext(res);
        });
      }
    });
    await this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      if (value != null) this.loadAddresses();
    });
    await this.customerService.addressContext$.subscribe((value) => {
      this.addressContext = value;
    });
  }

  loadHistory() {
    if (this.orderId != null) {
      this.orderService.getOrderHistory(this.orderId).subscribe((val) => {
        this.orderHistory = val;
        this.isLoading = false;
      });
    }
  }

  loadAddresses() {
    this.customerService
      .getAddresses(this.customerContext!.id)
      .subscribe((val) => {
        this.customerService.setaddressContext(val);
      });
  }

  async getCustomerContext() {
    if (this.orderContext != null) {
      this.customerService
        .getCustomer(this.orderContext.billedToCustomerId)
        .subscribe((c) => {
          this.customerService.setCustomerContext(c);
        });
      this.customerService
        .getAddresses(this.customerContext!.id)
        .subscribe((a) => {
          this.customerService.setaddressContext(a);
        });
    }
  }
}
