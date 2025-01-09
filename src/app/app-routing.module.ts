import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { CustomerPageComponent } from './components/customer/customer-page/customer-page.component';
import { AddCustomerComponent } from './components/customer/add-customer/add-customer.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { ViewInventoryComponent } from './components/inventory/view-inventory/view-inventory.component';
import { AddInventoryComponent } from './components/inventory/add-inventory/add-inventory.component';
import { ViewOrdersComponent } from './components/order/view-orders/view-orders.component';
import { OrderDetailComponent } from './components/order/order-detail/order-detail.component';
import { AddOrderComponent } from './components/order/add-order/add-order.component';
import { UpdateOrderComponent } from './components/order/update-order/update-order.component';
import { OrderHistoryComponent } from './components/order/order-history/order-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'customers',
    component: CustomerPageComponent,
  },
  {
    path: 'customers/detail',
    component: CustomerDetailComponent,
  },
  {
    path: 'customers/add',
    component: AddCustomerComponent,
  },
  {
    path: 'inventory',
    component: ViewInventoryComponent,
  },
  {
    path: 'inventory/add',
    component: AddInventoryComponent,
  },
  {
    path: 'orders',
    component: ViewOrdersComponent,
  },
  {
    path: 'orders/detail',
    component: OrderDetailComponent,
  },
  {
    path: 'orders/add',
    component: AddOrderComponent,
  },
  {
    path: 'orders/:orderId/update',
    component: UpdateOrderComponent,
  },
  {
    path: 'orders/:orderId/history',
    component: OrderHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
