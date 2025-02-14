import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  apiUrl = 'https://berenandor.moriczcloud.hu/api/register'; // Laravel API URL-je

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.http.post(this.apiUrl, this.registerForm.value, { withCredentials: true }).subscribe(
        (response: any) => {
          console.log('Sikeres regisztráció:', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Hiba a regisztráció során:', error);
          alert('Hiba történt a regisztráció során.');
        }
      );
    } else {
      alert('Kérlek, töltsd ki az összes mezőt helyesen!');
    }
  }
}
