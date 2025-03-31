import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CustomRouteReuseStrategy } from '../custom-route-reuse-strategy';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);
  private apiUrl = 'https://berenandor.moriczcloud.hu/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private routeReuseStrategy: CustomRouteReuseStrategy
  ) {}

  login(email: string, password: string) {
    this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.token.next(response.token);
        localStorage.setItem('id', response.user.id);
        localStorage.setItem('avatar', response.user.avatar);
        localStorage.setItem('username', response.user.name);
        localStorage.setItem('fresh', "1");
        if(response.user.is_admin == 1)
        {
          localStorage.setItem('admin', "1");
        }
        this.router.navigate(['/home']);
        this.messageService.add({ severity: 'success', summary: 'Sikeres bejelentkezés', detail: 'Üdvözöljük!' });
        this.reloadPage();
      },
      error: (err) => {
        console.error(err)
        this.messageService.add({ severity: 'error', summary: 'Bejelentkezési hiba', detail: err.error.message });
      }
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearLocalStorage();
        this.router.navigate(['/login']);
        this.messageService.add({ severity: 'success', summary: 'Sikeres kijelentkezés', detail: 'Viszontlátásra!' });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.messageService.add({ severity: 'warn', summary: 'Érvénytelen token', detail: 'A token már nem érvényes.' });
          this.clearLocalStorage();
          this.router.navigate(['/login']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Kijelentkezési hiba', detail: 'Hiba történt a kijelentkezés során.' });
        }
      }
    });
  }

  clearLocalStorage() : void
  {
    this.routeReuseStrategy.clearCache();
    localStorage.removeItem('token');
    this.token.next(null);
    localStorage.removeItem('id');
    localStorage.removeItem('avatar');
    localStorage.removeItem('username');
    if(localStorage.getItem('admin') !== null)
    {
      localStorage.removeItem('admin');
    }
  }

  forgot(email: string) {
    this.http.post(`${this.apiUrl}/password/forgot`, { email }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Jelszó visszaállítás', detail: 'Az új jelszót elküldtük az e-mail címedre. Nézd meg az email fiókod!' });
        this.router.navigate(['/login']);
      },
      error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: err.error.message });
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
        localStorage.removeItem('avatar');
        localStorage.setItem('avatar', response.url);
        this.messageService.add({ severity: 'success', summary: 'Sikeres feltöltés', detail: 'Az avatar sikeresen feltöltve!' });
        this.reloadPage();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: err.error.message });
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    return this.http.post(`${this.apiUrl}/my-details`, { withCredentials: true });
  }

  getOtherUser(id: number) {
    return this.http.post(`${this.apiUrl}/user/${id}`, { withCredentials: true });
  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
}
