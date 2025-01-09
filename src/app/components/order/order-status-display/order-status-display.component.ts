import { Component, Input } from '@angular/core';
import { OrderStatus } from '@/src/app/models/Order/OrderStatus';

@Component({
    selector: 'order-status-display',
    templateUrl: './order-status-display.component.html',
    styleUrl: './order-status-display.component.css',
})
export class OrderStatusDisplayComponent {
  @Input() status: OrderStatus = OrderStatus.Pending;

  OrderStatus = OrderStatus;
}
