import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';
import { SafeHtmlPipe } from '../../../safe-html.pipe';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('hu');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css',
})
export class TopicDetailsComponent implements OnInit {
  topics: any[] = [];
  id: number = 0;

  constructor(private topicService: TopicService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
  
      this.topicService.getTopic(this.id).subscribe({
        next: (response) => {
          if (response) {
            this.topics = [{ 
              ...response, 
              timeAgo: dayjs.utc(response.created_at).local().fromNow() 
            }];
          } else {
            console.error('Invalid response structure:', response);
          }
        },
        error: (err) => {
          console.error('Failed to fetch topics:', err);
        }
      });
    });
  }  
}
