import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

dayjs.locale('hu'); // magyar lokalizáció

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiUrl = 'https://berenandor.moriczcloud.hu/api/forum';
  private readonly HUNGARIAN_TIMEZONE = 'Europe/Budapest';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getTopics(
    categoryId?: string,
    title?: string,
    orderBy?: string,
    myTopics: boolean = false,
    userTopics: number | null = null,
    page: number = 1
  ): Observable<any> {
    let params: any = {};
    if (categoryId) params.category_id = categoryId;
    if (title) params.title = title;
    if (orderBy) params.order_by = orderBy;
    if (myTopics) params.my_topics = true;
    if (userTopics && userTopics != null) params.user_topics = userTopics;
    params.page = page;

    return this.http.get(`${this.apiUrl}/home`, { params, withCredentials:true }).pipe(
      tap({
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a témák betöltése során.',
          });
        },
      })
    );
  }

  getTopic(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/topic/${id}`, {withCredentials: true}).pipe(
      tap({
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a téma betöltése során.',
          });
        },
      })
    );
  }

  createTopic(
    title: string,
    content: string,
    categoryId: number
  ): Observable<any> {
    const data = { title, content, category_id: categoryId };
    return this.http.post(`${this.apiUrl}/upload`, data, {withCredentials: true}).pipe(
      tap({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres',
            detail: 'Téma sikeresen létrehozva!',
          });
          localStorage.setItem("refresh","1");
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a téma létrehozása során.',
          });
        },
      })
    );
  }

  modifyTopic(
    title: string,
    content: string,
    categoryId: number,
    topicId: number
  ): Observable<any> {
    const data = { title, content, category_id: categoryId };
    return this.http.post(`${this.apiUrl}/topic/${topicId}/modify`, data, {withCredentials: true}).pipe(
      tap({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres',
            detail: 'Téma sikeresen szerkesztve!',
          });
          localStorage.setItem("refresh","1");
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a téma szerkesztése során.',
          });
        },
      })
    );
  }

  addComment(topicId: number, content: string): Observable<any> {
    const data = { content };
    return this.http.post(`${this.apiUrl}/topic/${topicId}/comment`, data, {withCredentials: true}).pipe(
      tap({
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a hozzászólás hozzáadása során.',
          });
        },
      })
    );
  }

  modifyComment(topicId: number, content: string): Observable<any> {
    const data = { content };
    return this.http.post(`${this.apiUrl}/comment/${topicId}/modify`, data, {withCredentials: true}).pipe(
      tap({
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba történt a hozzászólás szerkesztése során.',
          });
        },
      })
    );
  }

  vote(
    id: number,
    voteObject: 'topic' | 'comment',
    voteType: 'up' | 'down'
  ): void {
    this.http
      .post(`${this.apiUrl}/${voteObject}/${id}/vote`, { vote_type: voteType })
      .subscribe({
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba',
            detail: err.error.message,
          });
        },
      });
  }

  deleteTopic(id: number){
    this.http.delete(`${this.apiUrl}/topic/delete/${id}`, {withCredentials: true}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sikeres',
          detail: 'Topic sikeresen törölve!',
        });
        localStorage.setItem("refresh","1");
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Hiba történt a topic törlése során.',
        });
      },
    });
  }

  deleteComment(id: number): void {
    this.http.delete(`${this.apiUrl}/comment/delete/${id}` , {withCredentials: true}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sikeres',
          detail: 'Hozzászólás sikeresen törölve!',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Hiba történt a hozzászólás törlése során.',
        });
      },
    });
  }

  getTimeAgo(createdAt: string, updatedAt: string): string {
    const timezone = 'Europe/Budapest';
  
    const created = dayjs(createdAt).tz(timezone).subtract(1, 'minute').subtract(20, 'second');
    const updated = dayjs(updatedAt).tz(timezone).subtract(1, 'minute').subtract(20, 'second');
  
    const isModified = updated.isAfter(created);
  
    return isModified
      ? `${created.fromNow()} feltöltve, ${updated.fromNow()} szerkesztve`
      : `${created.fromNow()} feltöltve`;
  }


  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }
}
