import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { SafeHtmlPipe } from '../../../safe-html.pipe';
import { Router } from '@angular/router';

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

  constructor(private topicService: TopicService, private router: Router) {}

  onClick(topicId: number) {
    this.router.navigate(['topics/view', topicId]);
  }

  filterTopics() {
    this.currentPage = 1;
    this.hasMoreTopics = true;
    this.loadTopics(true);
  }

  loadTopics(reset: boolean = false) {
    if (this.loadingMore) return;
    this.loadingMore = true;

    this.topicService.getTopics(this.categoryId, this.title, this.orderBy, true, this.currentPage).subscribe({
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