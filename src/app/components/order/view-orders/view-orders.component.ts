import { Customer } from '@/src/app/models/Customer/Customer';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStatus } from '@/src/app/models/Order/OrderStatus';
import { EventType } from '@/src/app/models/Order/EventType';
import { OrderStatusDisplayComponent } from '../order-status-display/order-status-display.component';
import { NgIcon } from '@ng-icons/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-view-orders',
    templateUrl: './view-orders.component.html',
    styleUrl: './view-orders.component.css',
    imports: [
        NgIcon,
        OrderStatusDisplayComponent,
        CurrencyPipe,
        DatePipe,
    ],
})
export class ViewOrdersComponent implements OnInit {
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  router = inject(Router);
  itemsPerPage = 50;
  totalCount = 0;
  orders: Order[] = [];
  customers: Customer[] = [];
  eventTypes: EventType[] = [];
  isLoading: Boolean = false;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.orderService
      .getOrders(this.itemsPerPage, this.totalCount)
      .subscribe((res) => {
        this.orders = res.orders;
        this.itemsPerPage = res.pageSize;
        this.totalCount += res.pageSize;
        this.getCustomers();
        this.getEventTypes();
      });
  }

  getCustomers() {
    if (this.orders.length > 0) {
      this.orders.forEach((o) => {
        this.customerService
          .getCustomer(o.billedToCustomerId)
          .subscribe((res) => this.customers.push(res));
      });
      this.isLoading = false;
    } else {
      console.log('orders is empty');
    }
  }

  getEventTypes() {
    this.orderService.getEventTypes().subscribe((res) => {
      this.eventTypes = res;
      this.orderService.setEventsContext(res);
    });
  }

  getEventName(id: string) {
    if (this.eventTypes.length > 0) {
      const event = this.eventTypes.find((e) => e.id == id);
      if (!event) {
        console.log('Unable to find EventId: ' + id);
      } else {
        return event.name;
      }
    }
    return null;
  }

  getCustomerName(id: string) {
    const customer = this.customers.find((c) => c.id == id);
    return customer?.firstName + ' ' + customer?.lastName;
  }

  getOrderStatus(id: number) {
    return OrderStatus[id];
  }

  async selectOrder(data: Order) {
    await this.orderService.setOrderContext(data);
    await this.customerService.setCustomerContext(
      this.customers.find((c) => c.id == data.billedToCustomerId)!
    );
    this.router.navigate(['/orders/detail']);
  }
}
