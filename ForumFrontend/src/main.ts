import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideRouter , withHashLocation } from '@angular/router';
import { routes } from './app/app.routes';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastModule } from 'primeng/toast';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ToastModule),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
      
  }),
    MessageService
  ],
}).catch(err => console.error(err));
