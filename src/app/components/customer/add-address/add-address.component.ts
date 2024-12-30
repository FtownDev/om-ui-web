import { CustomerService } from '@/src/app/services/customer.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '@/src/app/models/Address/Country';
import { Router } from '@angular/router';
import { Customer } from '@/src/app/models/Customer/Customer';

@Component({
  selector: 'app-add-address',
  standalone: false,
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css',
})
export class AddAddressComponent implements OnInit {
  countryList: Country[] = [];
  addressForm: FormGroup<any> | undefined;
  isLoading: Boolean = false;
  customerService = inject(CustomerService);
  _router = inject(Router);
  _customerService = inject(CustomerService);
  _fb = inject(FormBuilder);
  customerContext: Customer | null = null;

  ngOnInit(): void {
    this.isLoading = true;
    this.customerService.getAllCountries().subscribe((res) => {
      this.countryList = res;
      this.isLoading = false;
    });
    this.customerService.customerContext$.subscribe(
      (val) => (this.customerContext = val)
    );

    this.addressForm = this._fb.group({
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
    });
  }

  onCountryChange(event: any): void {
    const selectedCountry = this.countryList.find((c) => c.id == event.value);
    if (selectedCountry) {
      this.addressForm!.get('country')!.setValue(selectedCountry.name);
      this.addressForm!.get('countryId')!.setValue(selectedCountry.id);
    }
  }

  onSubmit() {
    console.log(this.customerContext?.id);
    console.log(this.addressForm?.value);
  }
}
