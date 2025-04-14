import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideRouter, RouteReuseStrategy, withHashLocation, withInMemoryScrolling} from '@angular/router';
import { routes } from './app/app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastModule } from 'primeng/toast';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation(), withInMemoryScrolling({
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ToastModule, ConfirmDialogModule),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
  }),
    MessageService,
    ConfirmationService
  ],
}).catch(err => console.error(err));
