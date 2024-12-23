import { OrderService } from '@/src/app/services/order.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-order',
  standalone: false,

  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css',
})
export class UpdateOrderComponent implements OnInit {
  orderId: string | null | undefined;

  route = inject(ActivatedRoute);
  _orderService = inject(OrderService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId');
      console.log('got id: ', this.orderId);
    });
  }
}
