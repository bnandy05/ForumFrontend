import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(ToastModule),
    provideAnimations(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
      
  }),
    MessageService
  ],
}).catch(err => console.error(err));
