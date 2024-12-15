import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
/* Forms */
import { ReactiveFormsModule } from '@angular/forms'; // Add this import

/* Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { CustomerPageComponent } from './components/customer/customer-page/customer-page.component';
import { AddCustomerComponent } from './components/customer/add-customer/add-customer.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';
import { ViewInventoryComponent } from './components/inventory/view-inventory/view-inventory.component';
import { AddInventoryComponent } from './components/inventory/add-inventory/add-inventory.component';
import { ViewOrdersComponent } from './components/order/view-orders/view-orders.component';
import { AddOrderComponent } from './components/order/add-order/add-order.component';
import { OrderDetailComponent } from './components/order/order-detail/order-detail.component';

/* Icons */
import { NgIconsModule } from '@ng-icons/core';
import {
  bootstrapTwitterX,
  bootstrapFacebook,
  bootstrapInstagram,
  bootstrapPlusSquareFill,
  bootstrapXLg,
  bootstrapPerson,
  bootstrapFileEarmarkPost,
  bootstrapFileEarmark,
  bootstrapPlusCircle,
  bootstrapTable,
  bootstrapPersonSquare,
} from '@ng-icons/bootstrap-icons';
import { matfAngularDirectiveCloneColored } from '@ng-icons/material-file-icons/colored';
import { SelectCustomerComponent } from './components/order/select-customer/select-customer.component';
import { OrderStatusDisplayComponent } from './components/order/order-status-display/order-status-display.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    CustomerPageComponent,
    AddCustomerComponent,
    CustomerDetailComponent,
    ViewInventoryComponent,
    AddInventoryComponent,
    ViewOrdersComponent,
    AddOrderComponent,
    OrderDetailComponent,
    SelectCustomerComponent,
    OrderStatusDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule.withIcons({
      bootstrapTwitterX,
      bootstrapFacebook,
      bootstrapInstagram,
      matfAngularDirectiveCloneColored,
      bootstrapPlusSquareFill,
      bootstrapXLg,
      bootstrapPerson,
      bootstrapFileEarmark,
      bootstrapFileEarmarkPost,
      bootstrapPlusCircle,
      bootstrapTable,
      bootstrapPersonSquare,
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
