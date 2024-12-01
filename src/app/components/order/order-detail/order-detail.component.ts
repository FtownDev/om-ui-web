import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { EventType } from '@/src/app/models/Order/EventType';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  standalone: false,

  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  orderContext: Order | null = null;
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  customerContext: Customer | null = null;
  eventTypes: EventType[] | null = [];
  customerAddresses: Address[] = [];

  ngOnInit(): void {
    this.orderService.orderContext$.subscribe((val) => {
      this.orderContext = val;
    });
    this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      this.getCustomerAddresses();
    });
    this.eventTypes = this.orderService.getEventsContext();
    if (this.eventTypes?.length == 0) {
      this.orderService.getEventTypes().subscribe((res) => {
        this.eventTypes = res;
        this.orderService.setEventsContext(res);
      });
    }
  }

  getCustomerAddresses() {
    this.customerService
      .getAddresses(this.customerContext!.id)
      .subscribe((res) => {
        this.customerAddresses = res;
      });
  }
}
