import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { CustomerCreateRequest } from '@/src/app/models/Customer/CustomerCreateRequest';
import { Router } from '@angular/router';
import { Country } from '@/src/app/models/Address/Country';
import { Customer } from '@/src/app/models/Customer/Customer';

@Component({
  selector: 'app-add-customer',
  standalone: false,

  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css',
})
export class AddCustomerComponent implements OnInit {
  countryList: Country[] = [];
  customerForm: FormGroup<any> | undefined;

  customerService = inject(CustomerService);
  router = inject(Router);
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this;
    this.customerService.getAllCountries().subscribe((res) => {
      this.countryList = res;
    });

    this.customerForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      primaryPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      ext: [''],
      secondaryPhone: [''],
      fax: [''],

      // Address Information
      billingAddress: this.fb.group({
        street1: ['', Validators.required],
        street2: [''],
        dependentLocality: ['', Validators.required],
        locale: ['', Validators.required],
        postalCode: [
          '',
          [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
        ],
        countryId: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  onCountryChange(event: any): void {
    const selectedCountry = this.countryList.find((c) => c.id == event.value);
    if (selectedCountry) {
      this.customerForm!.get('billingAddress.country')!.setValue(
        selectedCountry.name
      );
      this.customerForm!.get('billingAddress.countryId')!.setValue(
        selectedCountry.id
      );
    }
  }

  onSubmit(): void {
    if (this.customerForm?.valid) {
      const customerData: CustomerCreateRequest = this.customerForm.value;

      this.customerService.createCustomer(customerData).subscribe({
        next: (response) => {
          console.log('Customer created successfully', response);
          // Handle successful creation (e.g., show success message, reset form)
          this.customerForm?.reset();
        },
        error: (error) => {
          console.error('Error creating customer', error);
          // Handle error (e.g., show error message)
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.customerForm!);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() {
    return this.customerForm!.controls;
  }
}
