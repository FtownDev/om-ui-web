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

/* Auth */
import { provideKeycloak } from 'keycloak-angular';

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
import { SelectCustomerComponent } from './components/order/select-customer/select-customer.component';
import { OrderStatusDisplayComponent } from './components/order/order-status-display/order-status-display.component';
import { UpdateOrderComponent } from './components/order/update-order/update-order.component';
import { OrderHistoryComponent } from './components/order/order-history/order-history.component';
import { AddAddressComponent } from './components/customer/add-address/add-address.component';

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
  bootstrapPencilSquare,
  bootstrapClockHistory,
  bootstrapTrash3,
  bootstrapEnvelopeAt,
  bootstrapTelephone,
  bootstrapTelephonePlus,
  bootstrapVoicemail,
  bootstrapGeoAlt,
  bootstrapCalendar2Check,
} from '@ng-icons/bootstrap-icons';

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
    UpdateOrderComponent,
    OrderHistoryComponent,
    AddAddressComponent,
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
      bootstrapPlusSquareFill,
      bootstrapXLg,
      bootstrapPerson,
      bootstrapFileEarmark,
      bootstrapFileEarmarkPost,
      bootstrapPlusCircle,
      bootstrapTable,
      bootstrapPersonSquare,
      bootstrapPencilSquare,
      bootstrapClockHistory,
      bootstrapTrash3,
      bootstrapEnvelopeAt,
      bootstrapTelephone,
      bootstrapTelephonePlus,
      bootstrapVoicemail,
      bootstrapGeoAlt,
      bootstrapCalendar2Check,
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideKeycloak({
      config: {
        url: 'https://login.ftown.dev/',
        realm: 'order-management',
        clientId: 'web-client',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.origin,
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
