import { Customer } from '@/src/app/models/Customer/Customer';
import { CustomerService } from '@/src/app/services/customer.service';
import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-select-customer',
    templateUrl: './select-customer.component.html',
    styleUrl: './select-customer.component.css',
    imports: [
    DatePipe
],
})
export class SelectCustomerComponent implements OnInit {
  customers: Customer[] = [];
  addresses = [];
  currentPage: any;
  itemsPerPage = 50;
  totalCount = 0;

  customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService
      .getAllCustomers(this.currentPage, this.totalCount)
      .subscribe((res) => {
        this.customers = res.customers;
        this.itemsPerPage = res.pageSize;
        this.totalCount += res.pageSize;
      });
  }

  async selectCustomer(data: Customer) {
    await this.customerService.setCustomerContext(data);
  }
}
