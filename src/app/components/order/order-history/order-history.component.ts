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
import { FieldNameDisplay } from '@/src/app/utils/FieldNameDisplay';
import { OrderItemHistory } from '@/src/app/models/Order/OrderItemHistory';
import { OrderItemChangeType } from '@/src/app/models/Order/OrderItemChangeType';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.css',
    imports: [
    DatePipe
],
})
export class OrderHistoryComponent implements OnInit {
  // Flags
  error = false;
  isLoading = false;

  // Tabs
  tabs = [
    { label: 'Details', badge: null },
    { label: 'Items', badge: null },
  ];
  activeTab = 0;

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
  orderItemHistory: OrderItemHistory[] = [];
  changeType = OrderItemChangeType;

  // Inventory
  itemCategories: InventoryCategory[] = [];
  items: InventoryItem[] = [];

  // Mappings
  fieldNameDisplay = FieldNameDisplay;

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

  selectTab(index: number) {
    this.activeTab = index;
    if (index === 1 && this.orderItemHistory.length == 0) {
      this.loadItemHistory();
    }
  }

  loadHistory() {
    if (this.orderId != null) {
      this.orderService.getOrderHistory(this.orderId).subscribe((val) => {
        console.log('OrderHistory: ', val);
        this.orderHistory = val;
      });
      this.orderService.getOrderById(this.orderId).subscribe((val) => {
        this.orderService.setOrderContext(val);
      });
      this.isLoading = false;
    }
  }

  loadItemHistory() {
    this.isLoading = true;
    this.inventoryService.getInventoryCategories().subscribe((res) => {
      this.itemCategories = res;
    });

    this.inventoryService.getInventoryItems().subscribe((res) => {
      this.items = res;
    });
    if (this.orderId != null) {
      this.orderService.getOrderItemHistory(this.orderId).subscribe((val) => {
        console.log('ItemHistory: ', val);
        this.orderItemHistory = val;
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

  getItemDisplayName(itemId: string): string {
    const item = this.items.find((i) => i.id === itemId);
    const category = this.itemCategories.find((c) => c.id === item?.categoryId);
    return item?.name + ' - ' + category?.name;
  }

  getEventType(eventId: string): string {
    if (this.eventTypesContext != null) {
      const eventType = this.eventTypesContext.find((e) => e.id === eventId);
      if (eventType != null) {
        return eventType.name;
      }
    }
    return '';
  }

  getAddress(addressId: string): string {
    if (this.addressContext != null) {
      const address = this.addressContext.find((a) => a.id === addressId);
      if (address != null) {
        return (
          address.street1 +
          (address.street2 != null ? ' ' + address.street2 : null) +
          ' ' +
          address.dependentLocality +
          ', ' +
          address.locale +
          ' ' +
          address.postalCode
        );
      }
    }
    return '';
  }

  getParedDate(dateString: string): string[][] {
    return dateString
      .split(';')
      .map((group) => group.split(',').map((dateStr) => dateStr.trim()));
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
