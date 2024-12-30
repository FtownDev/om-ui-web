import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '@/src/app/services/customer.service';
import { Customer } from '@/src/app/models/Customer/Customer';
import { Address } from '@/src/app/models/Address/Address';

@Component({
  selector: 'app-customer-detail',
  standalone: false,
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
})
export class CustomerDetailComponent implements OnInit {
  // Flags
  isLoading = false;
  error = false;
  showAddressForm = false;
  // Context
  customerContext: Customer | null = null;
  addressContext: Address[] | null = null;

  // Services
  customerService = inject(CustomerService);

  ngOnInit(): void {
    this.isLoading = true;
    this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      if (value !== null) {
        this.loadAddresses(value.id);
      }
      this.isLoading = false;
    });
    this.customerService.addressContext$.subscribe((value) => {
      this.addressContext = value;
    });
  }

  loadAddresses(customerId: string): void {
    this.customerService.getAddresses(customerId).subscribe((value) => {
      this.customerService.setaddressContext(value);
    });
  }

  getAddressDisplay(addressId: string): string {
    if (this.addressContext && this.addressContext.length > 0) {
      const a = this.addressContext.find((a) => a.id === addressId);
      if (a) {
        return `${a.street1} ${a.street2} ${a.dependentLocality}, ${a.locale} ${a.postalCode}`;
      }
    }
    return '';
  }
}
