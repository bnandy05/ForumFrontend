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
  orderBy: any = "";
  categoryId: string = "";
  categories: any[] = [];

  constructor(private topicService: TopicService) {}

  filterTopics() {
    this.topicService.getMyTopics(this.categoryId, this.title, this.orderBy).subscribe({
      next: (response) => {
        this.topics = response.data.map((topic: any) => ({
          ...topic,
          timeAgo: dayjs.utc(topic.created_at).local().fromNow()
        }));
      },
      error: (err) => {
        console.error('Failed to fetch topics:', err);
      }
    });
  }

  ngOnInit() {
    this.categoryId = '';
    this.orderBy = 'created_at'; 
    this.filterTopics();
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