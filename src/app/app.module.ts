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
} from '@ng-icons/bootstrap-icons';
import { matfAngularDirectiveCloneColored } from '@ng-icons/material-file-icons/colored';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { CustomerPageComponent } from './components/customer/customer-page/customer-page.component';
import { AddCustomerComponent } from './components/customer/add-customer/add-customer.component';
import { CustomerDetailComponent } from './components/customer/customer-detail/customer-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    CustomerPageComponent,
    AddCustomerComponent,
    CustomerDetailComponent,
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
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
