import { AfterViewChecked, Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { SafeHtmlPipe } from '../../../safe-html.pipe';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AdminService } from '../../../services/admin.service';
import { ConfirmationService } from 'primeng/api';
import { ShortenNumberPipe } from '../../../shorten-number.pipe';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-topics',
  standalone: true,
  imports: [
    HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule,
    AvatarModule, AvatarGroupModule, ButtonModule, MenuModule, ShortenNumberPipe
  ],
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.css']
})
export class MyTopicsComponent implements OnInit, AfterViewChecked, OnDestroy {
  topics: any[] = [];
  title: string = "";
  orderBy: string = "";
  categoryId: string = "";
  categories: any[] = [];
  currentPage: number = 1;
  hasMoreTopics: boolean = true;
  loadingMore: boolean = false;
  userVotes: { [key: number]: 'up' | 'down' | null } = {};
  userId: number | null = null;
  ownMenuItems: any[] = [];
  adminMenuItems: any[] = [];
  selectedTopicId: number = -1;
  selectedUserId: number = -1;
  currentUserId = localStorage.getItem('id');
  titleChanged = new Subject<string>();
  destroy$ = new Subject<void>();
  paramMapSub: Subscription | null = null;

  constructor(
    private topicService: TopicService,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.ownMenuItems = [
      { label: 'Módosítás', icon: 'pi pi-pencil', command: () => this.ModifyTopic(this.selectedTopicId) },
      { label: 'Törlés', icon: 'pi pi-trash', command: () => this.DeleteTopic(this.selectedTopicId) }
    ];
    this.adminMenuItems = [
      { label: 'Felhasználó Kitiltása', icon: 'pi pi-ban', command: () => this.BanUser(this.selectedUserId) },
      { label: 'Topic Törlése', icon: 'pi pi-trash', command: () => this.AdminDeleteTopic(this.selectedTopicId) }
    ];

    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? parseInt(idParam, 10) : null;

      this.categoryId = '';
      this.orderBy = 'created_at';
      this.currentPage = 1;
      this.hasMoreTopics = true;

      this.loadTopics(true);
      this.loadCategories();
    });

    this.titleChanged.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.title = value;
      this.currentPage = 1;
      this.hasMoreTopics = true;
      this.loadTopics(true);
    });
  }

  ngAfterViewChecked(): void {
    if (localStorage.getItem("refresh") == "1") {
      localStorage.removeItem("refresh");
      location.reload();
    }
  }

  loadTopics(reset: boolean = false) {
    if (this.loadingMore) return;
    this.loadingMore = true;

    this.topicService.getTopics(
      this.categoryId,
      this.title,
      this.orderBy,
      this.userId === null,
      this.userId,
      this.currentPage
    ).subscribe({
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

  loadCategories() {
    this.topicService.getCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      },
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

  openMenu(event: Event, topicId: number, userId: number, menu: any) {
    this.selectedTopicId = topicId;
    this.selectedUserId = userId;
    menu.toggle(event);
  }

  filterTopics(source?: 'title' | 'category' | 'order') {
    if (source === 'title') {
      this.titleChanged.next(this.title);
    } else {
      this.currentPage = 1;
      this.hasMoreTopics = true;
      this.loadTopics(true);
    }
  }

  loadMore() {
    if (!this.hasMoreTopics) return;
    this.currentPage++;
    this.loadTopics();
  }

  navigateToTopic(topicId: number, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const forbiddenTags = ['BUTTON', 'A', 'SPAN'];
    if (forbiddenTags.includes(target.tagName)) {
      return;
    }
    this.router.navigate(['/topics/view', topicId]);
  }

  DeleteTopic(topicId: number) {
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
      reject: () => {}
    });
  }

  IsAdmin(): boolean {
    return this.adminService.isAdmin();
  }

  ModifyTopic(topicId: number) {
    this.router.navigate(['/topics/modify', topicId]);
  }

  BanUser(userId: number) {
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
      reject: () => {}
    });
  }

  AdminDeleteTopic(topicId: number) {
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
      reject: () => {}
    });
  }

  ngOnDestroy(): void {
    if (this.paramMapSub) {
      this.paramMapSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
