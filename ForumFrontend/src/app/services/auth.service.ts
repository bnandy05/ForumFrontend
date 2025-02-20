import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private apiUrl = 'https://berenandor.moriczcloud.hu/api';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private messageService: MessageService
  ) {}

  login(email: string, password: string) {
    this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.token.next(response.token);
        this.router.navigate(['/']);
        this.messageService.add({ severity: 'success', summary: 'Sikeres bejelentkezés', detail: 'Üdvözöljük!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Bejelentkezési hiba', detail: 'Hibás email vagy jelszó.' });
      }
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.token.next(null);
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'success', summary: 'Sikeres kijelentkezés', detail: 'Viszontlátásra!' });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.messageService.add({ severity: 'warn', summary: 'Érvénytelen token', detail: 'A token már nem érvényes.' });
          localStorage.removeItem('token');
          this.token.next(null);
          this.router.navigate(['/login']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Kijelentkezési hiba', detail: 'Hiba történt a kijelentkezés során.' });
        }
      }      
    });
  }

  forgot(email: string) {
    this.http.post(`${this.apiUrl}/password/forgot`, { email }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Jelszó visszaállítás', detail: 'Az új jelszót elküldtük az e-mail címedre. Nézd meg az email fiókod!' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Az e-mail cím nem található az adatbázisban.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a jelszó-visszaállítás során. Kérjük, próbáld újra később.' });
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
        this.messageService.add({ severity: 'success', summary: 'Sikeres jelszó változtatás', detail: 'A jelszó sikeresen megváltoztatva!' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'A jelenlegi jelszó nem megfelelő.' });
        } else if (err.status === 422) {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'A jelszó nem felel meg a követelményeknek vagy a jelszavak nem egyeznek.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a jelszó változtatása során. Kérjük, próbáld újra később.' });
        }
      }
    });
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.apiUrl}/avatar/upload`, formData, {withCredentials: true}).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Sikeres feltöltés', detail: 'Az avatar sikeresen feltöltve!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt az avatar feltöltése során.' });
      }
    });
  }

  deleteAvatar() {
    this.http.post(`${this.apiUrl}/avatar/delete`, {withCredentials: true}).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Sikeres törlés', detail: 'Az avatar sikeresen törölve!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt az avatar törlése során.' });
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