import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CustomerService } from '@/src/app/services/customer.service';
import { Customer } from '@/src/app/models/Customer/Customer';
import { Address } from '@/src/app/models/Address/Address';
import { NgIcon } from '@ng-icons/core';
import { AddAddressComponent } from '../add-address/add-address.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  imports: [NgIcon, AddAddressComponent, DatePipe],
})
export class CustomerDetailComponent implements OnInit {
  // Flags
  isLoading = false;
  error = false;
  showAddressForm = false;

  // Context
  route = inject(ActivatedRoute);
  customerId: string | null = null;
  customerContext: Customer | null = null;
  addressContext: Address[] | null = null;

  // Services
  customerService = inject(CustomerService);

  // Modals / Actions
  isOpen = false;
  showDeleteModal = false;
  addressToDelete: string | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.isOpen = false;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.customerId = params.get('customerId');
    });
    this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      if (value !== null) {
        this.isLoading = true;
        this.loadAddresses(value.id);
      } else if (this.customerId != null) {
        this.loadCustomerDetails();
      }
    });

    this.customerService.addressContext$.subscribe((value) => {
      this.addressContext = value;
    });
  }

  loadCustomerDetails() {
    this.customerService.getCustomer(this.customerId!).subscribe((value) => {
      this.customerService.setCustomerContext(value);
    });
  }
  loadAddresses(customerId: string): void {
    this.customerService.getAddresses(customerId).subscribe((value) => {
      this.customerService.setaddressContext(value);
      this.isLoading = false;
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

  openDeleteModal(addressId: string) {
    this.addressToDelete = addressId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.addressToDelete = null;
  }

  confirmDelete() {
    if (this.addressToDelete) {
      this.customerService
        .deleteCustomerAddress(this.customerContext!.id, this.addressToDelete)
        .subscribe((value) => {
          if (value != null) {
            this.customerService.setaddressContext(
              this.addressContext?.filter(
                (a) => a.id !== this.addressToDelete
              ) || []
            );

            this.closeDeleteModal();
          }
        });
    }
  }

  onEdit() {
    console.log('Edit clicked');
    this.isOpen = false;
  }

  onDelete() {
    console.log('Delete clicked');
    this.isOpen = false;
  }
}
