import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'https://berenandor.moriczcloud.hu/api/forum';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getTopics(categoryId?: string, title?: string, orderBy?: string, myTopics: boolean = false, userTopics: number | null = null, page: number = 1): Observable<any> {
    let params: any = {};
    if (categoryId) params.category_id = categoryId;
    if (title) params.title = title;
    if (orderBy) params.order_by = orderBy;
    if (myTopics) params.my_topics = true;
    if (userTopics && userTopics!=null) params.user_topics = userTopics;
    params.page = page;

    return this.http.get(`${this.apiUrl}/home`, { params }).pipe(
      tap({
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a témák betöltése során.' });
        }
      })
    );
  }

  getTopic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/topic/${id}`).pipe(
      tap({
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a téma betöltése során.' });
        }
      })
    );
  }

  createTopic(title: string, content: string, categoryId: number): Observable<any> {
    const data = { title, content, category_id: categoryId };
    return this.http.post(`${this.apiUrl}/upload`, data).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Téma sikeresen létrehozva!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a téma létrehozása során.' });
        }
      })
    );
  }

  addComment(topicId: number, content: string): Observable<any> {
    const data = { content };
    return this.http.post(`${this.apiUrl}/topic/${topicId}/comment`, data).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Hozzászólás sikeresen hozzáadva!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a hozzászólás hozzáadása során.' });
        }
      })
    );
  }

  voteTopic(topicId: number, voteType: 'up' | 'down'): void {
    this.http.post(`${this.apiUrl}/topic/${topicId}/vote`, { vote_type: voteType }).subscribe({
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: err.error.message });
      }
    });
  }
  

  voteComment(commentId: number, voteType: 'up' | 'down'): Observable<any> {
    const data = { vote_type: voteType };
    return this.http.post(`${this.apiUrl}/comment/${commentId}/vote`, data).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Szavazat sikeresen rögzítve!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a szavazás során.' });
        }
      })
    );
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/topic/${id}`).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Téma sikeresen törölve!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a téma törlése során.' });
        }
      })
    );
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comment/${id}`).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Hozzászólás sikeresen törölve!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a hozzászólás törlése során.' });
        }
      })
    );
  }

  deleteAdminTopic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/topic/admin/${id}`).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Téma adminként sikeresen törölve!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a téma adminkénti törlése során.' });
        }
      })
    );
  }

  deleteAdminComment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comment/admin/${id}`).pipe(
      tap({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sikeres', detail: 'Hozzászólás adminként sikeresen törölve!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a hozzászólás adminkénti törlése során.' });
        }
      })
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }
}