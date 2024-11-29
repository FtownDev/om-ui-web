import { CustomerService } from '@/src/app/services/customer.service';
import { Component, OnInit } from '@angular/core';
import { Customer } from '@/src/app/models/Customer';

@Component({
  selector: 'app-customer-page',
  standalone: false,

  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css',
})
export class CustomerPageComponent implements OnInit {
  customers: any = [];
  addresses = [];
  currentPage: any;
  itemsPerPage: any;
  totalCount = 0;

  constructor(public customerService: CustomerService) {}
  ngOnInit() {
    this.customerService
      .getAllCustomers(this.currentPage, this.totalCount)
      .subscribe((res) => {
        this.customers = res.customers;
        this.itemsPerPage = res.pageSize;
        this.totalCount += res.pageSize;
      });
  }

  logData() {
    console.log(this.customers);
  }
}
