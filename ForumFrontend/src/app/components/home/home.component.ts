import { Component, HostListener, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../safe-html.pipe';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule, AvatarModule, AvatarGroupModule, MenuModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  topics: any[] = [];
  title: string = "";
  orderBy: string = "";
  categoryId: string = "";
  categories: any[] = [];
  currentPage: number = 1;
  hasMoreTopics: boolean = true;
  loadingMore: boolean = false;
  userVotes: { [key: number]: 'up' | 'down' | null } = {};
  currentUserId = localStorage.getItem('id');
  menuItems: any[] = [];
  selectedTopicId: number = -1;
  

  constructor(private topicService: TopicService, private router: Router) {}

  navigateToTopic(topicId: number, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const forbiddenTags = ['BUTTON', 'A', 'SPAN'];

    if (forbiddenTags.includes(target.tagName)) {
      return;
    }

    sessionStorage.removeItem('scrollPosition');
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    console.log(window.pageYOffset)
    
    this.router.navigate(['/topics/view', topicId]);
  }

  userClick(userId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['/profile', userId]);
  }

  filterTopics() {
    this.currentPage = 1;
    this.hasMoreTopics = true;
    this.loadTopics(true);
  }

  loadTopics(reset: boolean = false) {
    if (this.loadingMore) return;
    this.loadingMore = true;

    this.topicService.getTopics(this.categoryId, this.title, this.orderBy, false, null, this.currentPage).subscribe({
      next: (response) => {
        const newTopics = response.topics.data.map((topic: any) => ({
          ...topic,
          timeAgo: this.topicService.getTimeAgo(topic.created_at, topic.updated_at),
          upvote_count: topic.upvotes - topic.downvotes
        }));
        if (reset) {
          this.topics = newTopics;
        } else {
          this.topics = [...this.topics, ...newTopics];
        }

        this.userVotes = response.user_votes || {};

        this.hasMoreTopics = this.currentPage < response.topics.last_page;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Failed to fetch topics:', err);
        this.loadingMore = false;
      }
    });
  }

  vote(topicId: number, index: number, type: 'up' | 'down', event: MouseEvent) {
    event.stopPropagation();
    const topic = this.topics[index];
  
    if (!topic) return;
  
    if (this.userVotes[topicId] === type) {
      this.userVotes[topicId] = null;
      topic.upvote_count += type === 'up' ? -1 : 1;
    } else if (this.userVotes[topicId] && this.userVotes[topicId] !== type) {
      topic.upvote_count += type === 'up' ? 2 : -2;
      this.userVotes[topicId] = type;
    } else {
      this.userVotes[topicId] = type;
      topic.upvote_count += type === 'up' ? 1 : -1;
    }
  
    this.topicService.vote(topicId, 'topic', type);
  }
  
  openMenu(event: Event, topicId: number, menu: any) {
    this.selectedTopicId = topicId;
    menu.toggle(event);
  }

  loadMore() {
    if (!this.hasMoreTopics) return;
    this.currentPage++;
    this.loadTopics();
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/home') { 
          this.setScrollStatus();
        }
      });
    this.menuItems = [
      { label: 'Módosítás', icon: 'pi pi-pencil', command: () => this.ModifyTopic(this.selectedTopicId) },
      { label: 'Törlés', icon: 'pi pi-trash', command: () => this.DeleteTopic(this.selectedTopicId) }
    ];
    this.categoryId = '';
    this.orderBy = 'created_at';
    this.loadTopics(true);

    this.topicService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      },
    });
  }

  setScrollStatus(): void {
    window.scrollTo(0, Number(sessionStorage.getItem('scrollPosition')));

    sessionStorage.removeItem('scrollPosition');
  }

  DeleteTopic(topicId:number)
  {
    this.topicService.deleteTopic(topicId);
    this.loadTopics(true);
  }

  ModifyTopic(topicId:number)
  {
    sessionStorage.removeItem('scrollPosition');
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    this.router.navigate(['/topics/modify', topicId]);
  }
}
