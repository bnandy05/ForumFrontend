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
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('hu');

interface Comment {
  id: number;
  topic_id: number;
  user_id: number;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  is_active: number;
  user: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string | null;
      is_admin: number;
      created_at: string;
      updated_at: string;
      apikey: string | null;
  };
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css',
})
export class TopicDetailsComponent implements OnInit {
  topics: any[] = [];
  id: number = 0;
  userVote: 'up' | 'down' | null = null;
  newComment: { [key: number]: string } = {};

  constructor(private topicService: TopicService, private activatedRoute: ActivatedRoute, private messageService: MessageService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
  
      this.topicService.getTopic(this.id).subscribe({
        next: (response) => {
          console.log(response)
          if (response) {
            this.topics = [{ 
              ...response.topic, 
              timeAgo: dayjs.utc(response.topic.created_at).local().fromNow(),
              upvote_count: response.topic.upvotes - response.topic.downvotes,
              comments: response.topic.comments.map((comment: Comment) => ({
                ...comment,
                timeAgo: dayjs.utc(comment.created_at).local().fromNow()
            }))
            }];
            this.userVote = response.user_vote;
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

  refreshTopic(): void {
    if (!this.id) return;

    this.topicService.getTopic(this.id).subscribe({
        next: (response) => {
            if (response) {
                this.topics = [{
                    ...response.topic,
                    timeAgo: dayjs.utc(response.topic.created_at).local().fromNow(),
                    upvote_count: response.topic.upvotes - response.topic.downvotes,
                    comments: response.topic.comments.map((comment: Comment) => ({
                      ...comment,
                      timeAgo: dayjs.utc(comment.created_at).local().fromNow()
                  }))
                }];
            }
        },
        error: (err) => {
            console.error('Hiba történt az adatok frissítésekor:', err);
        }
    });
  }


  addComment(topicId: number): void {
    const content = this.newComment[topicId];
    if (!content) {
      this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'A hozzászólás nem lehet üres!' });
      return;
    }

    this.topicService.addComment(topicId, content).subscribe(
      (response) => {
        const topic = this.topics.find(t => t.id === topicId);
        if (topic) {
          topic.comments.push(response);
        }
        this.newComment[topicId] = '';
        this.refreshTopic()
      }
    );
  }

  vote(type: 'up' | 'down') {
  const topic = this.topics[0];

  if (this.userVote === type) {

    this.userVote = null;
    if (type === 'up') {
      topic.upvote_count -= 1;
    } else {
      topic.upvote_count += 1;
    }
  }
  else if (this.userVote && this.userVote !== type) {
    if (type === 'up') {
      topic.upvote_count += 2;
    } else {
      topic.upvote_count -= 2;
    }
    this.userVote = type;
  }
  else {
    this.userVote = type;
    if (type === 'up') {
      topic.upvote_count += 1;
    } else {
      topic.upvote_count -= 1;
    }
  }

  this.topicService.voteTopic(topic.id, type);
}
}
