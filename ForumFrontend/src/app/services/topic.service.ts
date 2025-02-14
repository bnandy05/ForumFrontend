import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'https://berenandor.moriczcloud.hu/api/forum';

  constructor(private http: HttpClient) {}

  getTopics(categoryId?: number, title?: string, orderBy?: string): Observable<any> {
    let params: any = {};
    if (categoryId) params.category_id = categoryId;
    if (title) params.title = title;
    if (orderBy) params.order_by = orderBy;

    return this.http.get(`${this.apiUrl}/fooldal`, { params });
  }

  getTopic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/topik/${id}`);
  }

  createTopic(title: string, content: string, categoryId: number): Observable<any> {
    const data = { title, content, category_id: categoryId };
    return this.http.post(`${this.apiUrl}/feltoltes`, data);
  }

  addComment(topicId: number, content: string): Observable<any> {
    const data = { content };
    return this.http.post(`${this.apiUrl}/topik/${topicId}/komment`, data);
  }

  voteTopic(topicId: number, voteType: 'up' | 'down'): Observable<any> {
    const data = { vote_type: voteType };
    return this.http.post(`${this.apiUrl}/topik/${topicId}/vote`, data);
  }

  voteComment(commentId: number, voteType: 'up' | 'down'): Observable<any> {
    const data = { vote_type: voteType };
    return this.http.post(`${this.apiUrl}/komment/${commentId}/vote`, data);
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/topik/${id}`);
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/komment/${id}`);
  }

  deleteAdminTopic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/topik/admin/${id}`);
  }

  deleteAdminComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/komment/admin/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/kategoriak`);
  }
}
