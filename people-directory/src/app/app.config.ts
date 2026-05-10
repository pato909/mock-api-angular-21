import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatDateFormats,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { AppDateAdapter } from './shared/date/app-date-adapter';
import { SecurityService } from './core/security/security.service';
import { provideOAuthClient } from 'angular-oauth2-oidc';

const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: { day: '2-digit', month: '2-digit', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideOAuthClient({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: ['https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1/'],
      },
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: MAT_DATE_LOCALE, useValue: 'fr-BE' },
    provideNativeDateAdapter(APP_DATE_FORMATS),
    { provide: DateAdapter, useClass: AppDateAdapter },
    provideAppInitializer(() => inject(SecurityService).login()),
  ],
};
