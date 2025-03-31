import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ThemeToggleComponent],
})
export class RegisterComponent {
  registerForm: FormGroup;
  apiUrl = 'https://berenandor.moriczcloud.hu/api/register';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private messageService: MessageService, public themeService: ThemeService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  redirect(url:string) {
    this.router.navigate([url]);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post(this.apiUrl, this.registerForm.value, { withCredentials: true }).subscribe(
        (response: any) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a regisztráció során.' });
        }
      );
    } else {
      alert('Kérlek, töltsd ki az összes mezőt helyesen!');
    }
  }
}
