import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://berenandor.moriczcloud.hu/api';

  constructor(private http: HttpClient) {}

  banUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/forum/admin/user/ban`, { body: { id } });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/forum/admin/user/delete`, { body: { id } });
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/forum/admin/topic/delete`, { body: { id } });
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/forum/admin/comment/delete`, { body: { id } });
  }

  uploadCategory(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forum/admin/category/upload`, { name });
  }
}
