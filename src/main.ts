import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideKeycloak } from 'keycloak-angular';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import {
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
} from '@ng-icons/bootstrap-icons';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
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
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideKeycloak({
      config: {
        url: 'https://login.ftown.dev/',
        realm: 'order-management',
        clientId: 'web-client',
      },
      initOptions: {
        onLoad: 'login-required',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
        redirectUri: window.location.href,
      },
    }),
  ],
}).catch((err) => console.error(err));
