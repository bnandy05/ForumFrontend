import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://berenandor.moriczcloud.hu/api/forum';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  banUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/user/ban`, { id }, { withCredentials: true }).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Felhasználó sikeresen kitiltva' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a felhasználó kitiltása' 
        });
        return throwError(error);
      })
    );
  }

  unbanUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/user/unban`, { id }, { withCredentials: true }).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Felhasználó tiltásának feloldása sikeres' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a felhasználó tiltásának feloldása' 
        });
        return throwError(error);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/user/delete/${id}`).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Felhasználó sikeresen törölve' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a felhasználó törlése' 
        });
        return throwError(error);
      })
    );
  }

  isAdmin(): boolean {
    return !!localStorage.getItem('admin');
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/topic/delete/${id}`,).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Téma sikeresen törölve' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a téma törlése' 
        });
        return throwError(error);
      })
    );
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/comment/delete/${id}`,).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Hozzászólás sikeresen törölve' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a hozzászólás törlése' 
        });
        return throwError(error);
      })
    );
  }

  uploadCategory(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/category/upload`, { name }, { withCredentials: true }).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Kategória sikeresen feltöltve' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a kategória feltöltése' 
        });
        return throwError(error);
      })
    );
  }

  makeAdmin(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/user/admin/give`, { id }, { withCredentials: true }).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Adminisztrátor jogosultság sikeresen megadva' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült az adminisztrátor jogosultság megadása' 
        });
        return throwError(error);
      })
    );
  }

  revokeAdmin(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/user/admin/revoke`, { id }, { withCredentials: true }).pipe(
      tap(response => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sikeres művelet', 
          detail: 'Adminisztrátor jogosultság sikeresen visszavonva' 
        });
      }),
      catchError(error => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült az adminisztrátor jogosultság visszavonása' 
        });
        return throwError(error);
      })
    );
  }

  getUsers(page: number = 1, name: string | null = null, banned: number | null = null, admin: number | null = null): Observable<any> {
    const payload: any = {};
  
    if (name !== null) payload.name = name;
    if (banned !== null) payload.banned = banned;
    if (admin !== null) payload.admin = admin;
  
    return this.http.post(`${this.baseUrl}/admin/users/get?page=${page}`, payload, { withCredentials: true }).pipe(
      tap(response => {}),
      catchError(error => {
        console.error(error)
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a felhasználók lekérése' 
        });
        return throwError(error);
      })
    );
  }

  getUser(userId:number): Observable<any> {
  
    return this.http.post(`${this.baseUrl}/admin/users/get/${userId}`, { withCredentials: true }).pipe(
      tap(response => {}),
      catchError(error => {
        console.error(error)
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Hiba', 
          detail: error.error?.message || 'Nem sikerült a felhasználó lekérése' 
        });
        return throwError(error);
      })
    );
  }  
}