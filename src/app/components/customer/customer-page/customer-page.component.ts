import { CustomerService } from '@/src/app/services/customer.service';
import { Component, inject, OnInit } from '@angular/core';
import { Customer } from '@/src/app/models/Customer/Customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-page',
  standalone: false,

  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css',
})
export class CustomerPageComponent implements OnInit {
  customers: Customer[] = [];
  addresses = [];
  currentPage: any;
  itemsPerPage: any;
  totalCount = 0;

  customerService = inject(CustomerService);
  router = inject(Router);

  ngOnInit() {
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
    this.router.navigate(['/customers/detail']);
  }
}
