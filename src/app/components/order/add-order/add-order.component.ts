import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { EventType } from '@/src/app/models/Order/EventType';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderItem } from '@/src/app/models/Order/OrderItem';

@Component({
  selector: 'app-add-order',
  standalone: false,

  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css',
})
export class AddOrderComponent implements OnInit {
  isLoading: Boolean = false;
  specifyDeliverTimes: Boolean = false;
  showDeliveryModal: Boolean = false;
  tempDeliveryTimes: string[][] = [];
  showPickupModal: Boolean = false;
  tempPickupTimes: string[][] = [];
  private destroy$ = new Subject<void>();
  orderContext: Order | null = null;
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  customerContext: Customer | null = null;
  eventTypes: EventType[] = [];
  addressContext: Address[] | null = [];
  fb = inject(FormBuilder);

  orderForm: FormGroup<any> | undefined;
  itemsForm: FormGroup<any> | undefined;
  deliveryWindowForm: FormGroup | undefined;
  orderItems: OrderItem[] = [];

  selectedShippingAddress: Address | null = null;

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      eventDate: ['', Validators.required],
      eventTypeId: ['', Validators.required],
      billedToCustomerId: [, Validators.required],
      billedToAddressId: ['', Validators.required],
      shippedToAddressId: ['', Validators.required],
      amount: ['', Validators.required],
      balanceDue: [''],
      taxRate: ['', Validators.required],
      deliveryWindow: [''],
      pickupWindow: [''],
      deliveryPickupNotes: [''],
      discount: [''],
      paymentTerms: ['', Validators.required],
    });

    this.deliveryWindowForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });

    this.customerService.customerContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.customerContext = val;
        if (val != null) {
          this.orderForm!.get('billedToCustomerId')!.setValue(val.id);
          this.orderForm!.get('billedToAddressId')!.setValue(
            val.billingAddressId
          );
        }
      });
    this.customerService.addressContext$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.addressContext = val;
      });

    this.orderService.getEventTypes().subscribe((res) => {
      this.eventTypes = res;
      this.orderService.setEventsContext(res);
    });
  }

  get f() {
    return this.orderForm!.controls;
  }

  get d() {
    return this.deliveryWindowForm!.controls;
  }

  addDeliveryWindow() {
    if (this.deliveryWindowForm?.valid) {
      const formVal = this.deliveryWindowForm!.value;
      const newVal = [formVal.startTime, formVal.endTime];
      this.tempDeliveryTimes.push(newVal);
      this.showDeliveryModal = false;
    }
  }

  onShippingAddressChange(event: any) {
    const address = this.addressContext?.find((a) => a.id == event.value);
    if (address) {
      this.selectedShippingAddress = address;
    }
  }
  onEventTypeChange(event: any) {
    const selectedEvent = this.eventTypes.find((c) => c.id == event.value);
    if (selectedEvent) {
      this.orderForm!.get('eventTypeId')!.setValue(selectedEvent.id);
    }
  }

  getAddressLine1(id: string) {
    const address = this.addressContext?.find((a) => a.id == id);
    if (address) {
      return address.street1 + ' ' + address.street2;
    } else {
      return null;
    }
  }

  getAddressLine2(id: string) {
    const address = this.addressContext?.find((a) => a.id == id);
    if (address) {
      return address.locale + ', ' + address.dependentLocality;
    } else {
      return null;
    }
  }

  getAddressLine3(id: string) {
    const address = this.addressContext?.find((a) => a.id == id);
    if (address) {
      return address.country + ' - ' + address.postalCode;
    } else {
      return null;
    }
  }

  onSubmit() {
    this.orderForm
      ?.get('deliveryWindow')
      ?.setValue(this.tempDeliveryTimes.toString());
    this.orderForm
      ?.get('pickupWindow')
      ?.setValue(this.tempDeliveryTimes.toString());
    console.log('orderForm: ', this.orderForm?.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
