import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    this.http.post<any>('http://localhost:8000/login', { email, password }).subscribe({
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
    this.http.post('http://localhost:8000/logout', {}).subscribe(() => {
      localStorage.removeItem('token');
      this.token.next(null);
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated() {
    return this.token.asObservable();
  }
}
