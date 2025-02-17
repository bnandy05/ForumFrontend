import { AuthService } from './../../../services/auth.service';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../../services/topic.service';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  topics: any[] = [];

  constructor(private AuthService: AuthService) {}

  ngOnInit() {
    this.AuthService.getTopics().subscribe({
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
