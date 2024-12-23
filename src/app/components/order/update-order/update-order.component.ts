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
  // flags
  error = false;
  isLoading = false;

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
  customerAddresses: Address[] = [];
  orderItems: OrderItem[] = [];
  inventoryItems: InventoryItem[] = [];
  inventoryCategories: InventoryCategory[] = [];

  // Forms
  orderForm: FormGroup<any> | undefined;
  itemsForm: FormGroup<any> | undefined;
  deliveryWindowForm: FormGroup | undefined;
  pickupWindowForm: FormGroup | undefined;
  orderItemForm: FormGroup | undefined;

  // Inventory
  itemCategories: InventoryCategory[] = [];
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];

  // Locals
  orderSubTotal: number | null = null;
  orderId: string | null | undefined;
  selectedShippingAddress: Address | undefined;
  specifyDeliverTimes: Boolean = false;
  showDeliveryModal: Boolean = false;
  tempDeliveryTimes: string[][] = [];
  tempPickupTimes: string[][] = [];
  showPickupModal: Boolean = false;
  specifyPickupTimes: Boolean = false;
  paymentTerms: any;
  shippingRates = ShippingRates;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId');
    });
    await this.orderService.orderContext$.subscribe((val) => {
      this.orderContext = val;
    });
    await this.orderService.eventTypesContext$.subscribe((value) => {
      this.eventTypesContext = value;
    });
    await this.orderService.orderItemsContext$.subscribe((value) => {
      if (value != null) this.orderItems = value;
    });
    await this.customerService.customerContext$.subscribe((value) => {
      this.customerContext = value;
    });

    await this.customerService.addressContext$.subscribe((value) => {
      this.addressContext = value;
      if (value == null && this.customerContext != null) this.loadAddresses();
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
      paymentTerms: [this.orderContext?.paymentTerms, Validators.required],
    });

    this.selectedShippingAddress = this.addressContext?.find(
      (a) => a.id == this.orderContext?.shippedToAddressId
    );

    this.specifyDeliverTimes = this.orderContext?.deliveryWindow != null;
    this.specifyPickupTimes = this.orderContext?.pickupWindow != null;

    if (this.orderContext?.deliveryWindow != undefined)
      this.tempDeliveryTimes = this.orderContext?.deliveryWindow;
    if (this.orderContext?.pickupWindow != undefined)
      this.tempPickupTimes = this.orderContext?.pickupWindow;

    this.isLoading = false;

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
    let orderTotal = withShipping * this.orderForm?.get('taxRate')?.value;
    return orderTotal;
  }
  calcualteSubTotal(): number {
    let total = 0;
    this.orderItems.forEach(
      (i) =>
        (total +=
          i.qty * this.inventoryItems.find((ii) => ii.id == i.id)?.price!)
    );
    return total;
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
    this.orderForm!.get('eventDate')!.setValue(
      new Date(event.value).toISOString()
    );
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

  onSubmit() {
    console.log('made it');
    console.log(this.orderForm?.value);
  }
}
