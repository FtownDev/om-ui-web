import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

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
} from '@ng-icons/bootstrap-icons';
import { matfAngularDirectiveCloneColored } from '@ng-icons/material-file-icons/colored';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { CustomerPageComponent } from './components/customer/customer-page/customer-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    CustomerPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
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
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
