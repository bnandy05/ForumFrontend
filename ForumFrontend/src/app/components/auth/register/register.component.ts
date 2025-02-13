import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  apiUrl = 'http://localhost:8000/api/register'; // Laravel API URL-je

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
          alert('Sikeres regisztráció! Token: ' + response.token);
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
