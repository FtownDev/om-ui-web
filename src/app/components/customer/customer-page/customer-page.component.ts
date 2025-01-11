import { CustomerService } from '@/src/app/services/customer.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Customer } from '@/src/app/models/Customer/Customer';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerSearchRequest } from '@/src/app/models/Customer/CustomerSearchRequest';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrl: './customer-page.component.css',
  imports: [NgIcon, ReactiveFormsModule, DatePipe],
})
export class CustomerPageComponent implements OnInit {
  isLoading = signal(false);
  customers: Customer[] = [];
  searchForm: FormGroup<any> | undefined;

  fb = inject(FormBuilder);
  addresses = [];
  currentPage: any;
  itemsPerPage = 50;
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

    this.searchForm = this.fb.group({
      field: ['firstName', Validators.required],
      value: ['', Validators.required],
    });
  }

  onFieldChange(event: any): void {
    this.searchForm!.get('field')!.setValue(event.value);
  }

  searchCustomers() {
    this.isLoading.set(true);
    const field = this.searchForm?.value.field as keyof CustomerSearchRequest;
    const value = this.searchForm?.value.value;
    const searchData: CustomerSearchRequest = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
    if (field) {
      searchData[field] = value;
    }

    this.customerService.searchCustomers(searchData).subscribe((res) => {
      this.customers = res;
      this.isLoading.set(false);
    });
  }

  async selectCustomer(data: Customer) {
    await this.customerService.setCustomerContext(data);
    this.router.navigate(['/customers/detail']);
  }
}
