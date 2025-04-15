import { AfterViewChecked, Component, OnInit, OnDestroy} from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../safe-html.pipe';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AdminService } from '../../services/admin.service';
import { ShortenNumberPipe } from '../../shorten-number.pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule, AvatarModule, AvatarGroupModule, MenuModule, ButtonModule, ShortenNumberPipe, RouterLink],
  animations :[fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked, OnDestroy{
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
  ownMenuItems: any[] = [];
  adminMenuItems: any[] = [];
  selectedTopicId: number = -1;
  selectedUserId: number = -1;

  searchChanged: Subject<string> = new Subject<string>();
  private searchSubscription!: Subscription;

  animate = false;

  constructor(private topicService: TopicService, private router: Router, public adminService: AdminService, private confirmationService: ConfirmationService) {}

  filterTopics() {
    this.currentPage = 1;
    this.hasMoreTopics = true;
    this.loadTopics(true);
  }

  getAttachedImageCount(content: string): number {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const images = tempDiv.querySelectorAll('img');
    return images.length;
  }

  loadTopics(reset: boolean = false) {
    if (this.loadingMore) return;
    this.loadingMore = true;

    this.topicService.getTopics(this.categoryId, this.title, this.orderBy, false, null, this.currentPage).subscribe({
      next: (response) => {
        const newTopics = response.topics.data.map((topic: any) => ({
          ...topic,
          timeAgo: this.topicService.getTimeAgo(topic.created_at, topic.updated_at),
          upvote_count: topic.upvotes - topic.downvotes,
          image_count: this.getAttachedImageCount(topic.content)
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

  setupSearch() {
    this.searchSubscription = this.searchChanged
      .pipe(
        debounceTime(400),
        switchMap((searchTerm: string) => {
          this.currentPage = 1;
          this.hasMoreTopics = true;
          this.loadingMore = true;
          return this.topicService.getTopics(this.categoryId, searchTerm, this.orderBy, false, null, this.currentPage);
        })
      )
      .subscribe({
        next: (response) => {
          const newTopics = response.topics.data.map((topic: any) => ({
            ...topic,
            timeAgo: this.topicService.getTimeAgo(topic.created_at, topic.updated_at),
            upvote_count: topic.upvotes - topic.downvotes,
            image_count: this.getAttachedImageCount(topic.content)
          }));

          this.topics = newTopics;
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

  onInputChange() {
    this.searchChanged.next(this.title);
  }

  vote(topicId: number, index: number, type: 'up' | 'down', event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
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

  openMenu(event: Event, topicId: number, userId: number, menu: any) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedTopicId = topicId;
    this.selectedUserId = userId;
    menu.toggle(event);
  }

  loadMore() {
    if (!this.hasMoreTopics) return;
    this.currentPage++;
    this.loadTopics();
  }

  ngOnInit() {
    this.setupSearch();
    this.ownMenuItems = [
      { label: 'Módosítás', icon: 'pi pi-pencil', command: () => this.ModifyTopic(this.selectedTopicId) },
      { label: 'Törlés', icon: 'pi pi-trash', command: () => this.DeleteTopic(this.selectedTopicId) }
    ];
    this.adminMenuItems = [
      { label: 'Felhasználó Kitiltása', icon: 'pi pi-ban', command: () => this.BanUser(this.selectedUserId) },
      { label: 'Topic Törlése', icon: 'pi pi-trash', command: () => this.AdminDeleteTopic(this.selectedTopicId) }
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

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    if(localStorage.getItem("refresh")=="1")
    {
      localStorage.removeItem("refresh");
      location.reload();
    }
  }

  IsAdmin() : boolean
  {
    return this.adminService.isAdmin();
  }

  DeleteTopic(topicId:number)
  {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a topicot?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.topicService.deleteTopic(topicId);
        this.loadTopics(true);
      },
      reject: () => {
      }
    });
  }

  ModifyTopic(topicId:number)
  {
    this.router.navigate(['/topics/modify', topicId]);
  }

  BanUser(userId:number)
  {
    this.confirmationService.confirm({
      message: 'Biztosan ki szeretnéd tiltani a felhasználót?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.banUser(userId).subscribe();
        this.loadTopics(true);
      },
      reject: () => {
      }
    });
  }

  AdminDeleteTopic(topicId:number)
  {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a topicot?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.deleteTopic(topicId).subscribe();
        this.loadTopics(true);
      },
      reject: () => {
      }
    });
  }
}
