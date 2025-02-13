import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private apiUrl = 'http://localhost:8000'; // Laravel backend base URL

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
        console.error('Logout failed', err);
        alert('Hiba történt a kijelentkezés során.');
      }
    });
  }

  isAuthenticated() {
    return this.token.asObservable();
  }
}
