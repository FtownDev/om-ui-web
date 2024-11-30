import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { CustomerPageComponent } from './components/customer/customer-page/customer-page.component';
import { AddCustomerComponent } from './components/customer/add-customer/add-customer.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { ViewInventoryComponent } from './components/inventory/view-inventory/view-inventory.component';
import { AddInventoryComponent } from './components/inventory/add-inventory/add-inventory.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {
    path: 'customers',
    component: CustomerPageComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'customers/detail',
    component: CustomerDetailComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'customers/add',
    component: AddCustomerComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    component: ViewInventoryComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: 'inventory/add',
    component: AddInventoryComponent,
    //canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
