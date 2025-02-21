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
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

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
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SafeHtmlPipe, FormsModule, AvatarGroupModule, AvatarModule, PickerComponent],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.css',
})
export class TopicDetailsComponent implements OnInit {
  topics: any[] = [];
  id: number = 0;
  userVote: 'up' | 'down' | null = null;
  userCommentVotes: { [key: number]: 'up' | 'down' | null } = {};
  newComment: string = '';
  showEmojiPicker = false;

  constructor(
    private topicService: TopicService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  emojiLang = {
    search: 'Keresés...',
    clear: 'Törlés', 
    notfound: 'Nem található emoji',
    categories: {
      search: 'Keresés eredményei',
      recent: 'Legutóbbiak',
      smileys: 'Hangulatjelek és érzelmek',
      people: 'Emberek',
      nature: 'Állatok és természet',
      foods: 'Ételek és italok',
      activity: 'Tevékenységek',
      places: 'Helyek',
      objects: 'Tárgyak',
      symbols: 'Szimbólumok',
      flags: 'Zászlók',
      custom: 'Egyedi',
    },
  };
  

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: EmojiEvent) {
    this.newComment += event.emoji.native;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];

      this.topicService.getTopic(this.id).subscribe({
        next: (response) => {
          if (response) {
            console.log(response)
            this.topics = [
              {
                ...response.topic,
                timeAgo: dayjs.utc(response.topic.created_at).local().fromNow(),
                upvote_count: response.topic.upvotes - response.topic.downvotes,
                comments: response.topic.comments.map((comment: Comment) => ({
                  ...comment,
                  timeAgo: dayjs.utc(comment.created_at).local().fromNow(),
                  upvote_count: comment.upvotes - comment.downvotes,
                })),
              },
            ];

            this.userVote = response.user_vote;

            this.userCommentVotes = {};
            response.topic.comments.forEach((comment: Comment) => {
              this.userCommentVotes[comment.id] =
                response.user_comment_votes[comment.id] || null;
            });
          } else {
            console.error('Invalid response structure:', response);
          }
        },
        error: (err) => {
          console.error('Failed to fetch topics:', err);
        },
      });
    });
  }

  refreshTopic(): void {
    if (!this.id) return;

    this.topicService.getTopic(this.id).subscribe({
      next: (response) => {
        if (response) {
          this.topics = [
            {
              ...response.topic,
              timeAgo: dayjs.utc(response.topic.created_at).local().fromNow(),
              upvote_count: response.topic.upvotes - response.topic.downvotes,
              comments: response.topic.comments.map((comment: Comment) => ({
                ...comment,
                timeAgo: dayjs.utc(comment.created_at).local().fromNow(),
                upvote_count: comment.upvotes - comment.downvotes,
              })),
            },
          ];

          this.userVote = response.user_vote;

          this.userCommentVotes = {};
          response.topic.comments.forEach((comment: Comment) => {
            this.userCommentVotes[comment.id] =
              response.user_comment_votes[comment.id] || null;
          });
        }
      },
      error: (err) => {
        console.error('Hiba történt az adatok frissítésekor:', err);
      },
    });
  }

  addComment(topicId: number): void {
    const content = this.newComment[topicId];
    if (!content) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hiba',
        detail: 'A hozzászólás nem lehet üres!',
      });
      return;
    }

    this.topicService.addComment(topicId, content).subscribe((response) => {
      const topic = this.topics.find((t) => t.id === topicId);
      if (topic) {
        topic.comments.push(response);
      }
      this.newComment = '';
      this.showEmojiPicker = false;
      this.refreshTopic();
    });
  }

  voteComment(commentId: number, index: number, type: 'up' | 'down') {
    const comment = this.topics[0].comments[index];

    if (this.userCommentVotes[commentId] === type) {
      this.userCommentVotes[commentId] = null;
      comment.upvote_count += type === 'up' ? -1 : 1;
    } else if (
      this.userCommentVotes[commentId] &&
      this.userCommentVotes[commentId] !== type
    ) {
      comment.upvote_count += type === 'up' ? 2 : -2;
      this.userCommentVotes[commentId] = type;
    } else {
      this.userCommentVotes[commentId] = type;
      comment.upvote_count += type === 'up' ? 1 : -1;
    }

    this.topicService.vote(commentId, 'comment', type);
  }

  voteTopic(type: 'up' | 'down') {
    const topic = this.topics[0];

    if (this.userVote === type) {
      this.userVote = null;
      if (type === 'up') {
        topic.upvote_count -= 1;
      } else {
        topic.upvote_count += 1;
      }
    } else if (this.userVote && this.userVote !== type) {
      if (type === 'up') {
        topic.upvote_count += 2;
      } else {
        topic.upvote_count -= 2;
      }
      this.userVote = type;
    } else {
      this.userVote = type;
      if (type === 'up') {
        topic.upvote_count += 1;
      } else {
        topic.upvote_count -= 1;
      }
    }

    this.topicService.vote(topic.id, 'topic', type);
  }
}
