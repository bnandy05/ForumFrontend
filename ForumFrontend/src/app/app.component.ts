import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ForumFrontend';
  isLoading = true;

  constructor(private messageService: MessageService) {
    setTimeout(() => {
      this.isLoading = false;
    }, 300)
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Siker!', detail: 'Ez egy sikeres üzenet' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'Ez egy hibaüzenet' });
  }
}
