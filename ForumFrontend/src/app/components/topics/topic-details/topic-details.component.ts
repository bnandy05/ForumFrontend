import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('hu');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css',
})
export class TopicDetailsComponent implements OnInit {
  topics: any[] = [];
  id: number = 0;

  constructor(private topicService: TopicService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.id = paramsId['id'];
      console.log(this.id);
    });
    this.topicService.getTopic(this.id).subscribe({
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
}
