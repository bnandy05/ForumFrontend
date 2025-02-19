import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../safe-html.pipe';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';
import { Router } from '@angular/router';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('hu');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  constructor(private topicService: TopicService, private router: Router) {}

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


  userClick(userId:number)
  {
    this.router.navigate(['/topics/user', userId]);
  }

  filterTopics() {
    this.currentPage = 1;
    this.hasMoreTopics = true;
    this.loadTopics(true);
  }

  loadTopics(reset: boolean = false) {
    if (this.loadingMore) return;
    this.loadingMore = true;

    this.topicService.getTopics(this.categoryId, this.title, this.orderBy, false, this.currentPage).subscribe({
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
        console.log(this.topics)
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Failed to fetch topics:', err);
        this.loadingMore = false;
      }
    });
  }

  loadMore() {
    if (!this.hasMoreTopics) return;
    this.currentPage++;
    this.loadTopics();
  }

  ngOnInit() {
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
}