import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../services/topic.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // UTC plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';

dayjs.extend(utc); // UTC plugin
dayjs.extend(relativeTime);
dayjs.locale('hu');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  topics: any[] = [];

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    console.log('Current date:', dayjs().format());
    this.topicService.getTopics().subscribe({
      next: (response) => {
        console.log('Topics:', response.data);
        this.topics = response.data.map((topic: any) => ({
          ...topic,
          timeAgo: dayjs.utc(topic.created_at).local().fromNow() // UTC-ről helyi időzónára, majd relatív idő
        }));
      },
      error: (err) => {
        console.error('Failed to fetch topics:', err);
      }
    });
  }
}