import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private http: HttpClient  // Inject HttpClient
  ) {}

  onSubmit() {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post('https://berenandor.moriczcloud.hu/api/login', loginData, { withCredentials: true }).subscribe(
      (response: any) => {
        // Sikeres bejelentkezés
        localStorage.setItem('token', response.token);
        alert('Sikeres bejelentkezés!');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Hiba kezelése
        this.errorMessage = 'Hibás bejelentkezési adatok. Kérlek, próbáld újra.';
      }
    );
  }
  

  onForgotPassword() {
    alert('Elfelejtett jelszó funkció hamarosan elérhető.');
  }
}
