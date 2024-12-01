import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '@/src/app/services/customer.service';
import { Customer } from '@/src/app/models/Customer/Customer';

@Component({
  selector: 'app-customer-detail',
  standalone: false,
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
})
export class CustomerDetailComponent implements OnInit {
  customerContext: Customer | null = null;
  customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
    });
  }
}
