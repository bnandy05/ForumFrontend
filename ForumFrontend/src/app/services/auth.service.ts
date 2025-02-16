import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private apiUrl = 'https://berenandor.moriczcloud.hu/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.token.next(response.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Hibás email vagy jelszó.');
      }
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.token.next(null);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          console.warn('A token már nem érvényes.');
          localStorage.removeItem('token');
          this.token.next(null);
          this.router.navigate(['/login']);
        } else {
          console.error('Logout failed', err);
          alert('Hiba történt a kijelentkezés során.');
        }
      }      
    });
  }

  forgot(email: string) {
    this.http.post(`${this.apiUrl}/password/forgot`, { email }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert("Az új jelszót elküldtük az e-mail címedre. Nézd meg az email fiókod!");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Az e-mail cím nem található az adatbázisban.');
        } else {
          alert('Hiba történt a jelszó-visszaállítás során. Kérjük, próbáld újra később.');
        }
      }
    });
  }

  changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string) {
    this.http.post(`${this.apiUrl}/password/change`, {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmNewPassword 
    }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('A jelszó sikeresen megváltoztatva!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 401) {
          alert('A jelenlegi jelszó nem megfelelő.');
        } else if (err.status === 422) {
          alert('A jelszó nem felel meg a követelményeknek vagy a jelszavak nem egyeznek.');
        } else {
          alert('Hiba történt a jelszó változtatása során. Kérjük, próbáld újra később.');
        }
      }
    });
  }
  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    return this.http.get(`${this.apiUrl}/user`);
  }
}