import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { EventType } from '@/src/app/models/Order/EventType';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';

@Component({
  selector: 'app-add-order',
  standalone: false,

  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css',
})
export class AddOrderComponent implements OnInit {
  isLoading: Boolean = false;
  private destroy$ = new Subject<void>();
  orderContext: Order | null = null;
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  customerContext: Customer | null = null;
  eventTypes: EventType[] | null = [];
  addressContext: Address[] | null = [];

  ngOnInit(): void {
    this.customerService.customerContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        console.log('Add Oder retrived new customer context!', val);
        this.customerContext = val;
      });
    this.customerService.addressContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.addressContext = val;
      });
  }
}
