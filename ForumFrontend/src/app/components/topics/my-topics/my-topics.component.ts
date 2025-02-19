import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { SafeHtmlPipe } from '../../../safe-html.pipe';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('hu');

@Component({
  selector: 'app-my-topics',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule],
  templateUrl: './my-topics.component.html',
  styleUrls: ['./my-topics.component.css']
})
export class MyTopicsComponent implements OnInit {
  topics: any[] = [];
  title: string = "";
  orderBy: string = "";
  categoryId: string = "";
  categories: any[] = [];
  currentPage: number = 1;
  hasMoreTopics: boolean = true;
  loadingMore: boolean = false;
  isSelectingText = false;
  startX: number = 0;
  startY: number = 0;
  userId: number | null = null; // URL-ből kapott user ID

  constructor(
    private topicService: TopicService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? parseInt(idParam, 10) : null;
      
      this.categoryId = '';
      this.orderBy = 'created_at';
      this.currentPage = 1;
      this.hasMoreTopics = true;

      this.loadTopics(true);
      this.loadCategories();
    });
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
        const newTopics = response.data.map((topic: any) => ({
          ...topic,
          timeAgo: dayjs.utc(topic.created_at).local().fromNow(),
          upvote_count: topic.upvotes - topic.downvotes
        }));

        if (reset) {
          this.topics = newTopics;
        } else {
          this.topics = [...this.topics, ...newTopics];
        }

        this.hasMoreTopics = this.currentPage < response.last_page;
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

  filterTopics() {
    this.currentPage = 1;
    this.hasMoreTopics = true;
    this.loadTopics(true);
  }

  loadMore() {
    if (!this.hasMoreTopics) return;
    this.currentPage++;
    this.loadTopics();
  }

  onMouseDown(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }
  }

  onMouseUp(topicId: number, event: MouseEvent | TouchEvent) {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      this.isSelectingText = true;
    }
  
    if (this.isSelectingText) {
      this.isSelectingText = false;
      return;
    }
  
    let endX: number, endY: number;
    if (event instanceof MouseEvent) {
      endX = event.clientX;
      endY = event.clientY;
    } else {
      endX = event.changedTouches[0].clientX;
      endY = event.changedTouches[0].clientY;
    }
  
    if (Math.abs(this.startX - endX) > 5 || Math.abs(this.startY - endY) > 5) {
      return;
    }
  
    const target = event.target as HTMLElement;
    const forbiddenTags = ['P', 'H1', 'SPAN', 'A', 'BUTTON'];

    if (forbiddenTags.includes(target.tagName)) {
      return;
    }
  
    this.router.navigate(['/topics/view', topicId]);
  }
  
}
