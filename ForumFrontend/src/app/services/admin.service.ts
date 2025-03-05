import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://berenandor.moriczcloud.hu/api/forum';

  constructor(private http: HttpClient) {}

  banUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/user/ban`, { body: { id } } ,{withCredentials: true});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/user/delete`, { body: { id } });
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/topic/delete`, { body: { id } });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/comment/delete`, { body: { id } });
  }

  uploadCategory(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/category/upload`, { name }, {withCredentials: true});
  }

  getUsers(page: number =1): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users/get?page=${page}` ,{withCredentials: true});
  }
}
