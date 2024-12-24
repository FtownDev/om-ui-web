import { Address } from '@/src/app/models/Address/Address';
import { Customer } from '@/src/app/models/Customer/Customer';
import { InventoryCategory } from '@/src/app/models/Inventory/InventoryCategory';
import { InventoryItem } from '@/src/app/models/Inventory/InventoryItem';
import { Order } from '@/src/app/models/Order/Order';
import { OrderItem } from '@/src/app/models/Order/OrderItem';
import { CustomerService } from '@/src/app/services/customer.service';
import { InventoryService } from '@/src/app/services/inventory.service';
import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventType } from '@/src/app/models/Order/EventType';
import { PaymentTerms } from '@/src/app/models/Order/PaymentTerms';
import { ShippingRates } from '@/src/app/models/Order/ShippingRates';

@Component({
  selector: 'app-update-order',
  standalone: false,

  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css',
})
export class UpdateOrderComponent implements OnInit {
  // Flags
  error = false;
  isLoading = false;
  showPickupModal: Boolean = false;
  specifyPickupTimes: Boolean = false;
  specifyDeliverTimes: Boolean = false;
  showDeliveryModal: Boolean = false;

  // Services
  customerService = inject(CustomerService);
  inventoryService = inject(InventoryService);
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  fb = inject(FormBuilder);

  // Context
  orderContext: Order | null = null;
  orderItemsContext: OrderItem[] | null = null;
  addressContext: Address[] | null = null;
  eventTypesContext: EventType[] | null = null;
  customerContext: Customer | null = null;
  orderItems: OrderItem[] = [];

  // Forms
  orderForm: FormGroup<any> | undefined;
  itemsForm: FormGroup<any> | undefined;
  deliveryWindowForm: FormGroup | undefined;
  pickupWindowForm: FormGroup | undefined;
  orderItemForm: FormGroup | undefined;
  initialValues: Order | undefined;

  // Shipping
  initialDeliveryWindows: string[][] = [];
  initialPickupWindows: string[][] = [];

  // Inventory
  itemCategories: InventoryCategory[] = [];
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  inventoryCategories: InventoryCategory[] = [];

  // Enums
  paymentTerms: any;
  shippingRates = ShippingRates;

  // Locals
  orderSubTotal: number | null = null;
  orderId: string | null | undefined;
  selectedShippingAddress: Address | undefined;
  tempDeliveryTimes: string[][] = [];
  tempPickupTimes: string[][] = [];

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId');
    });
    await this.orderService.orderContext$.subscribe((val) => {
      this.orderContext = val;
      if (this.orderContext != null) {
        this.getCustomerContext();
        this.populateOrderForm();
      }
    });
    await this.orderService.eventTypesContext$.subscribe((value) => {
      this.eventTypesContext = value;
      if (value == null) {
        this.orderService.getEventTypes().subscribe((res) => {
          this.orderService.setEventsContext(res);
        });
      }
    });
    await this.orderService.orderItemsContext$.subscribe((value) => {
      if (value != null) this.orderItems = value;
    });
    await this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
      if (value != null) this.loadAddresses();
    });
    await this.customerService.addressContext$.subscribe((value) => {
      this.addressContext = value;
      this.selectedShippingAddress = this.addressContext?.find(
        (a) => a.id == this.orderContext?.shippedToAddressId
      );
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

    this.orderForm = this.fb.group({
      eventDate: [this.orderContext?.eventDate, Validators.required],
      eventTypeId: [this.orderContext?.eventTypeId, Validators.required],
      billedToCustomerId: [
        this.orderContext?.billedToCustomerId,
        Validators.required,
      ],
      billedToAddressId: [
        this.orderContext?.billedToAddressId,
        Validators.required,
      ],
      shippedToAddressId: [
        this.orderContext?.shippedToAddressId,
        Validators.required,
      ],
      amount: [this.orderContext?.amount],
      balanceDue: [this.orderContext?.balanceDue],
      taxRate: [this.orderContext?.taxRate, Validators.required],
      deliveryPickupNotes: [this.orderContext?.deliveryPickupNotes],
      discount: [this.orderContext?.discount],
      currentStatus: [this.orderContext?.currentStatus, Validators.required],
      paymentTerms: [this.orderContext?.paymentTerms, Validators.required],
    });

    if (this.orderContext == null) {
      await this.getOrderContext();
    }

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
    this.isLoading = false;
  }

  populateOrderForm() {
    if (this.orderContext != null) {
      this.orderForm?.patchValue({
        eventDate: this.orderContext.eventDate,
        eventTypeId: this.orderContext.eventTypeId,
        billedToCustomerId: this.orderContext.billedToCustomerId,
        billedToAddressId: this.orderContext.billedToAddressId,
        shippedToAddressId: this.orderContext.shippedToAddressId,
        amount: this.orderContext.amount,
        balanceDue: this.orderContext.balanceDue,
        taxRate: this.orderContext.taxRate,
        deliveryPickupNotes: this.orderContext.deliveryPickupNotes,
        discount: this.orderContext.discount,
        paymentTerms: this.orderContext.paymentTerms,
        currentStatus: this.orderContext.currentStatus,
      });

      this.initialValues = { ...this.orderContext };
      this.orderForm?.markAsPristine();

      this.specifyDeliverTimes =
        (this.orderContext.deliveryWindow?.length ?? 0) > 0;
      this.specifyPickupTimes =
        (this.orderContext.pickupWindow?.length ?? 0) > 0;

      if ((this.orderContext.deliveryWindow?.length ?? 0) > 0)
        this.tempDeliveryTimes = this.orderContext.deliveryWindow ?? [];
      this.initialDeliveryWindows = this.tempDeliveryTimes;
      if ((this.orderContext.pickupWindow?.length ?? 0) > 0)
        this.tempPickupTimes = this.orderContext.pickupWindow ?? [];
      this.initialPickupWindows = this.tempPickupTimes;
    }
  }

  async getOrderContext() {
    this.isLoading = true;

    if (this.orderId != null) {
      console.log('getting order data');
      this.orderService.getOrderById(this.orderId).subscribe((o) => {
        this.orderService.setOrderContext(o);
      });
      this.orderService.getOrderItems(this.orderId).subscribe((o) => {
        this.orderService.setOrderItemsContext(o);
      });
    }

    this.isLoading = false;
  }

  async getCustomerContext() {
    if (this.orderContext != null) {
      this.customerService
        .getCustomer(this.orderContext.billedToCustomerId)
        .subscribe((c) => {
          this.customerService.setCustomerContext(c);
        });
      this.customerService
        .getAddresses(this.customerContext!.id)
        .subscribe((a) => {
          this.customerService.setaddressContext(a);
        });
    }
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

  addOrderItem() {
    if (this.orderItemForm!.valid) {
      const formVal = this.orderItemForm!.value;
      const newItem: OrderItem = {
        itemId: formVal.itemId,
        qty: formVal.qty,
        orderId: this.orderContext!.id!,
      };

      this.orderItems.push(newItem);
      this.orderItemForm?.reset({ itemId: '', categoryId: '', qty: '' });
    }
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
  calculateOrderTotal(): number {
    let subTotal = this.calcualteSubTotal();
    let withShipping = subTotal + this.shippingRates[3];
    let orderTotal =
      withShipping + withShipping * this.orderForm?.get('taxRate')?.value;
    return Number(orderTotal.toFixed(2));
  }
  calcualteSubTotal(): number {
    let total = 0;
    if (this.orderItems.length != 0 && this.items.length != 0) {
      this.orderItems.forEach((orderItem) => {
        const founditem = this.items.find(
          (inventory) => inventory.id == orderItem.itemId
        );
        total += founditem?.price! * orderItem.qty;
      });
    }
    return Number(total.toFixed(2));
  }

  getItemPrice(itemId: string) {
    return this.items.find((f) => f.id == itemId)?.price;
  }

  getItemName(itemId: string) {
    return this.items.find((f) => f.id == itemId)?.name;
  }

  getItemCategoryName(itemId: string) {
    return this.itemCategories.find(
      (c) => c.id == this.items.find((f) => f.id == itemId)?.categoryId
    )?.name;
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

  getEventName(id: string) {
    return this.eventTypesContext!.find((c) => c.id == id);
  }

  onEventDateChange(event: any) {
    this.orderForm
      ?.get('eventDate')
      ?.setValue(new Date(event.value).toISOString());
  }

  onEventTypeChange(event: any) {
    const selectedEvent = this.eventTypesContext!.find(
      (c) => c.id == event.value
    );
    if (selectedEvent) {
      this.orderForm!.get('eventTypeId')!.setValue(selectedEvent.id);
    }
  }

  loadAddresses() {
    this.customerService
      .getAddresses(this.customerContext!.id)
      .subscribe((val) => {
        this.customerService.setaddressContext(val);
      });
  }

  isFormDirty(): boolean {
    if (!this.initialValues) return false;
    const currentValues = this.orderForm?.value;
    if (!currentValues || !this.initialValues) return false;

    return (Object.keys(currentValues) as (keyof Order)[]).some(
      (key) => currentValues[key] !== this.initialValues![key]
    );
  }

  areWindowsChanged(): boolean {
    return (
      !this.arraysEqual(this.tempDeliveryTimes, this.initialDeliveryWindows) ||
      !this.arraysEqual(this.tempPickupTimes, this.initialPickupWindows)
    );
  }

  arraysEqual(arr1: string[][], arr2: string[][]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].length !== arr2[i].length) {
        return false;
      }
      for (let j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] !== arr2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  onSubmit() {
    const formVal = this.orderForm?.value;
    const updatedOrder: Order = {
      id: this.orderContext!.id,
      eventDate: formVal.eventDate,
      eventTypeId: formVal.eventTypeId,
      billedToCustomerId: formVal.billedToCustomerId,
      billedToAddressId: formVal.billedToAddressId,
      shippedToAddressId: formVal.shippedToAddressId,
      amount: Number(this.calculateOrderTotal().toFixed(2)),
      balanceDue: formVal.balanceDue,
      taxRate: formVal.taxRate,
      deliveryPickupNotes: formVal.deliveryPickupNotes,
      paymentTerms: formVal.paymentTerms,
      deliveryWindow: this.tempDeliveryTimes,
      pickupWindow: this.tempPickupTimes,
      currentStatus: formVal.currentStatus,
      created: this.orderContext!.created!,
      deposit: this.orderContext!.deposit!,
      updated: new Date().toISOString(),
      discount: this.orderContext?.discount,
    };

    if (
      this.areWindowsChanged() ||
      (this.orderForm?.valid && this.isFormDirty())
    ) {
      console.log('updated order: ', JSON.stringify(updatedOrder));

      this.orderService
        .updateOrder(updatedOrder, crypto.randomUUID())
        .subscribe((res) => {
          console.log(res);
          this.orderService.setOrderContext(res);
        });
    }
  }
}
