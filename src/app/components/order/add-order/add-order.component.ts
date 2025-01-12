import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { EventType } from '@/src/app/models/Order/EventType';
import { Order } from '@/src/app/models/Order/Order';
import { CustomerService } from '@/src/app/services/customer.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrderItem } from '@/src/app/models/Order/OrderItem';
import { InventoryService } from '@/src/app/services/inventory.service';
import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { InventoryItem } from '@/src/app/models/Inventory/InventoryItem';
import { PaymentTerms } from '@/src/app/models/Order/PaymentTerms';
import { TaxRates } from '@/src/app/models/Order/TaxRates';
import { ShippingRates } from '@/src/app/models/Order/ShippingRates';
import { OrderCreateRequest } from '@/src/app/models/Order/OrderCreateRequest';
import { SelectCustomerComponent } from '../select-customer/select-customer.component';
import { NgClass, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.css',
  imports: [
    SelectCustomerComponent,
    ReactiveFormsModule,
    NgClass,
    NgIcon,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
  ],
})
export class AddOrderComponent implements OnInit {
  isLoading: Boolean = false;
  specifyDeliverTimes: Boolean = false;
  showDeliveryModal: Boolean = false;
  tempDeliveryTimes: string[][] = [];
  showPickupModal: Boolean = false;
  specifyPickupTimes: Boolean = false;
  tempPickupTimes: string[][] = [];
  private destroy$ = new Subject<void>();
  orderContext: Order | null = null;
  orderService = inject(OrderService);
  customerService = inject(CustomerService);
  inventoryService = inject(InventoryService);
  customerContext: Customer | null = null;
  eventTypes: EventType[] = [];
  addressContext: Address[] | null = [];
  fb = inject(FormBuilder);
  orderSubTotal: number = 0;

  paymentTerms: any;
  taxRates = TaxRates;
  shippingRates = ShippingRates;

  // Technical debt item, accidently made OrderItem need an OrderId on the create request, but order Id doesnt exist until after creation
  // Will not affect anything because on the backend this value gets overwritten with the actual ID
  orderId_temp = crypto.randomUUID();
  //

  orderForm: FormGroup<any> | undefined;
  itemsForm: FormGroup<any> | undefined;
  deliveryWindowForm: FormGroup | undefined;
  pickupWindowForm: FormGroup | undefined;
  orderItemForm: FormGroup | undefined;
  orderItems: OrderItem[] = [];

  itemCategories: InventoryCategory[] = [];
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  selectedShippingAddress: Address | null = null;

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      eventDate: ['', Validators.required],
      eventTypeId: ['', Validators.required],
      billedToCustomerId: [, Validators.required],
      billedToAddressId: ['', Validators.required],
      shippedToAddressId: ['', Validators.required],
      amount: [''],
      balanceDue: [''],
      taxRate: [0.0, Validators.required],
      deliveryPickupNotes: [''],
      discount: [0],
      paymentTerms: [0],
      itemTotalValue: [0],
      shippingCost: [0],
      taxValue: [0],
    });

    this.deliveryWindowForm = this.fb.group({
      startTime: [new Date(), Validators.required],
      endTime: [new Date(), Validators.required],
    });
    this.pickupWindowForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });

    this.orderItemForm = this.fb.group({
      categoryId: ['', Validators.required],
      itemId: ['', Validators.required],
      qty: [''],
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

    this.inventoryService.getInventoryCategories().subscribe((res) => {
      this.itemCategories = res;
    });

    this.inventoryService.getInventoryItems().subscribe((res) => {
      this.items = res;
    });

    this.paymentTerms = Object.keys(PaymentTerms)
      .filter((key) => isNaN(Number(key))) // Filter out reverse mappings
      .map((key) => ({
        value: PaymentTerms[key as keyof typeof PaymentTerms],
        label: key,
      }));
  }

  get f() {
    return this.orderForm!.controls;
  }
  get i() {
    return this.orderItemForm!.controls;
  }

  get d() {
    return this.deliveryWindowForm!.controls;
  }
  get p() {
    return this.pickupWindowForm!.controls;
  }

  getItemName(itemId: string) {
    return this.items.find((f) => f.id == itemId)?.name;
  }

  getItemCategoryName(itemId: string) {
    return this.itemCategories.find(
      (c) => c.id == this.items.find((f) => f.id == itemId)?.categoryId
    )?.name;
  }

  getItemPrice(itemId: string) {
    return this.items.find((f) => f.id == itemId)?.price;
  }

  onItemCategoryChange(event: any) {
    const category = this.itemCategories?.find((c) => c.id == event.value);
    if (category) {
      this.orderItemForm!.get('categoryId')!.setValue(category.id);
      this.filteredItems = this.items.filter(
        (i) => i.categoryId == category.id
      );
    }
  }

  onSelectItemChange(event: any) {
    const item = this.filteredItems.find((i) => i.id == event.value);
    if (item) {
      this.orderItemForm!.get('itemId')!.setValue(item.id);
    }
  }

  addOrderItem() {
    if (this.orderItemForm!.valid) {
      const formVal = this.orderItemForm!.value;
      const newItem: OrderItem = {
        itemId: formVal.itemId,
        qty: formVal.qty,
        itemCategory: this.getItemCategoryName(formVal.itemId)!,
        itemName: this.getItemName(formVal.itemId)!,
        price: this.getItemPrice(formVal.itemId)!,
      };

      this.orderSubTotal +=
        this.items.find((f) => f.id == formVal.itemId)!.price * formVal.qty;
      this.orderItems.push(newItem);
      this.orderItemForm?.reset({ itemId: '', categoryId: '', qty: '' });
    }
  }

  addDeliveryWindow() {
    if (this.deliveryWindowForm?.valid) {
      const formVal = this.deliveryWindowForm!.value;
      const newVal = [
        new Date(formVal.startTime).toISOString(),
        new Date(formVal.endTime).toISOString(),
      ];
      this.tempDeliveryTimes.push(newVal);
      this.showDeliveryModal = false;
      this.deliveryWindowForm.reset();
    }
  }

  resetDeliverWindows() {
    this.specifyDeliverTimes = false;
    this.tempDeliveryTimes = [];
  }

  addPickupWindow() {
    if (this.pickupWindowForm?.valid) {
      const formVal = this.pickupWindowForm!.value;
      const newVal = [
        new Date(formVal.startTime).toISOString(),
        new Date(formVal.endTime).toISOString(),
      ];
      this.tempPickupTimes.push(newVal);
      this.showPickupModal = false;
      this.pickupWindowForm.reset();
    }
  }

  resetPickupWindows() {
    this.specifyPickupTimes = false;
    this.tempPickupTimes = [];
  }

  onShippingAddressChange(event: any) {
    const address = this.addressContext?.find((a) => a.id == event.value);
    if (address) {
      this.selectedShippingAddress = address;
      this.orderForm!.get('shippedToAddressId')!.setValue(address.id);
    }
  }
  onEventTypeChange(event: any) {
    const selectedEvent = this.eventTypes.find((c) => c.id == event.value);
    if (selectedEvent) {
      this.orderForm!.get('eventTypeId')!.setValue(selectedEvent.id);
    }
  }

  onEventDateChange(event: any) {
    this.orderForm!.get('eventDate')!.setValue(
      new Date(event.value).toISOString()
    );
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

  getTaxValue() {
    return Number(
      (
        (this.orderSubTotal + this.shippingRates[3]) *
        this.orderForm?.get('taxRate')?.value
      ).toFixed(2)
    );
  }

  onSubmit() {
    const tax = this.getTaxValue();

    const totalWithShipping: number = Number(
      (this.orderSubTotal + this.shippingRates[3] + tax).toFixed(2)
    );
    this.orderForm
      ?.get('itemTotalValue')
      ?.setValue(Number(this.orderSubTotal).toFixed(2));
    this.orderForm?.get('shippingCost')?.setValue(this.shippingRates[3]);
    this.orderForm?.get('taxValue')?.setValue(tax);
    this.orderForm?.get('amount')?.setValue(totalWithShipping);
    this.orderForm?.get('balanceDue')?.setValue(totalWithShipping);

    const p: number = Number(
      parseFloat(this.orderForm?.get('paymentTerms')?.value).toFixed(2)
    );

    this.orderForm?.get('paymentTerms')?.setValue(p);

    const t: number = Number(
      parseFloat(this.orderForm?.get('taxRate')?.value).toFixed(2)
    );
    this.orderForm?.get('taxRate')?.setValue(t);

    const requestData: OrderCreateRequest = {
      order: this.orderForm!.value,
      orderItems: this.orderItems,
    };

    requestData.order.deliveryWindow = this.tempDeliveryTimes;
    requestData.order.pickupWindow = this.tempPickupTimes;

    this.orderService
      .createOrder(requestData)
      .subscribe((res) => console.log(res));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
